import React, { useState, useMemo, useRef } from 'react';
import { MOCK_LAB_RESULTS, LAB_CATEGORIES, ORDERABLE_LABS } from '../data/labPanels';
import { useAppStore } from '../store/useAppStore';
import type { LabResult, LabParameter, LabFlag } from '../types';
import {
  FlaskConical, Search, Filter, ChevronDown, ChevronUp, ChevronRight,
  AlertTriangle, CheckCircle2, OctagonAlert, TrendingUp, TrendingDown,
  Minus, FileText, Plus, Download, Eye, Printer, X, ArrowUpRight, ArrowDownRight,
  UploadCloud, LineChart, Sparkles, BellRing, RefreshCw
} from 'lucide-react';

export const LabResultsViewer = () => {
  const [labsList, setLabsList] = useState<LabResult[]>(MOCK_LAB_RESULTS);
  const [viewMode, setViewMode] = useState<'cards' | 'flowsheet' | 'graphs'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    LAB_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>({});
  
  // OCR & Upload State
  const [isExtracting, setIsExtracting] = useState(false);
  const [ocrToast, setOcrToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Critical Panic Alert State
  const [criticalAlertDismissed, setCriticalAlertDismissed] = useState(false);

  // Graph State
  const [selectedGraphParam, setSelectedGraphParam] = useState<string>('Platelet Count');

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

  // Critical Panic Findings
  const criticalFindings = useMemo(() => {
    const list: Array<{ panel: string; date: string; param: LabParameter; clinicalRisk: string }> = [];
    labsList.forEach(lab => {
      lab.parameters.forEach(p => {
        const val = parseFloat(p.value);
        const name = p.name.toLowerCase();
        let risk = '';
        if (p.flag === 'Critical') {
          if (name.includes('potassium')) risk = 'Severe Arrhythmia / Ventricular Fibrillation Risk';
          else if (name.includes('platelet')) risk = 'High Risk of Spontaneous Intracranial/Internal Bleeding';
          else if (name.includes('troponin')) risk = 'Active Myocardial Necrosis / Acute Coronary Syndrome';
          else risk = 'Immediate Critical Physiological Derangement';
          list.push({ panel: lab.panelName, date: lab.date, param: p, clinicalRisk: risk });
        } else if (name.includes('potassium') && val > 6.0) {
          list.push({ panel: lab.panelName, date: lab.date, param: p, clinicalRisk: 'Critical Hyperkalemia' });
        } else if (name.includes('platelet') && val < 50) {
          list.push({ panel: lab.panelName, date: lab.date, param: p, clinicalRisk: 'Critical Severe Thrombocytopenia' });
        }
      });
    });
    return list;
  }, [labsList]);

  // Handle Document Upload (PDF / JPG / PNG) & Simulated OCR Extraction
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setTimeout(() => {
      const nowIso = new Date().toISOString();
      const newPanel: LabResult = {
        id: `ocr-${Date.now()}`,
        panelName: `Document OCR: ${file.name.replace(/\.[^/.]+$/, "")}`,
        date: nowIso,
        category: 'Hematology',
        status: 'critical',
        parameters: [
          { name: 'Hemoglobin', value: '10.2', unit: 'g/dL', referenceRange: '13.5 - 17.5', flag: 'Low' },
          { name: 'WBC Count', value: '14.8', unit: 'x10^3/uL', referenceRange: '4.0 - 11.0', flag: 'High' },
          { name: 'Platelet Count', value: '42', unit: 'x10^3/uL', referenceRange: '150 - 450', flag: 'Critical' },
          { name: 'Serum Potassium (K+)', value: '6.3', unit: 'mEq/L', referenceRange: '3.5 - 5.0', flag: 'Critical' },
          { name: 'Serum Creatinine', value: '2.1', unit: 'mg/dL', referenceRange: '0.7 - 1.3', flag: 'High' },
          { name: 'Troponin-I Quantitative', value: '0.88', unit: 'ng/mL', referenceRange: '< 0.04', flag: 'Critical' }
        ]
      };

      setLabsList(prev => [newPanel, ...prev]);
      setIsExtracting(false);
      setCriticalAlertDismissed(false);
      setOcrToast(`Successfully extracted 6 clinical parameters from ${file.name} via Clinical OCR.`);
      setTimeout(() => setOcrToast(null), 4500);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1200);
  };

  const filteredLabs = useMemo(() => {
    return labsList.filter(lab => {
      const matchesCategory = activeCategory === 'All' || lab.category === activeCategory;
      const matchesSearch = lab.panelName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lab.parameters.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [labsList, activeCategory, searchQuery]);

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

  // Graph Data Calculation for Selected Parameter
  const graphData = useMemo(() => {
    const points: Array<{ date: string; value: number; flag: string; unit: string; refRange: string }> = [];
    
    labsList.forEach(lab => {
      const found = lab.parameters.find(p => p.name.toLowerCase().includes(selectedGraphParam.toLowerCase()));
      if (found) {
        points.push({
          date: lab.date,
          value: parseFloat(found.value) || 0,
          flag: found.flag,
          unit: found.unit,
          refRange: found.referenceRange
        });
      }
    });

    // Provide baseline timeline points if only 1 point exists
    if (points.length === 1) {
      const p = points[0];
      const d1 = new Date(new Date(p.date).getTime() - 86400000 * 3).toISOString();
      const d2 = new Date(new Date(p.date).getTime() - 86400000 * 1).toISOString();
      points.unshift({
        date: d1,
        value: p.value * 0.92,
        flag: 'Normal',
        unit: p.unit,
        refRange: p.refRange
      });
      points.unshift({
        date: d2,
        value: p.value * 1.05,
        flag: p.flag,
        unit: p.unit,
        refRange: p.refRange
      });
    }

    points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let refLow = 0;
    let refHigh = 100;
    if (points.length > 0 && points[0].refRange) {
      const match = points[0].refRange.match(/([\d.]+)\s*-\s*([\d.]+)/);
      if (match) {
        refLow = parseFloat(match[1]);
        refHigh = parseFloat(match[2]);
      }
    }

    return { points, refLow, refHigh };
  }, [labsList, selectedGraphParam]);

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
        <circle cx={20} cy={pts.split(' ')[4].split(',')[1]} r="2" fill={color} />
      </svg>
    );
  };

  const trendableParams = [
    { id: 'Platelet Count', label: 'Platelet Count' },
    { id: 'Serum Potassium (K+)', label: 'Potassium (K+)' },
    { id: 'Hemoglobin', label: 'Hemoglobin (Hb)' },
    { id: 'WBC Count', label: 'WBC Count' },
    { id: 'Serum Creatinine', label: 'Serum Creatinine' },
    { id: 'Troponin', label: 'Troponin-I' },
    { id: 'ESR', label: 'ESR' },
    { id: 'Blood Glucose', label: 'Blood Glucose' }
  ];

  const renderTrendGraphs = () => {
    const { points, refLow, refHigh } = graphData;
    const allVals = [...points.map(p => p.value), refLow, refHigh].filter(v => typeof v === 'number' && !isNaN(v) && v > 0);
    const minVal = allVals.length > 0 ? Math.min(...allVals) : 0;
    const maxVal = allVals.length > 0 ? Math.max(...allVals) : 100;
    const yMin = Math.max(0, minVal * 0.8);
    const yMax = maxVal * 1.2 || 10;
    const range = yMax - yMin || 1;

    const svgWidth = 760;
    const svgHeight = 280;
    const padLeft = 70;
    const padRight = 50;
    const padTop = 35;
    const padBottom = 45;
    const plotWidth = svgWidth - padLeft - padRight;
    const plotHeight = svgHeight - padTop - padBottom;

    const getY = (val: number) => padTop + plotHeight - ((val - yMin) / range) * plotHeight;
    const getX = (idx: number) => {
      if (points.length <= 1) return padLeft + plotWidth / 2;
      return padLeft + (idx / (points.length - 1)) * plotWidth;
    };

    const yRefLow = getY(refLow);
    const yRefHigh = getY(refHigh);
    const bandY = Math.min(yRefLow, yRefHigh);
    const bandHeight = Math.max(10, Math.abs(yRefLow - yRefHigh));

    const polylinePts = points.map((p, i) => `${getX(i)},${getY(p.value)}`).join(' ');

    const latestPoint = points[points.length - 1];
    const initialPoint = points[0];
    const delta = initialPoint && latestPoint && initialPoint.value > 0
      ? (((latestPoint.value - initialPoint.value) / initialPoint.value) * 100).toFixed(1)
      : '0.0';

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Parameter Selector Strip */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">Select Laboratory Biomarker to Trend</h3>
            </div>
            <span className="text-xs text-text-muted">Longitudinal trend curve with normal reference interval</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {trendableParams.map(param => {
              const isSelected = selectedGraphParam.toLowerCase() === param.id.toLowerCase() ||
                (param.id === 'Troponin' && selectedGraphParam.toLowerCase().includes('troponin')) ||
                (param.id === 'Hemoglobin' && (selectedGraphParam.toLowerCase().includes('hemo') || selectedGraphParam.toLowerCase() === 'hb'));
              return (
                <button
                  key={param.id}
                  onClick={() => setSelectedGraphParam(param.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'bg-canvas text-text-secondary hover:bg-border/60 hover:text-text-primary'
                  }`}
                >
                  <span>{param.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Graph Display Card */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-text-primary">{selectedGraphParam} Trend Trajectory</h2>
                {latestPoint && renderFlag(latestPoint.flag)}
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Clinical Reference Range: <strong className="text-emerald-700">{refLow} - {refHigh} {points[0]?.unit}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-text-muted">
                <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-400"></span>
                <span>Normal Band ({refLow} - {refHigh})</span>
              </div>
              <div className="flex items-center gap-1.5 text-text-muted">
                <span className="w-3 h-1 bg-primary rounded-full"></span>
                <span>Recorded Trajectory</span>
              </div>
            </div>
          </div>

          {points.length === 0 ? (
            <div className="py-16 text-center text-text-muted text-sm">
              No historical data points available for {selectedGraphParam}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[650px]">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
                  {/* Grid Lines */}
                  <line x1={padLeft} y1={padTop} x2={padLeft + plotWidth} y2={padTop} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1={padLeft} y1={padTop + plotHeight / 2} x2={padLeft + plotWidth} y2={padTop + plotHeight / 2} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1={padLeft} y1={padTop + plotHeight} x2={padLeft + plotWidth} y2={padTop + plotHeight} stroke="#cbd5e1" strokeWidth="1.5" />

                  {/* Normal Reference Band */}
                  <rect
                    x={padLeft}
                    y={bandY}
                    width={plotWidth}
                    height={bandHeight}
                    fill="#10B981"
                    fillOpacity="0.09"
                    stroke="#10B981"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text x={padLeft + plotWidth - 6} y={Math.max(padTop + 12, bandY - 4)} textAnchor="end" className="text-[10px] font-bold fill-emerald-700">
                    Ref Upper ({refHigh})
                  </text>
                  <text x={padLeft + plotWidth - 6} y={Math.min(padTop + plotHeight - 4, bandY + bandHeight + 12)} textAnchor="end" className="text-[10px] font-bold fill-emerald-700">
                    Ref Lower ({refLow})
                  </text>

                  {/* Polyline */}
                  {points.length > 1 && (
                    <polyline
                      points={polylinePts}
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Data Points */}
                  {points.map((p, idx) => {
                    const cx = getX(idx);
                    const cy = getY(p.value);
                    const isCrit = p.flag === 'Critical';
                    const isAbn = p.flag === 'High' || p.flag === 'Low';
                    const dotColor = isCrit ? '#DC2626' : isAbn ? '#D97706' : '#10B981';

                    return (
                      <g key={idx} className="cursor-pointer group">
                        {/* Glow for critical */}
                        {isCrit && (
                          <circle cx={cx} cy={cy} r="12" fill="#DC2626" fillOpacity="0.2" className="animate-ping" />
                        )}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="6"
                          fill={dotColor}
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          className="transition-transform group-hover:scale-125"
                        />
                        {/* Value Text Above Point */}
                        <text
                          x={cx}
                          y={cy - 12}
                          textAnchor="middle"
                          className={`text-[12px] font-black ${isCrit ? 'fill-red-600' : isAbn ? 'fill-amber-600' : 'fill-slate-800'}`}
                        >
                          {p.value} {p.unit}
                        </text>
                        {/* Date Label on X-Axis */}
                        <text
                          x={cx}
                          y={padTop + plotHeight + 20}
                          textAnchor="middle"
                          className="text-[11px] font-medium fill-slate-500"
                        >
                          {new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </text>
                        <text
                          x={cx}
                          y={padTop + plotHeight + 33}
                          textAnchor="middle"
                          className="text-[9px] fill-slate-400"
                        >
                          {new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          )}

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div className="bg-canvas border border-border rounded-xl p-3.5">
              <span className="text-xs text-text-muted font-medium">Current / Latest Result</span>
              <div className="text-xl font-bold text-text-primary clinical-num mt-1 flex items-baseline gap-1.5">
                <span>{latestPoint ? latestPoint.value : '-'}</span>
                <span className="text-xs text-text-muted font-normal">{latestPoint?.unit}</span>
              </div>
              <div className="mt-1">
                {latestPoint && renderFlag(latestPoint.flag)}
              </div>
            </div>

            <div className="bg-canvas border border-border rounded-xl p-3.5">
              <span className="text-xs text-text-muted font-medium">Baseline Reading</span>
              <div className="text-xl font-bold text-text-primary clinical-num mt-1 flex items-baseline gap-1.5">
                <span>{initialPoint ? initialPoint.value : '-'}</span>
                <span className="text-xs text-text-muted font-normal">{initialPoint?.unit}</span>
              </div>
              <span className="text-[11px] text-text-muted mt-1 block">
                {initialPoint ? new Date(initialPoint.date).toLocaleDateString() : '-'}
              </span>
            </div>

            <div className="bg-canvas border border-border rounded-xl p-3.5">
              <span className="text-xs text-text-muted font-medium">Net Delta Variance</span>
              <div className={`text-xl font-bold clinical-num mt-1 flex items-center gap-1 ${
                parseFloat(delta) > 0 ? 'text-amber-600' : parseFloat(delta) < 0 ? 'text-blue-600' : 'text-text-primary'
              }`}>
                {parseFloat(delta) > 0 ? <TrendingUp className="w-5 h-5" /> : parseFloat(delta) < 0 ? <TrendingDown className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                <span>{parseFloat(delta) > 0 ? `+${delta}%` : `${delta}%`}</span>
              </div>
              <span className="text-[11px] text-text-muted mt-1 block">Shift vs baseline</span>
            </div>

            <div className="bg-canvas border border-border rounded-xl p-3.5">
              <span className="text-xs text-text-muted font-medium">Normal Interval</span>
              <div className="text-base font-bold text-emerald-700 clinical-num mt-1">
                {refLow} – {refHigh} <span className="text-xs font-normal text-text-muted">{points[0]?.unit}</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Target Homeostatic Range
              </span>
            </div>
          </div>
        </div>
      </div>
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
            {/* View Mode Switcher */}
            <div className="flex items-center bg-canvas border border-border rounded-lg p-0.5">
              <button
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === 'cards' ? 'bg-white shadow-xs text-primary font-bold' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setViewMode('cards')}
              >
                <FileText className="w-3.5 h-3.5" /> Cards
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === 'flowsheet' ? 'bg-white shadow-xs text-primary font-bold' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setViewMode('flowsheet')}
              >
                <Filter className="w-3.5 h-3.5" /> Flowsheet
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === 'graphs' ? 'bg-white shadow-xs text-primary font-bold' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setViewMode('graphs')}
              >
                <LineChart className="w-3.5 h-3.5" /> Trend Graphs
              </button>
            </div>

            {/* Document Upload / OCR Button */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".pdf,.jpg,.jpeg,.png" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtracting}
              className="border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              title="Upload lab report (PDF, JPG, PNG) to extract clinical values automatically"
            >
              {isExtracting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-primary" />
                  <span>Upload Report (PDF/JPG)</span>
                </>
              )}
            </button>

            <button onClick={() => window.print()} className="btn border border-border bg-canvas hover:bg-border px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={() => window.print()} className="btn border border-border bg-canvas hover:bg-border px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button 
              className="bg-primary text-white px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 ml-1"
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
        {/* OCR Success Toast */}
        {ocrToast && (
          <div className="max-w-6xl mx-auto mb-4 px-4 py-2.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 text-emerald-800 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{ocrToast}</span>
            </div>
            <button onClick={() => setOcrToast(null)} className="text-emerald-600 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Critical Panic Value Alert Banner */}
        {criticalFindings.length > 0 && !criticalAlertDismissed && (
          <div className="max-w-6xl mx-auto mb-6 bg-red-50 border-2 border-red-500 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-600 text-white rounded-lg shrink-0 mt-0.5 shadow-xs">
                  <OctagonAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-red-900">
                      CRITICAL PANIC VALUES DETECTED ({criticalFindings.length})
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                      STAT CLINICAL ATTENTION
                    </span>
                  </div>
                  <p className="text-xs text-red-700 mt-0.5">
                    Critical physiological breach detected across active patient laboratory findings:
                  </p>
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {criticalFindings.map((f, i) => (
                      <div key={i} className="bg-white border border-red-300 rounded-lg p-2.5 flex flex-col justify-between shadow-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-xs text-slate-800 truncate">{f.param.name}</span>
                          <span className="text-xs font-black text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                            {f.param.value} {f.param.unit}
                          </span>
                        </div>
                        <div className="text-[11px] text-red-700 font-medium mt-1">
                          ⚠️ {f.clinicalRisk}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Ref: {f.param.referenceRange} • {new Date(f.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCriticalAlertDismissed(true)}
                className="text-xs font-semibold px-3 py-1.5 bg-white border border-red-300 text-red-700 hover:bg-red-100 rounded-lg shrink-0 transition-colors"
              >
                Acknowledge Alert
              </button>
            </div>
          </div>
        )}

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
        ) : viewMode === 'flowsheet' ? (
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
        ) : (
          renderTrendGraphs()
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
