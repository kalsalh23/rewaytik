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

// ==================== MANUSCRIPT ORDERS ====================

export async function createManuscriptOrder(order: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase.from('manuscript_orders').insert({ ...order, user_id: user.id }).select().single()
  if (error) throw error
  return data
}

export async function getMyManuscripts() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase.from('manuscript_orders').select('*').eq('user_id', user.id).eq('is_archived', false).order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(mapManuscriptOrder)
}

export async function getManuscriptOrder(id: string) {
  const { data, error } = await supabase.from('manuscript_orders').select('*').eq('id', id).single()
  if (error) throw error
  const { data: attachments } = await supabase.from('manuscript_attachments').select('*').eq('manuscript_order_id', id).order('created_at', { ascending: true })
  return { ...mapManuscriptOrderDetail(data), attachments: attachments || [] }
}

export async function getAllManuscriptOrders(params?: { fromDate?: string; toDate?: string }) {
  let query = supabase.from('manuscript_orders').select('*').eq('is_archived', false).order('created_at', { ascending: false })
  if (params?.fromDate) query = query.gte('created_at', params.fromDate)
  if (params?.toDate) query = query.lte('created_at', params.toDate)
  const { data, error } = await query
  if (error) throw error
  return (data || []).map(mapManuscriptOrder)
}

