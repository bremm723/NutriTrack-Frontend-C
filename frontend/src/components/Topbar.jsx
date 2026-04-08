export default function Topbar({ user, setHalaman, onToggleNotif }) {
  const inisial = user.nama.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div className="topbar">
      <div className="hello">Halo, <span>{user.nama}! 👋</span></div>
      <div className="topbar-right">
        <div className="notif-btn" onClick={onToggleNotif} style={{ cursor:'pointer' }}>🔔</div>
        <div className="user-info" onClick={() => setHalaman('profil')} style={{ cursor:'pointer' }}>
          <div className="user-avatar">{inisial}</div>
          <div className="user-text">
            <div className="user-name">{user.nama}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}