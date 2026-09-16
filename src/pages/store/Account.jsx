import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Package, User, MapPin, Heart, Plus, Trash2, Loader2 } from 'lucide-react';

const MOCK_ORDERS = [
  {
    id: "1",
    order_number: "ORD-9921",
    created_date: new Date().toISOString(),
    total: 4999,
    payment_status: "Paid",
    fulfillment_status: "Processing",
    items: [{ quantity: 1, name: "Raijin Apex Pro E-Moto" }]
  }
];

export default function Account() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'orders';
  const { toast } = useToast();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [addresses, setAddresses] = useState([
    { id: '1', label: 'Home', line1: '123 Thunder Road', city: 'Oklahoma City', state: 'OK', zip: '73102' }
  ]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState({});
  const [name, setName] = useState('');
  const [newAddr, setNewAddr] = useState({ line1: '', city: '', state: '', zip: '', label: 'Home' });

  useEffect(() => { if (user) setName(user.full_name || 'Marshall Arends'); }, [user]);

  useEffect(() => {
    if (!user) return;
    setOrders(MOCK_ORDERS);
  }, [user]);

  if (!user) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">Please sign in to view your account.</p></div>;

  const saveName = async () => {
    toast({ title: 'Profile updated' });
  };

  const addAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.line1 || !newAddr.city || !newAddr.state || !newAddr.zip) return;
    const a = { ...newAddr, id: Math.random().toString() };
    setAddresses([...addresses, a]);
    setNewAddr({ line1: '', city: '', state: '', zip: '', label: 'Home' });
    toast({ title: 'Address added' });
  };

  const removeAddress = async (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast({ title: 'Address removed' });
  };

  const removeWish = async (id) => {
    setWishlist(wishlist.filter((w) => w.id !== id));
    toast({ title: 'Removed from wishlist' });
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