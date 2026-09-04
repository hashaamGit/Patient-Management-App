import { FlaskConical, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

const mockLabs = [
  { id: 1, date: '2023-10-15', test: 'Complete Blood Count (CBC)', status: 'abnormal', results: [
    { parameter: 'Hemoglobin (Hb)', value: '9.2', unit: 'g/dL', ref: '12.0 - 15.5', flag: 'Low' },
    { parameter: 'MCV', value: '75', unit: 'fL', ref: '80 - 100', flag: 'Low' },
    { parameter: 'WBC', value: '6.5', unit: 'x10^9/L', ref: '4.5 - 11.0', flag: 'Normal' },
    { parameter: 'Platelets', value: '250', unit: 'x10^9/L', ref: '150 - 450', flag: 'Normal' },
  ]},
  { id: 2, date: '2023-10-15', test: 'Iron Profile', status: 'abnormal', results: [
    { parameter: 'Serum Ferritin', value: '12', unit: 'ng/mL', ref: '30 - 400', flag: 'Low' },
    { parameter: 'Serum Iron', value: '45', unit: 'ug/dL', ref: '60 - 170', flag: 'Low' },
    { parameter: 'TIBC', value: '450', unit: 'ug/dL', ref: '240 - 450', flag: 'High' },
  ]},
  { id: 3, date: '2023-05-20', test: 'HbA1c', status: 'normal', results: [
    { parameter: 'HbA1c', value: '5.8', unit: '%', ref: '< 6.0', flag: 'Normal' },
  ]},
];

export const LabResultsViewer = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate mb-1">Lab Reports</h2>
          <p className="text-slate/60 text-sm">Review recent pathology and radiology reports.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center shadow-sm">
          <FlaskConical className="w-4 h-4 mr-2" /> Order New Labs
        </button>
      </div>

      <div className="space-y-6">
        {mockLabs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-2xl shadow-sm border border-slate/5 overflow-hidden">
            {/* Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${lab.status === 'abnormal' ? 'bg-danger/5 border-danger/10' : 'bg-slate/5 border-slate/10'}`}>
              <div className="flex items-center space-x-3">
                {lab.status === 'abnormal' ? (
                  <div className="bg-danger/20 p-2 rounded-full"><AlertTriangle className="w-5 h-5 text-danger" /></div>
                ) : (
                  <div className="bg-primary/20 p-2 rounded-full"><CheckCircle2 className="w-5 h-5 text-primary" /></div>
                )}
                <div>
                  <h3 className="font-bold text-slate text-lg">{lab.test}</h3>
                  <p className="text-xs text-slate/50 font-medium">Reported: {lab.date}</p>
                </div>
              </div>
              <button className="text-primary hover:underline text-sm font-medium flex items-center">
                View PDF <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Results Table */}
            <div className="p-6">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate/50 border-b border-slate/10">
                    <th className="pb-3 font-medium uppercase tracking-wider">Parameter</th>
                    <th className="pb-3 font-medium uppercase tracking-wider">Result</th>
                    <th className="pb-3 font-medium uppercase tracking-wider hidden md:table-cell">Reference Range</th>
                    <th className="pb-3 font-medium uppercase tracking-wider">Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate/5">
                  {lab.results.map((res, idx) => (
                    <tr key={idx} className="group hover:bg-slate/5 transition-colors">
                      <td className="py-3 font-medium text-slate">{res.parameter}</td>
                      <td className="py-3">
                        <span className={`font-bold text-lg ${res.flag !== 'Normal' ? (res.flag === 'Low' || res.flag === 'High' ? 'text-danger' : 'text-warning') : 'text-slate'}`}>
                          {res.value}
                        </span>
                        <span className="text-slate/40 ml-1 text-xs">{res.unit}</span>
                      </td>
                      <td className="py-3 text-slate/60 hidden md:table-cell">{res.ref}</td>
                      <td className="py-3">
                        {res.flag === 'Normal' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate/10 text-slate/70">
                            Normal
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${res.flag === 'High' || res.flag === 'Low' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>
                            {res.flag}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
