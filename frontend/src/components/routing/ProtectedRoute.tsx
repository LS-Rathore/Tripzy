import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-[4px] border-outline-variant border-t-primary-container rounded-full animate-spin" />
          <p className="font-label-sm text-on-surface-variant font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-tripzy-bg flex flex-col relative overflow-hidden">
        {/* Blurred background mockup layout */}
        <div className="fixed inset-0 bg-pattern -z-10"></div>
        <div className="flex-grow flex flex-col items-center justify-center p-6 blur-md select-none pointer-events-none">
          <div className="w-full max-w-4xl space-y-12">
            <div className="h-16 w-48 bg-white/40 rounded-xl border-2 border-black/10"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="h-12 w-3/4 bg-white/40 rounded-xl border-2 border-black/10"></div>
                <div className="h-6 w-5/6 bg-white/40 rounded-xl border-2 border-black/10"></div>
                <div className="h-24 w-full bg-white/40 rounded-2xl border-2 border-black/10"></div>
              </div>
              <div className="h-96 bg-white/40 rounded-2xl border-2 border-black/10"></div>
            </div>
          </div>
        </div>

        {/* Modal open automatically */}
        <LoginModal 
          isOpen={true} 
          onClose={() => navigate('/')} 
        />
      </div>
    );
  }

  return <Outlet />;
}
