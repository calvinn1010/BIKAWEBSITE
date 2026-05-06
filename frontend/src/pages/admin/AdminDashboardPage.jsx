import { useState, useEffect } from 'react';
import {
  FiUsers, FiFileText, FiHelpCircle, FiTrendingUp,
  FiTrendingDown, FiRefreshCw, FiExternalLink, FiBookOpen,
  FiBriefcase, FiAward, FiActivity
} from 'react-icons/fi';
import api from '../../utils/api';

/* ─── Sparkline mini chart (SVG) ─── */
function Sparkline({ data = [], color = '#6C63FF', height = 40 }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.12" />
    </svg>
  );
}

/* ─── Donut Chart ─── */
function DonutChart({ value, max, color, bg, size = 80 }) {
  const r = 28, cx = 40, cy = 40;
  const circ = 2 * Math.PI * r;
  const pct = max ? (value / max) : 0;
  const dash = pct * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={bg} strokeWidth="10" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fontSize="13" fontWeight="700" fill={color}>
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

/* ─── Bar Chart (mini) ─── */
function MiniBarChart({ data = [], color = '#6C63FF' }) {
  const max = Math.max(...data, 1);
  return (
    <div className="admin-bar-chart">
      {data.map((v, i) => (
        <div key={i} className="admin-bar-chart__bar-wrap">
          <div
            className="admin-bar-chart__bar"
            style={{ height: `${(v / max) * 100}%`, background: color }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Activity Line Chart ─── */
function ActivityChart({ data = [], color = '#FF6B9D' }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 100, h = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 6) - 3;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="admin-activity-chart">
      <defs>
        <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#actGrad)" />
      <polyline points={pts} stroke={color} strokeWidth="2.5" fill="none"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalContents: 0, totalQuizzes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminStats()
      .then(d => d && setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Mock growth data for charts */
  const userSpark = [12, 19, 14, 26, 22, 30, 28, 38, 35, 47, 42, stats.totalUsers || 50];
  const contentSpark = [5, 8, 7, 12, 10, 15, 14, 18, 17, 20, 22, stats.totalContents || 24];
  const quizSpark = [2, 3, 5, 4, 7, 6, 9, 8, 10, 12, 11, stats.totalQuizzes || 14];
  const barData = [65, 78, 55, 90, 72, 85, 68, 95, 80, 75, 88, 92];
  const activityData = [30, 45, 35, 60, 50, 75, 55, 80, 65, 90, 70, 85];

  /* Category breakdown */
  const categories = [
    { label: 'Lowongan', count: Math.round(stats.totalContents * 0.4) || 8, color: '#6C63FF' },
    { label: 'Tutorial', count: Math.round(stats.totalContents * 0.35) || 7, color: '#00D9FF' },
    { label: 'Usaha', count: Math.round(stats.totalContents * 0.25) || 5, color: '#FF6B9D' },
  ];

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      sub: 'pengguna terdaftar',
      icon: <FiUsers size={22} />,
      color: '#6C63FF',
      bg: 'rgba(108,99,255,0.12)',
      spark: userSpark,
      trend: '+12%',
      up: true,
    },
    {
      label: 'Total Konten',
      value: stats.totalContents,
      sub: 'artikel tersedia',
      icon: <FiFileText size={22} />,
      color: '#00D9FF',
      bg: 'rgba(0,217,255,0.12)',
      spark: contentSpark,
      trend: '+8%',
      up: true,
    },
    {
      label: 'Total Kuis',
      value: stats.totalQuizzes,
      sub: 'kuis aktif',
      icon: <FiHelpCircle size={22} />,
      color: '#FF6B9D',
      bg: 'rgba(255,107,157,0.12)',
      spark: quizSpark,
      trend: '+5%',
      up: true,
    },
    {
      label: 'Konten Aktif',
      value: stats.totalContents || 0,
      sub: 'bulan ini',
      icon: <FiActivity size={22} />,
      color: '#00E676',
      bg: 'rgba(0,230,118,0.12)',
      spark: [10, 15, 12, 20, 18, 25, 22, 30, stats.totalContents || 30],
      trend: '-2%',
      up: false,
    },
  ];

  const quickInfoItems = [
    {
      icon: <FiBriefcase size={16} />,
      color: '#6C63FF',
      title: 'Kelola Konten',
      desc: 'Tambah lowongan, tutorial, dan tips usaha untuk pengguna.',
      link: '/admin/konten',
    },
    {
      icon: <FiBookOpen size={16} />,
      color: '#00D9FF',
      title: 'Kelola Kuis',
      desc: 'Buat dan kelola soal kuis interaktif untuk pengguna.',
      link: '/admin/kuis',
    },
    {
      icon: <FiAward size={16} />,
      color: '#FF6B9D',
      title: 'Kategori Lowongan',
      desc: 'Konten berlabel "lowongan" tampil di halaman Masa Depan.',
      link: '/admin/konten',
    },
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner" />
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* ── Row 1: Stat Cards ── */}
      <div className="admin-stat-grid">
        {statCards.map((c, i) => (
          <div key={i} className="admin-stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="admin-stat-card__top">
              <div>
                <p className="admin-stat-card__label">{c.label}</p>
                <h3 className="admin-stat-card__value">{c.value.toLocaleString()}</h3>
                <p className="admin-stat-card__sub">{c.sub}</p>
              </div>
              <div className="admin-stat-card__icon" style={{ background: c.bg, color: c.color }}>
                {c.icon}
              </div>
            </div>
            <div className="admin-stat-card__bottom">
              <span className={`admin-stat-card__trend ${c.up ? 'up' : 'down'}`}>
                {c.up ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                {c.trend}
              </span>
              <span className="admin-stat-card__trend-sub">dari bulan lalu</span>
              <div className="admin-stat-card__spark">
                <Sparkline data={c.spark} color={c.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Bar Chart + Donut ── */}
      <div className="admin-mid-grid">

        {/* Bar Chart */}
        <div className="admin-panel admin-panel--bar">
          <div className="admin-panel__header">
            <div>
              <h3 className="admin-panel__title">Aktivitas Konten</h3>
              <p className="admin-panel__sub">12 bulan terakhir</p>
            </div>
            <button className="admin-panel__year-btn">2025 ▾</button>
          </div>
          <div className="admin-bar-wrap">
            <MiniBarChart data={barData} color="#6C63FF" />
            <div className="admin-bar-labels">
              {['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'].map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Donut Charts */}
        <div className="admin-panel admin-panel--donuts">
          <div className="admin-panel__header">
            <div>
              <h3 className="admin-panel__title">Distribusi Konten</h3>
              <p className="admin-panel__sub">Berdasarkan kategori</p>
            </div>
          </div>
          <div className="admin-donut-grid">
            {categories.map((cat, i) => (
              <div key={i} className="admin-donut-item">
                <DonutChart
                  value={cat.count}
                  max={stats.totalContents || 20}
                  color={cat.color}
                  bg="rgba(255,255,255,0.06)"
                />
                <div className="admin-donut-item__info">
                  <div className="admin-donut-item__dot" style={{ background: cat.color }} />
                  <span>{cat.label}</span>
                  <strong>{cat.count}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Row 3: Activity Chart + Quick Info ── */}
      <div className="admin-bot-grid">

        {/* Activity Line */}
        <div className="admin-panel admin-panel--activity">
          <div className="admin-panel__header">
            <div>
              <h3 className="admin-panel__title">Aktivitas Pengguna</h3>
              <p className="admin-panel__sub">Tren login bulanan</p>
            </div>
            <button className="admin-panel__year-btn">2025 ▾</button>
          </div>
          <div className="admin-activity-wrap">
            <ActivityChart data={activityData} color="#6C63FF" />
          </div>
        </div>

        {/* Quick Info */}
        <div className="admin-panel admin-panel--info">
          <div className="admin-panel__header">
            <h3 className="admin-panel__title">📌 Panduan Cepat</h3>
            <button className="admin-panel__refresh" title="Refresh">
              <FiRefreshCw size={14} />
            </button>
          </div>
          <div className="admin-info-list">
            {quickInfoItems.map((item, i) => (
              <div key={i} className="admin-info-item">
                <div className="admin-info-item__icon" style={{ background: `${item.color}20`, color: item.color }}>
                  {item.icon}
                </div>
                <div className="admin-info-item__body">
                  <p className="admin-info-item__title">{item.title}</p>
                  <p className="admin-info-item__desc">{item.desc}</p>
                </div>
                <a href={item.link} className="admin-info-item__link">
                  <FiExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
