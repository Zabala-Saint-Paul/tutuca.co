'use client'

import { useState } from 'react'
import { supabase } from './lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowRight, Users, Building2, Star, CheckCircle } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [userType, setUserType] = useState<'brand' | 'influencer' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            full_name: userType === 'brand' ? 'Brand User' : 'Influencer User'
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Redirect based on user type
        if (userType === 'brand') {
          router.push('/brand')
        } else {
          router.push('/influencer')
        }
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        // Check user type from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single()

        if (profile?.user_type === 'brand') {
          router.push('/brand')
        } else {
          router.push('/influencer')
        }
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-cyan-500/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              TUTUCA
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              La plataforma que conecta marcas con influencers auténticos. 
              Crea campañas impactantes y encuentra tu audiencia perfecta.
            </p>
            
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => setUserType('brand')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${
                  userType === 'brand'
                    ? 'bg-green-500 text-black'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <Building2 size={20} />
                Soy una Marca
              </button>
              <button
                onClick={() => setUserType('influencer')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${
                  userType === 'influencer'
                    ? 'bg-green-500 text-black'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <Users size={20} />
                Soy Influencer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form */}
      {userType && (
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {userType === 'brand' ? 'Acceso para Marcas' : 'Acceso para Influencers'}
            </h2>

            <form onSubmit={handleSignIn} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-lg hover:scale-105 transition disabled:opacity-50"
              >
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="text-center text-gray-400 mb-4">o</div>

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
            >
              Crear Cuenta Nueva
            </button>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">¿Por qué elegir TUTUCA?</h2>
          <p className="text-gray-400 text-lg">La plataforma más completa para marketing de influencers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Influencers Verificados</h3>
            <p className="text-gray-400">
              Todos nuestros influencers pasan por un proceso de verificación para garantizar autenticidad y calidad.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Campañas Efectivas</h3>
            <p className="text-gray-400">
              Herramientas avanzadas para crear, gestionar y medir el éxito de tus campañas de influencer marketing.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowRight className="text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Proceso Simplificado</h3>
            <p className="text-gray-400">
              Desde la búsqueda hasta el pago, todo el proceso está optimizado para ser rápido y eficiente.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-gray-400 mb-8">
            Únete a cientos de marcas e influencers que ya están creciendo con TUTUCA
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-lg hover:scale-105 transition"
          >
            Comenzar Ahora
          </button>
        </div>
      </div>
    </div>
  )
}