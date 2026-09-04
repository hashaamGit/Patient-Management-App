import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Heart, Scale } from 'lucide-react';

const mockVitalsData = [
  { date: 'Mar', sys: 135, dia: 85, hr: 78, weight: 72 },
  { date: 'Apr', sys: 130, dia: 82, hr: 75, weight: 71.5 },
  { date: 'May', sys: 128, dia: 80, hr: 74, weight: 71 },
  { date: 'Jun', sys: 125, dia: 78, hr: 72, weight: 70 },
  { date: 'Jul', sys: 122, dia: 79, hr: 70, weight: 69.5 },
  { date: 'Aug', sys: 120, dia: 80, hr: 72, weight: 70 },
];

export const VitalsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-slate mb-1">Overview & Trends</h2>
        <p className="text-slate/60 text-sm">Monitor historical patient vitals and health metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Summary Cards */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate/5 flex items-center">
          <div className="bg-danger/10 p-3 rounded-full mr-4">
            <Heart className="w-6 h-6 text-danger" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate/50 uppercase tracking-wide">Latest BP</p>
            <p className="text-2xl font-bold text-slate">120/80 <span className="text-sm font-normal text-slate/40">mmHg</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate/5 flex items-center">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate/50 uppercase tracking-wide">Latest HR</p>
            <p className="text-2xl font-bold text-slate">72 <span className="text-sm font-normal text-slate/40">bpm</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate/5 flex items-center">
          <div className="bg-slate/10 p-3 rounded-full mr-4">
            <Scale className="w-6 h-6 text-slate" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate/50 uppercase tracking-wide">Weight</p>
            <p className="text-2xl font-bold text-slate">70 <span className="text-sm font-normal text-slate/40">kg</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BP & HR Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate/5">
          <h3 className="text-lg font-bold text-slate mb-6">Blood Pressure & Heart Rate (6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockVitalsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[60, 160]} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[50, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                <Line yAxisId="left" type="monotone" name="Systolic (mmHg)" dataKey="sys" stroke="#ef4444" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line yAxisId="left" type="monotone" name="Diastolic (mmHg)" dataKey="dia" stroke="#f87171" strokeWidth={3} />
                <Line yAxisId="right" type="monotone" name="Heart Rate (bpm)" dataKey="hr" stroke="#0ea5e9" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate/5">
          <h3 className="text-lg font-bold text-slate mb-6">Weight Trend (6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockVitalsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                <Line type="monotone" name="Weight (kg)" dataKey="weight" stroke="#334155" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
