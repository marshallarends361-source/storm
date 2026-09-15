import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2, ShoppingCart, DollarSign, Package, AlertTriangle, Star } from 'lucide-react';

export default function StaffDashboard() {
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState(null);
  const [pendingReviews, setPendingReviews] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [o, p, r] = await Promise.all([
          base44.entities.Order.list('-created_date', 100),
          base44.entities.Product.list('-created_date', 200),
          base44.entities.Review.filter({ approved: false }, '-created_date', 50),
        ]);
        if (!active) return;
        setOrders(o || []); setProducts(p || []); setPendingReviews(r || []);
      } catch {
        if (active) { setOrders([]); setProducts([]); setPendingReviews([]); }
      }
    })();
    return () => { active = false; };
  }, []);

  if (!orders || !products || pendingReviews === null) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  const revenue = orders.filter((o) => o.payment_status === 'Paid').reduce((s, o) => s + (o.total || 0), 0);
  const lowStock = products.filter((p) => (p.inventory_quantity ?? 0) <= 10);
  const recent = orders.slice(0, 6);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, to: '/staff/orders' },
    { label: 'Revenue (Paid)', value: `$${revenue.toLocaleString()}`, icon: DollarSign, to: '/staff/orders' },
    { label: 'Products', value: products.length, icon: Package, to: '/staff/products' },
    { label: 'Pending Reviews', value: pendingReviews.length, icon: Star, to: '/staff/reviews' },
  ];

  return (
    <div>
      <h1 className="font-display text-xl md:text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to} className="glass-panel rounded-lg p-4 hover:glow-blue transition-all">
            <div className="flex items-center justify-between"><Icon className="w-5 h-5 text-primary" /><span className="text-2xl font-bold">{value}</span></div>
            <div className="text-xs text-muted-foreground mt-2">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center justify-between mb-3"><h2 className="font-semibold text-sm">Recent Orders</h2><Link to="/staff/orders" className="text-xs text-primary hover:underline">View all</Link></div>
          {recent.length === 0 ? <p className="text-sm text-muted-foreground">No orders yet.</p> : (
            <div className="space-y-2">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0"><div className="font-mono text-xs truncate">{o.order_number}</div><div className="text-xs text-muted-foreground truncate">{o.customer_email}</div></div>
                  <div className="text-right"><div className="font-medium">${(o.total || 0).toLocaleString()}</div><div className="text-[10px] text-emerald-400">{o.payment_status}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center justify-between mb-3"><h2 className="font-semibold text-sm flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-400" /> Low Stock</h2><Link to="/staff/products" className="text-xs text-primary hover:underline">Manage</Link></div>
          {lowStock.length === 0 ? <p className="text-sm text-muted-foreground">All products well stocked.</p> : (
            <div className="space-y-2">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{p.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${p.inventory_quantity <= 0 ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'}`}>{p.inventory_quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}