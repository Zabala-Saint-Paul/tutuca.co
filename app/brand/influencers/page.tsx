'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { Search, DollarSign, Star, TrendingUp, LogOut } from 'lucide-react'

export default function InfluencerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ full_name?: string } | null>(null)
  const [campaigns, setCampaigns] = useState<Array<{ id: string; title: string; description: string; budget: number }>>([])
  const [applications, setApplications] = useState<Array<{ id: string; campaign_id: string; status: string; campaigns?: { title: string; description: string } }>>([])
  const stats = {
    earnings: 0,
    activeCampaigns: 0,
    rating: 4.8,
    totalReach: 0
  }

  useEffect(() => {
    const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setUser(profile)
    }

    const loadCampaigns = async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (data) setCampaigns(data)
    }

    const loadApplications = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('applications')
      .select('*, campaigns(*)')
      .eq('influencer_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setApplications(data)
    }

    checkUser()
    loadCampaigns()
    loadApplications()
  }, [router])

  const applyToCampaign = async (campaignId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('applications').insert({
      campaign_id: campaignId,
      influencer_id: user.id,
      proposal: 'Me encantaría participar en esta campaña',
      price: 250,
      status: 'pending'
    })

    if (!error) {
      alert('¡Aplicación enviada!')
      // Reload applications
      const { data } = await supabase
        .from('applications')
        .select('*, campaigns(*)')
        .eq('influencer_id', user.id)
        .order('created_at', { ascending: false })
      
      if (data) setApplications(data)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">¡Hola, {user?.full_name || 'Creator'}! 👋</h1>
          <p className="text-gray-400">Tienes {campaigns.length} nuevas oportunidades de campaña esperándote</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <DollarSign size={16} />
            Ganado Este Mes
          </div>
          <div className="text-3xl font-bold text-green-400">$3,450</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <TrendingUp size={16} />
            Campañas Activas
          </div>
          <div className="text-3xl font-bold text-green-400">{applications.filter(a => a.status === 'accepted').length}</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <Star size={16} />
            Rating Promedio
          </div>
          <div className="text-3xl font-bold text-green-400">{stats.rating}⭐</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <Search size={16} />
            Alcance Total
          </div>
          <div className="text-3xl font-bold text-green-400">850K</div>
        </div>
      </div>

      {/* Available Campaigns */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">🔥 Oportunidades Recomendadas</h2>

        <div className="grid grid-cols-3 gap-4">
          {campaigns.map((campaign) => {
            const hasApplied = applications.some(a => a.campaign_id === campaign.id)

            return (
              <div key={campaign.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    MATCH 95%
                  </span>
                </div>

                <h3 className="font-bold mb-2">{campaign.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{campaign.description}</p>

                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <div className="text-2xl font-bold text-green-400">${campaign.budget}</div>
                  {hasApplied ? (
                    <span className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg text-sm">
                      Aplicado ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => applyToCampaign(campaign.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-lg hover:scale-105 transition"
                    >
                      Aplicar
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* My Applications */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">Mis Aplicaciones</h2>

        {applications.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No has aplicado a ninguna campaña aún</p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{app.campaigns?.title}</h4>
                  <p className="text-gray-400 text-sm">{app.campaigns?.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  app.status === 'accepted'
                    ? 'bg-green-500/20 text-green-400'
                    : app.status === 'rejected'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {app.status === 'pending' ? 'En revisión' : app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
