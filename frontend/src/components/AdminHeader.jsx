import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon, FiBell, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const pageTitle = {
  '/admin/dashboard': 'Dashboard',
  '/admin/konten': 'Kelola Konten',
  '/admin/kuis': 'Kelola Kuis',
};

export default function AdminHeader() {
  const { isDark, toggle } = useAdminTheme();
  const { admin } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState('');

  const title = pageTitle[location.pathname] || 'Admin';
  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <h2 className="admin-header__title">{title}</h2>
        <p className="admin-header__date">{today}</p>
      </div>

      <div className="admin-header__right">
        {/* Search */}
        <div className="admin-header__search">
          <FiSearch className="admin-header__search-icon" size={15} />
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="admin-header__search-input"
          />
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggle}
          className="admin-header__icon-btn"
          title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
          <span className="admin-header__toggle-track">
            <span className="admin-header__toggle-thumb">
              {isDark ? <FiMoon size={11} /> : <FiSun size={11} />}
            </span>
          </span>
        </button>

        {/* Notification */}
        <button className="admin-header__icon-btn admin-header__notif" title="Notifikasi">
          <FiBell size={18} />
          <span className="admin-header__notif-badge">3</span>
        </button>

        {/* Admin Avatar */}
        <div className="admin-header__avatar" title={admin?.nama}>
          {admin?.nama?.charAt(0)?.toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}
