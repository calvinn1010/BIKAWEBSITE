import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit3, FiX, FiSave, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';

export default function ManageContentPage() {
  const [contents, setContents] = useState([]);
  const [kategori, setKategori] = useState('lowongan');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ judul: '', deskripsi: '', kategori: 'lowongan', link_eksternal: '' });
  const [search, setSearch] = useState('');

  const load = () => {
    api.getContents(kategori).then(d => Array.isArray(d) && setContents(d)).catch(() => {});
  };

  useEffect(() => { load(); }, [kategori]);

  const openAdd = () => { 
    setEditItem(null); 
    setForm({ judul: '', deskripsi: '', kategori, link_eksternal: '' }); 
    setShowModal(true); 
  };
  
  const openEdit = (item) => { 
    setEditItem(item); 
    setForm({ judul: item.judul, deskripsi: item.deskripsi || '', kategori: item.kategori, link_eksternal: item.link_eksternal || '' }); 
    setShowModal(true); 
  };

  const handleSave = async () => {
    if (editItem) { await api.updateContent(editItem.id, form); }
    else { await api.createContent(form); }
    setShowModal(false); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus konten ini?')) return;
    await api.deleteContent(id); load();
  };

  const filtered = contents.filter(c => c.judul.toLowerCase().includes(search.toLowerCase()));
  const cats = ['lowongan', 'tutorial', 'usaha'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Kelola Konten</h1>
          <p className="text-text-secondary text-sm">Tambah, edit, dan hapus konten untuk pengguna</p>
        </div>
        <button onClick={openAdd} className="admin-btn">
          <FiPlus size={16} /> Tambah Konten
        </button>
      </div>

      <div className="admin-panel p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {cats.map(c => (
              <button key={c} onClick={() => setKategori(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer border ${kategori === c ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-bg-card text-text-secondary hover:bg-bg-input'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input type="text" placeholder="Cari konten..." value={search} onChange={e => setSearch(e.target.value)}
              className="admin-input pl-10" />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th className="hidden md:table-cell">Deskripsi</th>
                <th className="hidden sm:table-cell">Link</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-text-muted">Belum ada konten</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id}>
                  <td className="admin-table-title">{item.judul}</td>
                  <td className="hidden md:table-cell max-w-[200px] truncate">{item.deskripsi}</td>
                  <td className="hidden sm:table-cell max-w-[150px] truncate">
                    {item.link_eksternal ? (
                      <a href={item.link_eksternal} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        {item.link_eksternal}
                      </a>
                    ) : '-'}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all bg-transparent border-none cursor-pointer">
                        <FiEdit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">{editItem ? 'Edit Konten' : 'Tambah Konten'}</h2>
              <button onClick={() => setShowModal(false)} className="admin-modal__close">
                <FiX size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Judul</label>
                <input value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} placeholder="Judul konten"
                  className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Deskripsi</label>
                <textarea value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} rows={3} placeholder="Deskripsi konten"
                  className="admin-input resize-none" />
              </div>
              <div>
                <label className="admin-label">Kategori</label>
                <select value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}
                  className="admin-input">
                  {cats.map(c => <option key={c} value={c} className="bg-bg-surface">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Link Eksternal</label>
                <input value={form.link_eksternal} onChange={e => setForm({...form, link_eksternal: e.target.value})} placeholder="https://..."
                  className="admin-input" />
              </div>
              <button onClick={handleSave} className="admin-btn w-full mt-2">
                <FiSave size={16} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
