import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/cartContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';

export default function Cart() {
  const { items, remove, updateQty, subtotal } = useCart();
  const [discount, setDiscount] = useState('');
  const navigate = useNavigate();
  const shipping = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground mt-2">Unleash the thunder — find your ride.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 mt-5 btn-angular bg-primary text-primary-foreground px-6 h-11 font-semibold">Shop Now <ArrowRight className="w-4 h-4" /></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-5">Shopping Cart</h1>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-2">
          {items.map((it) => (
            <div key={it.key} className="glass-panel rounded-lg p-3 flex gap-3">
              <Link to={`/product/${it.slug || it.productId}`} className="w-20 h-20 rounded-md overflow-hidden bg-secondary/40 shrink-0">
                {it.image && <img src={it.image} alt={it.name} className="w-full h-full object-cover" />}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${it.slug || it.productId}`} className="font-medium text-sm hover:text-primary line-clamp-1">{it.name}</Link>
                {it.variant && <div className="text-xs text-muted-foreground">{it.variant}</div>}
                <div className="text-sm font-bold mt-1">${it.price.toLocaleString()}</div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <div className="flex items-center border border-border rounded-md">
                  <button onClick={() => updateQty(it.key, it.quantity - 1)} className="px-2 h-8 hover:text-primary"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="px-2 text-sm font-mono">{it.quantity}</span>
                  <button onClick={() => updateQty(it.key, it.quantity + 1)} className="px-2 h-8 hover:text-primary"><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <button onClick={() => remove(it.key)} className="text-muted-foreground hover:text-destructive text-xs flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
              </div>
            </div>
          ))}
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2">← Continue shopping</Link>
        </div>

        <div className="glass-panel rounded-lg p-4 h-fit sticky top-20">
          <h2 className="font-semibold text-sm mb-3">Order Summary</h2>
          <div className="flex gap-2 mb-3">
            <div className="flex items-center flex-1 bg-secondary/60 border border-border rounded-md">
              <Tag className="w-3.5 h-3.5 ml-2 text-muted-foreground" />
              <input value={discount} onChange={(e) => setDiscount(e.target.value.toUpperCase())} placeholder="Discount code" className="flex-1 bg-transparent px-2 h-9 text-sm outline-none" />
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (est. 8%)</span><span>${tax.toLocaleString()}</span></div>
            <div className="border-t border-border pt-1.5 flex justify-between font-bold text-base"><span>Total</span><span>${total.toLocaleString()}</span></div>
          </div>
          <button onClick={() => navigate(`/checkout${discount ? `?discount=${discount}` : ''}`)} className="btn-angular w-full mt-4 h-11 bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2">Checkout <ArrowRight className="w-4 h-4" /></button>
          <p className="text-[11px] text-muted-foreground mt-2 text-center">Secure checkout · Free shipping over $999</p>
        </div>
      </div>
    </div>
  );
}