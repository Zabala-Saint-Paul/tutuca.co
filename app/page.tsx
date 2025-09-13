'use client'

import { useState } from 'react'
import { supabase } from './lib/supabase'
import { useRouter } from 'next/navigation'

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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10 z-50 transition-all duration-300">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-all">
            TUTUCA
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-gray-400 hover:text-green-400 transition-colors relative group">
              Características
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#how-it-works" className="text-gray-400 hover:text-green-400 transition-colors relative group">
              Cómo Funciona
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="text-gray-400 hover:text-green-400 transition-colors relative group">
              Precios
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#testimonials" className="text-gray-400 hover:text-green-400 transition-colors relative group">
              Testimonios
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
            </a>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setUserType('brand')}
              className="px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all border border-white/20 text-white hover:bg-white/10 hover:border-green-400"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => setUserType('influencer')}
              className="px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all bg-gradient-to-r from-green-400 to-cyan-400 text-black hover:scale-105 hover:shadow-lg hover:shadow-green-400/40"
            >
              Empezar Gratis
            </button>
          </div>
          
          <button className="md:hidden text-white text-2xl">☰</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-24 px-8 bg-gradient-radial from-green-500/10 via-transparent to-cyan-500/10">
        {/* Floating Cards */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/5 left-1/12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 animate-float">
            <div className="text-3xl mb-2">📸</div>
            <div className="font-semibold text-lg">+2.5M</div>
            <div className="text-gray-400 text-sm">Contenidos</div>
          </div>
          
          <div className="absolute top-3/5 right-1/12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 animate-float" style={{animationDelay: '5s'}}>
            <div className="text-3xl mb-2">⭐</div>
            <div className="font-semibold text-lg">4.9/5</div>
            <div className="text-gray-400 text-sm">Rating</div>
          </div>
          
          <div className="absolute bottom-1/5 left-1/8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 animate-float" style={{animationDelay: '10s'}}>
            <div className="text-3xl mb-2">🚀</div>
            <div className="font-semibold text-lg">15K+</div>
            <div className="text-gray-400 text-sm">Campañas</div>
          </div>
        </div>
        
        <div className="max-w-6xl text-center z-10">
          <div className="inline-block bg-green-400/10 border border-green-400/30 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-pulse">
            🔥 #1 EN LATAM
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Conectamos <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Marcas</span><br />
            con <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Influencers</span> Auténticos
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto">
            La plataforma todo-en-uno para gestionar campañas de influencer marketing<br />
            con resultados medibles y ROI garantizado
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <button 
              onClick={() => setUserType('brand')}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold rounded-xl text-lg hover:scale-105 transition-all hover:shadow-lg hover:shadow-green-400/40"
            >
              Empezar Gratis →
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl text-lg hover:bg-white/10 hover:border-green-400 transition-all">
              Ver Demo
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-gray-400 text-sm">Influencers Verificados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-gray-400 text-sm">Marcas Activas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">$5M+</div>
              <div className="text-gray-400 text-sm">Pagos Procesados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">4.2x</div>
              <div className="text-gray-400 text-sm">ROI Promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 bg-gradient-to-b from-transparent via-green-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              CARACTERÍSTICAS
            </div>
            <h2 className="text-5xl font-bold mb-4">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-gray-400 text-lg">Herramientas poderosas para marcas e influencers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:border-green-400/30 hover:shadow-lg hover:shadow-green-400/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-3">Discovery Inteligente</h3>
              <p className="text-gray-400 leading-relaxed">
                Encuentra influencers perfectos con IA. Filtros avanzados por nicho, 
                engagement, ubicación y más. Match del 95% garantizado.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:border-green-400/30 hover:shadow-lg hover:shadow-green-400/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold mb-3">Analytics en Tiempo Real</h3>
              <p className="text-gray-400 leading-relaxed">
                Métricas detalladas de cada campaña. ROI, alcance, engagement y 
                conversiones actualizadas al instante.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:border-green-400/30 hover:shadow-lg hover:shadow-green-400/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold mb-3">Mensajería Integrada</h3>
              <p className="text-gray-400 leading-relaxed">
                Comunícate directamente con influencers. Chat en tiempo real, 
                compartir archivos y negociación transparente.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:border-green-400/30 hover:shadow-lg hover:shadow-green-400/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-2xl font-semibold mb-3">Pagos Seguros</h3>
              <p className="text-gray-400 leading-relaxed">
                Sistema de pagos integrado con escrow. Múltiples métodos de pago 
                y facturación automática.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:border-green-400/30 hover:shadow-lg hover:shadow-green-400/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-semibold mb-3">Gestión de Campañas</h3>
              <p className="text-gray-400 leading-relaxed">
                Crea, gestiona y escala campañas fácilmente. Workflows automatizados 
                y aprobaciones rápidas.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:border-green-400/30 hover:shadow-lg hover:shadow-green-400/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold mb-3">Reviews Verificados</h3>
              <p className="text-gray-400 leading-relaxed">
                Sistema de calificaciones bidireccional. Construye confianza 
                con feedback transparente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-400/10 border border-green-400/30 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              PROCESO SIMPLE
            </div>
            <h2 className="text-5xl font-bold mb-4">Cómo Funciona TUTUCA</h2>
            <p className="text-gray-400 text-lg">De la idea a resultados en 4 simples pasos</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-cyan-400/20 border-2 border-green-400 rounded-full flex items-center justify-center text-3xl font-bold text-green-400 mx-auto mb-6 hover:scale-110 hover:rotate-12 transition-all duration-300">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Crea tu Campaña</h3>
              <p className="text-gray-400">
                Define objetivos, presupuesto y requisitos en minutos
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-cyan-400/20 border-2 border-green-400 rounded-full flex items-center justify-center text-3xl font-bold text-green-400 mx-auto mb-6 hover:scale-110 hover:rotate-12 transition-all duration-300">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Encuentra Influencers</h3>
              <p className="text-gray-400">
                Recibe aplicaciones o busca en nuestra base de +10K creators
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-cyan-400/20 border-2 border-green-400 rounded-full flex items-center justify-center text-3xl font-bold text-green-400 mx-auto mb-6 hover:scale-110 hover:rotate-12 transition-all duration-300">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Colabora</h3>
              <p className="text-gray-400">
                Gestiona contenido, comunicación y pagos en un solo lugar
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-cyan-400/20 border-2 border-green-400 rounded-full flex items-center justify-center text-3xl font-bold text-green-400 mx-auto mb-6 hover:scale-110 hover:rotate-12 transition-all duration-300">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Mide Resultados</h3>
              <p className="text-gray-400">
                Analytics detallados y ROI en tiempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-8 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              TESTIMONIOS
            </div>
            <h2 className="text-5xl font-bold mb-4">Historias de Éxito</h2>
            <p className="text-gray-400 text-lg">Lo que dicen nuestros usuarios</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-3xl text-green-400 mb-4">&ldquo;</div>
              <p className="text-gray-200 leading-relaxed mb-6">
                TUTUCA transformó completamente nuestra estrategia de marketing. 
                El ROI aumentó 4x y ahorramos 20 horas semanales en gestión.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center font-bold text-black">
                  MG
                </div>
                <div className="flex-1">
                  <div className="font-semibold">María González</div>
                  <div className="text-gray-400 text-sm">CMO en Fashion Brand</div>
                </div>
                <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-3xl text-green-400 mb-4">&ldquo;</div>
              <p className="text-gray-200 leading-relaxed mb-6">
                Como influencer, TUTUCA me conectó con marcas perfectas para mi audiencia. 
                Mis ingresos crecieron 300% en 6 meses.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center font-bold text-black">
                  CL
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Carlos López</div>
                  <div className="text-gray-400 text-sm">@carloslifestyle • 120K</div>
                </div>
                <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-3xl text-green-400 mb-4">&ldquo;</div>
              <p className="text-gray-200 leading-relaxed mb-6">
                La mejor plataforma de influencer marketing. Interface intuitiva, 
                soporte excepcional y resultados medibles.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center font-bold text-black">
                  AP
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Ana Pérez</div>
                  <div className="text-gray-400 text-sm">Directora en TechCorp</div>
                </div>
                <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-400/10 border border-green-400/30 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              PRECIOS
            </div>
            <h2 className="text-5xl font-bold mb-4">Planes para cada necesidad</h2>
            <p className="text-gray-400 text-lg">Transparente, sin sorpresas</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center transition-all hover:-translate-y-2 hover:border-green-400/50">
              <h3 className="text-2xl font-semibold mb-2">Starter</h3>
              <div className="text-5xl font-bold text-green-400 mb-2">$99</div>
              <div className="text-gray-400 mb-8">por mes</div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  Hasta 5 campañas activas
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  20 influencers por mes
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  Analytics básicos
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  Soporte por email
                </li>
              </ul>
              
              <button className="w-full py-3 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 hover:border-green-400 transition-all">
                Empezar
              </button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-green-400 rounded-3xl p-8 text-center transition-all hover:-translate-y-2 hover:border-green-400/50 relative scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-cyan-400 text-black px-4 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-semibold mb-2">Professional</h3>
              <div className="text-5xl font-bold text-green-400 mb-2">$299</div>
              <div className="text-gray-400 mb-8">por mes</div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  Campañas ilimitadas
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  100 influencers por mes
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  Analytics avanzados
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  API access
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  Soporte prioritario
                </li>
              </ul>
              
              <button className="w-full py-3 bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold rounded-xl hover:scale-105 transition-all hover:shadow-lg hover:shadow-green-400/40">
                Empezar
              </button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center transition-all hover:-translate-y-2 hover:border-green-400/50">
              <h3 className="text-2xl font-semibold mb-2">Enterprise</h3>
              <div className="text-5xl font-bold text-green-400 mb-2">Custom</div>
              <div className="text-gray-400 mb-8">contactar ventas</div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  Todo ilimitado
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  Account Manager dedicado
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  Integraciones custom
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  SLA garantizado
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  Training personalizado
                </li>
              </ul>
              
              <button className="w-full py-3 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 hover:border-green-400 transition-all">
                Contactar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 text-center bg-gradient-to-r from-green-500/5 to-cyan-500/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            ¿Listo para escalar tu marketing?
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Únete a miles de marcas e influencers que ya están creciendo con TUTUCA
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={() => setUserType('brand')}
              className="px-12 py-4 bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold rounded-xl text-lg hover:scale-105 transition-all hover:shadow-lg hover:shadow-green-400/40"
            >
              Crear Cuenta Gratis
            </button>
            <button className="px-12 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl text-lg hover:bg-white/10 hover:border-green-400 transition-all">
              Agendar Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="text-2xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                TUTUCA
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                La plataforma líder de influencer marketing en LATAM. 
                Conectando marcas con voces auténticas desde 2023.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-400/20 hover:border-green-400 hover:text-green-400 transition-all">
                  f
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-400/20 hover:border-green-400 hover:text-green-400 transition-all">
                  𝕏
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-400/20 hover:border-green-400 hover:text-green-400 transition-all">
                  in
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-400/20 hover:border-green-400 hover:text-green-400 transition-all">
                  @
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors">Características</a>
                <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors">Precios</a>
                <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors">API</a>
                <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors">Integraciones</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors">Sobre Nosotros</a>
                <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors">Blog</a>
                <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors">Carreras</a>
                <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors">Contacto</a>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-white/5 text-gray-400 text-sm">
            <p>© 2025 TUTUCA. Todos los derechos reservados. Hecho con 💚 en LATAM</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {userType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
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
            
            <button
              onClick={() => setUserType(null)}
              className="w-full mt-4 py-2 text-gray-400 hover:text-white transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}