import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  Heart, Activity, Thermometer, Wind, Gauge, Scale, 
  TrendingUp, TrendingDown, Minus, AlertTriangle, 
  Plus, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Area, AreaChart, 
  Legend, RadialBarChart, RadialBar, ComposedChart, ReferenceArea
} from 'recharts';
import { format } from 'date-fns';

const mockTrend = [
  { month: 'Mar', sys: 148, dia: 92, hr: 82, weight: 75, temp: 37.0, spo2: 97 },
  { month: 'Apr', sys: 142, dia: 88, hr: 78, weight: 74, temp: 36.8, spo2: 97 },
  { month: 'May', sys: 138, dia: 85, hr: 76, weight: 73, temp: 37.1, spo2: 98 },
  { month: 'Jun', sys: 135, dia: 82, hr: 74, weight: 72, temp: 36.9, spo2: 98 },
  { month: 'Jul', sys: 130, dia: 80, hr: 72, weight: 71, temp: 37.0, spo2: 97 },
  { month: 'Aug', sys: 128, dia: 78, hr: 70, weight: 70, temp: 36.8, spo2: 98 },
];

const VitalCard = ({ 
  icon: Icon, 
  iconBg, 
  value, 
  label, 
  status, 
  badgeClass, 
  delta, 
  unit 
}: any) => (
  <div className="card p-4 flex flex-col justify-between h-full bg-surface">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg ${iconBg}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}>
        {status}
      </div>
    </div>
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold clinical-num text-text-primary">{value}</span>
        {unit && <span className="text-sm font-medium text-text-muted">{unit}</span>}
      </div>
      <div className="text-sm text-text-muted mt-1 font-medium">{label}</div>
    </div>
    <div className="mt-4 flex items-center text-xs font-medium text-text-muted">
      {delta > 0 ? (
        <ArrowUpRight className="w-4 h-4 mr-1 text-danger" />
      ) : delta < 0 ? (
        <ArrowDownRight className="w-4 h-4 mr-1 text-success" />
      ) : (
        <Minus className="w-4 h-4 mr-1" />
      )}
      <span>
        {delta !== 0 ? Math.abs(delta) : 'No change'} from last
      </span>
    </div>
  </div>
);

