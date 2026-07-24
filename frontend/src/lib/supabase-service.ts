import { supabase } from './supabase'

// ==================== AUTH ====================

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    if (error.message?.includes('Email not confirmed')) {
      throw new Error('البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الإلكتروني أولاً.')
    }
    throw error
  }
  return { user: data.user, session: data.session }
}

export async function register(name: string, email: string, password: string, phone: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone, role: 'user' },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
  return { user: data.user, session: data.session }
}

export async function resendVerification(email: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  })
  if (error) throw error
}

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()
  if (error) throw error
  return data
}

export async function updateProfile(data: { name?: string; email?: string; phone?: string }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const updates: any = {}
  if (data.name !== undefined) updates.name = data.name
  if (data.email !== undefined) updates.email = data.email
  if (data.phone !== undefined) updates.phone = data.phone
  const { error } = await supabase.from('users').update(updates).eq('id', user.id)
  if (error) throw error
  if (data.email) {
    await supabase.auth.updateUser({ email: data.email })
  }
  return getProfile()
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ==================== BOOK TYPES ====================

export async function getBookTypes() {
  const { data, error } = await supabase.from('book_types').select('*').eq('is_active', true)
  if (error) throw error
  return data
}

// ==================== GALLERY ====================

export async function getGalleryItems() {
  const { data, error } = await supabase.from('gallery_items').select('*').eq('is_active', true).order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAdminGalleryItems() {
  const { data, error } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createGalleryItem(item: {
  image_url: string
  title: string
  title_ar: string
  description: string
  description_ar: string
  book_type: string
  is_active: boolean
}) {
  const { data, error } = await supabase.from('gallery_items').insert(item).select().single()
  if (error) throw error
  return data
}

export async function updateGalleryItem(id: string, item: Partial<{
  image_url: string
  title: string
  title_ar: string
  description: string
  description_ar: string
  book_type: string
  is_active: boolean
}>) {
  const { data, error } = await supabase.from('gallery_items').update(item).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteGalleryItem(id: string) {
  const { error } = await supabase.from('gallery_items').delete().eq('id', id)
  if (error) throw error
}

// ==================== ORDERS ====================

export async function createOrder(order: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase.from('orders').insert({ ...order, user_id: user.id }).select().single()
  if (error) throw error
  return data
}

export async function getMyOrders() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase.from('orders').select('*, book_types(name_ar)').eq('user_id', user.id).eq('is_archived', false).order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapOrder)
}

export async function getAllOrders(params?: { fromDate?: string; toDate?: string }) {
  let query = supabase.from('orders').select('*, book_types(name_ar), users(name)').eq('is_archived', false).order('created_at', { ascending: false })
  if (params?.fromDate) query = query.gte('created_at', params.fromDate)
  if (params?.toDate) query = query.lte('created_at', params.toDate)
  const { data, error } = await query
  if (error) throw error
  return data.map(mapOrder)
}

export async function getOrder(id: string) {
  const { data, error } = await supabase.from('orders').select('*, book_types(name_ar)').eq('id', id).single()
  if (error) throw error
  return mapOrderDetail(data)
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}

export async function updatePaymentNotification(id: string, imageUrl: string) {
  const { error } = await supabase.from('orders').update({
    payment_notification_url: imageUrl,
    status: 'pending_review',
  }).eq('id', id)
  if (error) throw error
}

export async function approveOrder(id: string) {
  const { error } = await supabase.from('orders').update({
    status: 'writing',
  }).eq('id', id)
  if (error) throw error
}

export async function archiveOrder(id: string) {
  const { error } = await supabase.from('orders').update({ is_archived: true }).eq('id', id)
  if (error) throw error
}

export async function clearPaymentNotification(orderId: string) {
  const { error } = await supabase.from('orders').update({ payment_notification_url: null }).eq('id', orderId)
  if (error) throw error
}

export async function getPaymentNotifications() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, user_id, payment_notification_url, users(name), created_at')
    .not('payment_notification_url', 'is', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map((d: any) => ({
    id: d.id,
    orderNumber: d.order_number,
    customerName: d.users?.name || 'غير معروف',
    imageUrl: d.payment_notification_url,
    date: d.created_at,
  }))
}

// ==================== CONTACT ====================

export async function submitContact(data: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  const { error } = await supabase.from('contact_messages').insert(data)
  if (error) throw error
}

export async function getContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function deleteContactMessage(id: string) {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) throw error
}

// ==================== BANNERS ====================

export async function getBanners() {
  const { data, error } = await supabase.from('site_banners').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createBanner(banner: { image_url: string; is_active?: boolean; sort_order?: number }) {
  const { data, error } = await supabase.from('site_banners').insert(banner).select().single()
  if (error) throw error
  return data
}

export async function deleteBanner(id: string) {
  const { error } = await supabase.from('site_banners').delete().eq('id', id)
  if (error) throw error
}

// ==================== ADMIN ====================

export async function getDashboardStats() {
  const { data: allOrders, error: err1 } = await supabase.from('orders').select('id, total_amount, status')
  if (err1) throw err1
  const { data: allUsers, error: err2 } = await supabase.from('users').select('id').eq('role', 'user')
  if (err2) throw err2

  const totalOrders = allOrders?.length || 0
  const totalCustomers = allUsers?.length || 0
  const totalRevenue = (allOrders || [])
    .filter((o: any) => o.status !== 'rejected')
    .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0)
  const pendingReview = (allOrders || []).filter((o: any) => o.status === 'pending_review').length

  return { totalOrders, totalCustomers, totalRevenue, pendingReview }
}

export async function getCustomers() {
  const { data, error } = await supabase.from('users').select('*').eq('role', 'user').order('created_at', { ascending: false })
  if (error) throw error
  const customersWithOrders = await Promise.all(data.map(async (u: any) => {
    const { data: userOrders } = await supabase.from('orders').select('id').eq('user_id', u.id)
    return { ...u, ordersCount: userOrders?.length || 0 }
  }))
  return customersWithOrders
}

export async function getReports() {
  const { data, error } = await supabase.from('orders').select('created_at, total_amount').not('status', 'eq', 'rejected')
  if (error) throw error
  const monthlyMap: Record<string, { count: number; revenue: number }> = {}
  data.forEach((o: any) => {
    const d = new Date(o.created_at)
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`
    if (!monthlyMap[key]) monthlyMap[key] = { count: 0, revenue: 0 }
    monthlyMap[key].count++
    monthlyMap[key].revenue += o.total_amount || 0
  })
  const monthlyOrders = Object.entries(monthlyMap).map(([key, val]) => {
    const [year, month] = key.split('-').map(Number)
    return { year, month, count: val.count, revenue: val.revenue }
  }).sort((a, b) => b.year - a.year || b.month - a.month)
  return { monthlyOrders }
}

// ==================== HELPERS ====================

function mapOrder(data: any) {
  return {
    id: data.id,
    orderNumber: data.order_number,
    userId: data.user_id,
    bookTypeId: data.book_type_id,
    bookTypeName: data.book_types?.name_ar || '',
    status: data.status,
    totalAmount: data.total_amount,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    detail: data.detail || {},
  }
}

function mapOrderDetail(data: any) {
  return {
    id: data.id,
    orderNumber: data.order_number,
    userId: data.user_id,
    bookTypeId: data.book_type_id,
    bookTypeName: data.book_types?.name_ar || '',
    status: data.status,
    totalAmount: data.total_amount,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    rejectionReason: data.rejection_reason,
    detail: {
      characterName: data.character_name,
      age: data.age,
      nationality: data.nationality,
      hobbies: data.hobbies,
      qualities: data.qualities,
      memories: data.memories,
      storyType: data.story_type,
      storyGoal: data.story_goal,
      clientMessage: data.client_message,
      images: data.images,
      characterImages: data.character_images,
      eyeColor: data.eye_color,
      hairColor: data.hair_color,
      height: data.height,
      skinTone: data.skin_tone,
      build: data.build,
      shippingAddress: data.shipping_address,
      timeline: data.timeline || [],
      transactionNumber: data.transaction_number,
      paymentNotificationUrl: data.payment_notification_url,
    },
  }
}
