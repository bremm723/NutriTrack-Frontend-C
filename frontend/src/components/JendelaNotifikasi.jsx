import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import api from '../api.js'

function NotifPanel({ onTutup }) {
  const [notifs, setNotifs] = useState([])

  useEffect(() => {
    api.get('/notifikasi').then(res => setNotifs(res.data)).catch(() => {})
  }, [])

  const hapus = async (id) => {
    await api.delete(`/notifikasi/${id}`).catch(() => {})
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  const tandaiSemua = async () => {
    await api.put('/notifikasi/tandai-semua').catch(() => {})
    setNotifs(prev => prev.map(n => ({ ...n, terbaca: true })))
  }

  const belumDibaca = notifs.filter(n => !n.terbaca).length

  return (
    <>
      <div className="notif-overlay" onClick={onTutup} />
      <div className="notif-panel">
        <div className="notif-header">
          <div className="notif-judul">Notifikasi</div>
          {belumDibaca > 0 && <div className="notif-badge">{belumDibaca} baru</div>}
          <button className="notif-close" onClick={onTutup}>✕</button>
        </div>
        <div className="notif-list">
          {notifs.length === 0
            ? <div className="notif-kosong"><div className="notif-kosong-ikon">🔔</div><div>Tidak ada notifikasi</div></div>
            : notifs.map(n => (
              <div key={n.id} className={'notif-item' + (!n.terbaca ? ' notif-unread' : '')}>
                <div className="notif-item-ikon">{n.ikon}</div>
                <div className="notif-item-body">
                  <div className="notif-item-judul">{n.judul}</div>
                  <div className="notif-item-waktu">{n.waktu}</div>
                </div>
                {!n.terbaca && <div className="notif-dot" />}
                <button className="notif-hapus-btn" onClick={() => hapus(n.id)} title="Hapus notifikasi">✕</button>
              </div>
            ))
          }
        </div>
        <div className="notif-footer">
          <button className="notif-tandai-semua" onClick={tandaiSemua}>Tandai semua sudah dibaca</button>
        </div>
      </div>
    </>
  )
}

export default function JendelaNotifikasi({ onTutup }) {
  return createPortal(<NotifPanel onTutup={onTutup} />, document.body)
}