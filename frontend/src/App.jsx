import { useState, useRef, useEffect } from 'react'
import HalamanLogin      from './components/HalamanLogin.jsx'
import HalamanRegister   from './components/HalamanRegister.jsx'
import Sidebar           from './components/Sidebar.jsx'
import Topbar            from './components/Topbar.jsx'
import GaugeCard         from './components/GaugeCard.jsx'
import MacroCard         from './components/MacroCard.jsx'
import CatatanMakanan    from './components/CatatanMakanan.jsx'
import RiwayatKalori     from './components/RiwayatKalori.jsx'
import Rekomendasi       from './components/Rekomendasi.jsx'
import AirTracker        from './components/AirTracker.jsx'
import HalamanProfil     from './components/HalamanProfil.jsx'
import KalkulatorKalori  from './components/KalkulatorKalori.jsx'
import HalamanSetelan    from './components/HalamanSetelan.jsx'
import JendelaNotifikasi from './components/JendelaNotifikasi.jsx'
import api from './api.js'

const HARI_MAP = { Senin:0, Selasa:1, Rabu:2, Kamis:3, Jumat:4, Sabtu:5, Minggu:6 }

export default function App() {
  const [authPage, setAuthPage] = useState('login')
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [user,     setUser]     = useState(null)
  const [halaman,  setHalaman]  = useState('dashboard')
  const [tema,     setTema]     = useState('light')
  const [showNotif,setShowNotif]= useState(false)

  const [catatanItems, setCatatanItems] = useState([])
  const nextId = useRef(1)

  const [targetHarian,  setTargetHarian]  = useState()
  const [targetMingguan, setTargetMingguan] = useState(
    Array(7).fill(null)
  )

  const handleLogin      = (u) => { setUser(u); setAuthPage(null) }
  const handleRegister   = (u) => { setUser(u); setAuthPage(null) }
  const handleUpdateUser = (data) => setUser(prev => ({ ...prev, ...data }))
  const handleLogout = () => {
    setUser(null)
    setAuthPage('login')
    setHalaman('dashboard')
  }
  const toggleTema = () => {
    setTema(t => t === 'light' ? 'dark' : 'light')
    document.body.classList.toggle('dark-mode')
  }

  const tambahMakanan = async (data) => {
    try {
      const res = await api.post('/tracking', data)
      const t = res.data
      const newItem = {
        id: t.id,
        nama: t.food.name, kalori: t.food.calories,
        karbo: t.food.carbs, protein: t.food.protein, lemak: t.food.fat,
        porsi: t.food.portion, waktu: t.mealTime
      }
      setCatatanItems(prev => [...prev, newItem])
    } catch(err) { console.error('Gagal tambah makanan') }
  }

  const updateItem = async (id, data) => {
    try {
      const res = await api.put(`/tracking/${id}`, data)
      const t = res.data
      const updatedItem = {
        id: t.id,
        nama: t.food.name, kalori: t.food.calories,
        karbo: t.food.carbs, protein: t.food.protein, lemak: t.food.fat,
        porsi: t.food.portion, waktu: t.mealTime
      }
      setCatatanItems(prev => prev.map(it => it.id === id ? updatedItem : it))
    } catch(err) { console.error('Gagal update makanan') }
  }

  const hapusItem = async (id) => {
    try {
      await api.delete(`/tracking/${id}`)
      setCatatanItems(prev => prev.filter(it => it.id !== id))
    } catch(err) { console.error('Gagal hapus makanan') }
  }

useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const tokenFromUrl = params.get("token")
  const tokenFromStorage = localStorage.getItem("token")

  const token = tokenFromUrl || tokenFromStorage

  if (token) {
    localStorage.setItem("token", token)

    // hapus token dari URL biar bersih
    if (tokenFromUrl) {
      window.history.replaceState({}, document.title, "/")
    }

    // Fetch data user lengkap dari API agar user.nama, email, dll tersedia
    api.get('/user/me')
      .then(res => {
        const u = res.data
        setUser({ id: u.id, nama: u.name, email: u.email, birthday: u.birthday, gender: u.gender, height: u.height, weight: u.weight })
      })
      .catch(() => {
        console.error("Sesi tidak valid, logout.")
        localStorage.removeItem("token")
      })
      .finally(() => {
        setLoadingAuth(false)
      })
  } else {
    setLoadingAuth(false)
  }
}, [])

  useEffect(() => {
    if (!user) return
    api.get('/user/target')
      .then(res => {
        if (res.data) {
          setTargetMingguan(Array.isArray(res.data.targetMingguan) ? res.data.targetMingguan : Array(7).fill(null))
          setTargetHarian(res.data.targetHarian)
        }
      })
      .catch(err => console.warn('Gagal load target kalori:', err))

    // Fetch catatan / tracking hari ini
    api.get('/tracking')
      .then(res => {
        if (Array.isArray(res.data)) {
          const loaded = res.data.map(t => ({
            id: t.id,
            nama: t.food?.name || 'Unknown', kalori: t.food?.calories || 0,
            karbo: t.food?.carbs || 0, protein: t.food?.protein || 0, lemak: t.food?.fat || 0,
            porsi: t.food?.portion || '1 porsi', waktu: t.mealTime
          }))
          setCatatanItems(loaded)
        }
      })
      .catch(err => console.warn('Gagal load catatan makanan:', err))
  }, [user])

