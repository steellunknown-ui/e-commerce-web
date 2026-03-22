import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Auth({ mode = 'login' }) {
  const isLoginInitial = mode === 'login';
  const [isLogin, setIsLogin] = useState(isLoginInitial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            }
          }
        });
        
        if (signUpError) throw signUpError;
        alert("Registration Successful!");
        setIsLogin(true); // Switch to login after signup
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (signInError) throw signInError;
        navigate('/'); // Redirect to homepage
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Left Side - Cinematic Brand Banner */}
      <div className="hidden md:flex w-1/2 h-full relative flex-col justify-end p-16 text-white overflow-hidden">
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/auth_video.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay with primary Blend mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10" />
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />

        <div className="relative z-10 space-y-6 max-w-lg">
          <Link to="/" className="flex items-center space-x-2 text-white">
            <span className="font-serif text-3xl font-bold tracking-tight">Green <span className="text-secondary">Weave</span></span>
          </Link>
          <h2 className="font-serif text-4xl font-bold leading-tight">Rooted in Earth, Sourced with Integrity</h2>
          <p className="text-white/80 leading-relaxed text-lg">
            Experience the purity of authentic agricultural harvests. By joining us, you empower sustainable farming standard continuous speeds scaling nature securely decors.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100')" }} />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100')" }} />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100')" }} />
            </div>
            <p className="text-sm font-medium text-white/90">Trusted by 500+ Premium B2B Buyers</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-6 relative overflow-y-auto pt-20 md:pt-6 bg-cover bg-center" style={{ backgroundImage: "url('/auth_right_bg.png')" }}>
        <div className="w-full max-w-md flex flex-col items-center space-y-6">
          <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? -20 : 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-muted/20 shadow-xl space-y-6"
          >
            <div className="text-center space-y-2">
              <h1 className="font-serif text-3xl font-bold text-foreground">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-foreground/60 text-sm">
                {isLogin ? 'Log in to view your enquiries.' : 'Join to explore our premium catalogue details.'}
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 animate-in fade-in-50">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <Label htmlFor="auth-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <Input 
                      id="auth-name" 
                      placeholder="John Doe" 
                      required 
                      className="pl-9 bg-muted/5 border-muted/30 h-11"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="auth-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
                  <Input 
                    id="auth-email" 
                    type="email" 
                    placeholder="name@company.com" 
                    required 
                    className="pl-9 bg-muted/5 border-muted/30 h-11"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="auth-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
                  <Input 
                    id="auth-password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    required 
                    className="pl-9 bg-muted/5 border-muted/30 h-11"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1">
                  <Label htmlFor="auth-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <Input 
                      id="auth-confirm" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      required 
                      className="pl-9 bg-muted/5 border-muted/30 h-11"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-foreground/60 font-normal">Remember me</Label>
                  </div>
                  <a href="#" className="text-primary hover:underline font-medium">Forgot password?</a>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white h-11 font-semibold shadow-md flex items-center justify-center gap-2 group">
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>

            <div className="border-t border-muted/10 pt-6 text-center">
              <p className="text-sm text-foreground/60">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-primary hover:underline font-semibold">
                  {isLogin ? 'Create one' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Welcome Text Footer Banner */}
        <div className="text-center text-white space-y-1 drop-shadow-lg p-2 rounded-xl backdrop-blur-none">
          <h2 className="font-serif text-2xl font-bold tracking-wide">
            Welcome to <span className="text-primary">Green</span> <span className="text-secondary">Weaves</span>
          </h2>
          <p className="text-xs text-white/90 font-medium">Connecting you to pure, earth-grown goodness.</p>
        </div>
      </div>
    </div>
    </div>
  );
}
