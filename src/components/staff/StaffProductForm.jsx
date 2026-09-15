import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const CATEGORIES = ['Electric Dirt Bikes', 'E-Motos', 'Electric Mountain Bikes', 'Commuter E-Bikes', 'Fat-Tire E-Bikes', 'Kids E-Bikes', 'Batteries', 'Chargers', 'Replacement Parts', 'Performance Parts', 'Accessories', 'Helmets & Safety Gear'];

const empty = { name: '', slug: '', price: '', sale_price: '', sku: '', inventory_quantity: 0, category: 'Electric Dirt Bikes', description: '', images: '', featured: false, is_new: false, is_bestseller: false, is_limited: false, motor_power: '', top_speed: '', estimated_range: '', weight: '' };

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function StaffProductForm({ product, onClose, onSaved }) {
  const [f, setF] = useState(empty);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const isEdit = !!product;

  useEffect(() => {
    if (product) setF({ ...empty, ...product, images: (product.images || []).join('\n'), price: product.price ?? '', sale_price: product.sale_price ?? '', inventory_quantity: product.inventory_quantity ?? 0 });
    else setF(empty);
  }, [product]);

  const set = (k, v) => setF({ ...f, [k]: v });
  const input = 'h-9 px-3 rounded-md bg-input border border-border text-sm w-full';

  const save = async (e) => {
    e.preventDefault();
    if (!f.name || !f.price) { toast({ title: 'Name and price are required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = {
      name: f.name, slug: f.slug || slugify(f.name), price: Number(f.price),
      sale_price: f.sale_price ? Number(f.sale_price) : null,
      sku: f.sku, inventory_quantity: Number(f.inventory_quantity) || 0, category: f.category, description: f.description,
      images: f.images.split('\n').map((s) => s.trim()).filter(Boolean),
      featured: f.featured, is_new: f.is_new, is_bestseller: f.is_bestseller, is_limited: f.is_limited,
      motor_power: f.motor_power, top_speed: f.top_speed, estimated_range: f.estimated_range, weight: f.weight,
    };
    try {
      if (isEdit) await base44.entities.Product.update(product.id, payload);
      else await base44.entities.Product.create(payload);
      toast({ title: isEdit ? 'Product updated' : 'Product created' });
      onSaved();
    } catch (e2) { toast({ title: 'Save failed', description: e2.message, variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? 'Edit Product' : 'New Product'}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <div><Label className="text-xs">Name *</Label><Input className="mt-1" value={f.name} onChange={(e) => set('name', e.target.value)} required /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Price *</Label><Input type="number" step="0.01" className="mt-1" value={f.price} onChange={(e) => set('price', e.target.value)} required /></div>
            <div><Label className="text-xs">Sale Price</Label><Input type="number" step="0.01" className="mt-1" value={f.sale_price} onChange={(e) => set('sale_price', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">SKU</Label><Input className="mt-1" value={f.sku} onChange={(e) => set('sku', e.target.value)} /></div>
            <div><Label className="text-xs">Inventory</Label><Input type="number" className="mt-1" value={f.inventory_quantity} onChange={(e) => set('inventory_quantity', e.target.value)} /></div>
          </div>
          <div><Label className="text-xs">Category</Label>
            <select value={f.category} onChange={(e) => set('category', e.target.value)} className={input + ' mt-1'}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><Label className="text-xs">Description</Label><Textarea rows={3} className="mt-1" value={f.description} onChange={(e) => set('description', e.target.value)} /></div>
          <div><Label className="text-xs">Images (one URL per line)</Label><Textarea rows={2} className="mt-1 font-mono text-xs" value={f.images} onChange={(e) => set('images', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Motor Power</Label><Input className="mt-1" value={f.motor_power} onChange={(e) => set('motor_power', e.target.value)} /></div>
            <div><Label className="text-xs">Top Speed</Label><Input className="mt-1" value={f.top_speed} onChange={(e) => set('top_speed', e.target.value)} /></div>
            <div><Label className="text-xs">Est. Range</Label><Input className="mt-1" value={f.estimated_range} onChange={(e) => set('estimated_range', e.target.value)} /></div>
            <div><Label className="text-xs">Weight</Label><Input className="mt-1" value={f.weight} onChange={(e) => set('weight', e.target.value)} /></div>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            {[['featured', 'Featured'], ['is_new', 'New'], ['is_bestseller', 'Bestseller'], ['is_limited', 'Limited']].map(([k, label]) => (
              <label key={k} className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} className="accent-primary" /> {label}</label>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}