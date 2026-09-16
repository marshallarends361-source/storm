import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Pencil, Trash2, Minus } from 'lucide-react';
import StaffProductForm from '@/components/staff/StaffProductForm';
import { getRaijinProducts, deleteRaijinProduct, saveRaijinProduct } from '@/lib/raijin_products';

export default function StaffProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState(getRaijinProducts());
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setProducts(getRaijinProducts());
  };

  useEffect(() => {
    window.addEventListener('raijin_products_updated', load);
    return () => window.removeEventListener('raijin_products_updated', load);
  }, []);

  const del = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      deleteRaijinProduct(p.id);
      toast({ title: 'Product removed' });
    } catch (e) {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  const adjustStock = (p, delta) => {
    const newQty = Math.max(0, (p.inventory_quantity || 0) + delta);
    const updatedProduct = { ...p, inventory_quantity: newQty };
    saveRaijinProduct(updatedProduct, true);
    toast({ title: `Stock updated: ${p.name}`, description: `Now ${newQty} in stock` });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Product Management</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-angular bg-primary text-primary-foreground px-5 h-10 text-sm font-bold flex items-center gap-2 hover:glow-blue transition-all"><Plus className="w-4 h-4" /> NEW PRODUCT</button>
      </div>

      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="glass-panel rounded-xl p-4 flex items-center gap-4 border-slate-800 hover:border-primary/20 transition-all">
            <div className="w-16 h-16 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
              {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600"><Plus size={20}/></div>}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">{p.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{p.category} · ${p.price?.toLocaleString()}</div>

              {/* Quick Stock Controls directly on the slide */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Inventory:</span>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-md overflow-hidden">
                  <button onClick={() => adjustStock(p, -1)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border-r border-slate-700"><Minus className="w-3 h-3" /></button>
                  <span className="px-3 text-xs font-mono font-bold text-primary min-w-[32px] text-center">{p.inventory_quantity || 0}</span>
                  <button onClick={() => adjustStock(p, 1)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border-l border-slate-700"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
            </div>

            <div className="flex gap-1 shrink-0 bg-slate-900/50 rounded-lg p-1 border border-slate-800">
              <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Edit Details"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => del(p)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete Product"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && <StaffProductForm product={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
    </div>
  );
}
