'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      const header = document.getElementById('header')
      if (window.scrollY > 50) {
        header?.classList.add('scrolled')
      } else {
        header?.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #000000;
          color: #ffffff;
          overflow-x: hidden;
        }

        html {
          scroll-behavior: smooth;
        }

        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .header.scrolled {
          background: rgba(0, 0, 0, 0.95);
          padding: 0.5rem 0;
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
        }

        .logo {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00ff88 0%, #00ccff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: #999;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          color: #00ff88;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: #00ff88;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          border: none;
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #00ff88;
        }

        .btn-primary {
          background: linear-gradient(135deg, #00ff88 0%, #00ccff 100%);
          color: #000;
        }

        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 40px rgba(0, 255, 136, 0.4);
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 6rem 2rem 2rem;
          background: radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(0, 204, 255, 0.1) 0%, transparent 50%);
        }

        .hero-content {
          max-width: 1200px;
          text-align: center;
          z-index: 1;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          color: #00ff88;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 2rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          background: linear-gradient(135deg, #ffffff 0%, #999999 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fadeInUp 0.8s ease;
        }

        .hero-highlight {
          background: linear-gradient(135deg, #00ff88 0%, #00ccff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: #999;
          margin-bottom: 3rem;
          animation: fadeInUp 0.8s ease 0.2s both;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 4rem;
          animation: fadeInUp 0.8s ease 0.4s both;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeInUp 0.8s ease 0.6s both;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: #00ff88;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #666;
          font-size: 0.875rem;
        }

        .floating-cards {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.5rem;
          animation: float 20s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(2deg);
          }
          75% {
            transform: translateY(20px) rotate(-2deg);
          }
        }

        .floating-card:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-card:nth-child(2) {
          top: 60%;
          right: 10%;
          animation-delay: 5s;
        }

        .floating-card:nth-child(3) {
          bottom: 20%;
          left: 15%;
          animation-delay: 10s;
        }

        .features {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 255, 136, 0.02) 50%, transparent 100%);
        }

        .section-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem;
        }

        .section-badge {
          display: inline-block;
          background: rgba(0, 204, 255, 0.1);
          border: 1px solid rgba(0, 204, 255, 0.3);
          color: #00ccff;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          color: #999;
          font-size: 1.125rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #00ff88, #00ccff);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .feature-card:hover::before {
          transform: translateX(0);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 255, 136, 0.3);
          box-shadow: 0 20px 40px rgba(0, 255, 136, 0.1);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .feature-description {
          color: #999;
          line-height: 1.6;
        }

        .how-it-works {
          padding: 6rem 2rem;
          position: relative;
        }

        .steps-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .step {
          text-align: center;
          position: relative;
        }

        .step-number {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 204, 255, 0.2));
          border: 2px solid #00ff88;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          color: #00ff88;
          margin: 0 auto 1.5rem;
          transition: all 0.3s ease;
        }

        .step:hover .step-number {
          transform: scale(1.1) rotate(10deg);
        }

        .step-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .step-description {
          color: #999;
        }

        .testimonials {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 204, 255, 0.02) 50%, transparent 100%);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .testimonial-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          position: relative;
        }

        .testimonial-quote {
          font-size: 2rem;
          color: #00ff88;
          margin-bottom: 1rem;
        }

        .testimonial-text {
          color: #ccc;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00ff88 0%, #00ccff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #000;
        }

        .author-info {
          flex: 1;
        }

        .author-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .author-role {
          color: #666;
          font-size: 0.875rem;
        }

        .testimonial-rating {
          color: #ffcc00;
        }

        .pricing {
          padding: 6rem 2rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2rem;
          text-align: center;
          position: relative;
          transition: all 0.3s ease;
        }

        .pricing-card.featured {
          border-color: #00ff88;
          transform: scale(1.05);
        }

        .pricing-card.featured::before {
          content: 'POPULAR';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #00ff88 0%, #00ccff 100%);
          color: #000;
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .pricing-card:hover {
          transform: translateY(-10px);
          border-color: rgba(0, 255, 136, 0.5);
        }

        .pricing-plan {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .pricing-price {
          font-size: 3rem;
          font-weight: bold;
          color: #00ff88;
          margin-bottom: 0.5rem;
        }

        .pricing-period {
          color: #666;
          margin-bottom: 2rem;
        }

        .pricing-features {
          list-style: none;
          margin-bottom: 2rem;
        }

        .pricing-feature {
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .pricing-feature:last-child {
          border-bottom: none;
        }

        .check-icon {
          color: #00ff88;
        }

        .cta {
          padding: 6rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 204, 255, 0.05) 100%);
        }

        .cta-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #00ff88 0%, #00ccff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cta-subtitle {
          color: #999;
          font-size: 1.25rem;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .footer {
          padding: 4rem 2rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo {
          font-size: 1.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00ff88 0%, #00ccff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-description {
          color: #666;
          line-height: 1.6;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: rgba(0, 255, 136, 0.2);
          border-color: #00ff88;
          color: #00ff88;
          transform: scale(1.1);
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .footer-link {
          color: #666;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer-link:hover {
          color: #00ff88;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: #666;
          font-size: 0.875rem;
        }

        .mobile-menu-toggle {
          display: none;
          background: transparent;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          
          .mobile-menu-toggle {
            display: block;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.125rem;
          }
          
          .hero-buttons {
            flex-direction: column;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header" id="header">
        <nav className="nav-container">
          <div className="logo">TUTUCA</div>
          
          <div className="nav-links">
            <a href="#features" className="nav-link">Características</a>
            <a href="#how-it-works" className="nav-link">Cómo Funciona</a>
            <a href="#pricing" className="nav-link">Precios</a>
            <a href="#testimonials" className="nav-link">Testimonios</a>
          </div>
          
          <div className="nav-buttons">
            <button 
              onClick={() => setUserType('brand')}
              className="btn btn-secondary"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => setUserType('influencer')}
              className="btn btn-primary"
            >
              Empezar Gratis
            </button>
          </div>
          
          <button className="mobile-menu-toggle">☰</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="floating-cards">
          <div className="floating-card">
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📸</div>
            <div style={{fontWeight: '600'}}>+2.5M</div>
            <div style={{color: '#666', fontSize: '0.875rem'}}>Contenidos</div>
          </div>
          
          <div className="floating-card">
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⭐</div>
            <div style={{fontWeight: '600'}}>4.9/5</div>
            <div style={{color: '#666', fontSize: '0.875rem'}}>Rating</div>
          </div>
          
          <div className="floating-card">
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🚀</div>
            <div style={{fontWeight: '600'}}>15K+</div>
            <div style={{color: '#666', fontSize: '0.875rem'}}>Campañas</div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">🔥 #1 EN LATAM</div>
          
          <h1 className="hero-title">
            Conectamos <span className="hero-highlight">Marcas</span><br />
            con <span className="hero-highlight">Influencers</span> Auténticos
          </h1>
          
          <p className="hero-subtitle">
            La plataforma todo-en-uno para gestionar campañas de influencer marketing<br />
            con resultados medibles y ROI garantizado
          </p>
          
          <div className="hero-buttons">
            <button 
              onClick={() => setUserType('brand')}
              className="btn btn-primary"
              style={{padding: '1rem 2rem', fontSize: '1.125rem'}}
            >
              Empezar Gratis →
            </button>
            <button className="btn btn-secondary" style={{padding: '1rem 2rem', fontSize: '1.125rem'}}>
              Ver Demo
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">10K+</div>
              <div className="stat-label">Influencers Verificados</div>
            </div>
            <div className="stat">
              <div className="stat-value">500+</div>
              <div className="stat-label">Marcas Activas</div>
            </div>
            <div className="stat">
              <div className="stat-value">$5M+</div>
              <div className="stat-label">Pagos Procesados</div>
            </div>
            <div className="stat">
              <div className="stat-value">4.2x</div>
              <div className="stat-label">ROI Promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-header">
          <div className="section-badge">CARACTERÍSTICAS</div>
          <h2 className="section-title">Todo lo que necesitas en un solo lugar</h2>
          <p className="section-subtitle">
            Herramientas poderosas para marcas e influencers
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3 className="feature-title">Discovery Inteligente</h3>
            <p className="feature-description">
              Encuentra influencers perfectos con IA. Filtros avanzados por nicho, 
              engagement, ubicación y más. Match del 95% garantizado.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Analytics en Tiempo Real</h3>
            <p className="feature-description">
              Métricas detalladas de cada campaña. ROI, alcance, engagement y 
              conversiones actualizadas al instante.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3 className="feature-title">Mensajería Integrada</h3>
            <p className="feature-description">
              Comunícate directamente con influencers. Chat en tiempo real, 
              compartir archivos y negociación transparente.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3 className="feature-title">Pagos Seguros</h3>
            <p className="feature-description">
              Sistema de pagos integrado con escrow. Múltiples métodos de pago 
              y facturación automática.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3 className="feature-title">Gestión de Campañas</h3>
            <p className="feature-description">
              Crea, gestiona y escala campañas fácilmente. Workflows automatizados 
              y aprobaciones rápidas.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3 className="feature-title">Reviews Verificados</h3>
            <p className="feature-description">
              Sistema de calificaciones bidireccional. Construye confianza 
              con feedback transparente.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-header">
          <div className="section-badge">PROCESO SIMPLE</div>
          <h2 className="section-title">Cómo Funciona TUTUCA</h2>
          <p className="section-subtitle">
            De la idea a resultados en 4 simples pasos
          </p>
        </div>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">Crea tu Campaña</h3>
            <p className="step-description">
              Define objetivos, presupuesto y requisitos en minutos
            </p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">Encuentra Influencers</h3>
            <p className="step-description">
              Recibe aplicaciones o busca en nuestra base de +10K creators
            </p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">Colabora</h3>
            <p className="step-description">
              Gestiona contenido, comunicación y pagos en un solo lugar
            </p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3 className="step-title">Mide Resultados</h3>
            <p className="step-description">
              Analytics detallados y ROI en tiempo real
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <div className="section-header">
          <div className="section-badge">TESTIMONIOS</div>
          <h2 className="section-title">Historias de Éxito</h2>
          <p className="section-subtitle">
            Lo que dicen nuestros usuarios
          </p>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-quote">&ldquo;</div>
            <p className="testimonial-text">
              TUTUCA transformó completamente nuestra estrategia de marketing. 
              El ROI aumentó 4x y ahorramos 20 horas semanales en gestión.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">MG</div>
              <div className="author-info">
                <div className="author-name">María González</div>
                <div className="author-role">CMO en Fashion Brand</div>
              </div>
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-quote">&ldquo;</div>
            <p className="testimonial-text">
              Como influencer, TUTUCA me conectó con marcas perfectas para mi audiencia. 
              Mis ingresos crecieron 300% en 6 meses.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">CL</div>
              <div className="author-info">
                <div className="author-name">Carlos López</div>
                <div className="author-role">@carloslifestyle • 120K</div>
              </div>
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-quote">&ldquo;</div>
            <p className="testimonial-text">
              La mejor plataforma de influencer marketing. Interface intuitiva, 
              soporte excepcional y resultados medibles.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">AP</div>
              <div className="author-info">
                <div className="author-name">Ana Pérez</div>
                <div className="author-role">Directora en TechCorp</div>
              </div>
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="section-header">
          <div className="section-badge">PRECIOS</div>
          <h2 className="section-title">Planes para cada necesidad</h2>
          <p className="section-subtitle">
            Transparente, sin sorpresas
          </p>
        </div>
        
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="pricing-plan">Starter</h3>
            <div className="pricing-price">$99</div>
            <div className="pricing-period">por mes</div>
            
            <ul className="pricing-features">
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                Hasta 5 campañas activas
              </li>
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                20 influencers por mes
              </li>
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                Analytics básicos
              </li>
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                Soporte por email
              </li>
            </ul>
            
            <button 
              onClick={() => setUserType('brand')}
              className="btn btn-secondary"
              style={{width: '100%'}}
            >
              Empezar
            </button>
          </div>
          
          <div className="pricing-card featured">
            <h3 className="pricing-plan">Professional</h3>
            <div className="pricing-price">$299</div>
            <div className="pricing-period">por mes</div>
            
            <ul className="pricing-features">
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                Campañas ilimitadas
              </li>
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                100 influencers por mes
              </li>
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                Analytics avanzados
              </li>
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                API access
              </li>
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                Soporte prioritario
              </li>
            </ul>
            
            <button 
              onClick={() => setUserType('brand')}
              className="btn btn-primary"
              style={{width: '100%'}}
            >
              Empezar
            </button>
          </div>
          
          <div className="pricing-card">
            <h3 className="pricing-plan">Enterprise</h3>
            <div className="pricing-price">Custom</div>
            <div className="pricing-period">contactar ventas</div>
            
            <ul className="pricing-features">
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                Todo ilimitado
              </li>
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                Account Manager dedicado
              </li>
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                Integraciones custom
              </li>
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                SLA garantizado
              </li>
              <li className="pricing-feature">
                <span className="check-icon">✓</span>
                Training personalizado
              </li>
            </ul>
            
            <button className="btn btn-secondary" style={{width: '100%'}}>
              Contactar
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">¿Listo para escalar tu marketing?</h2>
          <p className="cta-subtitle">
            Únete a miles de marcas e influencers que ya están creciendo con TUTUCA
          </p>
          
          <div className="cta-buttons">
            <button 
              onClick={() => setUserType('brand')}
              className="btn btn-primary"
              style={{padding: '1rem 3rem', fontSize: '1.125rem'}}
            >
              Crear Cuenta Gratis
            </button>
            <button 
              onClick={() => setUserType('influencer')}
              className="btn btn-secondary"
              style={{padding: '1rem 3rem', fontSize: '1.125rem'}}
            >
              Soy Influencer
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">TUTUCA</div>
            <p className="footer-description">
              La plataforma líder de influencer marketing en LATAM. 
              Conectando marcas con voces auténticas desde 2023.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">f</a>
              <a href="#" className="social-link">𝕏</a>
              <a href="#" className="social-link">in</a>
              <a href="#" className="social-link">@</a>
            </div>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-title">Producto</h4>
            <a href="#features" className="footer-link">Características</a>
            <a href="#pricing" className="footer-link">Precios</a>
            <a href="#" className="footer-link">API</a>
            <a href="#" className="footer-link">Integraciones</a>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-title">Empresa</h4>
            <a href="#" className="footer-link">Sobre Nosotros</a>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">Carreras</a>
            <a href="#" className="footer-link">Contacto</a>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-title">Legal</h4>
            <a href="#" className="footer-link">Términos</a>
            <a href="#" className="footer-link">Privacidad</a>
            <a href="#" className="footer-link">Cookies</a>
            <a href="#" className="footer-link">GDPR</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 TUTUCA. Todos los derechos reservados. Hecho con 💚 en LATAM</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {userType && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '28rem',
            width: '100%'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {userType === 'brand' ? 'Acceso para Marcas' : 'Acceso para Influencers'}
            </h2>

            <form onSubmit={handleSignIn} style={{marginBottom: '1.5rem'}}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: '#999',
                  marginBottom: '0.5rem'
                }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{marginBottom: '1rem'}}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: '#999',
                  marginBottom: '0.5rem'
                }}>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
                  color: 'black',
                  fontWeight: 'bold',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div style={{textAlign: 'center', color: '#999', marginBottom: '1rem'}}>o</div>

            <button
              onClick={handleSignUp}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#333',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.5 : 1,
                marginBottom: '1rem'
              }}
            >
              Crear Cuenta Nueva
            </button>
            
            <button
              onClick={() => setUserType(null)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: 'transparent',
                color: '#999',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}