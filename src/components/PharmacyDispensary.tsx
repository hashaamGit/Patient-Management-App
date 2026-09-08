import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Pill, CheckCircle2, Clock, AlertTriangle, ShieldCheck,
  Search, Printer, Check, ArrowRight, FileText, Package, User
} from 'lucide-react';
import { format } from 'date-fns';

export const PharmacyDispensary: React.FC = () => {
  const {
    prescription,
    patient,
    savedCases,
    inventory,
    updateStock,
    dispensePrescription,
    dispensedRecords,
    currentUser
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  const [dispensedSuccess, setDispensedSuccess] = useState<string | null>(null);

  // Active prescription items to fulfill
  const activeItems = prescription.items;

  const handleDispenseActive = () => {
    if (activeItems.length === 0) {
      alert("No active prescription items to dispense.");
      return;
    }

    // Deduct stock if matching items exist in inventory
    activeItems.forEach(rxItem => {
      const match = inventory.find(inv => 
        inv.name.toLowerCase().includes(rxItem.genericName.toLowerCase()) ||
        inv.name.toLowerCase().includes(rxItem.brandName.toLowerCase())
      );
      if (match) {
        updateStock(match.id, -10); // Standard dispensa count
      }
    });

    dispensePrescription({
      patientName: patient.name || 'Anonymous Patient',
      items: activeItems.map(i => ({
        name: `${i.brandName || i.genericName} ${i.strength}`,
        dosage: i.dosage,
        frequency: i.frequency,
        duration: i.duration
      })),
      dispensedBy: currentUser?.name || 'Pharmacist Ahmed',
      status: 'Dispensed'
    });

    setDispensedSuccess(`Prescription for ${patient.name || 'Patient'} successfully dispensed!`);
    setTimeout(() => setDispensedSuccess(null), 4000);
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-canvas space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/20">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text-primary">Pharmacy Dispensary Suite</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  CLINICAL PHARMACY
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Hassan and Co. Hospital Dispensary • Verification, Allergy Cross-Check & Dispensing Queue
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'queue'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface hover:bg-canvas border border-border text-text-secondary'
              }`}
            >
              Active Fulfillment Queue
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface hover:bg-canvas border border-border text-text-secondary'
              }`}
            >
              Dispense History ({dispensedRecords.length})
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {dispensedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center gap-3 text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{dispensedSuccess}</span>
          </div>
        )}

        {/* Queue View */}
        {activeTab === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Active Prescription for Current Patient */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-4">
                
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> Active Prescription Fulfillment
                    </h3>
                    <p className="text-xs text-text-muted">Physician Order for current patient session</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    {patient.name ? `Patient: ${patient.name}` : 'Ready for Intake'}
                  </span>
                </div>

                {/* Patient Safety Banner */}
                {patient.name && (
                  <div className="p-3 rounded-xl bg-canvas border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-text-muted">Demographics: </span>
                      <strong className="text-text-primary">{patient.name}</strong> ({patient.age || '--'} / {patient.gender || '--'})
                    </div>
                    {patient.allergies && patient.allergies.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-danger font-semibold bg-danger/10 px-2 py-0.5 rounded-full border border-danger/20">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Allergies: {patient.allergies.map(a => a.name).join(', ')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-600 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>No Known Drug Allergies</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Medication Items List */}
                {activeItems.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Prescribed Medications ({activeItems.length})
                    </div>
                    <div className="divide-y divide-border rounded-xl border border-border bg-canvas overflow-hidden">
                      {activeItems.map((item, idx) => {
                        // Check stock
                        const invMatch = inventory.find(inv => 
                          inv.name.toLowerCase().includes(item.genericName.toLowerCase()) ||
                          inv.name.toLowerCase().includes(item.brandName.toLowerCase())
                        );
                        const hasStock = invMatch ? invMatch.stock > 0 : false;

                        return (
                          <div key={item.id || idx} className="p-3.5 flex items-center justify-between gap-3">
                            <div>
                              <div className="font-bold text-sm text-text-primary flex items-center gap-2">
                                <span>{item.brandName || item.genericName}</span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface border border-border text-text-secondary">
                                  {item.strength}
                                </span>
                              </div>
                              <div className="text-xs text-text-muted mt-0.5">
                                {item.dosage} • {item.frequency} • {item.duration} • {item.form}
                                {item.instructions && <span className="italic ml-1">({item.instructions})</span>}
                              </div>
                            </div>

                            <div className="text-right">
                              {invMatch ? (
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  hasStock ? 'bg-emerald-500/10 text-emerald-600' : 'bg-danger/10 text-danger'
                                }`}>
                                  {hasStock ? `${invMatch.stock} in Stock` : 'Out of Stock'}
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-text-faint">Standard Stock</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 flex gap-3">
                      <button
                        onClick={handleDispenseActive}
                        className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>Verify & Dispense All Medications</span>
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="py-3 px-4 rounded-xl bg-surface border border-border hover:bg-canvas text-text-primary text-sm font-semibold flex items-center gap-2 transition-colors"
                      >
                        <Printer className="w-4 h-4 text-primary" />
                        <span>Print Labels</span>
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="py-12 text-center text-text-muted space-y-2">
                    <Package className="w-10 h-10 mx-auto text-text-faint opacity-50" />
                    <p className="text-sm">No pending prescription in current session.</p>
                    <p className="text-xs text-text-faint">Prescriptions entered by doctors in Clinical Workspace appear here in real time.</p>
                  </div>
                )}

              </div>
            </div>

            {/* Right: Hospital Inventory Quick Reference */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-500" /> Fast Inventory Stock Check
                </h3>
                <p className="text-xs text-text-muted">Top essential pharmaceutical items currently in pharmacy inventory</p>

                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {inventory.slice(0, 8).map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg bg-canvas border border-border flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-text-primary">{item.name}</div>
                        <div className="text-[10px] text-text-muted">{item.category} • Batch: {item.batchNo}</div>
                      </div>
                      <div className="text-right font-bold">
                        <span className={item.stock <= item.minStock ? 'text-danger' : 'text-emerald-600'}>
                          {item.stock} {item.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Dispensed Prescriptions Archive
            </h3>

            {dispensedRecords.length > 0 ? (
              <div className="divide-y divide-border border border-border rounded-xl bg-canvas overflow-hidden">
                {dispensedRecords.map((record) => (
                  <div key={record.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-sm text-text-primary">{record.patientName}</div>
                      <div className="text-text-muted mt-0.5">
                        Dispensed by {record.dispensedBy} • {format(new Date(record.date), 'dd MMM yyyy, h:mm a')}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {record.items.map((it, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-surface border border-border text-text-secondary font-medium">
                            {it.name} ({it.dosage})
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold self-start sm:self-center">
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-text-muted">
                No medication dispensed yet in this session.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