export const VitalsDashboard = () => {
  const patient = useAppStore(state => state.patient);

  if (!patient) return null;

  // Extract / parse vitals
  const [sysStr, diaStr] = (patient.bp || '120/80').split('/');
  const sys = parseInt(sysStr, 10) || 120;
  const dia = parseInt(diaStr, 10) || 80;
  const isBPHigh = sys > 140 || dia > 90;
  const bpStatus = isBPHigh ? 'High' : 'Normal';
  const bpBadge = isBPHigh ? 'bg-danger-bg text-danger-text' : 'bg-success-bg text-success-text';
  
  const hr = parseInt(patient.pulse || '75', 10);
  const isHRLow = hr < 60;
  const isHRHigh = hr > 100;
  const hrStatus = isHRLow ? 'Low' : isHRHigh ? 'High' : 'Normal';
  const hrBadge = hrStatus !== 'Normal' ? 'bg-warning-bg text-warning-text' : 'bg-success-bg text-success-text';

  const spo2 = parseInt(patient.spo2 || '98', 10);
  const isSpo2Low = spo2 < 95;
  const spo2Status = isSpo2Low ? 'Low' : 'Normal';
  const spo2Badge = isSpo2Low ? 'bg-danger-bg text-danger-text' : 'bg-success-bg text-success-text';

  const temp = parseFloat(patient.temperature || '37.0');
  const isTempHigh = temp > 37.5;
  const tempStatus = isTempHigh ? 'High' : 'Normal';
  const tempBadge = isTempHigh ? 'bg-warning-bg text-warning-text' : 'bg-success-bg text-success-text';

  const rr = parseInt(patient.respiratoryRate || '16', 10);
  const isRrLow = rr < 12;
  const isRrHigh = rr > 20;
  const rrStatus = isRrLow ? 'Low' : isRrHigh ? 'High' : 'Normal';
  const rrBadge = rrStatus !== 'Normal' ? 'bg-warning-bg text-warning-text' : 'bg-success-bg text-success-text';

  const pain = parseInt(patient.painScore || '0', 10);
  const painStatus = pain > 7 ? 'Severe' : pain > 3 ? 'Moderate' : 'Mild';
  const painBadge = pain > 7 ? 'bg-danger-bg text-danger-text' : pain > 3 ? 'bg-warning-bg text-warning-text' : 'bg-success-bg text-success-text';

  // NEWS2 calculation
  const rrScore = rr <= 8 || rr >= 25 ? 3 : rr >= 21 ? 2 : rr <= 11 ? 1 : 0;
  const spo2Score = spo2 <= 91 ? 3 : spo2 <= 93 ? 2 : spo2 <= 95 ? 1 : 0;
  const sysScore = sys <= 90 || sys >= 220 ? 3 : sys <= 100 ? 2 : sys <= 110 ? 1 : 0;
  const hrScore = hr <= 40 || hr >= 131 ? 3 : (hr <= 50 || hr >= 111) ? 2 : hr >= 91 ? 1 : 0;
  const tempScore = temp <= 35.0 ? 3 : (temp <= 36.0 || temp >= 39.1) ? 2 : temp >= 38.1 ? 1 : 0;
  
  const news2Total = rrScore + spo2Score + sysScore + hrScore + tempScore;
  const news2Risk = news2Total >= 7 ? 'High Risk' : news2Total >= 5 ? 'Medium Risk' : 'Low Risk';
  const news2Color = news2Total >= 7 ? '#DC2626' : news2Total >= 5 ? '#D97706' : '#16A34A';
  
  let news2Action = 'Routine monitoring every 12 hours';
  if (news2Total >= 7) news2Action = 'Emergency response. Consider ICU admission.';
  else if (news2Total >= 5) news2Action = 'Urgent ward assessment. Consider step-up care.';
  else if (news2Total >= 1) news2Action = 'Increase monitoring frequency to 4-6 hourly';

  // BMI calculation
  const weight = parseFloat(patient.weight || '70');
  const height = parseFloat(patient.height || '170');
  const bmi = weight / Math.pow(height / 100, 2);
  let bmiClass = 'Normal';
  let bmiColorClass = 'text-success-text bg-success-bg';
  if (bmi < 18.5) { bmiClass = 'Underweight'; bmiColorClass = 'text-warning-text bg-warning-bg'; }
  else if (bmi >= 30) { bmiClass = 'Obese'; bmiColorClass = 'text-danger-text bg-danger-bg'; }
  else if (bmi >= 25) { bmiClass = 'Overweight'; bmiColorClass = 'text-warning-text bg-warning-bg'; }

  const news2Data = [{ name: 'Score', value: news2Total, fill: news2Color }];
  // For standard radial bar (0 to 20 scale)
  const maxNews2Score = 20;
  const scorePercent = Math.min((news2Total / maxNews2Score) * 100, 100);

  return (
    <div className="h-full overflow-y-auto p-6 bg-canvas flex flex-col gap-6">
      
      {/* Row 1: Vital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <VitalCard 
          icon={Heart} iconBg="bg-danger" 
          value={`${sys}/${dia}`} label="Blood Pressure" unit="mmHg"
          status={bpStatus} badgeClass={bpBadge} delta={-2}
        />
        <VitalCard 
          icon={Activity} iconBg="bg-primary" 
          value={hr} label="Heart Rate" unit="bpm"
          status={hrStatus} badgeClass={hrBadge} delta={4}
        />
        <VitalCard 
          icon={Wind} iconBg="bg-info" 
          value={spo2} label="SpO₂" unit="%"
          status={spo2Status} badgeClass={spo2Badge} delta={0}
        />
        <VitalCard 
          icon={Thermometer} iconBg="bg-warning" 
          value={temp.toFixed(1)} label="Temperature" unit="°C"
          status={tempStatus} badgeClass={tempBadge} delta={-0.2}
        />
        <VitalCard 
          icon={Wind} iconBg="bg-purple-600" 
          value={rr} label="Respiratory Rate" unit="rpm"
          status={rrStatus} badgeClass={rrBadge} delta={-1}
        />
        <VitalCard 
          icon={Gauge} iconBg="bg-amber-500" 
          value={pain} label="Pain Score" unit="/10"
          status={painStatus} badgeClass={painBadge} delta={0}
        />
      </div>

      {/* Row 2: NEWS2 & BMI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="card p-6 lg:col-span-8 flex flex-col md:flex-row gap-8 items-center bg-surface">
          {/* Radial chart for NEWS2 */}
          <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" cy="50%" 
                innerRadius="75%" outerRadius="100%" 
                barSize={12} 
                data={news2Data} 
                startAngle={220} endAngle={-40}
              >
                {/* Background track hack using a full scale bar in gray */}
                <RadialBar 
                  data={[{ value: maxNews2Score }]} 
                  dataKey="value" 
                  fill="#E2E8F0" 
                  cornerRadius={10} 
                  isAnimationActive={false}
                />
                <RadialBar 
                  dataKey="value" 
                  cornerRadius={10} 
                  clockWise 
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold clinical-num text-text-primary">{news2Total}</span>
              <span className="text-sm text-text-muted font-medium">NEWS2</span>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  NEWS2 Risk Assessment
                  {news2Total >= 5 && <AlertTriangle className="w-5 h-5 text-warning" style={{ color: news2Color }}/>}
                </h3>
                <p className="text-sm font-medium mt-1" style={{ color: news2Color }}>{news2Risk} - {news2Action}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 mt-4 text-center">
              <div className="bg-canvas p-2 rounded-lg border border-border">
                <div className="text-xs text-text-muted mb-1">Resp</div>
                <div className="font-bold text-text-primary clinical-num">{rrScore}</div>
              </div>
              <div className="bg-canvas p-2 rounded-lg border border-border">
                <div className="text-xs text-text-muted mb-1">SpO₂</div>
                <div className="font-bold text-text-primary clinical-num">{spo2Score}</div>
              </div>
              <div className="bg-canvas p-2 rounded-lg border border-border">
                <div className="text-xs text-text-muted mb-1">Sys BP</div>
                <div className="font-bold text-text-primary clinical-num">{sysScore}</div>
              </div>
              <div className="bg-canvas p-2 rounded-lg border border-border">
                <div className="text-xs text-text-muted mb-1">Heart</div>
                <div className="font-bold text-text-primary clinical-num">{hrScore}</div>
              </div>
              <div className="bg-canvas p-2 rounded-lg border border-border">
                <div className="text-xs text-text-muted mb-1">Temp</div>
                <div className="font-bold text-text-primary clinical-num">{tempScore}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 lg:col-span-4 bg-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-text-primary font-bold">
                <Scale className="w-5 h-5" />
                <span>BMI</span>
              </div>
              <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${bmiColorClass}`}>
                {bmiClass}
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold clinical-num text-text-primary">{bmi.toFixed(1)}</span>
              <span className="text-sm font-medium text-text-muted">kg/m²</span>
            </div>
          </div>
          
          <div className="mt-6">
            {/* Visual Bar */}
            <div className="h-2 w-full flex rounded-full overflow-hidden mb-2">
              <div className="bg-blue-400" style={{ width: '25%' }}></div>
              <div className="bg-green-500" style={{ width: '35%' }}></div>
              <div className="bg-yellow-500" style={{ width: '20%' }}></div>
              <div className="bg-red-500" style={{ width: '20%' }}></div>
            </div>
            
            <div className="flex justify-between mt-4">
              <div>
                <div className="text-xs text-text-muted">Weight</div>
                <div className="font-semibold text-text-primary">{weight} kg</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted">Height</div>
                <div className="font-semibold text-text-primary">{height} cm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-4 h-[350px] flex flex-col">
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">Blood Pressure & Heart Rate (6 Months)</h4>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis yAxisId="left" domain={[60, 200]} orientation="left" stroke="#DC2626" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" domain={[40, 140]} orientation="right" stroke="#086E64" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ fontSize: 12, fontWeight: 500 }}
                  labelStyle={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                
                {/* Normal Reference Band for Systolic (90-140) */}
                <ReferenceArea yAxisId="left" y1={90} y2={140} fill="#16A34A" fillOpacity={0.05} />
                
                <Line yAxisId="left" type="monotone" dataKey="sys" stroke="#DC2626" strokeWidth={2.5} name="Systolic (mmHg)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="left" type="monotone" dataKey="dia" stroke="#F87171" strokeWidth={2.5} name="Diastolic (mmHg)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="hr" stroke="#086E64" strokeWidth={2.5} name="Heart Rate (bpm)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-4 h-[350px] flex flex-col">
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">Weight & Temperature Trend</h4>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis yAxisId="left" domain={['auto', 'auto']} orientation="left" stroke="#334155" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" domain={[35, 40]} orientation="right" stroke="#D97706" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: 12, fontWeight: 500 }}
                  labelStyle={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                
                <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#334155" strokeWidth={2.5} name="Weight (kg)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#D97706" strokeWidth={2.5} name="Temperature (°C)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Vitals Entry Form */}
      <div className="card p-6 bg-surface mt-2">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wide">Record New Vitals</h4>
          <div className="text-xs text-text-muted font-medium">
            Time: {format(new Date(), "dd MMM yyyy, HH:mm")}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">BP (mmHg)</label>
            <input type="text" placeholder="120/80" className="w-full px-3 py-2 bg-canvas border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">HR (bpm)</label>
            <input type="number" placeholder="75" className="w-full px-3 py-2 bg-canvas border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">SpO₂ (%)</label>
            <input type="number" placeholder="98" className="w-full px-3 py-2 bg-canvas border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Temp (°C)</label>
            <input type="number" step="0.1" placeholder="37.0" className="w-full px-3 py-2 bg-canvas border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Resp (rpm)</label>
            <input type="number" placeholder="16" className="w-full px-3 py-2 bg-canvas border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Pain (0-10)</label>
            <input type="number" min="0" max="10" placeholder="0" className="w-full px-3 py-2 bg-canvas border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
              <Plus className="w-4 h-4" />
              Record
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
