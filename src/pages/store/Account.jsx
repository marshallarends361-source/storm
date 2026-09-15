import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Package, User, MapPin, Heart, Plus, Trash2, Loader2 } from 'lucide-react';

export default function Account() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'orders';
  const { toast } = useToast();
  const [orders, setOrders] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState({});
  const [name, setName] = useState('');
  const [newAddr, setNewAddr] = useState({ line1: '', city: '', state: '', zip: '', label: 'Home' });

  useEffect(() => { if (user) setName(user.full_name || ''); }, [user]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      try {
        const ords = await base44.entities.Order.filter({ customer_email: user.email }, '-created_date', 50);
        if (active) setOrders(ords || []);
      } catch { if (active) setOrders([]); }
      try {
        const addrs = await base44.entities.Address.filter({ customer_id: user.id });
        if (active) setAddresses(addrs || []);
      } catch { /* ignore */ }
      try {
        const wl = await base44.entities.Wishlist.filter({ customer_id: user.id });
        if (active) {
          setWishlist(wl || []);
          const ids = (wl || []).map((w) => w.product_id);
          if (ids.length) {
            const prods = await base44.entities.Product.list('-created_date', 200);
            const map = {};
            prods.forEach((p) => { if (ids.includes(p.id)) map[p.id] = p; });
            if (active) setProducts(map);
          }
        }
      } catch { /* ignore */ }
    })();
    return () => { active = false; };
  }, [user]);

  if (!user) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">Please sign in to view your account.</p></div>;

  const saveName = async () => {
    try { await base44.auth.updateMe({ full_name: name }); toast({ title: 'Profile updated' }); } catch (e) { toast({ title: 'Failed', description: e.message, variant: 'destructive' }); }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.line1 || !newAddr.city || !newAddr.state || !newAddr.zip) return;
    try {
      const a = await base44.entities.Address.create({ ...newAddr, customer_id: user.id });
      setAddresses([...addresses, a]);
      setNewAddr({ line1: '', city: '', state: '', zip: '', label: 'Home' });
      toast({ title: 'Address added' });
    } catch (e) { toast({ title: 'Failed', description: e.message, variant: 'destructive' }); }
  };

  const removeAddress = async (id) => {
    await base44.entities.Address.delete(id);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const removeWish = async (id) => {
    await base44.entities.Wishlist.delete(id);
    setWishlist(wishlist.filter((w) => w.id !== id));
  };

  const tabs = [['orders', 'Orders', Package], ['profile', 'Profile', User], ['addresses', 'Addresses', MapPin], ['wishlist', 'Wishlist', Heart]];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl font-bold mb-1">My Account</h1>
      <p className="text-xs text-muted-foreground mb-5">{user.email}</p>

      <div className="flex gap-1 glass-panel rounded-lg p-1 mb-5 overflow-x-auto">
        {tabs.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setParams({ tab: id })} className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap ${tab === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}><Icon className="w-3.5 h-3.5" /> {label}</button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="space-y-3">
          {!orders ? <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div> :
           orders.length === 0 ? <p className="text-sm text-muted-foreground">No orders yet.</p> :
           orders.map((o) => (
            <div key={o.id} className="glass-panel rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div><div className="font-mono text-sm font-bold">{o.order_number}</div><div className="text-xs text-muted-foreground">{new Date(o.created_date).toLocaleDateString()}</div></div>
                <div className="text-right"><div className="text-sm font-bold">${(o.total || 0).toLocaleString()}</div><div className="text-xs text-emerald-400">{o.payment_status}</div></div>
              </div>
              <div className="text-xs text-muted-foreground">{(o.items || []).map((i) => `${i.quantity}× ${i.name}`).join(', ')}</div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground">{o.fulfillment_status}</span>
                {o.tracking_number && <span className="text-primary">Tracking: {o.tracking_number}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'profile' && (
        <div className="glass-panel rounded-lg p-4 max-w-md">
          <h2 className="font-semibold text-sm mb-3">Profile</h2>
          <label className="text-xs text-muted-foreground">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 rounded-md bg-input border border-border text-sm mt-1" />
          <input value={user.email} disabled className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-sm mt-2 text-muted-foreground" />
          <button onClick={saveName} className="mt-3 h-10 px-5 bg-primary text-primary-foreground rounded-md text-sm font-semibold">Save</button>
        </div>
      )}

      {tab === 'addresses' && (
        <div className="max-w-md space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="glass-panel rounded-lg p-3 flex justify-between">
              <div className="text-sm"><div className="font-medium">{a.label || 'Address'}</div><div className="text-muted-foreground">{a.line1}, {a.city}, {a.state} {a.zip}</div></div>
              <button onClick={() => removeAddress(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <form onSubmit={addAddress} className="glass-panel rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Address</h3>
            <div className="space-y-2">
              <input value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })} placeholder="Address" className="w-full h-10 px-3 rounded-md bg-input border border-border text-sm" />
              <div className="grid grid-cols-3 gap-2">
                <input value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} placeholder="City" className="h-10 px-3 rounded-md bg-input border border-border text-sm" />
                <input value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} placeholder="State" className="h-10 px-3 rounded-md bg-input border border-border text-sm" />
                <input value={newAddr.zip} onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })} placeholder="ZIP" className="h-10 px-3 rounded-md bg-input border border-border text-sm" />
              </div>
              <button type="submit" className="h-10 px-5 bg-primary text-primary-foreground rounded-md text-sm font-semibold">Add</button>
            </div>
          </form>
        </div>
      )}

      {tab === 'wishlist' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {wishlist.length === 0 ? <p className="text-sm text-muted-foreground col-span-full">Your wishlist is empty.</p> :
           wishlist.map((w) => {
             const p = products[w.product_id];
             if (!p) return null;
             return (
               <div key={w.id} className="glass-panel rounded-lg p-3">
                 <div className="aspect-square rounded bg-secondary/40 overflow-hidden mb-2">{p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}</div>
                 <div className="text-sm font-medium line-clamp-1">{p.name}</div>
                 <div className="flex items-center justify-between mt-1">
                   <span className="font-bold">${(p.sale_price ?? p.price).toLocaleString()}</span>
                   <button onClick={() => removeWish(w.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                 </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
}