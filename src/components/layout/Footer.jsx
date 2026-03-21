import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2f2f2f] text-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-white">Green <span className="text-secondary">Weave</span></h3>
            <p className="text-sm text-white/70">
              Ancient Treasures for Modern Living. Premium Makhana, Terracotta, Rice, and traditional crafts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Navigation</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login / Register</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Categories</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/products?category=makhana" className="hover:text-white transition-colors">Makhana</Link></li>
              <li><Link to="/products?category=rice" className="hover:text-white transition-colors">Specialty Rice</Link></li>
              <li><Link to="/products?category=non-basmati-rice" className="hover:text-white transition-colors">Non Basmati Rice</Link></li>
              <li><Link to="/products?category=handicraft-products" className="hover:text-white transition-colors">Handicraft</Link></li>
              <li><Link to="/products?category=brass-products" className="hover:text-white transition-colors">Brass Products</Link></li>
              <li><Link to="/products?category=marble-products" className="hover:text-white transition-colors">Marble Products</Link></li>
              <li><Link to="/products?category=wooden-products" className="hover:text-white transition-colors">Wooden Products</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Get in Touch</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                <span className="leading-relaxed">
                  04, A11, Kalher, Kalher, Bhiwandi, Thane, Maharashtra - 421302, India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                <span>+91-8976461365</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                <span>greenweave345@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Green Weave. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Designed for Earthy Luxury</p>
        </div>
      </div>
    </footer>
  );
}
