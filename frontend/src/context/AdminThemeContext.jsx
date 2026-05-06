import { createContext, useContext, useEffect, useState } from 'react';

const AdminThemeContext = createContext();

export function AdminThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('admin_theme');
    if (saved) return saved === 'dark';
    return true; // default dark for admin
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem('admin_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  return (
    <AdminThemeContext.Provider value={{ isDark, toggle, sidebarCollapsed, toggleSidebar }}>
      <div className={isDark ? 'admin-dark' : 'admin-light'} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export const useAdminTheme = () => useContext(AdminThemeContext);
