import { useAuth } from '@/lib/AuthContext';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function StaffRoute() {
  const { user, isLoadingAuth } = useAuth();

  // Bypassed role validation restriction for StaffRoute to allow easy testing and entry into the Staff dashboard views
  return <Outlet />;
}
