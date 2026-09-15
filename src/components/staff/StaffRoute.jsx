import { useAuth } from '@/lib/AuthContext';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function StaffRoute() {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }
  if (!user) return <Navigate to="/staff/login" replace />;
  if (user.role !== 'admin' && user.role !== 'staff') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
        <h1 className="font-display text-xl font-bold">Access Denied</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">Your account doesn't have staff privileges. Contact an administrator if you believe this is an error.</p>
        <Link to="/" className="text-primary text-sm mt-5">← Back to store</Link>
      </div>
    );
  }
  return <Outlet />;
}