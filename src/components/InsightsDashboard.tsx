import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LayoutDashboard, Users, AlertCircle, Activity, Clock } from 'lucide-react';

export const InsightsDashboard = () => {
  const savedCases = useAppStore(state => state.savedCases);

  const stats = useMemo(() => {
    const totalCases = savedCases.length;
    const now = new Date().getTime();
    const day = 24 * 60 * 60 * 1000;
    
    let last7Days = 0;
    let last30Days = 0;
    let redFlagCases = 0;

    const complaintsCount: Record<string, number> = {};
    const diagnosesCount: Record<string, number> = {};
    const genderCount: Record<string, number> = {};
    const ageGroupsCount: Record<string, number> = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0
    };

    savedCases.forEach(c => {
      // Time stats
      if (c.date) {
        const caseTime = new Date(c.date).getTime();
        if (now - caseTime <= 7 * day) last7Days++;
        if (now - caseTime <= 30 * day) last30Days++;
      }

      // Red-Flag Rate: Check for STAT orders
      if (c.orders?.some(o => o.urgency === 'STAT')) {
        redFlagCases++;
      }

      // Complaints
      if (c.soapNote?.subjective?.chiefComplaint) {
        const complaint = c.soapNote.subjective.chiefComplaint.trim() || 'Unknown';
        complaintsCount[complaint] = (complaintsCount[complaint] || 0) + 1;
      }

      // Diagnoses
      if (c.soapNote?.assessment?.diagnoses?.length) {
        c.soapNote.assessment.diagnoses.forEach(d => {
          diagnosesCount[d] = (diagnosesCount[d] || 0) + 1;
        });
      } else if (c.prescription?.diagnosis?.length) {
        c.prescription.diagnosis.forEach(d => {
          diagnosesCount[d] = (diagnosesCount[d] || 0) + 1;
        });
      }

      // Gender
      if (c.patient?.gender) {
        const gender = c.patient.gender;
        genderCount[gender] = (genderCount[gender] || 0) + 1;
      }

      // Age
      if (c.patient?.age) {
        const age = parseInt(c.patient.age, 10);
        if (!isNaN(age)) {
          if (age <= 18) ageGroupsCount['0-18']++;
          else if (age <= 35) ageGroupsCount['19-35']++;
          else if (age <= 50) ageGroupsCount['36-50']++;
          else if (age <= 65) ageGroupsCount['51-65']++;
          else ageGroupsCount['65+']++;
        }
      }
    });

    const redFlagRate = totalCases > 0 ? ((redFlagCases / totalCases) * 100).toFixed(1) : '0.0';

    const sortObject = (obj: Record<string, number>, limit: number = 5) => {
      return Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, count]) => ({ name, count }));
    };

    return {
      totalCases,
      last7Days,
      last30Days,
      redFlagRate,
      topComplaints: sortObject(complaintsCount),
      topDiagnoses: sortObject(diagnosesCount),
      genderSplit: sortObject(genderCount, 10),
      ageDistribution: Object.entries(ageGroupsCount)
        .filter(([, count]) => count > 0)
        .map(([name, count]) => ({ name, count }))
    };
  }, [savedCases]);

  const BarChart = ({ title, data, colorClass }: { title: string, data: { name: string, count: number }[], colorClass: string }) => {
    const maxVal = Math.max(...data.map(d => d.count), 1);
    return (
      <div className="card p-6 bg-surface flex flex-col h-full">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">{title}</h3>
        {data.length === 0 ? (
          <div className="text-sm text-text-muted italic flex-1 flex items-center justify-center">No data available</div>
        ) : (
          <div className="flex-1 space-y-4">
            {data.map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-text-secondary">
                  <span className="truncate pr-2 font-medium">{item.name}</span>
                  <span className="font-bold">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-canvas rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
                    style={{ width: `${(item.count / maxVal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-canvas flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Insights Dashboard</h1>
          <p className="text-sm text-text-muted">Global analytics and clinic performance metrics</p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-surface flex items-center gap-4 border-l-4 border-primary">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Total Cases</p>
            <p className="text-2xl font-bold text-text-primary clinical-num">{stats.totalCases}</p>
          </div>
        </div>

        <div className="card p-5 bg-surface flex items-center gap-4 border-l-4 border-info">
          <div className="p-3 bg-info/10 rounded-full">
            <Clock className="w-6 h-6 text-info" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Last 7 Days</p>
            <p className="text-2xl font-bold text-text-primary clinical-num">{stats.last7Days}</p>
          </div>
        </div>

        <div className="card p-5 bg-surface flex items-center gap-4 border-l-4 border-success">
          <div className="p-3 bg-success-bg rounded-full">
            <Activity className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Last 30 Days</p>
            <p className="text-2xl font-bold text-text-primary clinical-num">{stats.last30Days}</p>
          </div>
        </div>

        <div className="card p-5 bg-surface flex items-center gap-4 border-l-4 border-danger">
          <div className="p-3 bg-danger-bg rounded-full">
            <AlertCircle className="w-6 h-6 text-danger" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Red-Flag Rate</p>
            <p className="text-2xl font-bold text-text-primary clinical-num">{stats.redFlagRate}%</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-2">
          <BarChart 
            title="Top Presenting Complaints" 
            data={stats.topComplaints} 
            colorClass="bg-blue-500" 
          />
        </div>
        <div className="xl:col-span-2">
          <BarChart 
            title="Most Common Diagnoses" 
            data={stats.topDiagnoses} 
            colorClass="bg-purple-500" 
          />
        </div>
        <div className="xl:col-span-2">
          <BarChart 
            title="Gender Split" 
            data={stats.genderSplit} 
            colorClass="bg-teal-500" 
          />
        </div>
        <div className="xl:col-span-2">
          <BarChart 
            title="Age Distribution" 
            data={stats.ageDistribution} 
            colorClass="bg-orange-500" 
          />
        </div>
      </div>

    </div>
  );
};
