import { Link } from 'react-router-dom';
import { ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useToast } from '@/components/ui/use-toast';

export function stockBadge(qty) {
  if (qty <= 0) return { label: 'OUT OF STOCK', cls: 'bg-red-500/15 text-red-400' };
  if (qty <= 10) return { label: 'LOW STOCK', cls: 'bg-amber-500/15 text-amber-400' };
  return { label: 'IN STOCK', cls: 'bg-emerald-500/15 text-emerald-400' };
}

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { toast } = useToast();
  const onSale = product.sale_price != null && product.sale_price > 0 && product.sale_price < product.price;
  const badge = stockBadge(product.inventory_quantity ?? 0);

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if ((product.inventory_quantity ?? 0) <= 0) { toast({ title: 'Out of stock', variant: 'destructive' }); return; }
    add(product);
    toast({ title: 'Added to cart', description: product.name });
  };

  return (
    <Link to={`/product/${product.slug || product.id}`} className="group glass-panel rounded-lg overflow-hidden flex flex-col transition-all hover:glow-blue hover:-translate-y-0.5">
      <div className="relative aspect-square bg-secondary/40 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Zap className="w-10 h-10" /></div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {onSale && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary text-primary-foreground">SALE</span>}
          {product.is_new && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-black">NEW</span>}
          {product.is_limited && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-black">LIMITED</span>}
        </div>
        <span className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded ${badge.cls}`}>{badge.label}</span>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <div className="text-[10px] uppercase tracking-widest text-primary/80 font-semibold">{product.category}</div>
        <h3 className="font-display font-semibold text-sm mt-1 line-clamp-2 flex-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-base">${(onSale ? product.sale_price : product.price).toLocaleString()}</span>
            {onSale && <span className="text-xs text-muted-foreground line-through">${product.price.toLocaleString()}</span>}
          </div>
          <button onClick={addToCart} className="p-2 rounded-md bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Add to cart">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}