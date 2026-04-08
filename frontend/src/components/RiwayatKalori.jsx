import { useState } from 'react'

const HARI      = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const HARI_JS   = [1, 2, 3, 4, 5, 6, 0] 

export default function RiwayatKalori({ targetMingguan = Array(7).fill(null), kaloriHariIni = 0 }) {
  const [tab, setTab] = useState('Mingguan')

  const hariIniIdx = HARI_JS.indexOf(new Date().getDay())

  const dataBar = targetMingguan.map((val, i) => {
    if (i === hariIniIdx) return { target: val, aktual: kaloriHariIni }
    return { target: val, aktual: null }
  })

  const nilaiMaks = Math.max(
    ...dataBar.map(d => Math.max(d.target || 0, d.aktual || 0)),
    2000
  )

  return (
    <div className="card">
      <div className="chart-header">
        <div className="card-title">Kalori & Target Mingguan</div>
      </div>

      <div className="chart-area">
        {HARI.map((hari, i) => {
          const { target, aktual } = dataBar[i]
          const isHariIni = i === hariIniIdx


          const persenAktual = aktual > 0 ? Math.min((aktual / nilaiMaks) * 100, 100) : 0

          const persenTarget = target ? Math.min((target / nilaiMaks) * 100, 100) : 0

          const warnaAktual = aktual > (target || Infinity) ? '#ef4444' : '#7c3aed'

          return (
            <div className="bar-group" key={hari}>
              <div className="bar-wrap" style={{ position: 'relative' }}>
                {target && (
                  <div className="bar bar-target"
                    style={{ height: persenTarget + '%', background: '#e9d5ff', position: 'absolute', bottom: 0, width: '100%', borderRadius: '6px 6px 0 0' }}
                  />
                )}
                {persenAktual > 0 && (
                  <div className="bar bar-aktual"
                    style={{ height: persenAktual + '%', background: warnaAktual, position: 'absolute', bottom: 0, width: '100%', borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease' }}
                  />
                )}
                {!target && persenAktual === 0 && (
                  <div className="bar" style={{ height: '4px', background: '#f0f0f0' }} />
                )}
              </div>
              <div className="bar-day" style={{ fontWeight: isHariIni ? 700 : 400, color: isHariIni ? '#7c3aed' : undefined }}>
                {hari}
              </div>
              {(target || aktual > 0) && (
                <div className="bar-val">
                  {aktual > 0 ? `${(aktual/1000).toFixed(1)}k` : target ? `${(target/1000).toFixed(1)}k` : ''}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {targetMingguan.every(v => !v) && kaloriHariIni === 0 && (
        <div className="chart-empty">
          Tambah makanan atau gunakan kalkulator untuk melihat progres
        </div>
      )}
    </div>
  )
}
