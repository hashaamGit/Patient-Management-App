import { useState } from 'react';
import { Activity, Stethoscope, FileText, BrainCircuit, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const TABS = [
  { id: 'symptoms', label: '30 Symptoms', icon: Activity },
  { id: 'domains', label: '13 Domains', icon: Stethoscope },
  { id: 'diseases', label: '150 Diseases', icon: FileText },
  { id: 'ai', label: 'AI Stepwise History', icon: BrainCircuit },
];

const QUICK_SYMPTOMS = [
  'Fever', 'Cough', 'Headache', 'Dysuria', 'Abdominal Pain', 'Fatigue', 
  'Chest Pain', 'Shortness of Breath', 'Nausea/Vomiting', 'Diarrhea', 
  'Dizziness', 'Joint Pain', 'Back Pain', 'Sore Throat', 'Rash', 
  'Palpitations', 'Weight Loss', 'Constipation'
];

const QUICK_DOMAINS = [
  'Cardiology', 'Pulmonology', 'Gastroenterology', 'Neurology', 
  'Nephrology', 'Infectious Diseases', 'Endocrinology', 'Rheumatology', 
  'Hematology', 'Dermatology', 'Psychiatry', 'Otolaryngology (ENT)', 'Orthopedics'
];

const QUICK_DISEASES = [
  'Hypertension', 'Diabetes Mellitus Type 2', 'Asthma', 'COPD', 
  'Ischemic Heart Disease', 'Gastroesophageal Reflux', 'Peptic Ulcer Disease',
  'Urinary Tract Infection', 'Pneumonia', 'Tuberculosis', 'Hypothyroidism',
  'Migraine', 'Osteoarthritis', 'Rheumatoid Arthritis', 'Anemia (Iron Def)'
];

export const DiagnosticEngine = () => {
  const [activeTab, setActiveTab] = useState('symptoms');
  const [activeTree, setActiveTree] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [path, setPath] = useState<string[]>([]);
  
  const { addPrescriptionItem, setAdvice } = useAppStore();

  const handleStartTree = (item: string) => {
    setActiveTree(item);
    setStep(1);
    setPath([item]);
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
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* Top Tabs */}
      <div className="flex bg-white shadow-sm z-10 sticky top-0 shrink-0">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveTree(null); setStep(0); setPath([]); }}
              className={`flex-1 flex flex-col items-center justify-center py-3 text-xs md:text-sm font-bold transition-all border-b-[3px] ${
                isActive 
                  ? 'border-primary text-primary bg-primary/5 shadow-[inset_0_-2px_4px_rgba(8,110,100,0.05)]' 
                  : 'border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'animate-pulse' : ''}`} style={{ animationDuration: '3s' }} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        
        {/* Symptoms Tab View */}
        {!activeTree && activeTab === 'symptoms' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Chief Complaints (Symptoms)</h2>
              <p className="text-slate-500 font-medium">Select a primary symptom to launch the diagnostic tree.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {QUICK_SYMPTOMS.map(symp => (
                <button
                  key={symp}
                  onClick={() => handleStartTree(symp)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/50 text-left transition-all group flex items-center justify-between"
                >
                  <span className="font-bold text-slate-700 group-hover:text-primary">{symp}</span>
                  <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Domains Tab View */}
        {!activeTree && activeTab === 'domains' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Specialty Domains</h2>
              <p className="text-slate-500 font-medium">Select a system or specialty to begin assessment.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {QUICK_DOMAINS.map(domain => (
                <button
                  key={domain}
                  onClick={() => handleStartTree(domain)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/50 text-left transition-all group flex items-center justify-between"
                >
                  <span className="font-bold text-slate-700 group-hover:text-primary">{domain}</span>
                  <Stethoscope className="w-5 h-5 text-slate-200 group-hover:text-primary transform group-hover:scale-110 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Diseases Tab View */}
        {!activeTree && activeTab === 'diseases' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Disease Management</h2>
              <p className="text-slate-500 font-medium">Select a known diagnosis for algorithmic management and Rx guidelines.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {QUICK_DISEASES.map(disease => (
                <button
                  key={disease}
                  onClick={() => handleStartTree(disease)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/50 text-left transition-all group flex items-center justify-between"
                >
                  <span className="font-bold text-slate-700 group-hover:text-primary line-clamp-1" title={disease}>{disease}</span>
                  <FileText className="w-5 h-5 text-slate-200 group-hover:text-primary transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI History Tab View */}
        {!activeTree && activeTab === 'ai' && (
          <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
              <BrainCircuit className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3">AI Stepwise History</h2>
            <p className="text-slate-500 font-medium mb-8">
              The AI Engine allows you to type natural language patient histories and automatically generates the diagnostic rail and differential diagnosis.
            </p>
            <div className="w-full bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex">
              <input type="text" placeholder="e.g. 45yo male with 3 days of fever and chills..." className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-700 font-medium" disabled />
              <button className="bg-slate-200 text-slate-400 px-6 py-3 rounded-xl font-bold cursor-not-allowed">
                Analyze
              </button>
            </div>
            <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Coming in V4</p>
          </div>
        )}


        {/* Active Tree UI (The Interactive Rail) */}
        {activeTree && (
          <div className="flex flex-col md:flex-row h-full max-w-5xl mx-auto">
            
            {/* Left SVG Decision Rail / Breadcrumbs */}
            <div className="md:w-56 flex-shrink-0 md:pr-6 md:border-r border-slate-200 relative mb-8 md:mb-0">
              <button 
                onClick={() => { setActiveTree(null); setStep(0); setPath([]); }}
                className="mb-6 text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center"
              >
                &larr; Back to {activeTab}
              </button>
              
              <div className="sticky top-0 pt-2 space-y-8">
                {path.map((node, i) => (
                  <div key={i} className="flex items-start animate-in slide-in-from-left-4 duration-300">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-4 h-4 rounded-full z-10 shadow-sm ${i === path.length - 1 ? 'bg-primary ring-4 ring-primary/20 scale-125' : 'bg-slate-300'}`}></div>
                      {i < path.length - 1 && <div className="w-1 h-16 bg-slate-200 -mt-1 -mb-3 rounded-full"></div>}
                    </div>
                    <p className={`text-sm font-bold leading-snug mt-[-2px] ${i === path.length - 1 ? 'text-primary' : 'text-slate-400'}`}>
                      {node}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Question/Terminal Area */}
            <div className="flex-1 md:pl-10 py-2">
              
              {/* Step 1 Question */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                  <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Duration & Grade?</h3>
                  <p className="text-slate-500 font-medium mb-8 text-lg">Select the pattern of the presentation.</p>
                  
                  <div className="space-y-4 max-w-lg">
                    <button onClick={() => handleOptionClick('Acute (< 3 days), Severe')} className="w-full bg-white text-left p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all font-bold text-slate-700 text-lg group flex justify-between items-center">
                      <span>Acute (&lt; 3 days), Severe</span>
                      <ChevronRightIcon />
                    </button>
                    <button onClick={() => handleOptionClick('Sub-acute / Chronic (> 1 week)')} className="w-full bg-white text-left p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all font-bold text-slate-700 text-lg group flex justify-between items-center">
                      <span>Sub-acute / Chronic (&gt; 1 wk)</span>
                      <ChevronRightIcon />
                    </button>
                    <button onClick={() => handleOptionClick('Associated with other red flags')} className="w-full bg-white text-left p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all font-bold text-slate-700 text-lg group flex justify-between items-center">
                      <span>Associated with red flags</span>
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 Question */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                  <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Associated Symptoms?</h3>
                  <div className="space-y-4 max-w-lg mt-8">
                    <button onClick={() => handleOptionClick('With Chills / Rigors')} className="w-full bg-white text-left p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all font-bold text-slate-700 text-lg group flex justify-between items-center">
                      <span>With Chills / Rigors</span>
                      <ChevronRightIcon />
                    </button>
                    <button onClick={() => handleOptionClick('Burning micturition / Flank pain', true)} className="w-full bg-white text-left p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all font-bold text-slate-700 text-lg group flex justify-between items-center">
                      <span>Burning micturition / Flank pain</span>
                      <ChevronRightIcon />
                    </button>
                    <button onClick={() => handleOptionClick('Productive Cough / Dyspnea', true)} className="w-full bg-white text-left p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all font-bold text-slate-700 text-lg group flex justify-between items-center">
                      <span>Productive Cough / Dyspnea</span>
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 Question */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                  <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Pattern Observed?</h3>
                  <div className="space-y-4 max-w-lg mt-8">
                    <button onClick={() => handleOptionClick('Alternate Day Spike (Malaria suspect)', true)} className="w-full bg-white text-left p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all font-bold text-slate-700 text-lg group flex justify-between items-center">
                      <span>Alternate Day Spike</span>
                      <ChevronRightIcon />
                    </button>
                    <button onClick={() => handleOptionClick('Step-ladder pattern (Typhoid suspect)', true)} className="w-full bg-white text-left p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all font-bold text-slate-700 text-lg group flex justify-between items-center">
                      <span>Step-ladder pattern</span>
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              )}

              {/* Terminal State 99 */}
              {step === 99 && (
                <div className="animate-in zoom-in-95 fade-in duration-500 max-w-xl mt-4">
                  <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 p-8 text-white relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                      <div className="flex items-center mb-3 text-primary-300 font-bold uppercase tracking-widest text-xs">
                        <CheckCircle2 className="w-5 h-5 mr-2" /> Terminal Diagnosis Reached
                      </div>
                      <h3 className="text-3xl font-black tracking-tight relative z-10 leading-tight">Acute Febrile Illness <br/><span className="text-slate-300 text-xl font-bold">(Suspected Malaria/Enteric)</span></h3>
                    </div>
                    
                    <div className="p-8 space-y-8">
                      <div>
                        <h4 className="font-black text-slate-800 mb-3 text-sm uppercase tracking-wider">Recommended Treatment:</h4>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                          <p className="font-bold text-slate-700 flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:mr-3">Tab. Paracetamol 500mg <span className="ml-auto bg-white px-2 py-1 rounded shadow-sm text-xs border border-slate-200">1+1+1</span></p>
                          <p className="font-bold text-slate-700 flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:mr-3">Tab. Artemether + Lumefantrine <span className="ml-auto bg-white px-2 py-1 rounded shadow-sm text-xs border border-slate-200">1+0+1</span></p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/60">
                        <h4 className="font-black text-amber-800 mb-2 text-sm uppercase tracking-wider flex items-center">
                          <Zap className="w-5 h-5 mr-2"/> Recommended Investigations:
                        </h4>
                        <p className="text-sm text-amber-900/80 font-bold">CBC, MP (Malarial Parasite), Typhidot / Blood Culture.</p>
                      </div>

                      <button 
                        onClick={handleTransfer}
                        className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg hover:bg-primary-dark transition-all shadow-[0_4px_14px_0_rgba(8,110,100,0.39)] hover:shadow-[0_6px_20px_rgba(8,110,100,0.23)] hover:-translate-y-0.5 flex items-center justify-center group"
                      >
                        [ + Transfer to Rx Pad ] 
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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

// Helper component for chevron icon to keep code clean
const ChevronRightIcon = () => (
  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
);
