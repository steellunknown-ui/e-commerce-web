import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // 🔐 Listen to Auth State
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getInitial = () => {
    if (!user) return '';
    const name = user.user_metadata?.full_name || user.email;
    return name[0].toUpperCase();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-muted/20 py-4' : 'bg-gradient-to-b from-black/60 to-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">Green <span className="text-secondary">Weave</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium transition-colors ${isScrolled ? "text-foreground/80 hover:text-primary" : "text-white hover:text-white/80"}`}>Home</Link>
            <a href="/#about" className={`font-medium transition-colors ${isScrolled ? "text-foreground/80 hover:text-primary" : "text-white hover:text-white/80"}`}>About</a>
            <a href="/#faq" className={`font-medium transition-colors ${isScrolled ? "text-foreground/80 hover:text-primary" : "text-white hover:text-white/80"}`}>FAQ</a>
            <Link to="/products" className={`font-medium transition-colors ${isScrolled ? "text-foreground/80 hover:text-primary" : "text-white hover:text-white/80"}`}>Catalogue</Link>
            <Link to="/contact" className={`font-medium transition-colors ${isScrolled ? "text-foreground/80 hover:text-primary" : "text-white hover:text-white/80"}`}>Contact</Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md hover:bg-primary/90 transition-colors"
                >
                  {getInitial()}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl py-2 z-50 border border-muted/20 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-muted/10">
                      <p className="text-xs text-foreground/50 truncate">Logged in as</p>
                      <p className="text-sm font-semibold truncate text-foreground">{user.email}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full text-left transition-colors font-medium"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className={`${isScrolled ? "hover:text-primary" : "text-white hover:text-white/80"}`}>
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link to="/products">
              <Button size="icon" className="bg-primary hover:bg-primary/90 text-white rounded-full">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </Link>
            <Button className="bg-secondary hover:bg-secondary/90 text-white">
              Bulk Enquiry
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md"
                >
                  {getInitial()}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 z-50 border border-muted/20">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className={`${isScrolled ? "hover:text-primary" : "text-white hover:text-white/80"}`}>
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-background/95 backdrop-blur-md rounded-lg shadow-lg border border-muted/20 p-4 absolute top-full left-4 right-4 animate-in fade-in-20 duration-200">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="font-medium text-foreground/80 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <a href="/#about" className="font-medium text-foreground/80 hover:text-primary" onClick={() => setIsMenuOpen(false)}>About</a>
              <a href="/#faq" className="font-medium text-foreground/80 hover:text-primary" onClick={() => setIsMenuOpen(false)}>FAQ</a>
              <Link to="/products" className="font-medium text-foreground/80 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Catalogue</Link>
              <Link to="/contact" className="font-medium text-foreground/80 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Button className="bg-secondary hover:bg-secondary/90 text-white w-full">
                Bulk Enquiry
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