const terapkanTarget = async (hari, kalori) => {
  const idx = HARI_MAP[hari]
  if (idx === undefined) return

  const newTargetMingguan = [...targetMingguan]  // ← buat copy dulu
  newTargetMingguan[idx] = kalori
  setTargetMingguan(newTargetMingguan)
  setTargetHarian(kalori)

  await api.put('/user/target', {                // ← ini yang kurang
    targetMingguan: newTargetMingguan,
    targetHarian: kalori,
  })
}

  const totalHariIni = catatanItems.reduce((acc, it) => ({
    kalori:  acc.kalori  + (it.kalori  || 0),
    karbo:   acc.karbo   + (it.karbo   || 0),
    protein: acc.protein + (it.protein || 0),
    lemak:   acc.lemak   + (it.lemak   || 0),
  }), { kalori:0, karbo:0, protein:0, lemak:0 })

  if (loadingAuth) {
    return <div>Loading...</div>
  }

  if (!user) {
    if (authPage === 'login') {
      return <HalamanLogin onLogin={handleLogin} onKeRegister={() => setAuthPage('register')} />
    }
    return <HalamanRegister onRegister={handleRegister} onKeLogin={() => setAuthPage('login')} />
  }

  return (
    <>
      <Sidebar halaman={halaman} setHalaman={setHalaman} />
      <div className="main">
        <Topbar user={user} setHalaman={setHalaman} onToggleNotif={() => setShowNotif(v => !v)} />

        {halaman === 'dashboard' && (
          <div className="content">
            <div className="left">
              <div className="top-row top-row-3">
                <GaugeCard
                  kaloriHariIni={totalHariIni.kalori}
                  targetKalori={targetHarian}
                />
                <MacroCard
                  karbo={totalHariIni.karbo}
                  protein={totalHariIni.protein}
                  lemak={totalHariIni.lemak}
                />
                <AirTracker />
              </div>
              <CatatanMakanan
                items={catatanItems}
                onTambah={tambahMakanan}
                onUpdate={updateItem}
                onHapus={hapusItem}
                nextId={nextId}
              />
              <RiwayatKalori targetMingguan={targetMingguan} kaloriHariIni={totalHariIni.kalori} />
            </div>
            <div className="right">
              <Rekomendasi onTambah={tambahMakanan} />
            </div>
          </div>
        )}

        {halaman === 'profil'     && <HalamanProfil user={user} onUpdateUser={handleUpdateUser} />}
        {halaman === 'kalkulator' && <KalkulatorKalori onTerapkan={terapkanTarget} />}
        {halaman === 'setelan'    && <HalamanSetelan user={user} onUpdateUser={handleUpdateUser} tema={tema} onToggleTema={toggleTema} onLogout={handleLogout} />}
      </div>
      {showNotif && <JendelaNotifikasi onTutup={() => setShowNotif(false)} />}
    </>
  )
}