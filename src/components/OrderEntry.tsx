import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Order, OrderType, OrderUrgency, OrderStatus } from '../types';
import { ClipboardList, Plus, Search, Filter, FlaskConical, Image, UserPlus, Stethoscope, Clock, CheckCircle2, XCircle, AlertCircle, Trash2, ChevronDown, Edit2, Eye, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

export const OrderEntry = () => {
  const { orders, addOrder, updateOrderStatus, removeOrder } = useAppStore();
  
  const [filterType, setFilterType] = useState<OrderType | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newType, setNewType] = useState<OrderType>('Lab');
  const [newName, setNewName] = useState('');
  const [newUrgency, setNewUrgency] = useState<OrderUrgency>('Routine');
  const [newIndication, setNewIndication] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const suggestions: Record<OrderType, string[]> = {
    Lab: ['CBC', 'RFT', 'LFT', 'Lipid Profile', 'HbA1c', 'Thyroid Panel', 'Blood Culture', 'Urine C/S', 'Serum Electrolytes', 'PT/INR'],
    Imaging: ['Chest X-Ray', 'Abdominal Ultrasound', 'CT Head', 'CT Chest', 'MRI Brain', 'ECG', 'Echocardiography', 'KUB X-Ray'],
    Referral: ['Cardiology', 'Pulmonology', 'Gastroenterology', 'Neurology', 'Nephrology', 'Endocrinology', 'Surgery', 'Psychiatry', 'Ophthalmology'],
    Nursing: ['Vitals Q4H', 'I/O Charting', 'Wound Care', 'Fall Precautions', 'Strict Bed Rest', 'IV Fluid Administration', 'NG Tube Feeding']
  };

  const getUrgencyClass = (urgency: OrderUrgency) => {
    switch(urgency) {
      case 'STAT': return 'badge-danger';
      case 'Urgent': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  const getStatusClass = (status: OrderStatus) => {
    switch(status) {
      case 'Completed': return 'badge-success';
      case 'In Progress': return 'badge-info';
      case 'Pending': return 'badge-warning';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: OrderType, className = "w-4 h-4") => {
    switch(type) {
      case 'Lab': return <FlaskConical className={className} />;
      case 'Imaging': return <Image className={className} />;
      case 'Referral': return <UserPlus className={className} />;
      case 'Nursing': return <Stethoscope className={className} />;
    }
  };

  const filteredOrders = orders.filter(o => 
    (filterType === 'All' || o.type === filterType) &&
    (o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.clinicalIndication?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    pending: orders.filter(o => o.status === 'Pending').length,
    inProgress: orders.filter(o => o.status === 'In Progress').length,
    completed: orders.filter(o => o.status === 'Completed').length,
    total: orders.length
  };

  const handlePlaceOrder = () => {
    if (!newName) return;
    addOrder({
      type: newType,
      name: newName,
      urgency: newUrgency,
      clinicalIndication: newIndication,
      notes: newNotes
    });
    setNewName(''); setNewIndication(''); setNewNotes(''); setIsFormOpen(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-canvas">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Order Entry (CPOE)</h2>
              <p className="text-sm text-text-secondary">Manage labs, imaging, referrals, and nursing orders</p>
            </div>
          </div>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
          >
            {isFormOpen ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isFormOpen ? 'Close Form' : 'New Order'}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="card p-4 flex flex-col justify-center">
            <span className="text-sm font-medium text-text-secondary">Pending</span>
            <span className="text-2xl font-bold text-warning-text clinical-num">{stats.pending}</span>
          </div>
          <div className="card p-4 flex flex-col justify-center">
            <span className="text-sm font-medium text-text-secondary">In Progress</span>
            <span className="text-2xl font-bold text-blue-600 clinical-num">{stats.inProgress}</span>
          </div>
          <div className="card p-4 flex flex-col justify-center">
            <span className="text-sm font-medium text-text-secondary">Completed</span>
            <span className="text-2xl font-bold text-success-text clinical-num">{stats.completed}</span>
          </div>
          <div className="card p-4 flex flex-col justify-center">
            <span className="text-sm font-medium text-text-secondary">Total Orders</span>
            <span className="text-2xl font-bold text-text-primary clinical-num">{stats.total}</span>
          </div>
        </div>

        {/* New Order Form (Collapsible) */}
        {isFormOpen && (
          <div className="card p-5 border-l-4 border-l-primary">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Place New Order</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Order Type</label>
                <div className="flex bg-gray-100 p-1 rounded-md">
                  {(['Lab', 'Imaging', 'Referral', 'Nursing'] as OrderType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setNewType(t)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded ${newType === t ? 'bg-white shadow text-primary' : 'text-text-secondary'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-medium text-text-secondary mb-1">Order Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="e.g. Complete Blood Count"
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {suggestions[newType].map(s => (
                    <button key={s} onClick={() => setNewName(s)} className="text-[10px] px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors">{s}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Urgency</label>
                <select 
                  value={newUrgency} 
                  onChange={e => setNewUrgency(e.target.value as OrderUrgency)}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                >
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent</option>
                  <option value="STAT">STAT</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-1">Clinical Indication</label>
                <input 
                  type="text" 
                  value={newIndication}
                  onChange={e => setNewIndication(e.target.value)}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="Reason for order..."
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">Notes / Instructions</label>
              <textarea 
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm min-h-[60px]"
                placeholder="Additional instructions..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-gray-100 rounded-md font-medium">Cancel</button>
              <button onClick={handlePlaceOrder} disabled={!newName} className="px-4 py-2 text-sm bg-primary text-white hover:bg-primary/90 rounded-md font-medium disabled:opacity-50">Place Order</button>
            </div>
          </div>
        )}

        {/* Filters and List */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex bg-white border border-border p-1 rounded-md">
              {(['All', 'Lab', 'Imaging', 'Referral', 'Nursing'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 text-xs font-medium rounded ${filterType === t ? 'bg-primary text-white' : 'text-text-secondary hover:bg-gray-50'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 w-full md:w-64 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              />
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-text-muted">
                <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No orders found.</p>
              </div>
            ) : (
              filteredOrders.map(o => (
                <div key={o.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-1 ${o.type === 'Lab' ? 'bg-blue-100 text-blue-600' : o.type === 'Imaging' ? 'bg-purple-100 text-purple-600' : o.type === 'Referral' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                        {getTypeIcon(o.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{o.name}</span>
                          <span className={`badge ${getUrgencyClass(o.urgency)}`}>{o.urgency}</span>
                          <span className={`badge ${getStatusClass(o.status)}`}>{o.status}</span>
                        </div>
                        <div className="text-sm text-text-secondary space-y-1">
                          <div><span className="font-medium">Ordered:</span> {format(new Date(o.date), 'MMM d, h:mm a')}</div>
                          {o.clinicalIndication && <div><span className="font-medium">Indication:</span> {o.clinicalIndication}</div>}
                          {o.notes && <div className="text-xs text-text-muted mt-1 bg-gray-100 p-2 rounded">{o.notes}</div>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 md:flex-col lg:flex-row self-end md:self-center shrink-0">
                      {o.status === 'Pending' && (
                        <button onClick={() => updateOrderStatus(o.id, 'In Progress')} className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200">
                          Start
                        </button>
                      )}
                      {(o.status === 'Pending' || o.status === 'In Progress') && (
                        <button onClick={() => updateOrderStatus(o.id, 'Completed')} className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors border border-green-200">
                          Complete
                        </button>
                      )}
                      {(o.status === 'Pending' || o.status === 'In Progress') && (
                        <button onClick={() => updateOrderStatus(o.id, 'Cancelled')} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-200">
                          Cancel
                        </button>
                      )}
                      <button onClick={() => removeOrder(o.id)} className="p-1.5 text-gray-400 hover:text-danger hover:bg-danger-bg rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
