import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ALL_SYMPTOMS } from '../data/symptoms';
import { ALL_DISEASES } from '../data/diseases';
import {
  Search, LayoutDashboard, Stethoscope, FlaskConical, FileText,
  ClipboardList, History, Settings, Activity, Pill, ArrowRight,
  Command, X, Zap
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette = () => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setCommandPaletteOpen, setActiveView } = useAppStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const close = () => setCommandPaletteOpen(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    close();
  };

  const commands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [
      // Navigation
      { id: 'nav-dashboard', label: 'Go to Dashboard', category: 'Navigation', icon: <LayoutDashboard className="w-4 h-4" />, action: () => handleNavigate('/dashboard') },
      { id: 'nav-workspace', label: 'Go to Clinical Workspace', category: 'Navigation', icon: <Stethoscope className="w-4 h-4" />, action: () => handleNavigate('/workspace') },
      { id: 'nav-labs', label: 'Go to Laboratory', category: 'Navigation', icon: <FlaskConical className="w-4 h-4" />, action: () => handleNavigate('/labs') },
      { id: 'nav-notes', label: 'Go to SOAP Notes', category: 'Navigation', icon: <FileText className="w-4 h-4" />, action: () => handleNavigate('/notes') },
      { id: 'nav-orders', label: 'Go to Orders', category: 'Navigation', icon: <ClipboardList className="w-4 h-4" />, action: () => handleNavigate('/orders') },
      { id: 'nav-history', label: 'Go to Patient History', category: 'Navigation', icon: <History className="w-4 h-4" />, action: () => handleNavigate('/history') },
      { id: 'nav-settings', label: 'Go to Settings', category: 'Navigation', icon: <Settings className="w-4 h-4" />, action: () => handleNavigate('/settings') },
      // Symptoms
      ...ALL_SYMPTOMS.slice(0, 60).map((s) => ({
        id: `symptom-${s}`,
        label: s,
        category: 'Symptoms',
        icon: <Activity className="w-4 h-4 text-primary-light" />,
        action: () => { handleNavigate('/workspace'); },
      })),
      // Diseases
      ...ALL_DISEASES.slice(0, 80).map((d) => ({
        id: `disease-${d}`,
        label: d,
        category: 'Diseases',
        icon: <Pill className="w-4 h-4 text-warning" />,
        action: () => { handleNavigate('/workspace'); },
      })),
    ];
    return items;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands.slice(0, 12);
    const q = query.toLowerCase();
    return commands.filter((c) => c.label.toLowerCase().includes(q)).slice(0, 15);
  }, [query, commands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filtered]);

  const handleSelect = (item: CommandItem) => {
    item.action();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={close}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-[560px] bg-white rounded-xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search symptoms, diseases, navigate..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-faint outline-none"
          />
          <kbd className="text-[10px] bg-canvas px-2 py-0.5 rounded border border-border text-text-muted">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto py-2">
          {Object.entries(groupedResults).length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Zap className="w-8 h-8 text-text-faint mx-auto mb-2" />
              <p className="text-sm text-text-muted">No results found</p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-faint">{category}</span>
                </div>
                {items.map((item) => {
                  const absoluteIndex = filtered.findIndex(f => f.id === item.id);
                  const isSelected = absoluteIndex === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors group ${isSelected ? 'bg-primary-bg' : 'hover:bg-primary-bg'}`}
                    >
                      <span className={isSelected ? 'text-primary' : 'text-text-muted group-hover:text-primary'}>{item.icon}</span>
                      <span className={`flex-1 text-sm truncate ${isSelected ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>{item.label}</span>
                      <ArrowRight className={`w-3.5 h-3.5 transition-opacity ${isSelected ? 'opacity-100 text-primary' : 'text-text-faint opacity-0 group-hover:opacity-100'}`} />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-canvas text-[10px] text-text-faint">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="bg-white px-1.5 py-0.5 rounded border border-border">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-white px-1.5 py-0.5 rounded border border-border">↵</kbd> Select</span>
          </div>
          <div className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            <span>K to toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
};
