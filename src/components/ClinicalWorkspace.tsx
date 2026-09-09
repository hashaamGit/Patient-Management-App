import React, { useState } from 'react';
import { DiagnosticEngine } from './DiagnosticEngine';
import { PrescriptionPanel } from './PrescriptionPanel';
import { PatientHistory } from './PatientHistory';
import { SOAPNotes } from './SOAPNotes';
import { ErrorBoundary } from './ErrorBoundary';
import { Stethoscope, History, FileText } from 'lucide-react';

export const ClinicalWorkspace = () => {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'diagnostic' | 'history' | 'soap'>('diagnostic');

  return (
    <div className="flex flex-col h-full overflow-hidden bg-canvas">
      {/* Workspace Unified Clinical Subheader / Tab Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-surface border-b border-border text-xs shrink-0">
        <div className="flex items-center gap-1 bg-canvas p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setActiveWorkspaceTab('diagnostic')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-colors ${
              activeWorkspaceTab === 'diagnostic'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Stethoscope size={13} />
            <span>Diagnostic Engine &amp; AI</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-colors ${
              activeWorkspaceTab === 'history'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <History size={13} />
            <span>Patient Medical History</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('soap')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-colors ${
              activeWorkspaceTab === 'soap'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <FileText size={13} />
            <span>SOAP Notes &amp; Plan</span>
          </button>
        </div>

        <div className="text-[11px] text-text-muted font-medium hidden sm:block">
          Dual-Pane Integrated Clinical Workspace
        </div>
      </div>

      {/* Main Dual-Pane View */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-[3] min-w-0 border-r border-border h-full overflow-hidden">
          <ErrorBoundary fallbackMessage="Clinical Workspace Module encountered an error">
            {activeWorkspaceTab === 'diagnostic' && <DiagnosticEngine />}
            {activeWorkspaceTab === 'history' && <PatientHistory />}
            {activeWorkspaceTab === 'soap' && <SOAPNotes />}
          </ErrorBoundary>
        </div>
        <div className="flex-[2] min-w-0 h-full overflow-hidden">
          <ErrorBoundary fallbackMessage="Prescription Panel encountered an error">
            <PrescriptionPanel />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

