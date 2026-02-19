import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Search,
  LogOut,
  Package,
  Crown,
} from 'lucide-react';
import { cartAPI } from '../config/supabase';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) loadCartCount();
    else setCartCount(0);
  }, [user]);

  const loadCartCount = async () => {
    try {
      const cart = await cartAPI.getCart(user.uid);
      setCartCount(cart.length);
    } catch (error) { console.error(error); }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/products' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-[#C5A059]/20 shadow-sm py-1'
          : 'bg-white py-4'
          }`}
      >
        {/* --- LUXURY ANNOUNCEMENT BAR --- */}
        <div className="bg-[#111] text-[#C5A059] py-1.5 overflow-hidden">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-center text-[10px] tracking-[0.4em] uppercase font-['Golden']"
          >
            Complimentary Insured Shipping on All Orders • Lifetime Buyback Guarantee
          </motion.p>
        </div>

        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Left: Desktop Nav Items */}
            <div className="hidden lg:flex items-center space-x-8 flex-1">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group text-[11px] tracking-[0.2em] uppercase font-['Golden'] text-slate-800"
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-[1px] bg-[#C5A059] transition-all duration-300 ${location.pathname + location.search === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              ))}
            </div>

            {/* Center: Brand Identity */}
            <Link to="/" className="flex flex-col items-center group px-8">
              <motion.div whileHover={{ rotateY: 180 }} transition={{ duration: 0.6 }}>
                <image src="" />
              </motion.div>
              <h1 className="text-xl md:text-2xl font-['AnticDidone-Regular'] tracking-tight text-[#111]">
                Ashirwad <span className="italic font-light">Jewellers</span>
              </h1>
              <p className="text-[8px] tracking-[0.5em] uppercase font-['Golden'] text-[#C5A059] -mt-1">Handcrafted Excellence</p>
            </Link>

            {/* Right: Actions & Desktop Nav Continued */}
            <div className="flex items-center justify-end space-x-3 lg:space-x-6 flex-1">
              <div className="hidden lg:flex items-center space-x-8 mr-8">
                {navLinks.slice(3).map((link) => (
                  <Link key={link.name} to={link.path} className="relative group text-[11px] tracking-[0.2em] uppercase font-['Golden'] text-slate-800">
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </div>

              {/* Utility Icons */}
              <div className="flex items-center space-x-1 md:space-x-3 border-l border-slate-100 pl-4 md:pl-6">
                <button className="p-2 hover:text-[#C5A059] transition-colors">
                  <Search className="w-5 h-5" strokeWidth={1.5} />
                </button>

                <Link to="/favorites" className="p-2 hover:text-[#C5A059] transition-colors relative">
                  <Heart className="w-5 h-5" strokeWidth={1.5} />
                </Link>

                <Link to="/cart" className="p-2 hover:text-[#C5A059] transition-colors relative">
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-0 bg-[#C5A059] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-['Golden']">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* --- USER SECTION (FIXED) --- */}
                <div className="relative">
                  {user ? (
                    <div className="flex items-center">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="p-1 border border-[#C5A059]/30 rounded-full ml-2 hover:border-[#C5A059] transition-colors"
                      >
                        <img
                          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}`}
                          className="w-7 h-7 rounded-full object-cover"
                          alt="profile"
                        />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={login}
                      className="hidden md:block text-[10px] tracking-[0.3em] uppercase font-['Golden'] border border-black px-6 py-2.5 hover:bg-black hover:text-white transition-all duration-500"
                    >
                      Sign In
                    </button>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-900">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- USER DROPDOWN MENU --- */}
        <AnimatePresence>
          {showUserMenu && user && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setShowUserMenu(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute right-12 top-24 w-56 bg-white border border-slate-100 shadow-2xl p-4 font-['Golden']"
              >
                <p className="text-[10px] text-slate-400 mb-4 tracking-tighter border-b pb-2">{user.email}</p>
                <Link to="/profile" className="flex items-center space-x-3 py-2 text-xs hover:text-[#C5A059]" onClick={() => setShowUserMenu(false)}>
                  <User size={14} /> <span>My Profile</span>
                </Link>
                <Link to="/orders" className="flex items-center space-x-3 py-2 text-xs hover:text-[#C5A059]" onClick={() => setShowUserMenu(false)}>
                  <Package size={14} /> <span>Order History</span>
                </Link>
                <button onClick={logout} className="flex items-center space-x-3 py-2 text-xs text-red-800 mt-2 border-t w-full">
                  <LogOut size={14} /> <span>Sign Out</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- MOBILE FULLSCREEN MENU --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-white z-[100] lg:hidden flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-16">
                <Crown className="text-[#C5A059]" size={32} />
                <button onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
              </div>
              <div className="flex flex-col space-y-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name} to={link.path}
                    className="text-4xl font-['AnticDidone-Regular'] border-b border-slate-100 pb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="mt-auto py-8 text-center">
                <p className="font-['Golden'] text-[10px] tracking-[0.3em] text-[#C5A059]">Ashirwad Jewellers since 1990</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Dynamic Spacer */}
      <div className={isScrolled ? "h-24 md:h-32" : "h-28 md:h-36"}></div>
    </>
  );
};

export default Navbar;