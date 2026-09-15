import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ChevronDown, Truck, Save } from 'lucide-react';

const PAYMENT_STATUSES = ['Payment Pending', 'Paid', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
const FULFILL_STATUSES = ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

export default function StaffOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('');

  const load = async () => {
    setOrders(null);
    try { setOrders(await base44.entities.Order.list('-created_date', 200)); }
    catch { setOrders([]); }
  };
  useEffect(() => { load(); }, []);

  const filtered = orders ? (filter ? orders.filter((o) => o.payment_status === filter) : orders) : [];

  const update = async (id, data, msg) => {
    try {
      await base44.entities.Order.update(id, data);
      setOrders(orders.map((o) => (o.id === id ? { ...o, ...data } : o)));
      toast({ title: msg });
    } catch (e) { toast({ title: 'Update failed', description: e.message, variant: 'destructive' }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-xl md:text-2xl font-bold">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 px-2 rounded-md bg-secondary border border-border text-sm">
          <option value="">All Statuses</option>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {!orders ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
       filtered.length === 0 ? <p className="text-sm text-muted-foreground">No orders found.</p> : (
        <div className="space-y-2">
          {filtered.map((o) => (
            <div key={o.id} className="glass-panel rounded-lg overflow-hidden">
              <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="w-full flex items-center justify-between p-3 text-left">
                <div className="min-w-0">
                  <div className="font-mono text-xs font-bold">{o.order_number}</div>
                  <div className="text-xs text-muted-foreground truncate">{new Date(o.created_date).toLocaleString()} · {o.customer_email}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold">${(o.total || 0).toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400">{o.payment_status}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded === o.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {expanded === o.id && (
                <div className="border-t border-border p-3 space-y-3">
                  <div className="text-xs">
                    <div className="text-muted-foreground mb-1">Items</div>
                    {(o.items || []).map((it, i) => (
                      <div key={i} className="flex justify-between"><span>{it.quantity}× {it.name}{it.variant ? ` (${it.variant})` : ''}</span><span>${((it.price || 0) * it.quantity).toLocaleString()}</span></div>
                    ))}
                    <div className="border-t border-border pt-1 mt-1 flex justify-between font-bold"><span>Total</span><span>${(o.total || 0).toLocaleString()}</span></div>
                  </div>

                  {o.shipping_address && (
                    <div className="text-xs text-muted-foreground">
                      <div className="font-semibold text-foreground mb-0.5">Ship To</div>
                      {o.shipping_address.name}<br />
                      {o.shipping_address.line1}{o.shipping_address.line2 ? `, ${o.shipping_address.line2}` : ''}<br />
                      {o.shipping_address.city}, {o.shipping_address.state} {o.shipping_address.zip}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground">Payment Status</label>
                      <select value={o.payment_status} onChange={(e) => update(o.id, { payment_status: e.target.value }, 'Payment status updated')} className="w-full h-8 px-2 rounded-md bg-input border border-border text-xs mt-0.5">
                        {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Fulfillment</label>
                      <select value={o.fulfillment_status} onChange={(e) => update(o.id, { fulfillment_status: e.target.value }, 'Fulfillment updated')} className="w-full h-8 px-2 rounded-md bg-input border border-border text-xs mt-0.5">
                        {FULFILL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input defaultValue={o.tracking_number || ''} placeholder="Tracking number" onBlur={(e) => { if (e.target.value !== (o.tracking_number || '')) update(o.id, { tracking_number: e.target.value }, 'Tracking saved'); }} className="flex-1 h-8 px-2 rounded-md bg-input border border-border text-xs" />
                    <input defaultValue={o.tracking_url || ''} placeholder="Tracking URL" onBlur={(e) => { if (e.target.value !== (o.tracking_url || '')) update(o.id, { tracking_url: e.target.value }, 'Tracking URL saved'); }} className="flex-1 h-8 px-2 rounded-md bg-input border border-border text-xs" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}