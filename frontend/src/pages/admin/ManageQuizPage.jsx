import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiX, FiSave } from 'react-icons/fi';
import api from '../../utils/api';

export default function ManageQuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [quizDetail, setQuizDetail] = useState({});
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showQModal, setShowQModal] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [qForm, setQForm] = useState({ judul: '', deskripsi: '', kategori: 'umum' });
  const [soalForm, setSoalForm] = useState({ teks_soal: '', opsi_a: '', opsi_b: '', opsi_c: '', opsi_d: '', jawaban_benar: 'a' });

  const load = () => { api.getQuizzes().then(d => Array.isArray(d) && setQuizzes(d)).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const toggleExpand = async (id) => {
    if (expanded === id) { setExpanded(null); return; }
    const detail = await api.getQuizDetail(id);
    setQuizDetail(prev => ({ ...prev, [id]: detail }));
    setExpanded(id);
  };

  const addQuiz = async () => {
    await api.createQuiz(qForm);
    setShowQuizModal(false);
    setQForm({ judul: '', deskripsi: '', kategori: 'umum' });
    load();
  };

  const deleteQuiz = async (id) => {
    if (!confirm('Hapus kuis ini beserta semua soalnya?')) return;
    await api.deleteQuiz(id);
    load();
  };

  const openAddSoal = (quizId) => {
    setActiveQuizId(quizId);
    setSoalForm({ teks_soal: '', opsi_a: '', opsi_b: '', opsi_c: '', opsi_d: '', jawaban_benar: 'a' });
    setShowQModal(true);
  };

  const addSoal = async () => {
    await api.addQuestion(activeQuizId, soalForm);
    setShowQModal(false);
    const detail = await api.getQuizDetail(activeQuizId);
    setQuizDetail(prev => ({ ...prev, [activeQuizId]: detail }));
  };

  const deleteSoal = async (quizId, qId) => {
    if (!confirm('Hapus soal ini?')) return;
    await api.deleteQuestion(quizId, qId);
    const detail = await api.getQuizDetail(quizId);
    setQuizDetail(prev => ({ ...prev, [quizId]: detail }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Kelola Kuis</h1>
          <p className="text-text-secondary text-sm">Buat kuis dan tambahkan soal untuk pengguna</p>
        </div>
        <button onClick={() => setShowQuizModal(true)} className="admin-btn">
          <FiPlus size={16} /> Buat Kuis
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="admin-panel flex items-center justify-center py-16 text-text-muted">
          <p>Belum ada kuis yang dibuat.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="admin-panel p-0 overflow-hidden">
              <div 
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-bg-input transition-colors" 
                onClick={() => toggleExpand(quiz.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg ${quiz.kategori === 'psikotes' ? 'gradient-accent shadow-accent/20' : 'gradient-primary shadow-primary/20'}`}>
                    {quiz.kategori === 'psikotes' ? '🧠' : '📝'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary mb-1">{quiz.judul}</h3>
                    <p className="text-xs text-text-muted capitalize flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${quiz.kategori === 'psikotes' ? 'bg-accent/15 text-accent' : 'bg-primary/15 text-primary'}`}>
                        {quiz.kategori}
                      </span>
                      {quiz.deskripsi || 'Tanpa deskripsi'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz.id); }}
                    className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer" title="Hapus Kuis">
                    <FiTrash2 size={18} />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-bg-input border border-border flex items-center justify-center text-text-muted">
                    {expanded === quiz.id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {expanded === quiz.id && quizDetail[quiz.id] && (
                <div className="border-t border-border p-5 bg-bg-body/30 animate-fade-in">
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                      Daftar Soal ({quizDetail[quiz.id].Questions?.length || 0})
                    </h4>
                    <button onClick={() => openAddSoal(quiz.id)} className="admin-btn py-1.5 px-3 text-xs">
                      <FiPlus size={14} /> Tambah Soal
                    </button>
                  </div>

                  {(!quizDetail[quiz.id].Questions || quizDetail[quiz.id].Questions.length === 0) ? (
                    <div className="border border-dashed border-border rounded-xl p-8 text-center text-text-muted text-sm">
                      Belum ada soal untuk kuis ini.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {quizDetail[quiz.id].Questions.map((s, i) => (
                        <div key={s.id} className="bg-bg-card rounded-xl p-5 border border-border shadow-sm">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <p className="text-sm text-text-primary font-medium leading-relaxed">
                              <span className="text-primary font-bold mr-2">{i+1}.</span>
                              {s.teks_soal}
                            </p>
                            <button onClick={() => deleteSoal(quiz.id, s.id)} className="p-1.5 rounded text-text-muted hover:text-danger hover:bg-danger/10 bg-transparent border-none cursor-pointer flex-shrink-0" title="Hapus Soal">
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {['a','b','c','d'].map(k => (
                              <div key={k} className={`text-xs px-4 py-2.5 rounded-lg border flex items-center gap-3 ${s.jawaban_benar === k ? 'border-success bg-success/10 text-success' : 'border-border bg-bg-input text-text-sec'}`}>
                                <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold flex-shrink-0 ${s.jawaban_benar === k ? 'bg-success text-white' : 'bg-bg-surface text-text-muted'}`}>
                                  {k.toUpperCase()}
                                </span>
                                <span>{s[`opsi_${k}`]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">Buat Kuis Baru</h2>
              <button onClick={() => setShowQuizModal(false)} className="admin-modal__close"><FiX size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Judul Kuis</label>
                <input value={qForm.judul} onChange={e => setQForm({...qForm, judul: e.target.value})} placeholder="Masukkan judul..." className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Deskripsi</label>
                <textarea value={qForm.deskripsi} onChange={e => setQForm({...qForm, deskripsi: e.target.value})} rows={3} placeholder="Masukkan deskripsi..." className="admin-input resize-none" />
              </div>
              <div>
                <label className="admin-label">Kategori</label>
                <select value={qForm.kategori} onChange={e => setQForm({...qForm, kategori: e.target.value})} className="admin-input">
                  <option value="umum" className="bg-bg-surface">Umum</option>
                  <option value="psikotes" className="bg-bg-surface">Psikotes</option>
                </select>
              </div>
              <button onClick={addQuiz} className="admin-btn w-full mt-2"><FiSave size={16} /> Simpan Kuis</button>
            </div>
          </div>
        </div>
      )}

      {/* Soal Modal */}
      {showQModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-modal__header sticky top-0 bg-bg-card z-10 pt-2 pb-4 border-b border-border mb-4 -mx-6 px-6 -mt-2">
              <h2 className="admin-modal__title">Tambah Soal</h2>
              <button onClick={() => setShowQModal(false)} className="admin-modal__close"><FiX size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Pertanyaan</label>
                <textarea value={soalForm.teks_soal} onChange={e => setSoalForm({...soalForm, teks_soal: e.target.value})} rows={3} placeholder="Masukkan pertanyaan..." className="admin-input resize-none" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['a','b','c','d'].map(k => (
                  <div key={k}>
                    <label className="admin-label">Opsi {k.toUpperCase()}</label>
                    <input value={soalForm[`opsi_${k}`]} onChange={e => setSoalForm({...soalForm, [`opsi_${k}`]: e.target.value})} placeholder={`Teks opsi ${k.toUpperCase()}`} className="admin-input" />
                  </div>
                ))}
              </div>

              <div>
                <label className="admin-label">Jawaban Benar</label>
                <select value={soalForm.jawaban_benar} onChange={e => setSoalForm({...soalForm, jawaban_benar: e.target.value})} className="admin-input">
                  {['a','b','c','d'].map(k => <option key={k} value={k} className="bg-bg-surface">Opsi {k.toUpperCase()}</option>)}
                </select>
              </div>

              <button onClick={addSoal} className="admin-btn w-full mt-4"><FiSave size={16} /> Simpan Soal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
