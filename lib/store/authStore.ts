import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

type AppUser = User & {
  role?: string
  name?: string
  [key: string]: unknown
}

type AuthState = {
  user: AppUser | null
  isLoading: boolean
  setUser: (authUser: User | null) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,

  setUser: async (authUser) => {
    if (!authUser) {
      set({ user: null, isLoading: false })
      return
    }

    const state = get()
    if (state.user?.id === authUser.id) {
      set({ isLoading: false })
      return
    }

    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('member')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('member 조회 에러:', error)
      }

      set({
        user: { ...authUser, ...data },
        isLoading: false,
      })
    } catch (err) {
      console.error('member 조회 실패 (DB 연결 안 됨):', err)
      set({
        user: authUser,
        isLoading: false,
      })
    }
  },

  logout: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null, isLoading: false })
  },
}))