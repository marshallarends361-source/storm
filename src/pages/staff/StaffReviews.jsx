import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Check, Trash2, Star } from 'lucide-react';

const MOCK_REVIEWS = [
  { id: '1', customer_name: 'Kenji T.', rating: 5, text: 'The Raiju dirt bike is an absolute monster. Torque for days.', approved: true },
  { id: '2', customer_name: 'Marcus L.', rating: 5, text: 'Commuter model replaced my car. Charges overnight, rides all week.', approved: true },
  { id: '3', customer_name: 'Sofia R.', rating: 4, text: 'Build quality is unreal. Feels like a premium motorcycle, not a toy.', approved: false }
];

export default function StaffReviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('pending');

  const load = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('raijin_reviews_v1') || '[]');
      // Merge mocks with any session changes
      const mockIds = MOCK_REVIEWS.map(m => m.id);
      const custom = saved.filter(r => !mockIds.includes(r.id));
      const updatedMocks = MOCK_REVIEWS.map(m => saved.find(s => s.id === m.id) || m);
      setReviews([...custom, ...updatedMocks]);
    } catch {
      setReviews(MOCK_REVIEWS);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveToStorage = (updatedList) => {
    localStorage.setItem('raijin_reviews_v1', JSON.stringify(updatedList));
    setReviews(updatedList);
  };

  const approve = (r) => {
    const updated = reviews.map((x) => (x.id === r.id ? { ...x, approved: true } : x));
    saveToStorage(updated);
    toast({ title: 'Review approved' });
  };

  const del = (r) => {
    if (!confirm('Delete this review?')) return;
    const updated = reviews.filter((x) => x.id !== r.id);
    saveToStorage(updated);
    toast({ title: 'Review deleted' });
  };

  const filtered = reviews.filter((r) => tab === 'pending' ? !r.approved : r.approved);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">Review Moderation</h1>
        <div className="flex gap-1 glass-panel rounded-lg p-1 border-slate-800">
          <button onClick={() => setTab('pending')} className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${tab === 'pending' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Pending</button>
          <button onClick={() => setTab('approved')} className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${tab === 'approved' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Approved</button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-panel rounded-xl p-12 text-center border-slate-800">
            <Star className="w-8 h-8 mx-auto text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm font-medium">No {tab} reviews found.</p>
          </div>
        ) : filtered.map((r) => (
          <div key={r.id} className="glass-panel rounded-xl p-4 border-slate-800 hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold text-white">{r.customer_name}</div>
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'fill-current' : 'text-slate-700'}`} />)}
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed italic">"{r.text}"</p>
            <div className="flex gap-2 mt-4">
              {!r.approved && (
                <button onClick={() => approve(r)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
              )}
              <button onClick={() => del(r)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
