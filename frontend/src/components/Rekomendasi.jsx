import { DB_MAKANAN } from './CatatanMakanan.jsx'

const REKO = [
  { ...DB_MAKANAN.find(m => m.nama === 'Oatmeal'),      waktu: 'Sarapan', bg: '#ede9fe', color: '#7c3aed' },
  { ...DB_MAKANAN.find(m => m.nama === 'Ayam Bakar'),   waktu: 'Siang',   bg: '#fce7f3', color: '#ec4899' },
  { ...DB_MAKANAN.find(m => m.nama === 'Pisang Ambon'), waktu: 'Snack',   bg: '#fef3c7', color: '#f59e0b' },
  { ...DB_MAKANAN.find(m => m.nama === 'Soto Ayam'),    waktu: 'Malam',   bg: '#dbeafe', color: '#3b82f6' },
  { ...DB_MAKANAN.find(m => m.nama === 'Telur Goreng'), waktu: 'Sarapan', bg: '#dcfce7', color: '#16a34a' },
  { ...DB_MAKANAN.find(m => m.nama === 'Gado-Gado'),    waktu: 'Siang',   bg: '#fef3c7', color: '#92400e' },
]

export default function Rekomendasi({ onTambah }) {
  const tambah = (r) => {
    onTambah({ nama: r.nama, porsi: r.porsi, waktu: r.waktu,
      kalori: r.kalori, karbo: r.karbo, protein: r.protein, lemak: r.lemak })
  }

  return (
    <div className="card">
      <div className="reco-header">
        <div className="card-title">Rekomendasi</div>
      </div>
      <div className="reco-list">
        {REKO.map((r, i) => (
          <div className="reco-item reco-item-clickable" key={i} onClick={() => tambah(r)} title={`Tambah ${r.nama} ke catatan`}>
            <div style={{ flex: 1 }}>
              <div className="rname">{r.nama}</div>
              <div className="rcal">{r.kalori} kcal · K:{r.karbo}g · P:{r.protein}g</div>
            </div>
            <div className="tag" style={{ background: r.bg, color: r.color }}>{r.waktu}</div>
            <div className="reco-add-icon">+</div>
          </div>
        ))}
      </div>
    </div>
  )
}