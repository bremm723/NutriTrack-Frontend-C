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

const HARI_MAP = { Senin:0, Selasa:1, Rabu:2, Kamis:3, Jumat:4, Sabtu:5, Minggu:6 }

export default function App() {
  const [authPage, setAuthPage] = useState('login')
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

  const tambahMakanan = (data) => {
    setCatatanItems(prev => [...prev, { id: nextId.current++, ...data }])
  }

  const updateItem = (id, data) => {
    setCatatanItems(prev => prev.map(it => it.id === id ? { ...it, ...data } : it))
  }
  const hapusItem = (id) => {
    setCatatanItems(prev => prev.filter(it => it.id !== id))
  }


  useEffect(() => {
    if (!user) return
    api.get('user/target')
    .then(res => {
      setTargetMingguan(res.data.targetmingguan)
      setTargetHarian(res.data.targetharian)
    })
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

  if (authPage === 'login')    return <HalamanLogin    onLogin={handleLogin}       onKeRegister={() => setAuthPage('register')} />
  if (authPage === 'register') return <HalamanRegister onRegister={handleRegister} onKeLogin={() => setAuthPage('login')} />

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