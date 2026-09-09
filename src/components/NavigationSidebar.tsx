import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  LayoutDashboard, Stethoscope, FlaskConical, FileText,
  ClipboardList, History, Settings, PanelLeftClose, PanelLeft,
  Activity, Search, LogOut, Moon, Sun, Shield, Pill, Building2, Users,
  ChevronDown, ChevronRight
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
  const { sidebarCollapsed, toggleSidebar, setCommandPaletteOpen, darkMode, toggleDarkMode, currentUser, logout } = useAppStore();

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

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
      className={`h-screen flex flex-col bg-[#0B132B] border-r border-[#1E293B] no-print transition-all duration-300 ease-in-out select-none ${
        sidebarCollapsed ? 'w-[64px]' : 'w-[240px]'
      }`}
    >
      {/* Header / Logo & Collapse Toggle */}
      <div className={`flex items-center justify-between px-3.5 h-[56px] border-b border-[#1E293B] flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}>
        <div 
          onClick={sidebarCollapsed ? toggleSidebar : undefined}
          className={`flex items-center gap-2.5 cursor-pointer ${sidebarCollapsed ? 'justify-center w-full' : ''}`}
          title={sidebarCollapsed ? "Click to Expand Sidebar" : undefined}
        >
          <div className="relative flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-light heartbeat" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success rounded-full pulse-dot" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-white font-bold text-sm tracking-wide truncate">
              Hassan <span className="text-primary-light">&amp; Co.</span>
            </span>
          )}
        </div>

        {sidebarCollapsed ? (
          <button
            onClick={toggleSidebar}
            className="hidden" // expanded on container click
            title="Expand Sidebar"
          >
            <PanelLeft className="w-4 h-4 text-[#94A3B8]" />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand Button for Collapsed Mode */}
      {sidebarCollapsed && (
        <div className="px-2 pt-2 flex justify-center">
          <button
            onClick={toggleSidebar}
            className="w-10 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
            title="Expand Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Button */}
      <div className={`px-3 pt-2 pb-2 ${sidebarCollapsed ? 'px-2' : ''}`}>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#14213D] hover:bg-[#1E2D4A] text-[#CBD5E1] text-xs transition-colors border border-[#1E293B] shadow-2xs ${
            sidebarCollapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''
          }`}
          title="Quick Search (⌘K)"
        >
          <Search className="w-4 h-4 text-primary-light flex-shrink-0" />
          {!sidebarCollapsed && (
            <>
              <span className="flex-1 text-left font-medium text-[#94A3B8]">Search...</span>
              <kbd className="text-[10px] bg-[#0B132B] px-1.5 py-0.5 rounded border border-[#334155] text-[#94A3B8] font-mono">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-2 space-y-3 overflow-y-auto overflow-x-hidden">
        {filteredSections.map((section, sIdx) => {
          const isSectionCollapsed = collapsedSections[section.title];
          return (
            <div key={sIdx} className="space-y-1">
              {!sidebarCollapsed ? (
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] hover:text-white transition-colors group"
                >
                  <span className="truncate">{section.title}</span>
                  <span className="text-[#64748B] group-hover:text-[#94A3B8] transition-colors">
                    {isSectionCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                  </span>
                </button>
              ) : (
                <div className="h-[1px] bg-[#1E293B] mx-2 my-1" />
              )}

              {(!sidebarCollapsed && isSectionCollapsed) ? null : (
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <div key={item.path} className="relative group">
                        <button
                          onClick={() => navigate(item.path)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                            isActive
                              ? 'bg-primary text-white font-bold shadow-xs'
                              : 'text-[#CBD5E1] hover:text-white hover:bg-white/10'
                          } ${sidebarCollapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''}`}
                        >
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-white'}`} />
                          {!sidebarCollapsed && (
                            <>
                              <span className="flex-1 text-left truncate">{item.label}</span>
                              <span className={`text-[10px] font-mono ${isActive ? 'text-white/70' : 'text-[#64748B]'}`}>
                                {item.shortcut}
                              </span>
                            </>
                          )}
                        </button>

                        {/* Collapsed Tooltip */}
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#0F172A] text-white text-xs font-semibold rounded-lg shadow-xl border border-[#334155] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-2">
                            <span>{item.label}</span>
                            <span className="text-[10px] text-primary-light font-mono">({item.shortcut})</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-[#1E293B] space-y-1 bg-[#090F21]">
        {/* Settings */}
        <div className="relative group">
          <button
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              location.pathname === '/settings'
                ? 'bg-primary text-white font-bold'
                : 'text-[#CBD5E1] hover:text-white hover:bg-white/10'
            } ${sidebarCollapsed ? 'justify-center px-0 h-9 w-9 mx-auto' : ''}`}
          >
            <Settings className="w-4 h-4 flex-shrink-0 text-[#94A3B8] group-hover:text-white" />
            {!sidebarCollapsed && <span className="flex-1 text-left">Settings</span>}
          </button>
          {sidebarCollapsed && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#0F172A] text-white text-xs font-semibold rounded-lg shadow-lg border border-[#334155] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              Settings
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <div className="relative group">
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#CBD5E1] hover:text-white hover:bg-white/10 transition-colors ${
              sidebarCollapsed ? 'justify-center px-0 h-9 w-9 mx-auto' : ''
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400 flex-shrink-0" /> : <Moon className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />}
            {!sidebarCollapsed && <span className="flex-1 text-left">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          {sidebarCollapsed && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#0F172A] text-white text-xs font-semibold rounded-lg shadow-lg border border-[#334155] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="relative group">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors ${
              sidebarCollapsed ? 'justify-center px-0 h-9 w-9 mx-auto' : ''
            }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0 text-rose-400" />
            {!sidebarCollapsed && <span className="flex-1 text-left">Log Out</span>}
          </button>
          {sidebarCollapsed && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#0F172A] text-rose-300 text-xs font-semibold rounded-lg shadow-lg border border-[#334155] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              Log Out
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className={`flex items-center gap-2.5 pt-2 mt-1 border-t border-[#1E293B] ${sidebarCollapsed ? 'justify-center' : 'px-1'}`}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-primary-light/40 uppercase shadow-xs">
            {currentUser?.name?.substring(0, 2) || 'U'}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-white text-xs font-bold truncate">{currentUser?.name || 'User'}</div>
              <div className="text-primary-light text-[10px] font-semibold truncate">{currentUser?.role || 'Clinician'}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
