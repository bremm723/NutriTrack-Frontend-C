import { useState } from 'react'
import api from '../api.js'

export default function HalamanSetelan({ user, onUpdateUser, tema, onToggleTema }) {
  const [username, setUsername] = useState(user.nama)
  const [email, setEmail] = useState(user.email)
  const [passLama, setPassLama] = useState('')
  const [passBaru, setPassBaru] = useState('')
  const [passKonfirm, setPassKonfirm] = useState('')
  const [pesanAkun, setPesanAkun] = useState('')
  const [pesanPass, setPesanPass] = useState('')
  const [showPassLama, setShowPassLama] = useState(false)
  const [showPassBaru, setShowPassBaru] = useState(false)

  const simpanAkun = async () => {
    if (!username.trim()) { setPesanAkun('❌ Username tidak boleh kosong.'); return }
    try {
      const res = await api.put('/user/update-profil', { nama: username.trim(), email: email.trim() })
      const u = res.data.user
      onUpdateUser({ nama: u.name, email: u.email })
      setPesanAkun('✅ Profil berhasil diperbarui!')
    } catch {
      setPesanAkun('❌ Gagal memperbarui profil.')
    }
    setTimeout(() => setPesanAkun(''), 3000)
  }

  const simpanPassword = async () => {
    if (!passLama) { setPesanPass('❌ Masukkan password lama.'); return }
    if (passBaru.length < 6) { setPesanPass('❌ Password baru minimal 6 karakter.'); return }
    if (passBaru !== passKonfirm) { setPesanPass('❌ Konfirmasi password tidak cocok.'); return }
    try {
      await api.put('/user/update-password', { passLama, passBaru })
      setPassLama(''); setPassBaru(''); setPassKonfirm('')
      setPesanPass('✅ Password berhasil diperbarui!')
    } catch (err) {
      setPesanPass(err.response?.data?.message === 'Password lama salah' ? '❌ Password lama salah.' : '❌ Gagal memperbarui password.')
    }
    setTimeout(() => setPesanPass(''), 3000)
  }

  return (
    <div className="setelan-page">
      <h1 className="setelan-judul">Pengaturan</h1>
      <div className="setelan-section">
        <div className="setelan-section-title">Tampilan</div>
        <div className="setelan-card">
          <div className="setelan-row">
            <div>
              <div className="setelan-label">Tema Aplikasi</div>
              <div className="setelan-desc">Pilih tampilan terang atau gelap</div>
            </div>
            <div className="tema-toggle-wrap">
              <span className="tema-icon">{tema === 'dark' ? '🌙' : '☀️'}</span>
              <button className={'tema-toggle' + (tema === 'dark' ? ' dark' : '')} onClick={onToggleTema}>
                <div className="tema-thumb" />
              </button>
              <span className="tema-label">{tema === 'dark' ? 'Gelap' : 'Terang'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="setelan-section">
        <div className="setelan-section-title">Informasi Akun</div>
        <div className="setelan-card">
          <div className="setelan-form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          </div>
          <div className="setelan-form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          </div>
          {pesanAkun && <div className={'setelan-pesan' + (pesanAkun.startsWith('✅') ? ' sukses' : ' gagal')}>{pesanAkun}</div>}
          <button className="setelan-btn" onClick={simpanAkun}>Simpan Perubahan</button>
        </div>
      </div>
      <div className="setelan-section">
        <div className="setelan-section-title">Ubah Password</div>
        <div className="setelan-card">
          <div className="setelan-form-group">
            <label>Password Lama</label>
            <div className="setelan-pass-wrap">
              <input type={showPassLama ? 'text' : 'password'} value={passLama} onChange={e => setPassLama(e.target.value)} placeholder="Masukkan password lama" />
              <button className="setelan-show-pass" onClick={() => setShowPassLama(v => !v)}>{showPassLama ? '🙈' : '👁'}</button>
            </div>
          </div>
          <div className="setelan-form-group">
            <label>Password Baru</label>
            <div className="setelan-pass-wrap">
              <input type={showPassBaru ? 'text' : 'password'} value={passBaru} onChange={e => setPassBaru(e.target.value)} placeholder="Minimal 6 karakter" />
              <button className="setelan-show-pass" onClick={() => setShowPassBaru(v => !v)}>{showPassBaru ? '🙈' : '👁'}</button>
            </div>
          </div>
          <div className="setelan-form-group">
            <label>Konfirmasi Password Baru</label>
            <input type="password" value={passKonfirm} onChange={e => setPassKonfirm(e.target.value)} placeholder="Ulangi password baru" onKeyDown={e => e.key === 'Enter' && simpanPassword()} />
          </div>
          {pesanPass && <div className={'setelan-pesan' + (pesanPass.startsWith('✅') ? ' sukses' : ' gagal')}>{pesanPass}</div>}
          <button className="setelan-btn" onClick={simpanPassword}>Perbarui Password</button>
        </div>
      </div>
    </div>
  )
}