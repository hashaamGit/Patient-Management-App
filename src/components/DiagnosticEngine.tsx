import { useState } from 'react';
import { Activity, Stethoscope, FileText, BrainCircuit, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const TABS = [
  { id: 'symptoms', label: '30 Symptoms', icon: Activity },
  { id: 'domains', label: '13 Domains', icon: Stethoscope },
  { id: 'diseases', label: '150 Diseases', icon: FileText },
  { id: 'ai', label: 'AI History', icon: BrainCircuit },
];

const QUICK_SYMPTOMS = ['Fever', 'Cough', 'Headache', 'Dysuria', 'Abdominal Pain', 'Fatigue'];

export const DiagnosticEngine = () => {
  const [activeTab, setActiveTab] = useState('symptoms');
  const [activeTree, setActiveTree] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [path, setPath] = useState<string[]>([]);
  
  const { addPrescriptionItem, setAdvice } = useAppStore();

  const handleStartTree = (symptom: string) => {
    setActiveTree(symptom);
    setStep(1);
    setPath([symptom]);
  };

  const handleOptionClick = (optionStr: string, isTerminal: boolean = false) => {
    setPath(prev => [...prev, optionStr]);
    if (isTerminal) {
      setStep(99); // Terminal state
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleTransfer = () => {
    // Mock transfer logic for "Fever -> High Grade -> With Chills -> Malaria/Typhoid"
    addPrescriptionItem({
      brandName: 'Panadol',
      genericName: 'Paracetamol',
      strength: '500mg',
      form: 'Tab',
      dosage: '1+1+1',
      duration: '3 days',
      instructions: 'Take after meals for fever'
    });
    addPrescriptionItem({
      brandName: 'Artemether + Lumefantrine',
      genericName: 'Anti-malarial',
      strength: '80/480mg',
      form: 'Tab',
      dosage: '1+0+1',
      duration: '3 days',
      instructions: 'Take with milk/fatty meal'
    });
    setAdvice('Recommended Labs: CBC, MP (Malarial Parasite), Typhidot.\nAdvise: Complete rest, plenty of oral fluids. Follow up with reports.');
    
    // Reset engine
    setActiveTree(null);
    setStep(0);
    setPath([]);
  };

  return (
    <div className="flex flex-col h-full bg-paper/30 relative">
      
      {/* Top Tabs */}
      <div className="flex bg-white border-b border-slate-200">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveTree(null); setStep(0); setPath([]); }}
              className={`flex-1 flex items-center justify-center py-4 text-sm font-semibold transition-colors border-b-2 ${
                isActive ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* State 0: Not started a tree yet */}
        {!activeTree && activeTab === 'symptoms' && (
          <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Triage</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {QUICK_SYMPTOMS.map(symp => (
                <button
                  key={symp}
                  onClick={() => handleStartTree(symp)}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/40 text-left transition-all group flex items-center justify-between"
                >
                  <span className="font-bold text-slate-700 group-hover:text-primary">{symp}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-slate-400 italic">Select a symptom to begin the diagnostic decision tree.</p>
          </div>
        )}

        {/* Not built tabs placeholder */}
        {!activeTree && activeTab !== 'symptoms' && (
          <div className="flex items-center justify-center h-full text-slate-400 italic">
            This module is under construction for V4.
          </div>
        )}

        {/* Active Tree UI */}
        {activeTree && (
          <div className="flex h-full">
            
            {/* Left SVG Decision Rail / Breadcrumbs */}
            <div className="w-48 flex-shrink-0 pr-6 border-r border-slate-200 relative">
              <div className="sticky top-0 pt-2 space-y-6">
                {path.map((node, i) => (
                  <div key={i} className="flex items-start animate-in slide-in-from-left-2 duration-300">
                    <div className="flex flex-col items-center mr-3">
                      <div className={`w-3 h-3 rounded-full z-10 ${i === path.length - 1 ? 'bg-primary ring-4 ring-primary/20' : 'bg-slate-300'}`}></div>
                      {i < path.length - 1 && <div className="w-px h-12 bg-slate-200 -mt-1 -mb-2"></div>}
                    </div>
                    <p className={`text-xs font-bold leading-tight mt-[-2px] ${i === path.length - 1 ? 'text-primary' : 'text-slate-400'}`}>
                      {node}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Question/Terminal Area */}
            <div className="flex-1 pl-8 py-2">
              
              {/* Step 1 Question */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Duration & Grade?</h3>
                  <p className="text-slate-500 mb-6">Select the pattern of the fever.</p>
                  
                  <div className="space-y-3 max-w-md">
                    <button onClick={() => handleOptionClick('High grade, sudden onset')} className="w-full bg-white text-left p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary hover:bg-primary/5 transition-all font-semibold text-slate-700">
                      High grade, sudden onset (&lt; 3 days)
                    </button>
                    <button onClick={() => handleOptionClick('Low grade, evening rise')} className="w-full bg-white text-left p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary hover:bg-primary/5 transition-all font-semibold text-slate-700">
                      Low grade, evening rise (&gt; 1 week)
                    </button>
                    <button onClick={() => handleOptionClick('Associated with rash')} className="w-full bg-white text-left p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary hover:bg-primary/5 transition-all font-semibold text-slate-700">
                      Associated with Maculopapular rash
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 Question */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Associated Symptoms?</h3>
                  <div className="space-y-3 max-w-md mt-6">
                    <button onClick={() => handleOptionClick('With Chills / Rigors')} className="w-full bg-white text-left p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary hover:bg-primary/5 transition-all font-semibold text-slate-700">
                      With Chills / Rigors
                    </button>
                    <button onClick={() => handleOptionClick('Burning micturition', true)} className="w-full bg-white text-left p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary hover:bg-primary/5 transition-all font-semibold text-slate-700">
                      Burning micturition / Flank pain
                    </button>
                    <button onClick={() => handleOptionClick('Productive Cough', true)} className="w-full bg-white text-left p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary hover:bg-primary/5 transition-all font-semibold text-slate-700">
                      Productive Cough / Dyspnea
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 Question */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Pattern?</h3>
                  <div className="space-y-3 max-w-md mt-6">
                    <button onClick={() => handleOptionClick('Alternate Day Spike (Malaria suspect)', true)} className="w-full bg-white text-left p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary hover:bg-primary/5 transition-all font-semibold text-slate-700">
                      Alternate Day Spike
                    </button>
                    <button onClick={() => handleOptionClick('Step-ladder pattern (Typhoid suspect)', true)} className="w-full bg-white text-left p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary hover:bg-primary/5 transition-all font-semibold text-slate-700">
                      Step-ladder pattern
                    </button>
                  </div>
                </div>
              )}

              {/* Terminal State 99 */}
              {step === 99 && (
                <div className="animate-in zoom-in-95 fade-in duration-300 max-w-xl">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="bg-slate-800 p-6 text-white">
                      <div className="flex items-center mb-2 text-primary-300 font-bold uppercase tracking-wider text-xs">
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Terminal Diagnosis Reached
                      </div>
                      <h3 className="text-2xl font-bold">Acute Febrile Illness (Suspected Malaria/Enteric)</h3>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">Recommended Rx:</h4>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                          <li>Tab. Paracetamol 500mg (1+1+1)</li>
                          <li>Tab. Artemether + Lumefantrine (1+0+1)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <h4 className="font-bold text-amber-800 mb-2 text-sm uppercase flex items-center">
                          <Zap className="w-4 h-4 mr-1"/> Recommended Labs:
                        </h4>
                        <p className="text-sm text-amber-700 font-medium">CBC, MP (Malarial Parasite), Typhidot / Blood Culture.</p>
                      </div>

                      <button 
                        onClick={handleTransfer}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors shadow-lg hover:shadow-primary/25 flex items-center justify-center"
                      >
                        [ + Transfer to Rx Pad ]
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
