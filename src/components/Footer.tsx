import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-24 pb-12 border-t-8 border-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <Logo variant="light" className="items-start" />
            <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
              Preserving the soul of Marathi music through lyrics, meanings, and stories.
            </p>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Contribute</h4>
            <ul className="space-y-4">
              <li><Link to="/submit-lyrics" className="text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors">Submit Lyrics</Link></li>
              <li><Link to="/search" className="text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors">Browse Archive</Link></li>
              <li><Link to="/admin/dashboard" className="text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors">Admin Panel</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Sitemap</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Newsletter</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Get weekly Marathi music updates.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-white/5 border-2 border-white/10 px-4 py-3 flex-1 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-colors"
              />
              <button className="bg-primary text-secondary px-6 font-black uppercase tracking-widest text-xs hover:bg-white transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            © {new Date().getFullYear()} GANIBINI. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-500 hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
