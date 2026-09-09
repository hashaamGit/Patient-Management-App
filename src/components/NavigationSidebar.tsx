import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  LayoutDashboard, Stethoscope, FlaskConical, FileText,
  ClipboardList, History, Settings, PanelLeftClose, PanelLeft,
  Activity, Search, LogOut, Moon, Sun, Shield, Pill, Building2, Users
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: any;
  shortcut: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const ALL_SECTIONS: NavSection[] = [
  {
    title: 'Clinical & Patient History',
    items: [
      { path: '/workspace', label: 'Clinical Workspace', icon: Stethoscope, shortcut: '⌘1' },
      { path: '/patients', label: 'Patients Directory', icon: Users, shortcut: '⌘8' },
      { path: '/history', label: 'Patient History', icon: History, shortcut: '⌘7' },
      { path: '/notes', label: 'SOAP Notes', icon: FileText, shortcut: '⌘5' },
      { path: '/vitals', label: 'Vitals & Triage', icon: Activity, shortcut: '⌘3' },
      { path: '/labs', label: 'Laboratory', icon: FlaskConical, shortcut: '⌘4' },
      { path: '/orders', label: 'Orders', icon: ClipboardList, shortcut: '⌘6' },
    ]
  },
  {
    title: 'Pharmacy & Store',
    items: [
      { path: '/pharmacy', label: 'Pharmacy Dispensary', icon: Pill, shortcut: '⌘P' },
      { path: '/inventory', label: 'Store Inventory', icon: Building2, shortcut: '⌘I' },
    ]
  },
  {
    title: 'Operations & Insights',
    items: [
      { path: '/dashboard', label: 'Insights Analytics', icon: LayoutDashboard, shortcut: '⌘2' },
      { path: '/admin', label: 'Admin Console', icon: Shield, shortcut: '⌘A' },
    ]
  }
];

export const NavigationSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, clearSession, setCommandPaletteOpen, darkMode, toggleDarkMode, currentUser, logout } = useAppStore();

  const getFilteredSections = () => {
    if (!currentUser) return [];
    
    let allowedPaths: string[] = [];
    switch (currentUser.role) {
      case 'Doctor':
        allowedPaths = ['/workspace', '/patients', '/history', '/notes', '/vitals', '/labs', '/orders', '/pharmacy', '/dashboard'];
        break;
      case 'Nurse':
        allowedPaths = ['/vitals', '/patients', '/history', '/orders', '/dashboard'];
        break;
      case 'Pharmacist':
        allowedPaths = ['/pharmacy', '/inventory', '/dashboard', '/orders'];
        break;
      case 'Storekeeper':
        allowedPaths = ['/inventory', '/dashboard'];
        break;
      case 'Admin':
        allowedPaths = ['/admin', '/patients', '/history', '/dashboard', '/workspace', '/inventory', '/pharmacy'];
        break;
      default:
        allowedPaths = [];
    }

    return ALL_SECTIONS.map(section => ({
      ...section,
      items: section.items.filter(item => allowedPaths.includes(item.path))
    })).filter(section => section.items.length > 0);
  };

  const filteredSections = getFilteredSections();

  return (
    <aside
      className={`h-screen flex flex-col bg-nav border-r border-[#1E293B] no-print transition-all duration-200 ease-out ${
        sidebarCollapsed ? 'w-[60px]' : 'w-[220px]'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 h-[52px] border-b border-[#1E293B] flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}>
        <div className="relative">
          <Activity className="w-5 h-5 text-primary-light heartbeat" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success rounded-full pulse-dot" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-white font-bold text-sm tracking-wide truncate">
            Hassan <span className="text-primary-light">&amp; Co.</span>
          </span>
        )}
      </div>

      {/* Search Button */}
      <div className={`px-2.5 pt-3 pb-1 ${sidebarCollapsed ? 'px-1.5' : ''}`}>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-text-faint text-xs transition-colors ${
            sidebarCollapsed ? 'justify-center px-2' : ''
          }`}
          title="Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          {!sidebarCollapsed && (
            <>
              <span className="flex-1 text-left">Search...</span>
              <kbd className="text-[10px] bg-[#0F172A] px-1.5 py-0.5 rounded border border-[#334155] text-text-faint">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation Items Grouped */}
      <nav className="flex-1 px-2.5 py-2 space-y-4 overflow-y-auto">
        {filteredSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!sidebarCollapsed && (
              <div className="section-header px-3 pt-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-item w-full ${isActive ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-0 mx-0' : ''}`}
                  title={sidebarCollapsed ? `${item.label} (${item.shortcut})` : undefined}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      <span className="text-[10px] text-[#475569] opacity-0 group-hover:opacity-100">{item.shortcut}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-2.5 py-2 border-t border-[#1E293B] space-y-0.5">
        {/* Settings */}
        <button
          onClick={() => navigate('/settings')}
          className={`nav-item w-full ${location.pathname === '/settings' ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
          title={sidebarCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          {!sidebarCollapsed && <span className="flex-1 text-left">Settings</span>}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`nav-item w-full ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? <Sun className="w-[18px] h-[18px] flex-shrink-0" /> : <Moon className="w-[18px] h-[18px] flex-shrink-0" />}
          {!sidebarCollapsed && <span className="flex-1 text-left">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* New Session (Logout) */}
        <button
          onClick={logout}
          className={`nav-item w-full text-danger hover:text-danger hover:bg-[#1E293B] ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
          title={sidebarCollapsed ? 'Log Out' : undefined}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!sidebarCollapsed && <span className="flex-1 text-left">Log Out</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className={`nav-item w-full ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-[18px] h-[18px]" />
          ) : (
            <>
              <PanelLeftClose className="w-[18px] h-[18px]" />
              <span className="flex-1 text-left">Collapse</span>
            </>
          )}
        </button>

        {/* Doctor Badge */}
        <div className={`flex items-center gap-2.5 pt-2 mt-1 border-t border-[#1E293B] ${sidebarCollapsed ? 'justify-center' : 'px-2'}`}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-primary-light/30 uppercase">
            {currentUser?.name?.substring(0, 2) || 'U'}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="text-white text-xs font-medium truncate">{currentUser?.name || 'Unknown User'}</div>
              <div className="text-[#64748B] text-[10px] truncate">{currentUser?.role || 'Unknown Role'}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
