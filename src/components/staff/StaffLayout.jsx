import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import Logo from '@/components/store/Logo';
import { LayoutDashboard, ShoppingCart, Package, Tag, Star, Store, LogOut } from 'lucide-react';

const NAV = [
  { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/staff/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/staff/products', label: 'Products', icon: Package },
  { to: '/staff/discounts', label: 'Discounts', icon: Tag },
  { to: '/staff/reviews', label: 'Reviews', icon: Star },
];

export default function StaffLayout() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const itemCls = (to) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap ${loc.pathname === to ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <aside className="md:w-56 border-b md:border-b-0 md:border-r border-border bg-card/50 md:sticky md:top-0 md:min-h-screen flex md:flex-col">
        <div className="p-3 md:p-4 flex items-center justify-between">
          <Logo size="sm" showWord={false} />
          <div className="md:hidden text-[10px] text-primary font-semibold tracking-widest">STAFF</div>
          <div className="hidden md:block text-[10px] text-primary font-semibold tracking-widest mt-1">STAFF PORTAL</div>
        </div>
        <nav className="flex md:flex-col gap-1 px-2 pb-2 md:pb-4 overflow-x-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={itemCls(to)}><Icon className="w-4 h-4 shrink-0" /> {label}</Link>
          ))}
          <Link to="/" className={itemCls('/')}><Store className="w-4 h-4 shrink-0" /> View Store</Link>
          <button onClick={() => logout()} className={itemCls('#') + ' hover:text-destructive'}><LogOut className="w-4 h-4 shrink-0" /> Logout</button>
        </nav>
        <div className="hidden md:block text-[10px] text-muted-foreground px-4 pb-3 mt-auto truncate">{user?.email}</div>
      </aside>
      <main className="flex-1 p-4 md:p-6 min-w-0"><Outlet /></main>
    </div>
  );
}