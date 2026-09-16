import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import StaffProductForm from '@/components/staff/StaffProductForm';

const MOCK_PRODUCTS_LIST = [
  { id: "1", name: "Raijin Apex Pro E-Moto", category: "E-Motos", price: 4999, inventory_quantity: 15, images: ["https://media.base44.com/images/public/6a51082b02e209c4da4a908c/a7c93a724_generated_image.png"] },
  { id: "2", name: "Raijin Thunder Dirt Bike", category: "Electric Dirt Bikes", price: 3499, inventory_quantity: 2, images: ["https://media.base44.com/images/public/6a51082b02e209c4da4a908c/a7c93a724_generated_image.png"] },
  { id: "3", name: "Raijin Storm Mountain Bike", category: "Electric Mountain Bikes", price: 2199, inventory_quantity: 20, images: ["https://media.base44.com/images/public/6a51082b02e209c4da4a908c/a7c93a724_generated_image.png"] }
];

export default function StaffProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    // Merge base mock products with any products added/edited during this session in local storage
    try {
      const saved = JSON.parse(localStorage.getItem('raijin_products_v1') || '[]');
      const mockIds = MOCK_PRODUCTS_LIST.map(m => m.id);
      const custom = saved.filter(p => !mockIds.includes(p.id));

      // Update any mocks that were edited
      const updatedMocks = MOCK_PRODUCTS_LIST.map(m => {
        const edit = saved.find(s => s.id === m.id);
        return edit || m;
      });

      setProducts([...custom, ...updatedMocks]);
    } catch {
      setProducts(MOCK_PRODUCTS_LIST);
    }
  };
  useEffect(() => { load(); }, []);

  const del = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      const saved = JSON.parse(localStorage.getItem('raijin_products_v1') || '[]');
      localStorage.setItem('raijin_products_v1', JSON.stringify(saved.filter(s => s.id !== p.id)));
      setProducts(products.filter((x) => x.id !== p.id));
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

      {!products ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="glass-panel rounded-lg p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-secondary/40 overflow-hidden shrink-0">{p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : null}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.category} · ${p.price.toLocaleString()} · {p.inventory_quantity} in stock</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => del(p)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <StaffProductForm product={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
    </div>
  );
}