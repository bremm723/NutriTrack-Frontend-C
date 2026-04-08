import { useState, useEffect, useRef } from 'react'

export const DB_MAKANAN = [
  { nama: 'Nasi Putih',   porsi: '1 porsi (200g)',  kalori: 258, karbo: 56, protein: 5,  lemak: 1  },
  { nama: 'Nasi Goreng',  porsi: '1 porsi (250g)',  kalori: 338, karbo: 48, protein: 9,  lemak: 12 },
  { nama: 'Nasi Merah',   porsi: '1 porsi (200g)',  kalori: 218, karbo: 46, protein: 5,  lemak: 2  },
  { nama: 'Ayam Bakar',   porsi: '1 porsi (150g)',  kalori: 210, karbo: 0,  protein: 28, lemak: 11 },
  { nama: 'Ayam Goreng',  porsi: '1 potong (120g)', kalori: 290, karbo: 8,  protein: 26, lemak: 17 },
  { nama: 'Gado-Gado',    porsi: '1 porsi (300g)',  kalori: 340, karbo: 30, protein: 14, lemak: 18 },
  { nama: 'Soto Ayam',    porsi: '1 mangkuk',       kalori: 290, karbo: 22, protein: 24, lemak: 8  },
  { nama: 'Mie Ayam',     porsi: '1 mangkuk',       kalori: 400, karbo: 55, protein: 18, lemak: 12 },
  { nama: 'Mie Goreng',   porsi: '1 porsi',         kalori: 380, karbo: 52, protein: 12, lemak: 14 },
  { nama: 'Bakso',        porsi: '1 mangkuk',       kalori: 320, karbo: 35, protein: 20, lemak: 10 },
  { nama: 'Rendang',      porsi: '1 porsi (100g)',  kalori: 195, karbo: 4,  protein: 19, lemak: 12 },
  { nama: 'Tempe Goreng', porsi: '2 potong (80g)',  kalori: 160, karbo: 10, protein: 12, lemak: 9  },
  { nama: 'Tahu Goreng',  porsi: '2 potong (80g)',  kalori: 140, karbo: 6,  protein: 10, lemak: 9  },
  { nama: 'Telur Goreng', porsi: '1 butir',         kalori: 90,  karbo: 0,  protein: 6,  lemak: 7  },
  { nama: 'Pisang Ambon', porsi: '1 buah (120g)',   kalori: 89,  karbo: 23, protein: 1,  lemak: 0  },
  { nama: 'Apel',         porsi: '1 buah (150g)',   kalori: 80,  karbo: 21, protein: 0,  lemak: 0  },
  { nama: 'Roti Gandum',  porsi: '2 lembar',        kalori: 160, karbo: 30, protein: 7,  lemak: 2  },
  { nama: 'Susu Sapi',    porsi: '1 gelas (250ml)', kalori: 152, karbo: 12, protein: 8,  lemak: 8  },
  { nama: 'Yogurt',       porsi: '1 cup (150g)',    kalori: 100, karbo: 14, protein: 6,  lemak: 2  },
  { nama: 'Oatmeal',      porsi: '1 porsi (40g)',   kalori: 148, karbo: 27, protein: 5,  lemak: 2  },
]

const WAKTU_OPTS = ['Sarapan', 'Siang', 'Snack', 'Malam']
const WAKTU_ICON = { Sarapan: '🌅', Siang: '☀️', Snack: '🍎', Malam: '🌙' }

