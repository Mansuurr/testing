import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.12)', backgroundColor: '#050807' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '48px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <img src="/logo.png" alt="TSCM Group" style={{ height: '56px', width: 'auto', opacity: 0.9 }} />
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#79f2bf', fontWeight: 500 }}>
            Работаем по всему Казахстану
          </p>
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
            Все обращения строго конфиденциальны. Данные не передаются третьим лицам.
          </p>
          <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
            <Link to="/services" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s' }}>Услуги</Link>
            <Link to="/contacts" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s' }}>Контакты</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}