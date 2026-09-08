import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { InventoryItem, InventoryCategory } from '../store/useAppStore';
import {
  Building2, Plus, Search, Filter, AlertTriangle, CheckCircle2,
  Trash2, Package, Calendar, DollarSign, History, Wrench, ShieldCheck,
  ArrowUpRight, ArrowDownRight, Layers, FileSpreadsheet
} from 'lucide-react';

export const StorekeeperInventory: React.FC = () => {
  const { inventory, updateStock, addInventoryItem, deleteInventoryItem, inventoryLedger } = useAppStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'ledger'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState<{
    name: string;
    category: InventoryCategory;
    stock: number;
    minStock: number;
    unit: string;
    batchNo: string;
    expiryDate: string;
    unitPrice: number;
    sellingPrice: number;
    equipmentStatus?: 'Operational' | 'Maintenance Due' | 'Under Repair';
    location?: string;
  }>({
    name: '',
    category: 'Antibiotics',
    stock: 100,
    minStock: 25,
    unit: 'Tablets',
    batchNo: '',
    expiryDate: '',
    unitPrice: 15,
    sellingPrice: 20,
    equipmentStatus: 'Operational',
    location: 'Central Pharmacy'
  });

  const categories: string[] = [
    'All',
    'Antibiotics',
    'Analgesics',
    'Cardiovascular',
    'Antidiabetic',
    'Respiratory',
    'IV Fluids',
    'Medical Machinery & Equipment',
    'Cleaning & Sanitization Supplies',
    'Hospital Electronics & IT',
    'Medical & Surgical Consumables',
    'Other'
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const filteredLedger = inventoryLedger.filter(entry => {
    return entry.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           entry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
           entry.type.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;
    addInventoryItem({
      ...newItem,
      batchNo: newItem.batchNo || `BAT-${Date.now().toString().slice(-4)}`,
      expiryDate: newItem.expiryDate || '2028-01-01',
      unitPrice: Number(newItem.unitPrice) || 0,
      sellingPrice: Number(newItem.sellingPrice) || 0,
    });
    setNewItem({
      name: '',
      category: 'Antibiotics',
      stock: 100,
      minStock: 25,
      unit: 'Tablets',
      batchNo: '',
      expiryDate: '',
      unitPrice: 15,
      sellingPrice: 20,
      equipmentStatus: 'Operational',
      location: 'Central Pharmacy'
    });
    setShowAddModal(false);
  };

  const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;
  const totalStockValuation = inventory.reduce((sum, item) => sum + (item.stock * (item.unitPrice || 0)), 0);
  const machineryCount = inventory.filter(i => 
    i.category === 'Medical Machinery & Equipment' || i.category === 'Hospital Electronics & IT'
  ).length;

  return (
    <div className="h-full overflow-y-auto p-6 bg-canvas space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20 shadow-sm">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text-primary">Medical Store & Equipment Inventory</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  CENTRAL SUPPLY & LOGISTICS
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Hassan and Co. Central Supply • Real-Time Stock Tracking, Pricing, Machinery & Movement Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-surface p-1 rounded-xl border border-border">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'inventory'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Stock & Items
              </button>
              <button
                onClick={() => setActiveTab('ledger')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'ledger'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Movement Ledger ({inventoryLedger.length})
              </button>
            </div>

            {activeTab === 'inventory' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            )}
          </div>
        </div>

        {/* Status & Financial Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-text-primary">{inventory.length}</div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider">Total Active SKUs</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-emerald-600">
                ₨ {totalStockValuation.toLocaleString()}
              </div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider">Total Stock Valuation</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger/10 text-danger flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-danger">{lowStockCount}</div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider">Low Stock Warnings</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-text-primary">{machineryCount} Units</div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider">Machinery & Devices</div>
            </div>
          </div>
        </div>

        {/* Tab 1: Inventory Table */}
        {activeTab === 'inventory' && (
          <>
            {/* Filter Bar */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search by drug, machinery, batch, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Categories horizontally scrollable */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface hover:bg-canvas border border-border text-text-muted'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory Table */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-canvas border-b border-border text-xs font-bold text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4">Item Name & Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Stock Level</th>
                    <th className="py-3 px-4">Pricing (Cost / Retail)</th>
                    <th className="py-3 px-4">Batch / Expiry</th>
                    <th className="py-3 px-4 text-center">Quick Stock Adjust</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInventory.map((item) => {
                    const isLow = item.stock <= item.minStock;
                    const isMachinery = item.category === 'Medical Machinery & Equipment' || item.category === 'Hospital Electronics & IT';

                    return (
                      <tr key={item.id} className="hover:bg-canvas/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-text-primary flex items-center gap-2">
                            {item.name}
                            {isMachinery && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                {item.equipmentStatus || 'Asset'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-muted flex items-center gap-2">
                            <span>Unit: {item.unit}</span>
                            {item.location && <span>• Loc: {item.location}</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-canvas border border-border text-text-secondary">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-base font-extrabold ${isLow ? 'text-danger' : 'text-text-primary'}`}>
                              {item.stock}
                            </span>
                            <span className="text-xs text-text-muted">{item.unit}</span>
                            {isLow && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-danger/10 text-danger border border-danger/20">
                                LOW
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-text-faint">Min: {item.minStock}</div>
                        </td>
                        <td className="py-3 px-4 text-xs">
                          <div className="font-semibold text-text-primary">
                            Cost: ₨ {item.unitPrice ? item.unitPrice.toLocaleString() : '0'}
                          </div>
                          <div className="text-emerald-600 font-medium">
                            Sale: ₨ {item.sellingPrice ? item.sellingPrice.toLocaleString() : '0'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs">
                          <div className="font-mono text-text-secondary">Batch: {item.batchNo}</div>
                          <div className="text-text-muted">Exp: {item.expiryDate}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => updateStock(item.id, -10)}
                              className="px-2 py-1 rounded bg-canvas hover:bg-surface border border-border text-xs font-bold text-danger transition-colors"
                              title="Subtract 10 units"
                            >
                              -10
                            </button>
                            <button
                              onClick={() => updateStock(item.id, 10)}
                              className="px-2 py-1 rounded bg-canvas hover:bg-surface border border-border text-xs font-bold text-emerald-600 transition-colors"
                              title="Add 10 units"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => updateStock(item.id, 50)}
                              className="px-2 py-1 rounded bg-canvas hover:bg-surface border border-border text-xs font-bold text-primary transition-colors"
                              title="Add 50 units (New batch box)"
                            >
                              +50
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${item.name} from inventory?`)) {
                                deleteInventoryItem(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredInventory.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-text-muted">
                        No inventory items found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Tab 2: Movement & Stock Ledger */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Filter transactions by item, user or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-primary"
                />
              </div>
              <div className="text-xs text-text-muted font-medium">
                Showing {filteredLedger.length} transaction entries
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-canvas border-b border-border text-xs font-bold text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Movement Type</th>
                    <th className="py-3 px-4 text-center">Quantity Delta</th>
                    <th className="py-3 px-4 text-center">Balance After</th>
                    <th className="py-3 px-4">Authorized By</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLedger.map((entry) => {
                    const isPositive = entry.quantity > 0;
                    return (
                      <tr key={entry.id} className="hover:bg-canvas/50 transition-colors">
                        <td className="py-3 px-4 text-xs font-mono text-text-muted whitespace-nowrap">
                          {new Date(entry.date).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-text-primary">
                          {entry.itemName}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            entry.type === 'Stock In'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : entry.type === 'Dispensed'
                              ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}>
                            {entry.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span className={`inline-flex items-center gap-1 ${
                            isPositive ? 'text-emerald-600' : 'text-danger'
                          }`}>
                            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            {isPositive ? `+${entry.quantity}` : `${entry.quantity}`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-text-secondary">
                          {entry.balanceAfter}
                        </td>
                        <td className="py-3 px-4 text-xs text-text-primary font-medium">
                          {entry.user}
                        </td>
                        <td className="py-3 px-4 text-xs text-text-muted">
                          {entry.notes || '—'}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLedger.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-text-muted">
                        No ledger transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add New Stock Item */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="max-w-md w-full bg-surface border border-border rounded-2xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-text-primary text-base">Register Inventory or Equipment Item</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Item / Device / Drug Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ECG Machine 12-Lead, Ceftriaxone 1g, Floor Disinfectant"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary text-xs"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Unit of Measure</label>
                    <input
                      type="text"
                      placeholder="e.g. Tablets, Units, Bottles, Boxes"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Initial Stock Count</label>
                    <input
                      type="number"
                      min="0"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Minimum Alert Threshold</label>
                    <input
                      type="number"
                      min="0"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                </div>

                {/* Pricing Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Cost / Purchase Price (₨)</label>
                    <input
                      type="number"
                      min="0"
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Retail / Patient Price (₨)</label>
                    <input
                      type="number"
                      min="0"
                      value={newItem.sellingPrice}
                      onChange={(e) => setNewItem({ ...newItem, sellingPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Batch / Serial Number</label>
                    <input
                      type="text"
                      placeholder="e.g. SN-88204 or CIP-2026-09"
                      value={newItem.batchNo}
                      onChange={(e) => setNewItem({ ...newItem, batchNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Expiry / Warranty Date</label>
                    <input
                      type="date"
                      value={newItem.expiryDate}
                      onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Storage Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Ward A, ICU Storage, Bay 2"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Machinery / Asset Status</label>
                    <select
                      value={newItem.equipmentStatus}
                      onChange={(e) => setNewItem({ ...newItem, equipmentStatus: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary text-xs"
                    >
                      <option value="Operational">Operational</option>
                      <option value="Calibrated">Calibrated</option>
                      <option value="Maintenance Required">Maintenance Required</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow transition-colors"
                  >
                    Add to Inventory
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-2 px-4 rounded-lg bg-canvas border border-border hover:bg-surface text-text-secondary text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