function SearchMakanan({ value, onChange, onPilih }) {
  const [open,  setOpen]  = useState(false)
  const [query, setQuery] = useState(value?.nama || '')
  const wrapRef = useRef(null)

  const filtered = query.trim().length === 0
    ? DB_MAKANAN
    : DB_MAKANAN.filter(m => m.nama.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => { setQuery(value?.nama || '') }, [value])

  useEffect(() => {
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div className="search-makanan-wrap">
        <input type="text" value={query} autoComplete="off" placeholder="Cari atau ketik nama makanan..."
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        <span className="search-makanan-icon">🔍</span>
      </div>
      {open && (
        <div className="autocomplete-dropdown search-makanan-drop">
          <div className="ac-section-label">
            {query.trim() ? `${filtered.length} hasil` : 'Semua makanan'}
          </div>
          {filtered.length === 0
            ? <div className="ac-empty">Tidak ditemukan — ketik bebas</div>
            : filtered.map(m => (
              <div key={m.nama} className="autocomplete-item sm-item" onMouseDown={() => { onPilih(m); setOpen(false); setQuery(m.nama) }}>
                <div>
                  <div className="ac-nama">{m.nama}</div>
                  <div className="ac-detail">{m.porsi}</div>
                </div>
                <div className="ac-macro-badge">
                  <span>{m.kalori} kcal</span>
                  <span className="ac-karbo">K:{m.karbo}g</span>
                  <span className="ac-protein">P:{m.protein}g</span>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}

function ModalMakanan({ show, modeEdit, dataEdit, onSimpan, onTutup }) {
  const [pilihanDB, setPilihanDB] = useState(null)
  const [namaC,  setNamaC]  = useState('')
  const [porsi,  setPorsi]  = useState('')
  const [waktu,  setWaktu]  = useState('Sarapan')
  const [kalori, setKalori] = useState('')
  const [karbo,  setKarbo]  = useState('')
  const [protein,setProtein]= useState('')
  const [lemak,  setLemak]  = useState('')
  const [error,  setError]  = useState('')

  useEffect(() => {
    if (!show) return
    if (modeEdit && dataEdit) {
      setPilihanDB(null); setNamaC(dataEdit.nama); setPorsi(dataEdit.porsi)
      setWaktu(dataEdit.waktu); setKalori(String(dataEdit.kalori ?? ''))
      setKarbo(String(dataEdit.karbo ?? '')); setProtein(String(dataEdit.protein ?? ''))
      setLemak(String(dataEdit.lemak ?? ''))
    } else {
      setPilihanDB(null); setNamaC(''); setPorsi(''); setWaktu('Sarapan')
      setKalori(''); setKarbo(''); setProtein(''); setLemak('')
    }
    setError('')
  }, [show])

  const pilihDB = (item) => {
    setPilihanDB(item); setNamaC(item.nama); setPorsi(item.porsi)
    setKalori(String(item.kalori)); setKarbo(String(item.karbo))
    setProtein(String(item.protein)); setLemak(String(item.lemak)); setError('')
  }

  const simpan = () => {
    if (!namaC.trim()) { setError('⚠️ Nama makanan tidak boleh kosong.'); return }
    if (!kalori || isNaN(kalori) || Number(kalori) <= 0) { setError('⚠️ Masukkan kalori yang valid.'); return }
    setError('')
    onSimpan({ nama: namaC.trim(), porsi: porsi || '1 porsi', waktu,
      kalori: Number(kalori), karbo: Number(karbo)||0, protein: Number(protein)||0, lemak: Number(lemak)||0 })
  }

  return (
    <div className={'modal-overlay' + (show ? ' show' : '')} onClick={e => e.target.classList.contains('modal-overlay') && onTutup()}>
      <div className="modal modal-wide">
        <div className="modal-header">
          <div className="modal-title">{modeEdit ? 'Edit Catatan' : 'Tambah Catatan Makanan'}</div>
          <button className="modal-close" onClick={onTutup}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Cari Makanan {pilihanDB && <span className="label-badge">✓ dari database</span>}</label>
            <SearchMakanan value={pilihanDB} onChange={(v) => { setNamaC(v); if (pilihanDB && v !== pilihanDB.nama) { setPilihanDB(null); setKalori(''); setKarbo(''); setProtein(''); setLemak('') } }} onPilih={pilihDB} />
          </div>
          <div className="form-group">
            <label>Porsi</label>
            <input type="text" value={porsi} onChange={e => setPorsi(e.target.value)} placeholder="cth. 1 porsi (200g)" />
          </div>
          <div className="nutrisi-grid-2">
            <div className="form-group">
              <label>Kalori (kcal)</label>
              <input type="number" min="1" value={kalori} onChange={e => setKalori(e.target.value)} placeholder="350" />
            </div>
            <div className="form-group">
              <label>Karbohidrat (g)</label>
              <input type="number" min="0" value={karbo} onChange={e => setKarbo(e.target.value)} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Protein (g)</label>
              <input type="number" min="0" value={protein} onChange={e => setProtein(e.target.value)} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Lemak (g)</label>
              <input type="number" min="0" value={lemak} onChange={e => setLemak(e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="form-group">
            <label>Waktu Makan</label>
            <div className="meal-time-row">
              {WAKTU_OPTS.map(w => (
                <button key={w} className={'meal-time-btn' + (waktu === w ? ' active' : '')} onClick={() => setWaktu(w)}>
                  {WAKTU_ICON[w]} {w}
                </button>
              ))}
            </div>
          </div>
          {error && <div className="form-error">{error}</div>}
        </div>
        <div className="modal-footer">
          <button className="btn-batal" onClick={onTutup}>Batal</button>
          <button className="btn-simpan" onClick={simpan}>{modeEdit ? '✓ Simpan' : '+ Tambah'}</button>
        </div>
      </div>
    </div>
  )
}

function ModalHapus({ show, namaItem, onKonfirmasi, onTutup }) {
  return (
    <div className={'modal-overlay' + (show ? ' show' : '')} onClick={e => e.target.classList.contains('modal-overlay') && onTutup()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <div className="modal-title">Hapus Catatan?</div>
          <button className="modal-close" onClick={onTutup}>✕</button>
        </div>
        <div className="modal-body">
          <p className="hapus-desc">Item "<strong>{namaItem}</strong>" akan dihapus secara permanen.</p>
        </div>
        <div className="modal-footer">
          <button className="btn-batal" onClick={onTutup}>Batal</button>
          <button className="btn-hapus" onClick={onKonfirmasi}>🗑 Hapus</button>
        </div>
      </div>
    </div>
  )
}

function FoodItem({ item, removing, onEdit, onHapus }) {
  return (
    <div className={'food-item food-item-rich' + (removing ? ' food-item-removing' : '')}>
      <div className="info">
        <div className="name">{item.nama}</div>
        <div className="desc">{item.porsi} · {item.waktu}</div>
      </div>
      <div className="food-macro-row">
        {item.kalori  > 0 && <span className="food-macro-chip chip-kal">{item.kalori} kcal</span>}
        {item.karbo   > 0 && <span className="food-macro-chip chip-karbo">K {item.karbo}g</span>}
        {item.protein > 0 && <span className="food-macro-chip chip-protein">P {item.protein}g</span>}
        {item.lemak   > 0 && <span className="food-macro-chip chip-lemak">L {item.lemak}g</span>}
      </div>
      <div className="item-actions">
        <button className="action-btn edit-item-btn"   onClick={() => onEdit(item)}>✎</button>
        <button className="action-btn delete-item-btn" onClick={() => onHapus(item)}>🗑</button>
      </div>
    </div>
  )
}

export default function CatatanMakanan({ items, onTambah, onUpdate, onHapus, nextId }) {
  const [removingId,  setRemovingId]  = useState(null)
  const [showModal,   setShowModal]   = useState(false)
  const [modeEdit,    setModeEdit]    = useState(false)
  const [dataEdit,    setDataEdit]    = useState(null)
  const [showHapus,   setShowHapus]   = useState(false)
  const [hapusTarget, setHapusTarget] = useState(null)

  const bukaTambah = () => { setDataEdit(null); setModeEdit(false); setShowModal(true) }
  const bukaEdit   = (item) => { setDataEdit(item); setModeEdit(true); setShowModal(true) }
  const bukaHapus  = (item) => { setHapusTarget(item); setShowHapus(true) }

  const simpan = (data) => {
    if (modeEdit && dataEdit) onUpdate(dataEdit.id, data)
    else onTambah(data)
    setShowModal(false)
  }

  const konfirmasiHapus = () => {
    if (!hapusTarget) return
    setRemovingId(hapusTarget.id)
    setShowHapus(false)
    setTimeout(() => { onHapus(hapusTarget.id); setRemovingId(null); setHapusTarget(null) }, 350)
  }

  const total = items.reduce((acc, it) => ({
    kalori: acc.kalori + (it.kalori||0), karbo: acc.karbo + (it.karbo||0),
    protein: acc.protein + (it.protein||0), lemak: acc.lemak + (it.lemak||0),
  }), { kalori:0, karbo:0, protein:0, lemak:0 })

  return (
    <>
      <div className="card">
        <div className="food-header">
          <div>
            <div className="card-title" style={{ marginBottom: 4 }}>Catatan Makanan</div>
            <div className="food-total-row">
              <span className="food-total-chip chip-kal-total">{total.kalori.toLocaleString('id-ID')} kcal</span>
              <span className="food-total-chip chip-karbo-total">Karbo {total.karbo}g</span>
              <span className="food-total-chip chip-protein-total">Protein {total.protein}g</span>
              <span className="food-total-chip chip-lemak-total">Lemak {total.lemak}g</span>
            </div>
          </div>
          <button className="add-btn" onClick={bukaTambah}>+</button>
        </div>
        <div className="food-list">
          {items.length === 0
            ? <div className="food-empty">Belum ada catatan. Klik <strong>+</strong> untuk menambah makanan.</div>
            : items.map(item => (
              <FoodItem key={item.id} item={item} removing={removingId === item.id} onEdit={bukaEdit} onHapus={bukaHapus} />
            ))
          }
        </div>
      </div>
      <ModalMakanan show={showModal} modeEdit={modeEdit} dataEdit={dataEdit} onSimpan={simpan} onTutup={() => setShowModal(false)} />
      <ModalHapus   show={showHapus} namaItem={hapusTarget?.nama ?? ''} onKonfirmasi={konfirmasiHapus} onTutup={() => setShowHapus(false)} />
    </>
  )
}