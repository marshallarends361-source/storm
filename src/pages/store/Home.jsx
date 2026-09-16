import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/store/ProductCard';
import { Loader2, Zap, Shield, Truck, CreditCard, Star, ArrowRight, Cpu, BatteryCharging, Gauge } from 'lucide-react';

const HERO = 'https://media.base44.com/images/public/6a51082b02e209c4da4a908c/a7c93a724_generated_image.png';

const CATS = [
  { name: 'Electric Dirt Bikes', icon: Zap }, { name: 'E-Motos', icon: Gauge }, { name: 'Electric Mountain Bikes', icon: Cpu },
  { name: 'Commuter E-Bikes', icon: Truck }, { name: 'Fat-Tire E-Bikes', icon: BatteryCharging }, { name: 'Kids E-Bikes', icon: Star },
];

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Raijin Apex Pro E-Moto",
    slug: "raijin-apex-pro",
    category: "E-Motos",
    price: 4999,
    inventory_quantity: 15,
    images: [HERO],
    featured: true,
    is_new: true
  },
  {
    id: "2",
    name: "Raijin Thunder Dirt Bike",
    slug: "raijin-thunder-dirt",
    category: "Electric Dirt Bikes",
    price: 3499,
    inventory_quantity: 8,
    images: [HERO],
    is_bestseller: true,
    sale_price: 2999
  },
  {
    id: "3",
    name: "Raijin Storm Mountain Bike",
    slug: "raijin-storm-mtb",
    category: "Electric Mountain Bikes",
    price: 2199,
    inventory_quantity: 20,
    images: [HERO],
    is_new: true
  }
];

export default function Home() {
  const [allProducts, setAllProducts] = useState(MOCK_PRODUCTS);

  useEffect(() => {
    // Load from session storage safely after mount to prevent build crashes
    const saved = JSON.parse(localStorage.getItem('raijin_products_v1') || '[]');
    const mockIds = MOCK_PRODUCTS.map(m => m.id);
    const custom = saved.filter(p => !mockIds.includes(p.id));
    const updatedMocks = MOCK_PRODUCTS.map(m => saved.find(s => s.id === m.id) || m);
    setAllProducts([...custom, ...updatedMocks]);
  }, []);

  const featured = allProducts.filter(p => p.featured);
  const best = allProducts.filter(p => p.is_bestseller);
  const fresh = allProducts.filter(p => p.is_new);

  const Section = ({ title, subtitle, items, to }) => (
    items && items.length > 0 ? (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-4">
          <div><h2 className="font-display text-xl md:text-2xl font-bold tracking-wide">{title}</h2>{subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}</div>
          <Link to={to} className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">{items.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>
    ) : null
  );

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0"><img src={HERO} alt="" className="w-full h-full object-cover opacity-50" /></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
          <div className="font-display text-6xl md:text-8xl font-bold text-white text-glow tracking-wider">雷神</div>
          <div className="font-display text-2xl md:text-4xl font-bold tracking-[0.2em] mt-2">RAIJIN <span className="text-primary">E-MOTO</span></div>
          <p className="text-sm md:text-base text-muted-foreground tracking-[0.3em] uppercase mt-3">Unleash the Thunder.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
            <Link to="/shop?cat=Electric%20Dirt%20Bikes" className="btn-angular bg-primary text-primary-foreground px-7 h-12 font-semibold flex items-center justify-center gap-2 text-sm">SHOP E-BIKES <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/shop?cat=E-Motos" className="btn-angular border border-primary/60 text-white px-7 h-12 font-semibold flex items-center justify-center gap-2 text-sm hover:bg-primary/10">SHOP E-MOTOS <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="font-display text-xl md:text-2xl font-bold tracking-wide mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATS.map(({ name, icon: Icon }) => (
            <Link key={name} to={`/shop?cat=${encodeURIComponent(name)}`} className="glass-panel rounded-lg p-4 flex flex-col items-center gap-2 hover:glow-blue hover:-translate-y-0.5 transition-all">
              <Icon className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-center leading-tight">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      <Section title="Featured" subtitle="Hand-picked flagship rides" items={featured} to="/shop" />
      <Section title="Best Sellers" subtitle="Loved by the thunder tribe" items={best} to="/shop" />
      <Section title="New Arrivals & Limited Releases" subtitle="Fresh from the forge" items={fresh} to="/shop" />

      {/* WHY RAIJIN */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="font-display text-xl md:text-2xl font-bold tracking-wide mb-5 text-center">Why RAIJIN</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Zap, title: 'Electric Performance', desc: 'High-torque motors engineered for thunder.' },
            { icon: Shield, title: '2-Year Warranty', desc: 'Built to last, backed for years.' },
            { icon: Truck, title: 'Free Shipping', desc: 'Free delivery on all bikes over $999.' },
            { icon: CreditCard, title: 'Financing Available', desc: 'Affordable monthly plans at checkout.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-panel rounded-lg p-4 text-center">
              <Icon className="w-7 h-7 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">{title}</div>
              <div className="text-xs text-muted-foreground mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINANCING */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="glass-panel rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 glow-blue">
          <div><h3 className="font-display text-lg font-bold">Financing from 0% APR</h3><p className="text-sm text-muted-foreground mt-1">Split your ride into affordable monthly payments at checkout.</p></div>
          <Link to="/shop" className="btn-angular bg-primary text-primary-foreground px-6 h-11 font-semibold flex items-center gap-2">Explore Rides <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="font-display text-xl md:text-2xl font-bold tracking-wide mb-5 text-center">From the Thunder Tribe</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { name: 'Kenji T.', text: 'The Raiju dirt bike is an absolute monster. Torque for days.', rating: 5 },
            { name: 'Marcus L.', text: 'Commuter model replaced my car. Charges overnight, rides all week.', rating: 5 },
            { name: 'Sofia R.', text: 'Build quality is unreal. Feels like a premium motorcycle, not a toy.', rating: 4 },
          ].map((r) => (
            <div key={r.name} className="glass-panel rounded-lg p-4">
              <div className="flex mb-2">{[1,2,3,4,5].map((i) => <Star key={i} className={`w-4 h-4 ${i <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />)}</div>
              <p className="text-sm text-muted-foreground">"{r.text}"</p>
              <div className="text-xs font-medium mt-2">— {r.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
