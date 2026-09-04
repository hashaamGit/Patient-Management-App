import { useState, useMemo } from 'react';
import { MOCK_LAB_RESULTS, LAB_CATEGORIES, ORDERABLE_LABS } from '../data/labPanels';
import { useAppStore } from '../store/useAppStore';
import type { LabResult, LabParameter, LabFlag } from '../types';
import {
  FlaskConical, Search, Filter, ChevronDown, ChevronUp, ChevronRight,
  AlertTriangle, CheckCircle2, OctagonAlert, TrendingUp, TrendingDown,
  Minus, FileText, Plus, Download, Eye, Printer, X, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export const LabResultsViewer = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'flowsheet'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    LAB_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>({});
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderUrgency, setOrderUrgency] = useState('Routine');
  const [orderIndication, setOrderIndication] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const addOrder = useAppStore((state) => state.addOrder);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const togglePanel = (id: string) => {
    setExpandedPanels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredLabs = useMemo(() => {
    return MOCK_LAB_RESULTS.filter(lab => {
      const matchesCategory = activeCategory === 'All' || lab.category === activeCategory;
      const matchesSearch = lab.panelName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lab.parameters.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const labsByCategory = useMemo(() => {
    const grouped: Record<string, LabResult[]> = {};
    LAB_CATEGORIES.forEach(cat => {
      const labsInCat = filteredLabs.filter(lab => lab.category === cat);
      if (labsInCat.length > 0) {
        grouped[cat] = labsInCat;
      }
    });
    return grouped;
  }, [filteredLabs]);

  const flowsheetData = useMemo(() => {
    // Generate unique dates and unique parameters
    const datesSet = new Set<string>();
    const paramMap = new Map<string, { unit: string, ref: string, history: Record<string, LabParameter> }>();

    filteredLabs.forEach(lab => {
      datesSet.add(lab.date);
      lab.parameters.forEach(param => {
        if (!paramMap.has(param.name)) {
          paramMap.set(param.name, { unit: param.unit, ref: param.referenceRange, history: {} });
        }
        paramMap.get(param.name)!.history[lab.date] = param;
      });
    });

    const dates = Array.from(datesSet).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const parameters = Array.from(paramMap.entries()).map(([name, data]) => ({
      name,
      ...data
    })).sort((a, b) => a.name.localeCompare(b.name));

    return { dates, parameters };
  }, [filteredLabs]);

  const handleOrderToggleTest = (test: string) => {
    setSelectedTests(prev => 
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  const handlePlaceOrder = () => {
    selectedTests.forEach(test => {
      addOrder({
        type: 'Lab' as const,
        name: test,
        urgency: orderUrgency as 'Routine' | 'Urgent' | 'STAT',
        clinicalIndication: orderIndication,
      });
    });
    setIsOrderModalOpen(false);
    setSelectedTests([]);
    setOrderUrgency('Routine');
    setOrderIndication('');
  };

  const renderFlag = (flag: string) => {
    switch(flag) {
      case 'Normal':
        return <span className="text-text-muted">-</span>;
      case 'Low':
        return <span className="badge badge-info"><ArrowDownRight className="w-3 h-3 mr-1" /> LOW</span>;
      case 'High':
        return <span className="badge badge-warning"><ArrowUpRight className="w-3 h-3 mr-1" /> HIGH</span>;
      case 'Critical':
        return <span className="badge badge-danger"><OctagonAlert className="w-3 h-3 mr-1" /> CRITICAL</span>;
      default:
        return null;
    }
  };

  const renderValue = (param: LabParameter) => {
    const isNormal = param.flag === 'Normal';
    const isLow = param.flag === 'Low';
    const isHigh = param.flag === 'High';
    const isCritical = param.flag === 'Critical';

    return (
      <div className="flex items-center gap-2">
        <span className={`clinical-num ${isNormal ? 'text-text-primary' : isLow ? 'text-info' : isHigh ? 'text-warning-text' : isCritical ? 'text-danger-text font-bold' : ''}`}>
          {isCritical && <span className="mr-1">!!</span>}
          {param.value}
        </span>
      </div>
    );
  };

  const renderSparkline = (flag: string) => {
    // Simple mock sparkline SVG depending on flag
    let color = "#64748B";
    let pts = "0,5 5,5 10,5 15,5 20,5";
    if (flag === 'High') {
      color = "#D97706";
      pts = "0,10 5,8 10,6 15,4 20,0";
    } else if (flag === 'Low') {
      color = "#0284C7";
      pts = "0,0 5,2 10,4 15,8 20,10";
    } else if (flag === 'Critical') {
      color = "#DC2626";
      pts = "0,10 5,0 10,10 15,0 20,10";
    }
    
    return (
      <svg width="24" height="12" viewBox="0 0 24 12" className="overflow-visible">
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy={pts.split(' ')[4].split(',')[1]} r="2" fill={color} />
      </svg>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="bg-white border-b border-border px-6 py-4 flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FlaskConical className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Laboratory Results</h1>
              <p className="text-sm text-text-muted">Comprehensive lab flowsheet and panel viewer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn border border-border bg-canvas hover:bg-border px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2" onClick={() => setViewMode(viewMode === 'cards' ? 'flowsheet' : 'cards')}>
              {viewMode === 'cards' ? <FileText className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              {viewMode === 'cards' ? 'Flowsheet View' : 'Card View'}
            </button>
            <button className="btn border border-border bg-canvas hover:bg-border px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button className="btn border border-border bg-canvas hover:bg-border px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button 
              className="bg-primary text-white px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 ml-2"
              onClick={() => setIsOrderModalOpen(true)}
            >
              <Plus className="w-4 h-4" /> Order New Labs
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === 'All' ? 'bg-nav text-white' : 'bg-canvas text-text-secondary hover:bg-border'}`}
            >
              All
            </button>
            {LAB_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-nav text-white' : 'bg-canvas text-text-secondary hover:bg-border'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded-lg bg-canvas focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-canvas">
        {viewMode === 'cards' ? (
          <div className="max-w-6xl mx-auto space-y-6">
            {Object.keys(labsByCategory).length === 0 && (
              <div className="text-center py-12 text-text-muted">
                No lab results found matching your criteria.
              </div>
            )}
            {Object.entries(labsByCategory).map(([category, labs]) => {
              const isExpanded = expandedCategories[category];
              const abnormalCount = labs.filter(l => l.status !== 'normal').length;

              return (
                <div key={category} className="space-y-3">
                  <div 
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-text-muted group-hover:text-text-primary" /> : <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-text-primary" />}
                      <h2 className="text-lg font-semibold text-text-primary">{category}</h2>
                      <span className="text-sm text-text-muted bg-border px-2 py-0.5 rounded-full ml-2">{labs.length}</span>
                      {abnormalCount > 0 && (
                        <span className="text-sm text-danger-text bg-danger-bg px-2 py-0.5 rounded-full ml-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {abnormalCount} abnormal
                        </span>
                      )}
                    </div>
                    <div className="h-px flex-1 bg-border ml-4"></div>
                  </div>

                  {isExpanded && (
                    <div className="grid gap-4">
                      {labs.map(lab => {
                        const isPanelExpanded = expandedPanels[lab.id] !== false; // Default true
                        
                        return (
                          <div key={lab.id} className="card bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
                            <div 
                              className={`px-4 py-3 cursor-pointer flex items-center justify-between select-none ${lab.status === 'critical' ? 'bg-danger-bg/50 border-b border-danger/20' : lab.status === 'abnormal' ? 'bg-warning-bg/50 border-b border-warning/20' : 'border-b border-border hover:bg-canvas'}`}
                              onClick={() => togglePanel(lab.id)}
                            >
                              <div className="flex items-center gap-3">
                                {lab.status === 'normal' && <CheckCircle2 className="w-5 h-5 text-success" />}
                                {lab.status === 'abnormal' && <AlertTriangle className="w-5 h-5 text-warning" />}
                                {lab.status === 'critical' && <OctagonAlert className="w-5 h-5 text-danger" />}
                                
                                <div>
                                  <div className="font-semibold text-text-primary flex items-center gap-2">
                                    {lab.panelName}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-text-muted font-medium bg-canvas px-2 py-1 rounded border border-border">
                                  {new Date(lab.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {isPanelExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                              </div>
                            </div>

                            {isPanelExpanded && (
                              <div className="p-0 overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-canvas border-b border-border text-text-muted uppercase text-xs tracking-wider">
                                    <tr>
                                      <th className="px-4 py-2 font-medium w-1/3">Parameter Name</th>
                                      <th className="px-4 py-2 font-medium">Result</th>
                                      <th className="px-4 py-2 font-medium">Unit</th>
                                      <th className="px-4 py-2 font-medium">Reference Range</th>
                                      <th className="px-4 py-2 font-medium">Flag</th>
                                      <th className="px-4 py-2 font-medium text-right">Trend</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-border">
                                    {lab.parameters.map((param, idx) => {
                                      const isCrit = param.flag === 'Critical';
                                      const isAbnormal = param.flag === 'High' || param.flag === 'Low';
                                      
                                      return (
                                        <tr key={idx} className={`${isCrit ? 'bg-danger-bg/40' : isAbnormal ? 'bg-warning-bg/10' : 'bg-surface hover:bg-canvas'}`}>
                                          <td className={`px-4 py-2.5 font-medium ${isCrit ? 'text-danger-text' : 'text-text-primary'}`}>
                                            {param.name}
                                          </td>
                                          <td className="px-4 py-2.5">
                                            {renderValue(param)}
                                          </td>
                                          <td className="px-4 py-2.5 text-text-muted">{param.unit}</td>
                                          <td className="px-4 py-2.5 text-text-muted clinical-num">{param.referenceRange}</td>
                                          <td className="px-4 py-2.5">
                                            {renderFlag(param.flag)}
                                          </td>
                                          <td className="px-4 py-2.5 text-right flex justify-end items-center h-full">
                                            {renderSparkline(param.flag)}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-full mx-auto h-full flex flex-col bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-canvas sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 font-medium text-text-secondary border-b border-r border-border sticky left-0 bg-canvas z-20 w-64 min-w-[16rem]">
                      Parameter
                    </th>
                    <th className="px-4 py-3 font-medium text-text-secondary border-b border-r border-border w-32 shrink-0">
                      Ref Range
                    </th>
                    {flowsheetData.dates.map(date => (
                      <th key={date} className="px-4 py-3 font-medium text-text-secondary border-b border-border min-w-[120px]">
                        <div className="flex flex-col">
                          <span>{new Date(date).toLocaleDateString()}</span>
                          <span className="text-xs text-text-muted font-normal">{new Date(date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {flowsheetData.parameters.map((param, idx) => (
                    <tr key={idx} className="hover:bg-canvas transition-colors">
                      <td className="px-4 py-2.5 font-medium text-text-primary border-r border-border sticky left-0 bg-surface group-hover:bg-canvas z-10">
                        {param.name}
                      </td>
                      <td className="px-4 py-2.5 text-text-muted text-xs border-r border-border clinical-num">
                        {param.ref} {param.unit}
                      </td>
                      {flowsheetData.dates.map(date => {
                        const val = param.history[date];
                        return (
                          <td key={date} className="px-4 py-2.5 border-border">
                            {val ? (
                              <div className="flex flex-col gap-1">
                                {renderValue(val)}
                                {val.flag !== 'Normal' && <div>{renderFlag(val.flag)}</div>}
                              </div>
                            ) : (
                              <span className="text-text-muted">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {flowsheetData.parameters.length === 0 && (
                    <tr>
                      <td colSpan={flowsheetData.dates.length + 2} className="px-4 py-12 text-center text-text-muted">
                        No parameters to display in flowsheet for the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order New Labs Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-nav/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" /> Order Laboratory Tests
              </h2>
              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1 hover:bg-canvas rounded-lg text-text-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <h3 className="font-semibold text-text-primary mb-2">Available Panels</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {ORDERABLE_LABS.map(group => (
                      <div key={group.category} className="space-y-2">
                        <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">{group.category}</h4>
                        <div className="space-y-1">
                          {group.tests.map(test => (
                            <label key={test} className="flex items-center gap-2 text-sm text-text-primary hover:bg-canvas p-1 -ml-1 rounded cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                                checked={selectedTests.includes(test)}
                                onChange={() => handleOrderToggleTest(test)}
                              />
                              {test}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Order Details</h3>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Urgency</label>
                    <select 
                      className="w-full text-sm border border-border rounded-lg bg-surface px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={orderUrgency}
                      onChange={(e) => setOrderUrgency(e.target.value)}
                    >
                      <option value="Routine">Routine</option>
                      <option value="Urgent">Urgent</option>
                      <option value="STAT">STAT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Clinical Indication</label>
                    <textarea 
                      className="w-full text-sm border border-border rounded-lg bg-surface px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none h-24"
                      placeholder="Enter ICD-10 or clinical reason..."
                      value={orderIndication}
                      onChange={(e) => setOrderIndication(e.target.value)}
                    />
                  </div>

                  <div className="bg-canvas p-4 rounded-lg border border-border">
                    <div className="text-sm font-medium text-text-primary mb-1">Order Summary</div>
                    <div className="text-2xl font-bold text-primary clinical-num">{selectedTests.length}</div>
                    <div className="text-xs text-text-muted">Tests selected</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-canvas flex items-center justify-end gap-3 shrink-0">
              <button 
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-border transition-colors"
                onClick={() => setIsOrderModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedTests.length === 0}
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
