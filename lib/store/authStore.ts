import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { AppUser, fetchMemberById } from '../api/user'



type AuthState = {
  user: AppUser | null
  isLoading: boolean
  authError: string | null
  setAuthError: (message: string | null) => void
  setUser: (authUser: User | null) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  authError: null,

  setAuthError: (message) => set({ authError: message }),  

  setUser: async (authUser) => {
    if (!authUser) {
      set({ user: null, isLoading: false, authError: null })
      return
    }

    const state = get()
    if (state.user?.id === authUser.id) {
      set({ isLoading: false })
      return
    }

    const supabase = createClient()

    try {
      const memberData = await fetchMemberById(supabase, authUser.id)

      set({ user: { ...authUser, ...memberData }, isLoading: false, authError: null })

    } catch (err) {
      const isMemberNotFound =
        typeof err === 'object' && err !== null && 'code' in err && err.code === 'PGRST116'
      //PGRST116 : row가 0개일때 supabase가 주는 에러코드

      if (isMemberNotFound) {
        console.error('member 조회 실패: 등록되지 않은 회원', err)
        await supabase.auth.signOut().catch(() => { })
        set({
          user: null,
          isLoading: false,
          authError: '등록되지 않은 회원입니다. 관리자에게 문의해주세요.',
        })
        return
      }
      console.error('member 조회 실패 (DB 연결 안 됨):', err)
      await supabase.auth.signOut().catch(() => { })
      set({
        user: null,
        isLoading: false,
        authError: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      })
    }
  },

  logout: async () => {
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('로그아웃 실패', error)
        throw error
      }
      set({ user: null, isLoading: false, authError: null })
    } catch (err) {
      console.error('로그아웃 처리 중 에러:', err)
      throw err
    }
  },
}))