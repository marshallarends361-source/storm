import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/AuthContext';

const CATEGORIES = [
  'Electric Dirt Bikes', 'E-Motos', 'Electric Mountain Bikes', 'Commuter E-Bikes',
  'Fat-Tire E-Bikes', 'Kids E-Bikes', 'Batteries', 'Chargers',
  'Replacement Parts', 'Performance Parts', 'Accessories', 'Helmets & Safety Gear',
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="shrink-0"><Logo /></Link>

        <form onSubmit={submitSearch} className="hidden md:flex items-center flex-1 max-w-md">
          <div className="flex w-full items-center bg-secondary/60 border border-border rounded-md overflow-hidden">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search e-bikes, e-motos…" className="flex-1 bg-transparent px-3 h-9 text-sm outline-none" />
            <button type="submit" className="px-3 text-muted-foreground hover:text-primary"><Search className="w-4 h-4" /></button>
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <Link to="/shop?cat=E-Motos" className="hover:text-primary transition-colors">E-Motos</Link>
          <Link to="/shop?cat=Electric%20Dirt%20Bikes" className="hover:text-primary transition-colors">Dirt Bikes</Link>
          <Link to="/account" className="hover:text-primary transition-colors flex items-center gap-1"><User className="w-4 h-4" />{user ? 'Account' : 'Sign In'}</Link>
        </nav>

        <div className="flex items-center gap-1">
          <Link to="/cart" className="relative p-2 hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">{count}</span>}
          </Link>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-2">
          <form onSubmit={submitSearch} className="flex items-center bg-secondary/60 border border-border rounded-md overflow-hidden">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="flex-1 bg-transparent px-3 h-9 text-sm outline-none" />
            <button type="submit" className="px-3 text-muted-foreground"><Search className="w-4 h-4" /></button>
          </form>
          <Link to="/shop" onClick={() => setOpen(false)} className="block py-1.5 text-sm">Shop All</Link>
          {CATEGORIES.slice(0, 6).map((c) => (
            <Link key={c} to={`/shop?cat=${encodeURIComponent(c)}`} onClick={() => setOpen(false)} className="block py-1.5 text-sm text-muted-foreground">{c}</Link>
          ))}
          <Link to="/account" onClick={() => setOpen(false)} className="block py-1.5 text-sm text-primary">Account / Sign In</Link>
        </div>
      )}
    </header>
  );
}