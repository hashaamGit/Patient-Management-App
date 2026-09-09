import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { NavigationSidebar } from './NavigationSidebar';
import { PatientContextBar } from './PatientContextBar';
import { CommandPalette } from './CommandPalette';
import { ClinicalWorkspace } from './ClinicalWorkspace';
import { VitalsDashboard } from './VitalsDashboard';
import { InsightsDashboard } from './InsightsDashboard';
import { LabResultsViewer } from './LabResultsViewer';
import { SOAPNotes } from './SOAPNotes';
import { OrderEntry } from './OrderEntry';
import { PatientHistory } from './PatientHistory';
import { SettingsPanel } from './SettingsPanel';
import { LoginScreen } from './LoginScreen';
import { HomePage } from './HomePage';
import { AdminManagement } from './AdminManagement';
import { PharmacyDispensary } from './PharmacyDispensary';
import { StorekeeperInventory } from './StorekeeperInventory';
import { PatientsDirectory } from './PatientsDirectory';
import { useAppStore } from '../store/useAppStore';

export const AppShell = () => {
  const location = useLocation();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    currentUser,
    themeAccent,
    uiDensity,
    fontSizeScale
  } = useAppStore();
  const [showLogin, setShowLogin] = useState(false);

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

  if (!currentUser) {
    if (showLogin) {
      return <LoginScreen onBackToHome={() => setShowLogin(false)} />;
    }
    return <HomePage onOpenLogin={() => setShowLogin(true)} />;
  }

  const getDefaultRoute = () => {
    switch (currentUser.role) {
      case 'Doctor': return '/workspace';
      case 'Nurse': return '/vitals';
      case 'Pharmacist': return '/pharmacy';
      case 'Storekeeper': return '/inventory';
      case 'Admin': return '/admin';
      default: return '/workspace';
    }
  };

  // Only render patient context bar on clinical patient-specific routes
  const isClinicalPatientView = [
    '/workspace',
    '/patients',
    '/history',
    '/notes',
    '/vitals',
    '/labs',
    '/orders'
  ].some(p => location.pathname.startsWith(p));

  return (
    <div 
      data-theme={themeAccent || 'teal'}
      data-density={uiDensity || 'comfortable'}
      data-font={fontSizeScale || 'normal'}
      className="h-screen w-full flex overflow-hidden bg-canvas font-sans transition-colors duration-200"
    >
      {/* Left Sidebar Navigation */}
      <NavigationSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Patient Context Bar — cleanly scoped to clinical care routes */}
        {isClinicalPatientView && <PatientContextBar />}

        {/* Route Content */}
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
            <Route path="/workspace" element={<ClinicalWorkspace />} />
            <Route path="/dashboard" element={<InsightsDashboard />} />
            <Route path="/vitals" element={<VitalsDashboard />} />
            <Route path="/patients" element={<PatientsDirectory />} />
            <Route path="/admin" element={<AdminManagement />} />
            <Route path="/pharmacy" element={<PharmacyDispensary />} />
            <Route path="/inventory" element={<StorekeeperInventory />} />
            <Route path="/labs" element={<LabResultsViewer />} />
            <Route path="/notes" element={<SOAPNotes />} />
            <Route path="/orders" element={<OrderEntry />} />
            <Route path="/history" element={<PatientHistory />} />
            <Route path="/settings" element={<SettingsPanel />} />
            <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
          </Routes>
        </main>
      </div>

      {/* Command Palette Overlay */}
      {commandPaletteOpen && <CommandPalette />}
    </div>
  );
};
