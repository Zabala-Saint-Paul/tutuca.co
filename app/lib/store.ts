import { create } from 'zustand'

interface User {
  id: string
  email: string
  user_type: 'brand' | 'influencer'
  company_name?: string
  full_name?: string
  avatar_url?: string
}

interface Campaign {
  id: string
  title: string
  description: string
  budget: number
  status: string
  created_at: string
}

interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  created_at: string
}

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
  campaigns: Campaign[]
  setCampaigns: (campaigns: Campaign[]) => void
  messages: Message[]
  setMessages: (messages: Message[]) => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  campaigns: [],
  setCampaigns: (campaigns) => set({ campaigns }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}))
