export default function Sidebar({ halaman, setHalaman }) {
  const navItems = [
    { id: 'dashboard',  icon: '🏠', label: 'Beranda'    },
    { id: 'kalkulator', icon: '🧮', label: 'Kalkulator' },
    { id: 'profil',     icon: '👤', label: 'Profil'     },
    { id: 'setelan',    icon: '⚙️', label: 'Setelan'    },
  ]

  return (
    <>
      <div className="sidebar">
        <div className="logo">N</div>
        <button className={'nav-btn' + (halaman === 'dashboard'  ? ' active' : '')} title="Dashboard"  onClick={() => setHalaman('dashboard')}>🏠</button>
        <button className={'nav-btn' + (halaman === 'profil'     ? ' active' : '')} title="Profil"     onClick={() => setHalaman('profil')}>👤</button>
        <button className={'nav-btn' + (halaman === 'kalkulator' ? ' active' : '')} title="Kalkulator" onClick={() => setHalaman('kalkulator')}>🧮</button>
        <div className="bottom">
          <button className={'nav-btn' + (halaman === 'setelan' ? ' active' : '')} title="Pengaturan" onClick={() => setHalaman('setelan')}>⚙️</button>
        </div>
      </div>

      <nav className="bottom-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={'bottom-nav-btn' + (halaman === item.id ? ' active' : '')}
            onClick={() => setHalaman(item.id)}
          >
            <span className="bnav-icon">{item.icon}</span>
            <span className="bnav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}