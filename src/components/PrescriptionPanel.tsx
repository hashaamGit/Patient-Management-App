import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Printer, Plus, Trash2, Save, AlertTriangle, Zap, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

const QUICK_FAVORITES = [
  { id: 'f1', label: 'Adult Fever (Paracetamol)', items: [{ id: '1', brandName: 'Panadol', genericName: 'Paracetamol', strength: '500mg', form: 'Tab', dosage: '1+1+1', duration: '3 days', instructions: 'Take after meals for fever' }] },
  { id: 'f2', label: 'Standard URI (Augmentin)', items: [{ id: '2', brandName: 'Augmentin', genericName: 'Co-Amoxiclav', strength: '625mg', form: 'Tab', dosage: '1+0+1', duration: '5 days', instructions: 'Complete full course' }] },
  { id: 'f3', label: 'Gastritis (Omeprazole)', items: [{ id: '3', brandName: 'Risek', genericName: 'Omeprazole', strength: '20mg', form: 'Cap', dosage: '1+0+0', duration: '14 days', instructions: 'Take empty stomach 30 mins before breakfast' }] },
];

export const PrescriptionPanel = () => {
  const { patient, prescription, addPrescriptionItem, removePrescriptionItem, setAdvice, setFollowUpDate, saveCurrentCase } = useAppStore();
  
  const [newItem, setNewItem] = useState({ brandName: '', genericName: '', strength: '', form: 'Tab', dosage: '', duration: '', instructions: '' });
  const [showInteractionAlert, setShowInteractionAlert] = useState<string | null>(null);
  
  // 1-Click Inline Editor State
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const checkInteractions = (drugName: string) => {
    if (!patient.allergies || !drugName) return null;
    const allergiesList = patient.allergies.toLowerCase().split(',').map(a => a.trim());
    const drugLower = drugName.toLowerCase();
    
    const isPenicillin = drugLower.includes('augmentin') || drugLower.includes('amoxi') || drugLower.includes('penicillin');
    const allergicToPenicillin = allergiesList.some(a => a.includes('penicillin'));
    
    if (isPenicillin && allergicToPenicillin) {
      return "SEVERE ALLERGY ALERT: Patient is allergic to Penicillin. Prescribing Amoxicillin/Augmentin is contraindicated.";
    }
    
    for (const allergy of allergiesList) {
      if (drugLower.includes(allergy)) {
        return `ALLERGY ALERT: Potential reaction to ${allergy}.`;
      }
    }
    return null;
  };

  const handleAddItem = () => {
    if (newItem.brandName) {
      const alert = checkInteractions(newItem.brandName) || checkInteractions(newItem.genericName);
      if (alert) {
        setShowInteractionAlert(alert);
      } else {
        setShowInteractionAlert(null);
      }
      
      addPrescriptionItem({ ...newItem });
      setNewItem({ brandName: '', genericName: '', strength: '', form: 'Tab', dosage: '', duration: '', instructions: '' });
    }
  };

  const applyFavorite = (favoriteItems: any[]) => {
    favoriteItems.forEach(item => {
      const alert = checkInteractions(item.brandName) || checkInteractions(item.genericName);
      if (alert) setShowInteractionAlert(alert);
      const { id, ...itemWithoutId } = item;
      addPrescriptionItem(itemWithoutId);
    });
  };

  const updateItemDosage = (id: string, newDosage: string) => {
    const item = prescription.items.find(i => i.id === id);
    if (item) {
      removePrescriptionItem(id);
      const { id: _, ...itemWithoutId } = item;
      addPrescriptionItem({ ...itemWithoutId, dosage: newDosage });
      setEditingItemId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative shadow-[-4px_0_15px_rgb(0,0,0,0.05)] border-l border-slate-200">
      
      {/* Header Actions */}
      <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center no-print shrink-0">
        <h3 className="font-bold text-slate-800 flex items-center"><Edit2 className="w-4 h-4 mr-2 text-primary" /> Live Rx Pad</h3>
        <div className="flex space-x-2">
          <button onClick={saveCurrentCase} className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors" title="Save Case">
            <Save className="w-4 h-4" />
          </button>
          <button onClick={() => window.print()} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded transition-colors" title="Print Prescription">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showInteractionAlert && (
        <div className="mx-4 mt-3 p-3 bg-danger/10 border border-danger/20 rounded flex items-start text-danger-200 text-xs font-medium shadow-sm animate-in fade-in shrink-0 no-print">
          <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
          <div className="flex-1">{showInteractionAlert}</div>
          <button onClick={() => setShowInteractionAlert(null)} className="text-danger/50 hover:text-danger">&times;</button>
        </div>
      )}

      {/* Actual Prescription Paper */}
      <div className="flex-1 overflow-y-auto p-6 print:p-0">
        
        {/* Letterhead */}
        <div className="border-b-2 border-primary pb-3 mb-4">
          <h1 className="text-2xl font-black text-primary tracking-tight">Dr. Hassan Aqeel</h1>
          <p className="text-slate-700 font-bold uppercase tracking-widest text-xs mt-1">GP / Internal Medicine</p>
          <div className="flex justify-between items-end mt-2 text-xs text-slate-500">
            <p>Lahore, Pakistan • Reg No. 54321-M</p>
            <p className="font-medium">Date: {format(new Date(), 'dd MMM yyyy')}</p>
          </div>
        </div>

        {/* Patient Block */}
        <div className="flex flex-wrap text-sm border-b border-slate-100 pb-3 mb-6">
          <p className="mr-6 mb-1"><span className="text-slate-400 font-medium">Name:</span> <strong className="text-slate-800">{patient.name || '---'}</strong></p>
          <p className="mr-6 mb-1"><span className="text-slate-400 font-medium">Age/Sex:</span> <strong className="text-slate-800">{patient.age || '-'}y / {patient.gender ? patient.gender.charAt(0) : '-'}</strong></p>
          <p className="mr-6 mb-1"><span className="text-slate-400 font-medium">Wt:</span> <strong className="text-slate-800">{patient.weight || '-'}kg</strong></p>
          <p className="mb-1"><span className="text-slate-400 font-medium">BP:</span> <strong className="text-slate-800">{patient.bp || '-'}</strong></p>
        </div>

        <div className="text-4xl font-serif italic font-bold text-slate-800 mb-4">Rx</div>

        {/* Meds List */}
        <div className="space-y-5 min-h-[200px]">
          {prescription.items.length === 0 ? (
            <p className="text-slate-300 italic font-medium no-print text-sm">Transfer from diagnostics or manually add below.</p>
          ) : (
            prescription.items.map((item, index) => (
              <div key={item.id} className="relative group flex flex-col justify-start pb-2 border-b border-slate-50 border-dashed">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-800 text-base">
                      <span className="mr-2 text-slate-400 text-sm">{index + 1}.</span> 
                      {item.form} {item.brandName} <span className="text-xs font-semibold text-slate-500">{item.strength}</span>
                    </p>
                    {item.genericName && <p className="text-xs text-slate-400 font-medium italic mb-1 ml-6">({item.genericName})</p>}
                  </div>
                  <button 
                    onClick={() => removePrescriptionItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-danger-200 hover:bg-danger/10 rounded transition-all no-print"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="ml-6 mt-1 flex items-center flex-wrap">
                  {/* Inline Dosage Editor */}
                  {editingItemId === item.id ? (
                    <div className="flex space-x-1 mr-3 animate-in fade-in zoom-in-95 no-print">
                      {['1+0+1', '1+1+1', '1+0+0', '0+0+1', 'SOS'].map(dos => (
                        <button key={dos} onClick={() => updateItemDosage(item.id, dos)} className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded shadow-sm hover:bg-primary-dark">
                          {dos}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button 
                      onClick={() => setEditingItemId(item.id)} 
                      className="font-bold bg-slate-100 px-2 py-0.5 rounded mr-3 text-sm text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer no-print group/edit flex items-center"
                    >
                      {item.dosage}
                    </button>
                  )}
                  {/* Print view dosage */}
                  <span className="font-bold text-slate-800 mr-2 print:inline-block hidden">{item.dosage}</span>

                  {item.duration && <span className="mr-3 text-sm font-medium text-slate-700">for {item.duration}</span>}
                  {item.instructions && <span className="text-sm text-slate-500 italic">— {item.instructions}</span>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Advice */}
        <div className="mt-6 pt-4 border-t-2 border-slate-50 space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-2">Advice & Labs</h4>
            <textarea 
              value={prescription.advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full text-sm text-slate-700 border border-transparent hover:border-slate-200 focus:border-primary bg-slate-50 rounded p-2 focus:outline-none transition-colors"
              placeholder="Enter general diet advice or lab recommendations..."
              rows={4}
            />
          </div>
          <div className="flex items-center">
            <h4 className="font-bold text-primary mr-2 uppercase tracking-wider text-xs">Follow up:</h4>
            <input 
              type="text"
              value={prescription.followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="text-sm font-semibold border-b border-transparent hover:border-slate-300 focus:border-primary bg-transparent focus:outline-none text-slate-800 flex-1 px-1 transition-colors"
              placeholder="e.g. SOS or 5 days"
            />
          </div>
        </div>
      </div>

      {/* Manual Entry Footer */}
      <div className="bg-slate-50 border-t border-slate-200 p-3 no-print shrink-0">
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-2 hide-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center shrink-0"><Zap className="w-3 h-3 mr-1"/> Fast Rx</span>
          {QUICK_FAVORITES.map(fav => (
            <button 
              key={fav.id} onClick={() => applyFavorite(fav.items)}
              className="shrink-0 px-2 py-0.5 bg-white hover:border-primary hover:text-primary text-slate-600 text-xs font-semibold rounded-full border border-slate-200 transition-colors shadow-sm"
            >
              {fav.label}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-6 gap-2">
          <input placeholder="Brand" value={newItem.brandName} onChange={e => setNewItem({...newItem, brandName: e.target.value})} className="col-span-2 text-xs px-2 py-1.5 rounded border border-slate-300 focus:border-primary focus:outline-none"/>
          <select value={newItem.form} onChange={e => setNewItem({...newItem, form: e.target.value})} className="col-span-1 text-xs px-1 py-1.5 rounded border border-slate-300 focus:border-primary focus:outline-none bg-white">
            <option>Tab</option><option>Cap</option><option>Syp</option><option>Inj</option>
          </select>
          <input placeholder="Strength" value={newItem.strength} onChange={e => setNewItem({...newItem, strength: e.target.value})} className="col-span-1 text-xs px-2 py-1.5 rounded border border-slate-300 focus:border-primary focus:outline-none"/>
          <input placeholder="Dosage" value={newItem.dosage} onChange={e => setNewItem({...newItem, dosage: e.target.value})} className="col-span-1 text-xs px-2 py-1.5 rounded border border-slate-300 focus:border-primary focus:outline-none"/>
          <button onClick={handleAddItem} className="col-span-1 bg-primary text-white rounded flex items-center justify-center hover:bg-primary-dark shadow-sm"><Plus className="w-4 h-4" /></button>
        </div>
      </div>

    </div>
  );
};
