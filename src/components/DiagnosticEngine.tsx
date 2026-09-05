import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { SYMPTOM_CATEGORIES, ALL_SYMPTOMS } from '../data/symptoms';
import { DISEASE_DOMAINS, ALL_DISEASES, DOMAIN_LIST } from '../data/diseases';
import { DECISION_TREES } from '../data/decisionTrees';
import type { DecisionTree, TreeStep, TerminalDiagnosis, PrescriptionItem } from '../types';
import {
  Activity, Stethoscope, FileText, BrainCircuit, Search,
  ChevronRight, ChevronLeft, ArrowLeft, CheckCircle2, AlertTriangle,
  ArrowRight, Pill, FlaskConical, BookOpen, ShieldAlert, Zap,
  Target, TrendingUp, Clock, Filter, ChevronDown, ChevronUp
} from 'lucide-react';

type TabType = 'symptoms' | 'domains' | 'diseases' | 'ai';

const SYMPTOM_TREE_MAP: Record<string, string> = {
  'Cough (Dry)': 'Cough',
  'Cough (Productive)': 'Cough',
  'Numbness/Tingling': 'Numbness',
};

const getTreeKeyForSymptom = (symptom: string): string | null => {
  if (DECISION_TREES[symptom]) return symptom;
  if (SYMPTOM_TREE_MAP[symptom] && DECISION_TREES[SYMPTOM_TREE_MAP[symptom]]) return SYMPTOM_TREE_MAP[symptom];
  return null;
};

