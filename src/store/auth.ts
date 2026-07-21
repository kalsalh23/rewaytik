import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface AuthState {
  token: string | null
  user: any | null
  isAuthenticated: boolean
  setAuth: (token: string, user: any) => void
  logout: () => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),
  setAuth: (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },
  logout: async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null, isAuthenticated: false })
  },
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data: userData } = await supabase.from('users').select('*').eq('id', session.user.id).single()
      if (userData) {
        localStorage.setItem('token', session.access_token)
        localStorage.setItem('user', JSON.stringify(userData))
        set({ token: session.access_token, user: userData, isAuthenticated: true })
      }
    }
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: userData } = await supabase.from('users').select('*').eq('id', session.user.id).single()
        if (userData) {
          localStorage.setItem('token', session.access_token)
          localStorage.setItem('user', JSON.stringify(userData))
          set({ token: session.access_token, user: userData, isAuthenticated: true })
        }
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ token: null, user: null, isAuthenticated: false })
      }
    })
  },
}))
