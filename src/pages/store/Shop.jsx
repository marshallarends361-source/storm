import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ProductCard from '@/components/store/ProductCard';
import { Loader2, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  'Electric Dirt Bikes', 'E-Motos', 'Electric Mountain Bikes', 'Commuter E-Bikes',
  'Fat-Tire E-Bikes', 'Kids E-Bikes', 'Batteries', 'Chargers',
  'Replacement Parts', 'Performance Parts', 'Accessories', 'Helmets & Safety Gear',
];

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Raijin Apex Pro E-Moto",
    slug: "raijin-apex-pro",
    category: "E-Motos",
    price: 4999,
    inventory_quantity: 15,
    images: ["https://media.base44.com/images/public/6a51082b02e209c4da4a908c/a7c93a724_generated_image.png"],
    featured: true,
    is_new: true,
    description: "Ultimate flagship electric supermoto with extreme peak power."
  },
  {
    id: "2",
    name: "Raijin Thunder Dirt Bike",
    slug: "raijin-thunder-dirt",
    category: "Electric Dirt Bikes",
    price: 3499,
    inventory_quantity: 8,
    images: ["https://media.base44.com/images/public/6a51082b02e209c4da4a908c/a7c93a724_generated_image.png"],
    is_bestseller: true,
    sale_price: 2999,
    description: "High torque electric dirt bike built for rough offroad trails."
  },
  {
    id: "3",
    name: "Raijin Storm Mountain Bike",
    slug: "raijin-storm-mtb",
    category: "Electric Mountain Bikes",
    price: 2199,
    inventory_quantity: 20,
    images: ["https://media.base44.com/images/public/6a51082b02e209c4da4a908c/a7c93a724_generated_image.png"],
    is_new: true,
    description: "Premium carbon frame trail tracker with intuitive pedal assist."
  }
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') || '';
  const q = params.get('q') || '';
  const [products, setProducts] = useState(null);
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    let active = true;
    (async () => {
      setProducts(null);
      try {
        const list = await base44.entities.Product.list('-created_date', 200);
        if (!active) return;
        setProducts(list && list.length > 0 ? list : MOCK_PRODUCTS);
      } catch {
        if (active) setProducts(MOCK_PRODUCTS);
      }
    })();
    return () => { active = false; };
  }, []);

  let filtered = products || [];
  if (cat) filtered = filtered.filter((p) => p.category === cat);
  if (q) filtered = filtered.filter((p) => (p.name + p.description + p.category).toLowerCase().includes(q.toLowerCase()));
  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
  if (sort === 'new') filtered = [...filtered].sort((a, b) => (b.is_new === true) - (a.is_new === true));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">{cat || (q ? `Results for "${q}"` : 'All Products')}</h1>
        <p className="text-xs text-muted-foreground mt-1">Unleash the thunder — premium electric performance.</p>
      </div>

      <div className="flex gap-4">
        <aside className="hidden md:block w-52 shrink-0">
          <div className="glass-panel rounded-lg p-3 sticky top-20">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2"><SlidersHorizontal className="w-3.5 h-3.5" /> Categories</div>
            <ul className="space-y-1">
              <li><button onClick={() => setParams({})} className={`text-sm w-full text-left px-2 py-1.5 rounded ${!cat ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}>All Products</button></li>
              {CATEGORIES.map((c) => (
                <li key={c}><button onClick={() => setParams({ cat: c })} className={`text-sm w-full text-left px-2 py-1.5 rounded ${cat === c ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}>{c}</button></li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <select value={cat} onChange={(e) => setParams(e.target.value ? { cat: e.target.value } : {})} className="md:hidden h-9 px-2 rounded-md bg-secondary border border-border text-sm">
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="text-xs text-muted-foreground hidden md:block">{filtered.length} products</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 px-2 rounded-md bg-secondary border border-border text-sm">
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {!products ? (
            <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground text-sm">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}