export async function updateManuscriptPayment(id: string, paymentImageUrl: string, walletNumber: string) {
  const { error } = await supabase.from('manuscript_orders').update({
    payment_image_url: paymentImageUrl,
    wallet_number: walletNumber,
    payment_status: 'reviewing',
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw error
}

export async function updateManuscriptPaymentStatus(id: string, paymentStatus: string, note?: string) {
  const { data: existing } = await supabase.from('manuscript_orders').select('timeline').eq('id', id).single()
  const timeline = [...(existing?.timeline || []), { status: `payment_${paymentStatus}`, date: new Date().toISOString(), note }]
  const updates: any = { payment_status: paymentStatus, timeline, updated_at: new Date().toISOString() }
  if (paymentStatus === 'approved') updates.status = 'under_review'
  if (paymentStatus === 'rejected') updates.payment_notes = note
  const { error } = await supabase.from('manuscript_orders').update(updates).eq('id', id)
  if (error) throw error
}

export async function updateManuscriptStatus(id: string, status: string, note?: string) {
  const { data: existing } = await supabase.from('manuscript_orders').select('timeline').eq('id', id).single()
  const timeline = [...(existing?.timeline || []), { status, date: new Date().toISOString(), note }]
  const { error } = await supabase.from('manuscript_orders').update({ status, timeline, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function updateManuscriptInternalNotes(id: string, internalNotes: string) {
  const { error } = await supabase.from('manuscript_orders').update({ internal_notes: internalNotes, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function uploadManuscriptFinalFile(id: string, file: File, userId: string) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${userId}/${Date.now()}-${safeName}`
  const { error: uploadError } = await supabase.storage.from('manuscript-final').upload(filePath, file)
  if (uploadError) throw uploadError
  const { data: { publicUrl } } = supabase.storage.from('manuscript-final').getPublicUrl(filePath)
  const { error } = await supabase.from('manuscript_orders').update({ final_file_url: publicUrl, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
  return publicUrl
}

export async function archiveManuscriptOrder(id: string) {
  const { error } = await supabase.from('manuscript_orders').update({ is_archived: true }).eq('id', id)
  if (error) throw error
}

export async function getManuscriptStats() {
  const { data: all, error } = await supabase.from('manuscript_orders').select('id, status')
  if (error) throw error
  const total = all?.length || 0
  const newCount = (all || []).filter((o: any) => o.status === 'new').length
  const inProgress = (all || []).filter((o: any) => !['completed', 'cancelled'].includes(o.status)).length
  const completed = (all || []).filter((o: any) => o.status === 'completed').length
  return { total, newCount, inProgress, completed }
}

// ==================== MANUSCRIPT HELPERS ====================

function mapManuscriptOrder(data: any) {
  return {
    id: data.id,
    orderNumber: data.order_number,
    userId: data.user_id,
    status: data.status,
    paymentStatus: data.payment_status || 'pending',
    paymentAmount: data.payment_amount,
    paymentMethod: data.payment_method,
    walletNumber: data.wallet_number,
    paymentImageUrl: data.payment_image_url,
    paymentNotes: data.payment_notes,
    bookTitle: data.book_title,
    authorName: data.author_name,
    showAuthorOnCover: data.show_author_on_cover,
    bookSummary: data.book_summary,
    bookLanguage: data.book_language,
    manuscriptFileUrl: data.manuscript_file_url,
    manuscriptFileName: data.manuscript_file_name,
    manuscriptFileSize: data.manuscript_file_size,
    bookCategory: data.book_category,
    visualStyles: data.visual_styles || [],
    internalImagesOption: data.internal_images_option,
    pageLayout: data.page_layout,
    additionalServices: data.additional_services || [],
    additionalNotes: data.additional_notes,
    internalNotes: data.internal_notes,
    finalFileUrl: data.final_file_url,
    estimatedDays: data.estimated_days,
    timeline: data.timeline || [],
    isArchived: data.is_archived,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapManuscriptOrderDetail(data: any) {
  return mapManuscriptOrder(data)
}

// ==================== ACADEMIC SERVICES ====================

const ACADEMIC_TABLES = {
  graduation_project: 'graduation_projects',
  presentation: 'presentations',
  academic_task: 'academic_tasks',
  research_circle: 'research_circles',
} as const

function generateOrderNumber(prefix: string) {
  const date = new Date()
  const y = date.getFullYear().toString().slice(-2)
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${prefix}-${y}${m}${d}-${rand}`
}

export async function createAcademicOrder(serviceType: string, order: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const table = ACADEMIC_TABLES[serviceType as keyof typeof ACADEMIC_TABLES]
  if (!table) throw new Error('Invalid service type')
  const prefixes: Record<string, string> = {
    graduation_project: 'GP',
    presentation: 'PR',
    academic_task: 'AT',
    research_circle: 'RC',
  }
  const orderNumber = generateOrderNumber(prefixes[serviceType] || 'AC')
  const { data, error } = await supabase.from(table)
    .insert({ ...order, user_id: user.id, order_number: orderNumber }).select().single()
  if (error) throw error
  return data
}

export async function getMyAcademicOrders(serviceType: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const table = ACADEMIC_TABLES[serviceType as keyof typeof ACADEMIC_TABLES]
  if (!table) throw new Error('Invalid service type')
  const { data, error } = await supabase.from(table)
    .select('*').eq('user_id', user.id).eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getAllAcademicOrders(serviceType: string, params?: { fromDate?: string; toDate?: string }) {
  const table = ACADEMIC_TABLES[serviceType as keyof typeof ACADEMIC_TABLES]
  if (!table) throw new Error('Invalid service type')
  let query = supabase.from(table).select('*, users(name)').eq('is_archived', false).order('created_at', { ascending: false })
  if (params?.fromDate) query = query.gte('created_at', params.fromDate)
  if (params?.toDate) query = query.lte('created_at', params.toDate)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getAcademicOrder(serviceType: string, id: string) {
  const table = ACADEMIC_TABLES[serviceType as keyof typeof ACADEMIC_TABLES]
  if (!table) throw new Error('Invalid service type')
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
  if (error) throw error
  const { data: attachments } = await supabase.from('academic_attachments')
    .select('*').eq('order_id', id).order('created_at', { ascending: true })
  return { ...data, attachments: attachments || [] }
}

export async function updateAcademicOrderStatus(serviceType: string, id: string, status: string, note?: string) {
  const table = ACADEMIC_TABLES[serviceType as keyof typeof ACADEMIC_TABLES]
  if (!table) throw new Error('Invalid service type')
  const { data: existing } = await supabase.from(table).select('timeline').eq('id', id).single()
  const timeline = [...(existing?.timeline || []), { status, date: new Date().toISOString(), note }]
  const { error } = await supabase.from(table)
    .update({ status, timeline, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function updateAcademicPaymentStatus(serviceType: string, id: string, paymentStatus: string, note?: string) {
  const table = ACADEMIC_TABLES[serviceType as keyof typeof ACADEMIC_TABLES]
  if (!table) throw new Error('Invalid service type')
  const { data: existing } = await supabase.from(table).select('timeline').eq('id', id).single()
  const timeline = [...(existing?.timeline || []), { status: `payment_${paymentStatus}`, date: new Date().toISOString(), note }]
  const updates: any = { payment_status: paymentStatus, timeline, updated_at: new Date().toISOString() }
  if (paymentStatus === 'approved') updates.status = 'under_review'
  const { error } = await supabase.from(table).update(updates).eq('id', id)
  if (error) throw error
}

export async function updateAcademicInternalNotes(serviceType: string, id: string, internalNotes: string) {
  const table = ACADEMIC_TABLES[serviceType as keyof typeof ACADEMIC_TABLES]
  if (!table) throw new Error('Invalid service type')
  const { error } = await supabase.from(table)
    .update({ internal_notes: internalNotes, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function uploadAcademicFinalFile(serviceType: string, id: string, file: File, userId: string) {
  const table = ACADEMIC_TABLES[serviceType as keyof typeof ACADEMIC_TABLES]
  if (!table) throw new Error('Invalid service type')
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `academic/${serviceType}/${userId}/${Date.now()}-${safeName}`
  const { error: uploadError } = await supabase.storage.from('academic-final').upload(filePath, file)
  if (uploadError) throw uploadError
  const { data: { publicUrl } } = supabase.storage.from('academic-final').getPublicUrl(filePath)
  const { error } = await supabase.from(table)
    .update({ final_file_url: publicUrl, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
  return publicUrl
}

export async function archiveAcademicOrder(serviceType: string, id: string) {
  const table = ACADEMIC_TABLES[serviceType as keyof typeof ACADEMIC_TABLES]
  if (!table) throw new Error('Invalid service type')
  const { error } = await supabase.from(table).update({ is_archived: true }).eq('id', id)
  if (error) throw error
}

export async function uploadAcademicFile(serviceType: string, orderId: string, file: File, userId: string, category: string = 'client') {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `academic/${serviceType}/${userId}/${Date.now()}-${safeName}`
  const { error: uploadError } = await supabase.storage.from('academic-uploads').upload(filePath, file)
  if (uploadError) throw uploadError
  const { data: { publicUrl } } = supabase.storage.from('academic-uploads').getPublicUrl(filePath)
  const { data, error } = await supabase.from('academic_attachments').insert({
    order_id: orderId,
    service_type: serviceType,
    file_url: publicUrl,
    file_name: safeName,
    file_size: file.size,
    file_type: file.type,
    category,
  }).select().single()
  if (error) throw error
  return data
}

export async function getAcademicStats() {
  const results: Record<string, { total: number; newCount: number; inProgress: number; completed: number }> = {}
  for (const [type, table] of Object.entries(ACADEMIC_TABLES)) {
    const { data: all } = await supabase.from(table).select('id, status')
    const total = all?.length || 0
    const newCount = (all || []).filter((o: any) => o.status === 'new').length
    const inProgress = (all || []).filter((o: any) => !['delivered', 'cancelled'].includes(o.status)).length
    const completed = (all || []).filter((o: any) => o.status === 'delivered').length
    results[type] = { total, newCount, inProgress, completed }
  }
  return results
}

export async function updateAcademicPayment(serviceType: string, id: string, paymentImageUrl: string, walletNumber: string) {
  const table = ACADEMIC_TABLES[serviceType as keyof typeof ACADEMIC_TABLES]
  if (!table) throw new Error('Invalid service type')
  const { error } = await supabase.from(table).update({
    payment_image_url: paymentImageUrl,
    wallet_number: walletNumber,
    payment_status: 'reviewing',
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw error
}
