import { useState } from 'react';
import { ChevronDown, ChevronUp, User, Activity, AlertCircle, Heart, Scale } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { twMerge } from 'tailwind-merge';

export const PatientContextBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const patient = useAppStore((state) => state.patient);
  const setPatientField = useAppStore((state) => state.setPatientField);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-nav text-white border-b border-slate-700 shadow-sm sticky top-0 z-30 no-print flex flex-col justify-center">
      {/* Single Line Summary */}
      <div className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-slate-800 transition-colors" onClick={toggleExpand}>
        <div className="flex items-center space-x-4 text-sm font-medium overflow-x-auto whitespace-nowrap hide-scrollbar">
          
          <div className="flex items-center text-primary-300 font-bold">
            <User className="w-4 h-4 mr-2" />
            {patient.name || 'New Patient'} {patient.mrn && <span className="opacity-60 font-normal ml-2">#{patient.mrn}</span>}
          </div>
          
          <div className="w-px h-4 bg-slate-600"></div>
          
          <div className="flex items-center text-slate-300">
            {patient.age ? `${patient.age}y` : '--y'} {patient.gender ? `/ ${patient.gender.charAt(0)}` : ''}
          </div>

          <div className="w-px h-4 bg-slate-600"></div>

          <div className="flex items-center text-slate-300">
            <Heart className="w-3.5 h-3.5 mr-1.5 text-danger" />
            {patient.bp || '--'}
          </div>

          <div className="w-px h-4 bg-slate-600"></div>

          <div className="flex items-center text-slate-300">
            <Activity className="w-3.5 h-3.5 mr-1.5 text-primary" />
            {patient.pulse ? `${patient.pulse} bpm` : '-- bpm'}
          </div>

          <div className="w-px h-4 bg-slate-600"></div>

          <div className="flex items-center text-slate-300">
            <Scale className="w-3.5 h-3.5 mr-1.5 opacity-70" />
            {patient.weight ? `${patient.weight} kg` : '-- kg'}
          </div>

          {patient.allergies && (
            <>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="flex items-center bg-danger/20 text-danger-200 px-2 py-0.5 rounded-full text-xs font-bold border border-danger/30">
                <AlertCircle className="w-3 h-3 mr-1" />
                {patient.allergies}
              </div>
            </>
          )}

        </div>

        <button className="flex items-center space-x-1 text-slate-400 hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors">
          <span>Edit</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Form */}
      <div className={twMerge("bg-slate-900 border-t border-slate-700 overflow-hidden transition-all duration-300 ease-in-out", isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 max-w-7xl mx-auto">
          <div className="space-y-1 col-span-2">
            <label className="text-xs font-semibold text-slate-400">Full Name</label>
            <input 
              type="text" 
              value={patient.name}
              onChange={(e) => setPatientField('name', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">MRN</label>
            <input 
              type="text" 
              value={patient.mrn}
              onChange={(e) => setPatientField('mrn', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              placeholder="MRN-12345"
            />
          </div>
          <div className="space-y-1 flex space-x-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400">Age</label>
              <input 
                type="text" 
                value={patient.age}
                onChange={(e) => setPatientField('age', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
                placeholder="45"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400">Sex</label>
              <select 
                value={patient.gender}
                onChange={(e) => setPatientField('gender', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">-</option>
                <option value="Male">M</option>
                <option value="Female">F</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">BP</label>
            <input 
              type="text" 
              value={patient.bp}
              onChange={(e) => setPatientField('bp', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              placeholder="120/80"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Pulse</label>
            <input 
              type="text" 
              value={patient.pulse}
              onChange={(e) => setPatientField('pulse', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              placeholder="72"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Weight (kg)</label>
            <input 
              type="text" 
              value={patient.weight}
              onChange={(e) => setPatientField('weight', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              placeholder="70"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">SpO2</label>
            <input 
              type="text" 
              value={patient.spo2}
              onChange={(e) => setPatientField('spo2', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              placeholder="98%"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Pregnancy</label>
            <select 
              value={patient.pregnancyStatus}
              onChange={(e) => setPatientField('pregnancyStatus', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="N/A">N/A</option>
              <option value="Pregnant">Pregnant</option>
              <option value="Breastfeeding">Breastfeeding</option>
            </select>
          </div>
          <div className="space-y-1 col-span-3">
            <label className="text-xs font-semibold text-danger flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> Allergies
            </label>
            <input 
              type="text" 
              value={patient.allergies}
              onChange={(e) => setPatientField('allergies', e.target.value)}
              className="w-full bg-slate-800 border border-danger/50 rounded text-danger-100 px-3 py-1.5 text-sm focus:border-danger focus:outline-none placeholder:text-danger/40"
              placeholder="e.g. Penicillin, Peanuts"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
