import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { NavigationSidebar } from './NavigationSidebar';
import { PatientContextBar } from './PatientContextBar';
import { CommandPalette } from './CommandPalette';
import { ClinicalWorkspace } from './ClinicalWorkspace';
import { VitalsDashboard } from './VitalsDashboard';
import { LabResultsViewer } from './LabResultsViewer';
import { SOAPNotes } from './SOAPNotes';
import { OrderEntry } from './OrderEntry';
import { PatientHistory } from './PatientHistory';
import { SettingsPanel } from './SettingsPanel';
import { useAppStore } from '../store/useAppStore';

export const AppShell = () => {
  const { sidebarCollapsed, commandPaletteOpen, setCommandPaletteOpen } = useAppStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K → Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      // Escape → Close Command Palette
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-canvas font-sans">
      {/* Left Sidebar Navigation */}
      <NavigationSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Patient Context Bar — always visible */}
        <PatientContextBar />

        {/* Route Content */}
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/workspace" replace />} />
            <Route path="/dashboard" element={<VitalsDashboard />} />
            <Route path="/workspace" element={<ClinicalWorkspace />} />
            <Route path="/labs" element={<LabResultsViewer />} />
            <Route path="/notes" element={<SOAPNotes />} />
            <Route path="/orders" element={<OrderEntry />} />
            <Route path="/history" element={<PatientHistory />} />
            <Route path="/settings" element={<SettingsPanel />} />
          </Routes>
        </main>
      </div>

      {/* Command Palette Overlay */}
      {commandPaletteOpen && <CommandPalette />}
    </div>
  );
};
