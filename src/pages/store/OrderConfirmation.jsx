import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/cartContext';
import { Loader2, CheckCircle2, Package } from 'lucide-react';

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { clear } = useCart();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | paid | error
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) { setStatus('error'); setError('No payment session found.'); return; }
    let active = true;
    (async () => {
      try {
        const res = await base44.functions.invoke('confirm-order', { sessionId });
        if (!active) return;
        if (res?.paid && res?.order) { setOrder(res.order); setStatus('paid'); clear(); }
        else { setStatus('error'); setError(res?.error || 'Payment could not be confirmed.'); }
      } catch (e) {
        if (!active) return;
        setStatus('error');
        setError('Order confirmation requires the payment backend (Builder+ plan). If you completed payment on Stripe, your order will appear once the backend is enabled.');
      }
    })();
    return () => { active = false; };
  }, [sessionId]);

  if (status === 'loading') return <div className="max-w-2xl mx-auto px-4 py-24 text-center"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" /><p className="text-sm text-muted-foreground">Confirming your payment…</p></div>;

  if (status === 'error') return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="font-display text-xl font-bold mb-2">Confirmation unavailable</p>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
      <Link to="/shop" className="inline-block mt-5 text-primary text-sm">← Back to shop</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
      <h1 className="font-display text-2xl font-bold">Thank you for your order!</h1>
      <p className="text-sm text-muted-foreground mt-1">A confirmation has been sent to {order.customer_email}.</p>
      <div className="glass-panel rounded-lg p-5 mt-6 text-left">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
          <div><div className="text-xs text-muted-foreground">Order Number</div><div className="font-mono font-bold">{order.order_number}</div></div>
          <div className="text-right"><div className="text-xs text-muted-foreground">Status</div><div className="text-sm font-semibold text-emerald-400">{order.payment_status}</div></div>
        </div>
        <div className="space-y-2">
          {(order.items || []).map((it, i) => (
            <div key={i} className="flex justify-between text-sm"><span>{it.quantity} × {it.name}{it.variant ? ` (${it.variant})` : ''}</span><span>${(it.price * it.quantity).toLocaleString()}</span></div>
          ))}
        </div>
        <div className="border-t border-border pt-3 mt-3 space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${(order.subtotal || 0).toLocaleString()}</span></div>
          {order.discount_amount > 0 && <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>-${order.discount_amount.toLocaleString()}</span></div>}
          <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{(order.shipping_cost || 0) === 0 ? 'Free' : `$${order.shipping_cost}`}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>${(order.tax || 0).toLocaleString()}</span></div>
          <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span>${(order.total || 0).toLocaleString()}</span></div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4"><Package className="w-4 h-4 text-primary" /> Track this order anytime from your account.</div>
      <Link to="/account?tab=orders" className="inline-flex items-center gap-2 mt-5 btn-angular bg-primary text-primary-foreground px-6 h-11 font-semibold">View My Orders</Link>
    </div>
  );
}