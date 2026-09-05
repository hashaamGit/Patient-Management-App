import { DiagnosticEngine } from './DiagnosticEngine';
import { PrescriptionPanel } from './PrescriptionPanel';
import { ErrorBoundary } from './ErrorBoundary';

export const ClinicalWorkspace = () => {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-[3] min-w-0">
        <ErrorBoundary fallbackMessage="Diagnostic Engine encountered an error">
          <DiagnosticEngine />
        </ErrorBoundary>
      </div>
      <div className="flex-[2] min-w-0">
        <ErrorBoundary fallbackMessage="Prescription Panel encountered an error">
          <PrescriptionPanel />
        </ErrorBoundary>
      </div>
    </div>
  );
};
