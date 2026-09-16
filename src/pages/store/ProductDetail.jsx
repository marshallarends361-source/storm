import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { stockBadge } from '@/components/store/ProductCard';
import { getRaijinProducts } from '@/lib/raijin_products';
import { ShoppingCart, Star, Truck, Shield, Zap, ChevronLeft, Minus, Plus } from 'lucide-react';

const HERO = 'https://media.base44.com/images/public/6a51082b02e209c4da4a908c/a7c93a724_generated_image.png';

export default function ProductDetail() {
  const { slug } = useParams();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviews, setReviews] = useState([
    { id: '1', customer_name: 'Kenji T.', rating: 5, text: 'The Raiju dirt bike is an absolute monster. Torque for days.' }
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const { add } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const products = getRaijinProducts();
    const found = products.find(m => m.slug === slug || m.id === slug);
    setProduct(found || null);
  }, [slug]);

  if (!product) return <div className="text-center py-24"><p className="text-muted-foreground">Product not found.</p><Link to="/shop" className="text-primary text-sm mt-2 inline-block">← Back to shop</Link></div>;

  const onSale = product.sale_price != null && product.sale_price > 0 && product.sale_price < product.price;
  const badge = stockBadge(product.inventory_quantity ?? 0);
  const images = product.images?.length ? product.images : [HERO];
  const specs = [
    ['Motor Power', product.motor_power], ['Battery Voltage', product.battery_voltage], ['Battery Capacity', product.battery_capacity],
    ['Estimated Range', product.estimated_range], ['Top Speed', product.top_speed], ['Charge Time', product.charge_time],
    ['Weight', product.weight], ['Suspension', product.suspension], ['Brakes', product.brakes], ['Tire Size', product.tire_size], ['Frame', product.frame_info],
  ].filter(([, v]) => v);

  const addToCart = () => {
    if ((product.inventory_quantity ?? 0) <= 0) { toast({ title: 'Out of stock', variant: 'destructive' }); return; }
    add(product, '', qty);
    toast({ title: 'Added to cart', description: `${qty} × ${product.name}` });
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!newReview.text.trim()) return;
    const simulatedReview = {
      id: Math.random().toString(),
      customer_name: user?.full_name || "Marshall Arends",
      rating: newReview.rating,
      text: newReview.text
    };
    setReviews([simulatedReview, ...reviews]);
    setNewReview({ rating: 5, text: '' });
    toast({ title: 'Review submitted', description: 'Thank you for your feedback!' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Link to="/shop" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-4"><ChevronLeft className="w-3.5 h-3.5" /> Back to shop</Link>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="glass-panel rounded-lg overflow-hidden aspect-square bg-secondary/40">
            {images[activeImg] ? <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Zap className="w-16 h-16" /></div>}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">{product.category}</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">${(onSale ? product.sale_price : product.price).toLocaleString()}</span>
              {onSale && <span className="text-sm text-muted-foreground line-through">${product.price.toLocaleString()}</span>}
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badge.cls}`}>{badge.label}</span>
          </div>

          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center border border-border rounded-md">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 h-10 hover:text-primary"><Minus className="w-4 h-4" /></button>
              <span className="px-4 font-mono">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 h-10 hover:text-primary"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={addToCart} disabled={(product.inventory_quantity ?? 0) <= 0} className="btn-angular flex-1 h-10 bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-40">
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5 text-xs">
            <div className="glass-panel rounded-md p-2 text-center"><Truck className="w-4 h-4 mx-auto text-primary mb-1" /><div className="text-muted-foreground">Free shipping on bikes</div></div>
            <div className="glass-panel rounded-md p-2 text-center"><Shield className="w-4 h-4 mx-auto text-primary mb-1" /><div className="text-muted-foreground">{product.warranty || '2-yr warranty'}</div></div>
            <div className="glass-panel rounded-md p-2 text-center"><Zap className="w-4 h-4 mx-auto text-primary mb-1" /><div className="text-muted-foreground">Financing available</div></div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold mb-3">Customer Reviews</h2>
        <div className="space-y-2">
          {reviews.map((r) => (
            <div key={r.id} className="glass-panel rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{r.customer_name}</span>
                <span className="flex">{[1,2,3,4,5].map((i) => <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{r.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submitReview} className="glass-panel rounded-lg p-4 mt-4">
          <h3 className="font-semibold text-sm mb-2">Write a Review</h3>
          <div className="flex items-center gap-2 mb-2">
            {[1,2,3,4,5].map((i) => (
              <button key={i} type="button" onClick={() => setNewReview({ ...newReview, rating: i })}><Star className={`w-5 h-5 ${i <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} /></button>
            ))}
          </div>
          <textarea value={newReview.text} onChange={(e) => setNewReview({ ...newReview, text: e.target.value })} placeholder="Share your experience…" rows={3} className="w-full bg-input border border-border rounded-md p-2 text-sm" />
          <button type="submit" className="mt-2 h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-semibold">Submit Review</button>
        </form>
      </div>
    </div>
  );
}
