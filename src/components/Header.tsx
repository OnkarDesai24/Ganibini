import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Moon, Sun, User, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth, db } from '@/src/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

import { Logo } from './Logo';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(auth.currentUser);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Ensure user profile exists in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        } else {
          const role = user.email === 'desaisupriya12@gmail.com' ? 'admin' : 'user';
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            role: role
          });
          setUserRole(role);
        }
      } else {
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    toast.success("Logged out");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b-2 border-secondary">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <Link to="/">
          <Logo className="scale-75 origin-left" />
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-12 relative">
          <Input
            type="search"
            placeholder="Search for Marathi lyrics..."
            className="w-full bg-white border-2 border-secondary rounded-none h-12 px-12 font-bold focus-visible:ring-0 focus-visible:border-primary transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
        </form>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link to="/about" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">Contact</Link>
            <Link to="/submit-lyrics" className="text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">Submit Lyrics</Link>
          </nav>
          
          <div className="h-8 w-[2px] bg-secondary/10"></div>

          {user && (
            <Link to={userRole === 'admin' ? "/admin/dashboard" : "/dashboard"}>
              <Button variant="outline" size="sm" className="border-2 border-secondary rounded-none font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">
                {userRole === 'admin' ? 'Admin Panel' : 'My Dashboard'}
              </Button>
            </Link>
          )}
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-secondary overflow-hidden bg-slate-100 flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-6 h-6 text-secondary" />
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="font-black uppercase tracking-widest text-[10px] hover:text-primary">
                Sign Out
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsAuthModalOpen(true)} className="bg-secondary text-white rounded-none px-8 h-12 font-black uppercase tracking-widest hover:bg-primary hover:text-secondary transition-all shadow-[4px_4px_0px_0px_rgba(255,107,0,1)] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="border-2 border-secondary rounded-none">
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b-2 border-secondary p-6 space-y-6 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-white border-2 border-secondary rounded-none h-12 px-12 font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          </form>
          <nav className="flex flex-col gap-4">
            <Link to="/about" className="text-lg font-black uppercase tracking-tighter border-b border-secondary/10 pb-2" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/contact" className="text-lg font-black uppercase tracking-tighter border-b border-secondary/10 pb-2" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
            <Link to="/submit-lyrics" className="text-lg font-black uppercase tracking-tighter border-b border-secondary/10 pb-2 text-primary" onClick={() => setIsMenuOpen(false)}>Submit Lyrics</Link>
            <Link to="/privacy" className="text-lg font-black uppercase tracking-tighter border-b border-secondary/10 pb-2" onClick={() => setIsMenuOpen(false)}>Privacy Policy</Link>
            <Link to="/disclaimer" className="text-lg font-black uppercase tracking-tighter border-b border-secondary/10 pb-2" onClick={() => setIsMenuOpen(false)}>Disclaimer</Link>
            {user && (
              <Link to={userRole === 'admin' ? "/admin/dashboard" : "/dashboard"} className="text-lg font-black uppercase tracking-tighter text-primary" onClick={() => setIsMenuOpen(false)}>
                {userRole === 'admin' ? 'Admin Panel' : 'My Dashboard'}
              </Link>
            )}
            {user ? (
              <Button variant="outline" className="w-full border-2 border-secondary rounded-none font-black uppercase tracking-widest" onClick={logout}>Sign Out</Button>
            ) : (
              <Button className="w-full bg-secondary text-white rounded-none font-black uppercase tracking-widest h-14" onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}>Sign In</Button>
            )}
          </nav>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}