export const DiagnosticEngine = () => {
  const { addPrescriptionItem, setAdvice, addDiagnosis, addLab } = useAppStore();

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<TabType>('symptoms');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Collapse States
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});
  
  // Decision Tree State
  const [activeTreeId, setActiveTreeId] = useState<string | null>(null);
  const [currentStepId, setCurrentStepId] = useState<number | null>(null);
  const [treePath, setTreePath] = useState<Array<{ stepId: number; label: string }>>([]);

  // AI Tab State
  const [aiPrompt, setAiPrompt] = useState('');

  // --- Filtering Logic ---
  
  const filteredSymptoms = useMemo(() => {
    if (!searchQuery) return SYMPTOM_CATEGORIES;
    const lowerQ = searchQuery.toLowerCase();
    return SYMPTOM_CATEGORIES.map(cat => ({
      ...cat,
      symptoms: cat.symptoms.filter(s => s.toLowerCase().includes(lowerQ))
    })).filter(cat => cat.system.toLowerCase().includes(lowerQ) || cat.symptoms.length > 0);
  }, [searchQuery]);

  const filteredDomains = useMemo(() => {
    if (!searchQuery) return DISEASE_DOMAINS;
    const lowerQ = searchQuery.toLowerCase();
    return DISEASE_DOMAINS.map(domain => ({
      ...domain,
      diseases: domain.diseases.filter(d => d.name.toLowerCase().includes(lowerQ) || d.icdCode.toLowerCase().includes(lowerQ))
    })).filter(domain => domain.domain.toLowerCase().includes(lowerQ) || domain.diseases.length > 0);
  }, [searchQuery]);

  const filteredDiseases = useMemo(() => {
    if (!searchQuery) return ALL_DISEASES;
    const lowerQ = searchQuery.toLowerCase();
    return ALL_DISEASES.filter(d => d.toLowerCase().includes(lowerQ));
  }, [searchQuery]);

  // --- Handlers ---
  
  const toggleCategory = (system: string) => {
    setExpandedCategories(prev => ({ ...prev, [system]: !prev[system] }));
  };

  const toggleDomain = (domain: string) => {
    setExpandedDomains(prev => ({ ...prev, [domain]: !prev[domain] }));
  };

  const handleStartTree = (triggerId: string) => {
    const treeKey = getTreeKeyForSymptom(triggerId);
    if (!treeKey) return;
    const tree = DECISION_TREES[treeKey];
    if (tree) {
      setActiveTreeId(treeKey);
      setCurrentStepId(1); // Assuming 1 is the starting step
      setTreePath([]);
    }
  };

  const handleOptionClick = (nextStepId: number, label: string) => {
    if (currentStepId === null) return;
    setTreePath(prev => [...prev, { stepId: currentStepId, label }]);
    setCurrentStepId(nextStepId);
  };

  const handleBackTree = () => {
    if (treePath.length === 0) {
      setActiveTreeId(null);
      setCurrentStepId(null);
      return;
    }
    const newPath = [...treePath];
    const lastStep = newPath.pop();
    setTreePath(newPath);
    setCurrentStepId(lastStep!.stepId);
  };

  const handleRestartTree = () => {
    setCurrentStepId(1);
    setTreePath([]);
  };

  const handleTransferAll = (terminal: TerminalDiagnosis) => {
    // 1. Add Diagnosis
    addDiagnosis(terminal.diagnosis);

    // 2. Add Medications
    terminal.medications?.forEach(med => {
      addPrescriptionItem({
        genericName: med.genericName,
        brandName: med.brandName,
        strength: med.strength,
        form: med.form || 'Tab',
        route: 'Oral',
        dosage: med.dosage,
        frequency: 'OD',
        duration: med.duration,
        instructions: med.instructions || '',
      });
    });

    // 3. Add Labs
    terminal.investigations?.forEach(lab => {
      addLab(lab);
    });

    // 4. Set Advice
    if (terminal.advice) {
      setAdvice(terminal.advice);
    }

    // Reset view
    setActiveTreeId(null);
    setCurrentStepId(null);
  };

  const handleTransferMeds = (terminal: TerminalDiagnosis) => {
    terminal.medications?.forEach(med => {
      addPrescriptionItem({
        genericName: med.genericName,
        brandName: med.brandName,
        strength: med.strength,
        form: med.form || 'Tab',
        route: 'Oral',
        dosage: med.dosage,
        frequency: 'OD',
        duration: med.duration,
        instructions: med.instructions || '',
      });
    });
  };

  // --- Render Helpers ---

  const renderTabs = () => (
    <div className="flex items-center gap-2 border-b border-border px-4 py-2 bg-canvas">
      <button
        onClick={() => setActiveTab('symptoms')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          activeTab === 'symptoms' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-hover'
        }`}
      >
        <Activity size={16} />
        <span>60+ Symptoms</span>
      </button>
      <button
        onClick={() => setActiveTab('domains')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          activeTab === 'domains' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-hover'
        }`}
      >
        <Stethoscope size={16} />
        <span>20 Domains</span>
      </button>
      <button
        onClick={() => setActiveTab('diseases')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          activeTab === 'diseases' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-hover'
        }`}
      >
        <FileText size={16} />
        <span>150+ Diseases</span>
      </button>
      <button
        onClick={() => setActiveTab('ai')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          activeTab === 'ai' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-hover'
        }`}
      >
        <BrainCircuit size={16} />
        <span>AI Stepwise</span>
      </button>
    </div>
  );

  const renderSearchBar = () => (
    <div className="p-4 border-b border-border bg-surface shrink-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-canvas border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
      </div>
    </div>
  );

  const renderSymptomsTab = () => (
    <div className="p-4 space-y-4">
      {filteredSymptoms.map(category => (
        <div key={category.system} className="border border-border rounded-lg overflow-hidden bg-surface">
          <button
            onClick={() => toggleCategory(category.system)}
            className="w-full flex items-center justify-between p-3 bg-canvas hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                <Activity size={16} />
              </div>
              <span className="font-semibold text-text-primary text-sm">{category.system}</span>
              <span className="px-2 py-0.5 rounded-full bg-border text-xs font-medium text-text-muted">
                {category.symptoms.length}
              </span>
            </div>
            {expandedCategories[category.system] ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
          </button>
          
          {(expandedCategories[category.system] || searchQuery) && (
            <div className="p-3 flex flex-wrap gap-2 border-t border-border">
              {category.symptoms.map(symptom => {
                const treeKey = getTreeKeyForSymptom(symptom);
                const hasTree = !!treeKey;
                return (
                  <button
                    key={symptom}
                    onClick={() => hasTree ? handleStartTree(symptom) : null}
                    className={`px-3 py-1.5 text-sm rounded-md border flex items-center gap-2 transition-colors ${
                      hasTree 
                        ? 'border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary cursor-pointer' 
                        : 'border-border bg-canvas text-text-secondary opacity-70 cursor-default'
                    }`}
                  >
                    {symptom}
                    {!hasTree && (
                      <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold bg-surface px-1.5 py-0.5 rounded">
                        Coming Soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderDomainsTab = () => (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredDomains.map(domain => (
        <div key={domain.domain} className="card p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                <Stethoscope size={16} />
              </div>
              <h3 className="font-semibold text-sm text-text-primary">{domain.domain}</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-border text-xs font-medium text-text-muted">
              {domain.diseases.length}
            </span>
          </div>
          
          <button 
            onClick={() => toggleDomain(domain.domain)}
            className="text-xs text-primary font-medium hover:underline text-left"
          >
            {expandedDomains[domain.domain] || searchQuery ? 'Hide Diseases' : 'View Diseases'}
          </button>

          {(expandedDomains[domain.domain] || searchQuery) && (
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border max-h-48 overflow-y-auto">
              {domain.diseases.map(disease => {
                const treeKey = getTreeKeyForSymptom(disease.name);
                return (
                  <div 
                    key={disease.name}
                    onClick={() => treeKey && handleStartTree(disease.name)}
                    className={`flex items-center justify-between p-2 rounded text-sm ${
                      treeKey ? 'hover:bg-primary/5 cursor-pointer text-text-primary' : 'text-text-secondary cursor-default'
                    }`}
                  >
                    <span className="truncate pr-2">{disease.name}</span>
                    <span className="text-xs bg-canvas px-1.5 py-0.5 rounded border border-border clinical-num shrink-0">
                      {disease.icdCode}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderDiseasesTab = () => (
    <div className="p-4">
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {filteredDiseases.map((disease, idx) => {
          const treeKey = getTreeKeyForSymptom(disease);
          const hasTree = !!treeKey;
          return (
            <div 
              key={disease}
              onClick={() => hasTree && handleStartTree(disease)}
              className={`flex items-center justify-between p-3 border-b border-border last:border-0 ${
                hasTree ? 'hover:bg-primary/5 cursor-pointer text-text-primary' : 'text-text-secondary opacity-80'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{disease}</span>
                {!hasTree && <span className="text-xs text-text-muted">Pathway coming soon</span>}
              </div>
              {hasTree && <ChevronRight size={16} className="text-text-muted" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAITab = () => (
    <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <BrainCircuit size={40} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">AI Stepwise Diagnostic Assistant</h2>
        <p className="text-sm text-text-muted max-w-md">
          Describe the patient's symptoms in natural language. The AI will generate a dynamic clinical pathway and suggest the next best questions.
        </p>
      </div>
      
      <div className="w-full max-w-lg relative">
        <textarea 
          placeholder="e.g., 45yo male presenting with acute radiating chest pain, diaphoresis, and nausea for the past 2 hours..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="w-full h-32 p-4 bg-canvas border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <span className="badge badge-warning text-[10px]">Coming in V5</span>
          <button disabled className="px-4 py-1.5 bg-border text-text-muted rounded-md text-sm font-medium flex items-center gap-2">
            <Zap size={14} /> Analyze
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {["Persistent dry cough with weight loss", "Severe unilateral headache with aura", "Acute RLQ pain with fever"].map(prompt => (
          <button 
            key={prompt} 
            onClick={() => setAiPrompt(prompt)}
            className="px-3 py-1.5 text-xs bg-surface border border-border rounded-full text-text-secondary hover:bg-canvas transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderTreeView = () => {
    if (!activeTreeId || currentStepId === null) return null;
    const tree = DECISION_TREES[activeTreeId];
    const currentStep = tree.steps[currentStepId];
    const terminalStep = tree.terminal[currentStepId];

    return (
      <div className="flex h-full bg-canvas">
        {/* Left Rail (Breadcrumbs) */}
        <div className="w-64 border-r border-border bg-surface flex flex-col">
          <div className="p-4 border-b border-border">
            <button 
              onClick={handleBackTree}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Back to {activeTab}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
              Pathway: {activeTreeId}
            </h3>
            <div className="relative pl-3 border-l-2 border-border space-y-6">
              {treePath.map((node, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[21px] top-0.5 bg-surface rounded-full">
                    <CheckCircle2 size={18} className="text-success fill-success/10" />
                  </div>
                  <div className="text-xs font-medium text-text-primary">{node.label}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">Completed</div>
                </div>
              ))}
              
              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 bg-surface rounded-full">
                  <div className="w-[18px] h-[18px] rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-xs font-medium text-primary">
                  {terminalStep ? 'Diagnosis Reached' : 'Current Step'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {terminalStep ? (
            <div className="max-w-2xl mx-auto">
              <div className="card border-success border-2 overflow-hidden shadow-sm">
                <div className="bg-success-bg p-6 border-b border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary mb-2">
                        {terminalStep.diagnosis}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className="badge badge-success text-sm flex items-center gap-1 px-2.5 py-1">
                          <Target size={14} /> {terminalStep.confidence} Likely
                        </span>
                        <span className="text-xs text-text-muted flex items-center gap-1 font-medium bg-canvas px-2 py-1 rounded border border-border">
                          <BookOpen size={14} /> {terminalStep.guidelines}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 bg-surface">
                  {terminalStep.redFlags && terminalStep.redFlags.length > 0 && (
                    <div className="p-4 bg-danger-bg border border-danger/30 rounded-lg">
                      <div className="flex items-center gap-2 text-danger-text font-semibold text-sm mb-2">
                        <AlertTriangle size={16} /> Emergency Conditions to Rule Out
                      </div>
                      <ul className="list-disc pl-5 text-sm text-danger-text space-y-1">
                        {terminalStep.redFlags.map((flag, i) => (
                          <li key={i}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                        <Pill size={16} className="text-primary" /> Recommended Medications
                      </h3>
                      <div className="space-y-2">
                        {terminalStep.medications.map((med, i) => (
                          <div key={i} className="p-3 bg-canvas border border-border rounded-lg text-sm">
                            <div className="font-medium text-text-primary">{med.genericName} <span className="text-text-muted font-normal">({med.brandName})</span> - {med.strength}</div>
                            <div className="text-text-secondary text-xs mt-1">{med.dosage} for {med.duration}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                        <FlaskConical size={16} className="text-primary" /> Investigations
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {terminalStep.investigations.map((inv, i) => (
                          <span key={i} className="px-2.5 py-1.5 bg-canvas border border-border rounded-md text-xs font-medium text-text-secondary">
                            {inv}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6">
                        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-2">
                          <FileText size={16} className="text-primary" /> Clinical Advice
                        </h3>
                        <p className="text-sm text-text-secondary bg-canvas p-3 rounded-lg border border-border">
                          {terminalStep.advice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-border bg-canvas flex flex-wrap gap-3 items-center justify-end">
                  <button 
                    onClick={handleRestartTree}
                    className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors"
                  >
                    Restart Tree
                  </button>
                  <button 
                    onClick={() => handleTransferMeds(terminalStep)}
                    className="px-4 py-2 border border-primary/30 bg-primary/5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    + Transfer Meds Only
                  </button>
                  <button 
                    onClick={() => handleTransferAll(terminalStep)}
                    className="px-5 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} /> Transfer All to Rx Pad
                  </button>
                </div>
              </div>
            </div>
          ) : currentStep ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-text-primary mb-6">
                {currentStep.question}
              </h2>
              
              <div className="space-y-3">
                {currentStep.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(opt.nextStep, opt.label)}
                    className="w-full card card-hover p-4 flex items-center justify-between text-left group"
                  >
                    <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                      {opt.label}
                    </span>
                    <ChevronRight size={18} className="text-border group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  // --- Main Render ---
  
  return (
    <div className="h-full flex flex-col overflow-hidden bg-canvas border-r border-border">
      {activeTreeId ? (
        renderTreeView()
      ) : (
        <>
          {renderTabs()}
          {renderSearchBar()}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'symptoms' && renderSymptomsTab()}
            {activeTab === 'domains' && renderDomainsTab()}
            {activeTab === 'diseases' && renderDiseasesTab()}
            {activeTab === 'ai' && renderAITab()}
          </div>
        </>
      )}
    </div>
  );
};
