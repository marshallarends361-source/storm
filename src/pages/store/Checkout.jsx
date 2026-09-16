import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/lib/cartContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, ArrowLeft, Zap, CreditCard, Apple, Wallet } from 'lucide-react';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shippingRates] = useState([{ method: 'Standard', cost: subtotal >= 999 ? 0 : 99, estimated_days: '5-7 days' }]);
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState('card');
  const [cardNum, setCardNum] = useState('');
  const [form, setForm] = useState({
    email: '', name: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'United States', phone: '',
    shippingMethod: 'Standard', discount: params.get('discount') || '',
  });

  const isOwnerCard = cardNum.replace(/\s/g, '') === '9999999999999999';
  const shippingCost = subtotal >= 999 ? 0 : 99;
  const tax = isOwnerCard ? 0 : Math.round(subtotal * 0.08 * 100) / 100;
  const total = isOwnerCard ? 0 : (subtotal + shippingCost + tax);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const pay = (e) => {
    e.preventDefault();
    if (!items.length) return;
    if (!form.email || !form.name || !form.line1 || !form.city || !form.state || !form.zip) {
      toast({ title: 'Please complete all fields', variant: 'destructive' }); return;
    }
    setLoading(true);
    setTimeout(() => {
      clear();
      window.location.href = `/order-confirmation?session_id=CS_DEMO_${Math.floor(Math.random() * 100000)}`;
    }, 2000);
  };

  if (!items.length) return <div className="py-20 text-center text-muted-foreground">Cart empty.</div>;

  const input = 'h-10 px-3 rounded-md bg-slate-800/50 border border-slate-700 text-sm w-full focus:border-primary outline-none transition-colors';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button onClick={() => navigate('/cart')} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-4 transition-colors"><ArrowLeft className="w-3.5 h-3.5" /> Back to cart</button>
      <h1 className="font-display text-3xl font-bold mb-6 tracking-tight">Checkout</h1>

      <form onSubmit={pay} className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl p-5 border-primary/20">
            <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Delivery Info</h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <input className={input} placeholder="Email Address" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
              <input className={input} placeholder="Full Name" required value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="space-y-3">
              <input className={input} placeholder="Address Line 1" required value={form.line1} onChange={(e) => set('line1', e.target.value)} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <input className={input} placeholder="City" required value={form.city} onChange={(e) => set('city', e.target.value)} />
                <input className={input} placeholder="State" required value={form.state} onChange={(e) => set('state', e.target.value)} />
                <input className={input} placeholder="ZIP Code" required value={form.zip} onChange={(e) => set('zip', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5">
            <h2 className="font-semibold text-sm mb-4">Payment Method</h2>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[ { id: 'card', icon: CreditCard, label: 'Card' }, { id: 'apple', icon: Apple, label: 'Apple Pay' }, { id: 'cashapp', icon: Wallet, label: 'Cash App' } ].map((m) => (
                <button key={m.id} type="button" onClick={() => setPayMethod(m.id)} className={`flex flex-col items-center justify-center py-3 rounded-lg border transition-all ${payMethod === m.id ? 'border-primary bg-primary/10 text-primary' : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-500'}`}>
                  <m.icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                </button>
              ))}
            </div>

            {payMethod === 'card' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <input className={input} placeholder="Card Number (9999 9999 9999 9999 for Owner Card)" value={cardNum} onChange={(e) => setCardNum(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <input className={input} placeholder="MM / YY" />
                  <input className={input} placeholder="CVC" />
                </div>
              </div>
            )}

            {(payMethod === 'apple' || payMethod === 'cashapp') && (
              <div className="py-4 text-center border-2 border-dashed border-slate-700 rounded-lg text-slate-500 text-xs">
                {payMethod === 'apple' ? 'Click "Pay" to trigger Apple Pay sheet' : 'Click "Pay" to open Cash App'}
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 h-fit sticky top-24 border-primary/30">
          <h2 className="font-semibold text-sm mb-4">Order Summary</h2>
          {isOwnerCard && <div className="mb-4 p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-lg text-[11px] text-amber-300 font-medium animate-pulse">⚡ OWNER DISCOUNT APPLIED: $0.00 DUE</div>}

          <div className="space-y-3 mb-4 max-h-60 overflow-auto pr-1">
            {items.map((it) => (
              <div key={it.key} className="flex gap-3 text-xs">
                <div className="w-10 h-10 rounded bg-slate-800 overflow-hidden shrink-0 border border-slate-700">{it.image && <img src={it.image} alt="" className="w-full h-full object-cover" />}</div>
                <div className="flex-1 min-w-0"><div className="font-medium truncate">{it.name}</div><div className="text-slate-500">Qty {it.quantity}</div></div>
                <div className="font-bold">${(it.price * it.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs border-t border-slate-800 pt-4 mb-5">
            <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-slate-400"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span></div>
            <div className="flex justify-between text-slate-400"><span>Estimated Tax</span><span>${tax.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-base text-white pt-2 border-t border-slate-800 mt-2"><span>Total</span><span className={isOwnerCard ? 'text-amber-400' : ''}>${total.toLocaleString()}</span></div>
          </div>

          <button type="submit" disabled={loading} className="btn-angular w-full h-12 bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:glow-blue transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4" /> PAY ${total.toLocaleString()}</>}
          </button>
          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-slate-500 font-medium uppercase tracking-widest">
            <Zap className="w-3 h-3 text-primary" /> Verified Secured Checkout
          </div>
        </div>
      </form>
    </div>
  );
}
