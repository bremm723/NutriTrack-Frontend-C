import { useState } from 'react'
import api from '../api.js'

export default function HalamanProfil({ user, onUpdateUser }) {
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    nama: user.nama, email: user.email,
    birthday: user.birthday || '', gender: user.gender || '',
    height: user.height || '', weight: user.weight || '',
  })
  const [loading, setLoading] = useState(false)
  const [pesan, setPesan] = useState('')

  const bukaEdit  = () => setEditMode(true)
  const batalEdit = () => {
    setForm({ nama: user.nama, email: user.email, birthday: user.birthday||'', gender: user.gender||'', height: user.height||'', weight: user.weight||'' })
    setEditMode(false)
  }
  const simpan = async () => {
    setLoading(true)
    try {
      const res = await api.put('/user/update-profil', form)
      const u = res.data.user
      onUpdateUser({ nama: u.name, email: u.email, birthday: u.birthday, gender: u.gender, height: u.height, weight: u.weight })
      setPesan('✅ Profil berhasil disimpan!')
      setEditMode(false)
      setTimeout(() => setPesan(''), 3000)
    } catch {
      setPesan('❌ Gagal menyimpan profil.')
    } finally {
      setLoading(false)
    }
  }

  const inisial = user.nama.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div className="profil-page">
      <div className="profil-card-besar">
        <div className="profil-avatar-besar">{inisial}</div>
        <div className="profil-nama">{user.nama}</div>
        <div className="profil-email-text">{user.email}</div>
        {pesan && <div style={{color: pesan.startsWith('✅') ? 'green' : 'red', marginBottom: 8}}>{pesan}</div>}
        <div className="profil-info-list">
          <div className="profil-info-row">
            <span className="profil-info-label">Birthday</span>
            {editMode
              ? <input className="profil-input" type="date" value={form.birthday} onChange={e => setForm({...form, birthday: e.target.value})} />
              : <span className="profil-info-val">{user.birthday || 'DD/MM/YY'}</span>}
          </div>
          <div className="profil-info-row">
            <span className="profil-info-label">Gender</span>
            {editMode
              ? <div className="gender-toggle">
                  <button className={'gender-btn'+(form.gender==='female'?' active':'')} onClick={()=>setForm({...form,gender:'female'})}>♀</button>
                  <button className={'gender-btn'+(form.gender==='male'?' active':'')} onClick={()=>setForm({...form,gender:'male'})}>♂</button>
                </div>
              : <span className="profil-info-val">{user.gender==='female'?'♀ Perempuan':user.gender==='male'?'♂ Laki-laki':'♀ ♂'}</span>}
          </div>
          <div className="profil-info-row">
            <span className="profil-info-label">Height</span>
            {editMode
              ? <input className="profil-input" type="number" placeholder="cm" value={form.height} onChange={e=>setForm({...form,height:e.target.value})} />
              : <span className="profil-info-val">{user.height ? user.height+' cm':'— cm'}</span>}
          </div>
          <div className="profil-info-row">
            <span className="profil-info-label">Weight</span>
            {editMode
              ? <input className="profil-input" type="number" placeholder="kg" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} />
              : <span className="profil-info-val">{user.weight ? user.weight+' kg':'— kg'}</span>}
          </div>
        </div>
        {editMode
          ? <div className="profil-btn-row">
              <button className="profil-btn-batal" onClick={batalEdit}>Batal</button>
              <button className="profil-btn-simpan" onClick={simpan} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          : <button className="profil-btn-edit" onClick={bukaEdit}>Edit</button>}
      </div>
    </div>
  )
}