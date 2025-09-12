'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function NewCampaign() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    start_date: '',
    end_date: '',
    content_type: [] as string[],
    requirements: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { error } = await supabase.from('campaigns').insert({
        brand_id: user.id,
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        start_date: formData.start_date,
        end_date: formData.end_date,
        requirements: {
          content_type: formData.content_type,
          details: formData.requirements
        },
        status: 'active'
      })

      if (error) throw error

      router.push('/brand/campaigns')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleContentType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      content_type: prev.content_type.includes(type)
        ? prev.content_type.filter(t => t !== type)
        : [...prev.content_type, type]
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <h1 className="text-3xl font-bold mb-8">Crear Nueva Campaña</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Información Básica</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre de la Campaña</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Presupuesto (USD)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Fecha de Inicio</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Fecha de Fin</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Content Type */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Tipo de Contenido</h2>

            <div className="grid grid-cols-3 gap-4">
              {['Instagram Post', 'Instagram Reel', 'Instagram Story', 'TikTok Video', 'YouTube Video', 'Blog Post'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleContentType(type)}
                  className={`p-4 border-2 rounded-xl transition ${
                    formData.content_type.includes(type)
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {type.includes('Instagram') ? '📸' : type.includes('TikTok') ? '🎵' : type.includes('YouTube') ? '📹' : '✍️'}
                  </div>
                  <div className="font-medium">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Requisitos</h2>

            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              placeholder="Describe los requisitos específicos para los influencers..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-lg hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Campaña'}
          </button>
        </form>
      </div>
    </div>
  )
}
