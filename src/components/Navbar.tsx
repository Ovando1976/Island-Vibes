import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Compass, MessageSquare, User, ShoppingBag, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { totalItems } = useCart();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/guide', icon: Sparkles, label: 'Guide' },
    { path: '/social', icon: MessageSquare, label: 'Social' },
    { path: '/favorites', icon: Heart, label: 'Saved' },
    { path: '/cart', icon: ShoppingBag, label: 'Cart' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-20 glass-dark items-center px-8 justify-between border-b border-white/5">
        <Link to="/" className="text-2xl font-black tracking-tighter text-emerald-400">
          ISLAND<span className="text-white">VIBES</span>
        </Link>
        
        <div className="flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 text-sm font-medium transition-colors relative ${
                location.pathname === item.path ? 'text-emerald-400' : 'text-white/60 hover:text-white'
              }`}
            >
              <div className="relative">
                <item.icon className="w-4 h-4" />
                {item.path === '/cart' && totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-black"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <Link to="/guide" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>AI Guide</span>
        </Link>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-20 glass-dark flex items-center justify-around px-4 pb-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center space-y-1 transition-all relative ${
              location.pathname === item.path ? 'text-emerald-400' : 'text-white/40'
            }`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.path === '/cart' && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-black"
                >
                  {totalItems}
                </motion.span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            {location.pathname === item.path && (
              <motion.div
                layoutId="nav-indicator"
                className="w-1 h-1 bg-emerald-400 rounded-full"
              />
            )}
          </Link>
        ))}
      </nav>
    </>
  );
};
