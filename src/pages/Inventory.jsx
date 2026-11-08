import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  Boxes,
  Search,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Package,
  Calendar,
  Layers,
  Edit2
} from 'lucide-react';

export default function Inventory() {
  const { inventory, addInventoryItem, updateStock } = useLab();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');

  const [newItemData, setNewItemData] = useState({
    name: '',
    category: 'Reagents',
    lotNo: '',
    expiryDate: '',
    inStock: '',
    minAlert: 5,
    unit: 'Kits'
  });

  const filteredInventory = inventory.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lotNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = inventory.filter(i => i.inStock <= i.minAlert).length;

  const handleUpdateStock = (e) => {
    e.preventDefault();
    if (!editingItem || newStockVal === '') return;
    updateStock(editingItem.id, newStockVal);
    setEditingItem(null);
    setNewStockVal('');
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemData.name || !newItemData.inStock) return;
    addInventoryItem({
      ...newItemData,
      inStock: Number(newItemData.inStock),
      minAlert: Number(newItemData.minAlert || 5)
    });
    setIsAddModalOpen(false);
    setNewItemData({
      name: '',
      category: 'Reagents',
      lotNo: '',
      expiryDate: '',
      inStock: '',
      minAlert: 5,
      unit: 'Kits'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Boxes className="w-7 h-7 text-brand-600" />
            <span>Reagent Inventory & Consumables</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track analyzer reagents, vacutainer tubes, lot numbers, expiry dates, and low-stock reorder thresholds.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Stock Item</span>
        </button>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-rose-900">{lowStockCount} Reagents / Consumables are below minimum threshold!</span>
            <p className="text-rose-700 mt-0.5">Prompt re-ordering is required to prevent analyzer downtime.</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by reagent name, lot number or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
          {inventory.length} Tracked Items
        </span>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Lot # & Expiry</th>
                <th className="py-3 px-4">Current In-Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => {
                const isLow = item.inStock <= item.minAlert;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.name}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {item.category}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="text-slate-800 font-semibold">{item.lotNo || 'N/A'}</div>
                      <div className="text-slate-400">Exp: {item.expiryDate || 'Long shelf'}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-sm">
                      <span className={isLow ? 'text-rose-600' : 'text-slate-900'}>
                        {item.inStock} {item.unit}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Min alert: {item.minAlert}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" /> Reorder Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Adequate
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setNewStockVal(item.inStock);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Adjust</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Adjust Stock: {editingItem.name}
            </h3>
            <form onSubmit={handleUpdateStock} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New In-Stock Quantity ({editingItem.unit})</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-bold text-sm"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-600 text-white font-bold rounded-xl"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Stock Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-brand-700 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Inventory Item</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white hover:opacity-75">✕</button>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reagent / Consumable Name *</label>
                <input
                  type="text"
                  required
                  value={newItemData.name}
                  onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                  placeholder="e.g. Sysmex Cellpack Diluent"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newItemData.category}
                    onChange={(e) => setNewItemData({ ...newItemData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Reagents">Reagents & Kits</option>
                    <option value="Vacutainers">Vacutainer Tubes</option>
                    <option value="Test Strips">Test Strips</option>
                    <option value="Calibrators">Calibrators & Controls</option>
                    <option value="Consumables">General Consumables</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItemData.unit}
                    onChange={(e) => setNewItemData({ ...newItemData, unit: e.target.value })}
                    placeholder="e.g. Kits, Tubes, Strips"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lot / Batch Number</label>
                  <input
                    type="text"
                    value={newItemData.lotNo}
                    onChange={(e) => setNewItemData({ ...newItemData, lotNo: e.target.value })}
                    placeholder="e.g. LOT-2026-X"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newItemData.expiryDate}
                    onChange={(e) => setNewItemData({ ...newItemData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Quantity *</label>
                  <input
                    type="number"
                    required
                    value={newItemData.inStock}
                    onChange={(e) => setNewItemData({ ...newItemData, inStock: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Reorder Alert Level</label>
                  <input
                    type="number"
                    value={newItemData.minAlert}
                    onChange={(e) => setNewItemData({ ...newItemData, minAlert: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
