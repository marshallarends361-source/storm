import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import Logo from './Logo';
import { useToast } from '@/components/ui/use-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const subscribe = (e) => { e.preventDefault(); if (email.trim()) { toast({ title: 'Subscribed', description: 'Welcome to the RAIJIN thunder.' }); setEmail(''); } };

  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="text-xs text-muted-foreground mt-3 max-w-xs">Premium Japanese-inspired electric performance. Unleash the thunder.</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Shop</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/shop?cat=E-Motos" className="hover:text-primary">E-Motos</Link></li>
            <li><Link to="/shop?cat=Electric%20Dirt%20Bikes" className="hover:text-primary">Electric Dirt Bikes</Link></li>
            <li><Link to="/shop?cat=Accessories" className="hover:text-primary">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Company</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/account" className="hover:text-primary">My Account</Link></li>
            <li><Link to="/account?tab=orders" className="hover:text-primary">Track Order</Link></li>
            <li><a href="#" className="hover:text-primary">Warranty</a></li>
            <li><a href="#" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Join the thunder</div>
          <form onSubmit={subscribe} className="flex gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" className="flex-1 h-9 px-3 rounded-md bg-secondary/60 border border-border text-sm" />
            <button className="btn-angular bg-primary text-primary-foreground px-4 h-9 text-sm font-semibold flex items-center gap-1"><Zap className="w-3.5 h-3.5" /></button>
          </form>
        </div>
      </div>
      <div className="border-t border-border py-5 flex flex-col items-center gap-2 text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} RAIJIN E-MOTO · 雷神 · All rights reserved.</div>
        <Link to="/staff/login" className="text-muted-foreground/50 hover:text-primary transition-colors">Staff Sign In</Link>
      </div>
    </footer>
  );
}