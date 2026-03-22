import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect directly to admin dashboard
      navigate('/admin');
    } catch (err) {
      alert("Login Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-muted/20 shadow-xl space-y-6">
        <div className="text-center">
          <Link to="/" className="font-serif text-2xl font-bold text-foreground">
            Green <span className="text-secondary">Weave</span>
          </Link>
          <p className="text-foreground/60 text-sm mt-1">Admin Panel Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                className="pl-10 h-11" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="pl-10 h-11" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-11 bg-[#2f2f2f] hover:bg-[#1f1f1f] text-white font-semibold rounded-xl"
          >
            {loading ? "Authenticating..." : "Sign into Dashboard"}
          </Button>
        </form>

        <div className="text-center">
          <Link to="/" className="text-xs text-primary hover:underline">
            ← Back to live site
          </Link>
        </div>
      </div>
    </div>
  );
}
