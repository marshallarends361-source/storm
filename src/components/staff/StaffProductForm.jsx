import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, X } from 'lucide-react';

const CATEGORIES = ['Electric Dirt Bikes', 'E-Motos', 'Electric Mountain Bikes', 'Commuter E-Bikes', 'Fat-Tire E-Bikes', 'Kids E-Bikes', 'Batteries', 'Chargers', 'Replacement Parts', 'Performance Parts', 'Accessories', 'Helmets & Safety Gear'];

const empty = { name: '', slug: '', price: '', sale_price: '', sku: '', inventory_quantity: 0, category: 'Electric Dirt Bikes', description: '', images: '', featured: false, is_new: false, is_bestseller: false, is_limited: false, motor_power: '', top_speed: '', estimated_range: '', weight: '' };

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function StaffProductForm({ product, onClose, onSaved }) {
  const [f, setF] = useState(empty);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const isEdit = !!product;

  useEffect(() => {
    if (product) setF({ ...empty, ...product, images: (product.images || []).join('\n'), price: product.price ?? '', sale_price: product.sale_price ?? '', inventory_quantity: product.inventory_quantity ?? 0 });
    else setF(empty);
  }, [product]);

  const set = (k, v) => setF({ ...f, [k]: v });
  const input = 'h-9 px-3 rounded-md bg-input border border-border text-sm w-full';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please select an image under 2MB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const currentImages = f.images ? f.images.split('\n') : [];
      set('images', [...currentImages, base64String].join('\n'));
      toast({ title: "Image imported" });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    const imgs = f.images.split('\n');
    imgs.splice(index, 1);
    set('images', imgs.join('\n'));
  };

  const save = async (e) => {
    e.preventDefault();
    if (!f.name || !f.price) { toast({ title: 'Name and price are required', variant: 'destructive' }); return; }
    setSaving(true);

    const payload = {
      id: product?.id || Math.random().toString(36).substr(2, 9),
      name: f.name, slug: f.slug || slugify(f.name), price: Number(f.price),
      sale_price: f.sale_price ? Number(f.sale_price) : null,
      sku: f.sku, inventory_quantity: Number(f.inventory_quantity) || 0, category: f.category, description: f.description,
      images: f.images.split('\n').map((s) => s.trim()).filter(Boolean),
      featured: f.featured, is_new: f.is_new, is_bestseller: f.is_bestseller, is_limited: f.is_limited,
      motor_power: f.motor_power, top_speed: f.top_speed, estimated_range: f.estimated_range, weight: f.weight,
    };

    try {
      const savedProducts = JSON.parse(localStorage.getItem('raijin_products_v1') || '[]');
      let updated;
      if (isEdit) {
        updated = savedProducts.map(p => p.id === product.id ? payload : p);
        if (!savedProducts.find(p => p.id === product.id)) updated.push(payload);
      } else {
        updated = [payload, ...savedProducts];
      }
      localStorage.setItem('raijin_products_v1', JSON.stringify(updated));

      toast({ title: isEdit ? 'Product updated' : 'Product created' });
      onSaved(payload);
    } catch (e2) { toast({ title: 'Save failed', description: e2.message, variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  const currentImgs = f.images.split('\n').filter(Boolean);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800 text-white">
        <DialogHeader><DialogTitle className="text-white">{isEdit ? 'Edit Product' : 'New Product'}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <div><Label className="text-xs text-slate-400">Name *</Label><Input className="mt-1 bg-slate-800 border-slate-700 text-white" value={f.name} onChange={(e) => set('name', e.target.value)} required /></div>

          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs text-slate-400">Price *</Label><Input type="number" step="0.01" className="mt-1 bg-slate-800 border-slate-700 text-white" value={f.price} onChange={(e) => set('price', e.target.value)} required /></div>
            <div><Label className="text-xs text-slate-400">Sale Price</Label><Input type="number" step="0.01" className="mt-1 bg-slate-800 border-slate-700 text-white" value={f.sale_price} onChange={(e) => set('sale_price', e.target.value)} /></div>
          </div>

          <div>
            <Label className="text-xs text-slate-400">Product Photos</Label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {currentImgs.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-slate-800 border border-slate-700">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 p-1 bg-black/60 rounded-full hover:bg-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-700 hover:border-primary hover:bg-primary/5 transition-all text-slate-500 hover:text-primary"
              >
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">IMPORT</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>
          </div>

          <div><Label className="text-xs text-slate-400">Category</Label>
            <select value={f.category} onChange={(e) => set('category', e.target.value)} className={input + ' mt-1 bg-slate-800 border-slate-700 text-white'}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><Label className="text-xs text-slate-400">Description</Label><Textarea rows={3} className="mt-1 bg-slate-800 border-slate-700 text-white" value={f.description} onChange={(e) => set('description', e.target.value)} /></div>

          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs text-slate-400">Motor Power</Label><Input className="mt-1 bg-slate-800 border-slate-700 text-white" value={f.motor_power} onChange={(e) => set('motor_power', e.target.value)} /></div>
            <div><Label className="text-xs text-slate-400">Top Speed</Label><Input className="mt-1 bg-slate-800 border-slate-700 text-white" value={f.top_speed} onChange={(e) => set('top_speed', e.target.value)} /></div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {[['featured', 'Featured'], ['is_new', 'New'], ['is_bestseller', 'Bestseller'], ['is_limited', 'Limited']].map(([k, label]) => (
              <label key={k} className="flex items-center gap-1.5 text-xs cursor-pointer text-slate-300"><input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} className="accent-primary" /> {label}</label>
            ))}
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Product'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
