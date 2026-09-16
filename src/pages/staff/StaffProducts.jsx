import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import StaffProductForm from '@/components/staff/StaffProductForm';
import { getRaijinProducts } from '@/lib/raijin_products';

export default function StaffProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState(getRaijinProducts());
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setProducts(getRaijinProducts());
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      const saved = JSON.parse(localStorage.getItem('raijin_products_v1') || '[]');
      localStorage.setItem('raijin_products_v1', JSON.stringify(saved.filter(s => s.id !== p.id)));
      load();
      toast({ title: 'Product removed' });
    } catch (e) {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-xl md:text-2xl font-bold">Products</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-angular bg-primary text-primary-foreground px-4 h-9 text-sm font-semibold flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="glass-panel rounded-lg p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-secondary/40 overflow-hidden shrink-0">{p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : null}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.category} · ${p.price?.toLocaleString()} · {p.inventory_quantity} in stock</div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => del(p)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && <StaffProductForm product={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
    </div>
  );
}
