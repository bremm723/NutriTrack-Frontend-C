import { useEffect, useState } from 'react'
import api from '../api.js'

export default function AirTracker() {
  const [terisi, setTerisi] = useState(0)

  useEffect(() => {
    api.get('/tracking/air')
      .then(res => setTerisi(res.data.jumlah))
      .catch(() => {})
  }, [])

  const toggle = async (i) => {
    const jumlahBaru = i < terisi ? i : i + 1
    setTerisi(jumlahBaru)
    await api.put('/tracking/air', { jumlah: jumlahBaru })
  }

  return (
    <div className="card air-tracker-card">
      <div className="wtitle-row">
        <div className="card-title">Asupan Air</div>
        <div className="wcount">
          <span style={{ color: '#3b82f6', fontSize: 16 }}>{terisi}</span>/8 gelas
        </div>
      </div>
      <div className="cups-row">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={i < terisi ? 'cup filled' : 'cup'} onClick={() => toggle(i)} />
        ))}
      </div>
      <div className="air-progress-bar">
        <div className="air-progress-fill" style={{ width: `${(terisi/ 8) * 100}%` }} />
      </div>
      <div className="air-progress-label">{Math.round((terisi / 8) * 100)}% target harian</div>
    </div>
  )
}