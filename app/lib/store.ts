import { create } from 'zustand'

interface User {
  id: string
  email: string
  user_type: 'brand' | 'influencer'
  company_name?: string
  full_name?: string
  avatar_url?: string
}

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
  campaigns: any[]
  setCampaigns: (campaigns: any[]) => void
  messages: any[]
  setMessages: (messages: any[]) => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  campaigns: [],
  setCampaigns: (campaigns) => set({ campaigns }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}))
