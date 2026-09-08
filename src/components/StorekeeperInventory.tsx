import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { InventoryItem } from '../store/useAppStore';
import {
  Building2, Plus, Search, Filter, AlertTriangle, CheckCircle2,
  Trash2, ArrowUpRight, ArrowDownRight, Package, Calendar, RefreshCw
} from 'lucide-react';

export const StorekeeperInventory: React.FC = () => {
  const { inventory, updateStock, addInventoryItem, deleteInventoryItem } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Antibiotics' as InventoryItem['category'],
    stock: 100,
    minStock: 25,
    unit: 'Tablets',
    batchNo: '',
    expiryDate: ''
  });

  const categories = ['All', 'Antibiotics', 'Analgesics', 'Cardiovascular', 'Antidiabetic', 'Respiratory', 'Consumables', 'IV Fluids', 'Other'];

  const filteredInventory = inventory.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.batchNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;
    addInventoryItem({
      ...newItem,
      batchNo: newItem.batchNo || `BAT-${Date.now().toString().slice(-4)}`,
      expiryDate: newItem.expiryDate || '2028-01-01'
    });
    setNewItem({
      name: '',
      category: 'Antibiotics',
      stock: 100,
      minStock: 25,
      unit: 'Tablets',
      batchNo: '',
      expiryDate: ''
    });
    setShowAddModal(false);
  };

  const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;

  return (
    <div className="h-full overflow-y-auto p-6 bg-canvas space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text-primary">Medical Store & Inventory</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  CENTRAL SUPPLY
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Hassan and Co. Central Pharmacy Supply • Real-Time Stock Tracking, Expiry Management & Procurement
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock Item</span>
            </button>
          </div>
        </div>

        {/* Status Metrics */}
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
            <div className="w-10 h-10 rounded-lg bg-danger/10 text-danger flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-danger">{lowStockCount}</div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider">Low Stock Warnings</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600">
                {inventory.filter(i => i.stock > i.minStock).length}
              </div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider">Adequate Stock</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-text-primary">0</div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider">Expired Batches</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by drug name or batch number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
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
                <th className="py-3 px-4">Item Name & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Batch & Expiry</th>
                <th className="py-3 px-4 text-center">Quick Adjust</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInventory.map((item) => {
                const isLow = item.stock <= item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-text-primary">{item.name}</div>
                      <div className="text-xs text-text-muted">Unit: {item.unit}</div>
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
                  <td colSpan={6} className="py-8 text-center text-text-muted">
                    No inventory items found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal: Add New Stock Item */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="max-w-md w-full bg-surface border border-border rounded-2xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-text-primary text-base">Register Inventory Item</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Item / Medicine Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ciprofloxacin 500mg"
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
                      placeholder="e.g. Tablets, Vials, Packs"
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Batch Number</label>
                    <input
                      type="text"
                      placeholder="e.g. CIP-2026-09"
                      value={newItem.batchNo}
                      onChange={(e) => setNewItem({ ...newItem, batchNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={newItem.expiryDate}
                      onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
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
