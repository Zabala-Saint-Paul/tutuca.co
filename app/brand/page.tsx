'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { Plus, Search, MessageSquare, DollarSign, BarChart3, Users, LogOut } from 'lucide-react'

export default function BrandDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ company_name?: string } | null>(null)
  const [campaigns, setCampaigns] = useState<Array<{ id: string; title: string; description: string; budget: number; status: string }>>([])
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalInfluencers: 0,
    totalReach: 0,
    avgROI: 0
  })

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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .eq('brand_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setCampaigns(data)
    }

    const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: campaignData } = await supabase
      .from('campaigns')
      .select('*')
      .eq('brand_id', user.id)
      .eq('status', 'active')

    const { data: applicationData } = await supabase
      .from('applications')
      .select('*, campaigns!inner(*)')
      .eq('campaigns.brand_id', user.id)
      .eq('status', 'accepted')

    setStats({
      activeCampaigns: campaignData?.length || 0,
      totalInfluencers: applicationData?.length || 0,
      totalReach: Math.floor(Math.random() * 2500000),
      avgROI: 4.2
    })
    }

    checkUser()
    loadCampaigns()
    loadStats()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 p-6">
        <h1 className="text-2xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-8">
          TUTUCA
        </h1>

        <nav className="space-y-2">
          <a href="/brand" className="flex items-center gap-3 px-4 py-3 bg-green-500/20 text-green-400 rounded-lg">
            <BarChart3 size={20} />
            Dashboard
          </a>
          <a href="/brand/campaigns" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
            <Users size={20} />
            Campañas
          </a>
          <a href="/brand/influencers" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
            <Search size={20} />
            Influencers
          </a>
          <a href="/brand/messages" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
            <MessageSquare size={20} />
            Mensajes
          </a>
          <a href="/brand/payments" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
            <DollarSign size={20} />
            Pagos
          </a>
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">¡Hola, {user?.company_name || 'Marca'}! 👋</h2>
          <p className="text-gray-400">Aquí está el resumen de tu actividad hoy</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-gray-400 text-sm mb-2">Campañas Activas</div>
            <div className="text-3xl font-bold text-green-400">{stats.activeCampaigns}</div>
            <div className="text-green-400 text-sm mt-2">↑ +2 esta semana</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-gray-400 text-sm mb-2">Influencers Trabajando</div>
            <div className="text-3xl font-bold text-green-400">{stats.totalInfluencers}</div>
            <div className="text-green-400 text-sm mt-2">↑ +6 nuevos</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-gray-400 text-sm mb-2">Alcance Total</div>
            <div className="text-3xl font-bold text-green-400">
              {(stats.totalReach / 1000000).toFixed(1)}M
            </div>
            <div className="text-green-400 text-sm mt-2">↑ +18% vs mes anterior</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-gray-400 text-sm mb-2">ROI Promedio</div>
            <div className="text-3xl font-bold text-green-400">{stats.avgROI}x</div>
            <div className="text-green-400 text-sm mt-2">↑ +0.5x mejora</div>
          </div>
        </div>

        {/* Campaigns Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Campañas Activas</h3>
            <button
              onClick={() => router.push('/brand/campaigns/new')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-lg hover:scale-105 transition"
            >
              <Plus size={20} />
              Nueva Campaña
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No tienes campañas activas</p>
              <button
                onClick={() => router.push('/brand/campaigns/new')}
                className="mt-4 text-green-400 hover:underline"
              >
                Crear tu primera campaña →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold">{campaign.title}</h4>
                      <p className="text-gray-400 text-sm">{campaign.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-700">
                    <div>
                      <div className="text-gray-400 text-xs">Aplicaciones</div>
                      <div className="font-bold">{Math.floor(Math.random() * 50)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Presupuesto</div>
                      <div className="font-bold">${campaign.budget}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Alcance</div>
                      <div className="font-bold">{Math.floor(Math.random() * 900)}K</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}