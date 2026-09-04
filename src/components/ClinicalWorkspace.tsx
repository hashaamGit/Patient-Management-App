import { DiagnosticEngine } from './DiagnosticEngine';
import { PrescriptionPanel } from './PrescriptionPanel';

export const ClinicalWorkspace = () => {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Panel: Diagnostic Engine (60%) */}
      <div className="w-[60%] flex-shrink-0 border-r border-border bg-white overflow-hidden flex flex-col no-print h-full">
        <DiagnosticEngine />
      </div>

      {/* Right Panel: Prescription Pad (40%) */}
      <div className="w-[40%] flex-shrink-0 bg-canvas overflow-hidden h-full">
        <PrescriptionPanel />
      </div>
    </div>
  );
};
