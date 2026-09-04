import { PatientContextBar } from './PatientContextBar';
import { PrescriptionPanel } from './PrescriptionPanel';
import { DiagnosticEngine } from './DiagnosticEngine';

export const MainLayout = () => {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-paper font-sans">
      <PatientContextBar />
      
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Left Panel: Diagnostic Engine (60%) */}
        <div className="w-[60%] flex-shrink-0 border-r border-slate-200 bg-white overflow-hidden flex flex-col no-print h-full">
          <DiagnosticEngine />
        </div>
        
        {/* Right Panel: Prescription Pad (40%) */}
        <div className="w-[40%] flex-shrink-0 bg-surface overflow-hidden h-full">
          <PrescriptionPanel />
        </div>
      </div>
    </div>
  );
};
