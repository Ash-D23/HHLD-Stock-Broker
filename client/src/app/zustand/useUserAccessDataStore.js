import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useUserAccessDataStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      userData: {},
      setAccessToken: (token) => set({ accessToken: token }),
      setUserData: (data) => set({ accessToken: data.access_token, userData: {user_name: data.user_name, user_id: data.user_id}}),
      clearUserData: () => set({ accessToken: null, userData: null })
    }),
    {
      name: 'access-token',
      storage: createJSONStorage(() => sessionStorage)
    }
  ),
)