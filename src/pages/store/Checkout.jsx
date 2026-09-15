import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/cartContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, ArrowLeft, Zap } from 'lucide-react';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shippingRates, setShippingRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '', name: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'United States', phone: '',
    shippingMethod: 'Standard', discount: params.get('discount') || '',
  });

  useEffect(() => {
    (async () => {
      try {
        const rates = await base44.entities.ShippingRate.filter({ active: true });
        setShippingRates(rates || []);
        if (rates?.length && !form.shippingMethod) setForm((f) => ({ ...f, shippingMethod: rates[0].method }));
      } catch { /* ignore */ }
    })();
  }, []);

  const shippingCost = (shippingRates.find((r) => r.method === form.shippingMethod)?.cost) ?? (subtotal >= 999 ? 0 : 99);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shippingCost + tax;

  const set = (k, v) => setForm({ ...form, [k]: v });

  const pay = async (e) => {
    e.preventDefault();
    if (!items.length) { toast({ title: 'Cart is empty', variant: 'destructive' }); return; }
    if (!form.email || !form.name || !form.line1 || !form.city || !form.state || !form.zip) {
      toast({ title: 'Please complete all required fields', variant: 'destructive' }); return;
    }
    setLoading(true);
    try {
      const origin = window.location.origin;
      const res = await base44.functions.invoke('create-checkout-session', {
        items: items.map((i) => ({ productId: i.productId, variant: i.variant, quantity: i.quantity })),
        shippingMethod: form.shippingMethod,
        discountCode: form.discount,
        customerEmail: form.email,
        customerName: form.name,
        successUrl: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/cart`,
      });
      if (res?.url) {
        clear();
        window.location.href = res.url;
      } else {
        toast({ title: 'Checkout unavailable', description: res?.error || 'Could not start payment session.', variant: 'destructive' });
      }
    } catch (err) {
      toast({
        title: 'Live payments not yet enabled',
        description: 'Real Stripe checkout requires a Builder+ plan and a Stripe secret key. Add the backend function and your key to enable payments.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">Your cart is empty.</p><button onClick={() => navigate('/shop')} className="text-primary text-sm mt-2">← Shop</button></div>;
  }

  const input = 'h-10 px-3 rounded-md bg-input border border-border text-sm w-full';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button onClick={() => navigate('/cart')} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="w-3.5 h-3.5" /> Back to cart</button>
      <h1 className="font-display text-2xl font-bold mb-5">Checkout</h1>
      <form onSubmit={pay} className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <div className="glass-panel rounded-lg p-4">
            <h2 className="font-semibold text-sm mb-3">Contact</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              <input className={input} placeholder="Email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
              <input className={input} placeholder="Full name" required value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
          </div>
          <div className="glass-panel rounded-lg p-4">
            <h2 className="font-semibold text-sm mb-3">Shipping Address</h2>
            <div className="space-y-2">
              <input className={input} placeholder="Address line 1" required value={form.line1} onChange={(e) => set('line1', e.target.value)} />
              <input className={input} placeholder="Apartment, suite, etc. (optional)" value={form.line2} onChange={(e) => set('line2', e.target.value)} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <input className={input} placeholder="City" required value={form.city} onChange={(e) => set('city', e.target.value)} />
                <input className={input} placeholder="State" required value={form.state} onChange={(e) => set('state', e.target.value)} />
                <input className={input} placeholder="ZIP" required value={form.zip} onChange={(e) => set('zip', e.target.value)} />
              </div>
              <input className={input} placeholder="Phone (optional)" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
          </div>
          <div className="glass-panel rounded-lg p-4">
            <h2 className="font-semibold text-sm mb-3">Shipping Method</h2>
            <div className="space-y-2">
              {(shippingRates.length ? shippingRates : [{ method: 'Standard', cost: subtotal >= 999 ? 0 : 99, estimated_days: '5-7 days' }]).map((r) => (
                <label key={r.method} className={`flex items-center justify-between p-3 rounded-md border cursor-pointer ${form.shippingMethod === r.method ? 'border-primary bg-primary/10' : 'border-border'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="ship" checked={form.shippingMethod === r.method} onChange={() => set('shippingMethod', r.method)} className="accent-primary" />
                    <div><div className="text-sm font-medium">{r.method}</div><div className="text-xs text-muted-foreground">{r.estimated_days || ''}</div></div>
                  </div>
                  <span className="text-sm font-medium">{r.cost === 0 ? 'Free' : `$${r.cost}`}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-4 h-fit sticky top-20">
          <h2 className="font-semibold text-sm mb-3">Order Summary</h2>
          <div className="space-y-2 max-h-52 overflow-auto">
            {items.map((it) => (
              <div key={it.key} className="flex gap-2 text-sm">
                <div className="w-12 h-12 rounded bg-secondary/40 overflow-hidden shrink-0">{it.image && <img src={it.image} alt="" className="w-full h-full object-cover" />}</div>
                <div className="flex-1 min-w-0"><div className="line-clamp-1">{it.name}</div><div className="text-xs text-muted-foreground">Qty {it.quantity}</div></div>
                <div className="font-medium">${(it.price * it.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input className={input} placeholder="Discount code" value={form.discount} onChange={(e) => set('discount', e.target.value.toUpperCase())} />
          </div>
          <div className="space-y-1.5 text-sm mt-3 border-t border-border pt-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${tax.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-base pt-1.5 border-t border-border"><span>Total</span><span>${total.toLocaleString()}</span></div>
          </div>
          <button type="submit" disabled={loading} className="btn-angular w-full mt-4 h-11 bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4" /> Pay ${total.toLocaleString()}</>}
          </button>
          <p className="text-[11px] text-muted-foreground mt-2 flex items-center justify-center gap-1"><Zap className="w-3 h-3 text-primary" /> Secured by Stripe · We never store card data</p>
        </div>
      </form>
    </div>
  );
}