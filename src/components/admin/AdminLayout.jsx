import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, MessageSquare, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: ShoppingBag },
    { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-muted/10">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 bg-[#2f2f2f] text-white flex-col">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin" className="font-serif text-xl font-bold">
            Green <span className="text-secondary">Weave</span> 
            <span className="text-xs text-white/40 block font-sans tracking-wide">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-secondary'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span>View Live Site</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-[#2f2f2f] text-white p-4 flex justify-between items-center border-b border-white/10 shadow-md">
          <Link to="/admin" className="font-serif text-lg font-bold">
            Green <span className="text-secondary">Weave</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#2f2f2f] text-white border-b border-white/10 p-4 space-y-2 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 text-secondary" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <hr className="border-white/10" />
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
