import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
