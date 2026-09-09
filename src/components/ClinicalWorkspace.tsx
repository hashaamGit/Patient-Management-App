import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { DiagnosticEngine } from './DiagnosticEngine';
import { PrescriptionPanel } from './PrescriptionPanel';
import { PatientHistory } from './PatientHistory';
import { SOAPNotes } from './SOAPNotes';
import { ErrorBoundary } from './ErrorBoundary';
import { Stethoscope, History, FileText, Pill, PanelRightOpen, PanelRightClose } from 'lucide-react';

export const ClinicalWorkspace = () => {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'diagnostic' | 'history' | 'soap'>('diagnostic');
  const { prescriptionCollapsed, togglePrescriptionCollapsed, prescription } = useAppStore();

  const medCount = prescription?.items?.length || 0;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-canvas">
      {/* Workspace Unified Clinical Subheader / Tab Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border text-xs shrink-0 select-none">
        <div className="flex items-center gap-1 bg-canvas p-0.5 rounded-xl border border-border shadow-2xs">
          <button
            onClick={() => setActiveWorkspaceTab('diagnostic')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold transition-all duration-150 ${
              activeWorkspaceTab === 'diagnostic'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-muted hover:text-text-primary hover:bg-surface'
            }`}
          >
            <Stethoscope size={14} />
            <span>Diagnostic Engine &amp; AI</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold transition-all duration-150 ${
              activeWorkspaceTab === 'history'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-muted hover:text-text-primary hover:bg-surface'
            }`}
          >
            <History size={14} />
            <span>Patient Medical History</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('soap')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold transition-all duration-150 ${
              activeWorkspaceTab === 'soap'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-muted hover:text-text-primary hover:bg-surface'
            }`}
          >
            <FileText size={14} />
            <span>SOAP Notes &amp; Plan</span>
          </button>
        </div>

        {/* Right Toggle Action for Prescription Pad */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePrescriptionCollapsed}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-150 shadow-2xs border ${
              prescriptionCollapsed
                ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:border-primary/50'
                : 'bg-surface text-text-secondary border-border hover:bg-canvas hover:text-text-primary'
            }`}
            title={prescriptionCollapsed ? "Expand Prescription Pad" : "Minimize Prescription Pad"}
          >
            <Pill size={14} className={medCount > 0 ? 'text-primary' : 'text-text-muted'} />
            <span>{prescriptionCollapsed ? 'Show Rx Pad' : 'Minimize Rx'}</span>
            {medCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-primary text-white text-[10px] font-bold">
                {medCount}
              </span>
            )}
            {prescriptionCollapsed ? <PanelRightOpen size={14} /> : <PanelRightClose size={14} />}
          </button>
        </div>
      </div>

      {/* Main Dual-Pane View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Clinical Diagnostics / History / SOAP pane */}
        <div className="flex-1 min-w-0 h-full overflow-hidden transition-all duration-300 ease-in-out">
          <ErrorBoundary fallbackMessage="Clinical Workspace Module encountered an error">
            {activeWorkspaceTab === 'diagnostic' && <DiagnosticEngine />}
            {activeWorkspaceTab === 'history' && <PatientHistory />}
            {activeWorkspaceTab === 'soap' && <SOAPNotes />}
          </ErrorBoundary>
        </div>

        {/* Right Prescription Panel OR Sleek Minimized Dock */}
        {!prescriptionCollapsed ? (
          <div className="w-[420px] 2xl:w-[480px] min-w-0 h-full overflow-hidden border-l border-border bg-surface transition-all duration-300 ease-in-out shrink-0">
            <ErrorBoundary fallbackMessage="Prescription Panel encountered an error">
              <PrescriptionPanel onMinimize={togglePrescriptionCollapsed} />
            </ErrorBoundary>
          </div>
        ) : (
          <div 
            onClick={togglePrescriptionCollapsed}
            className="w-[48px] h-full border-l border-border bg-surface hover:bg-primary-bg flex flex-col items-center py-4 cursor-pointer transition-colors group select-none shrink-0 shadow-2xs"
            title="Click to Expand Live Prescription Pad"
          >
            <button
              onClick={(e) => { e.stopPropagation(); togglePrescriptionCollapsed(); }}
              className="p-2 rounded-xl bg-canvas group-hover:bg-primary group-hover:text-white text-text-secondary transition-all mb-4 shadow-2xs border border-border group-hover:border-primary"
              title="Expand Rx Pad"
            >
              <PanelRightOpen size={16} />
            </button>

            {/* Med Count Badge */}
            {medCount > 0 && (
              <div className="w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center mb-6 shadow-xs animate-pulse">
                {medCount}
              </div>
            )}

            {/* Vertical Rotated Text */}
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[11px] font-bold text-text-secondary group-hover:text-primary tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 transition-colors">
                Live Prescription Pad
              </span>
            </div>

            <Pill size={18} className="text-primary-light mt-auto group-hover:scale-110 transition-transform" />
          </div>
        )}
      </div>
    </div>
  );
};

