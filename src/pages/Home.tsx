import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { Song } from '@/src/types';
import SongCard from '@/src/components/SongCard';
import { buttonVariants } from '@/components/ui/button';
import { ChevronRight, TrendingUp, Clock, Sparkles, Play, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Home() {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [latestSongs, setLatestSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendingQuery = query(
          collection(db, 'songs'), 
          where('is_trending', '==', true), 
          where('status', '==', 'approved'),
          limit(6)
        );
        const trendingSnap = await getDocs(trendingQuery);
        setTrendingSongs(trendingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song)));

        const latestQuery = query(
          collection(db, 'songs'), 
          where('status', '==', 'approved'),
          orderBy('created_at', 'desc'), 
          limit(12)
        );
        const latestSnap = await getDocs(latestQuery);
        setLatestSongs(latestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song)));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'songs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero Section: Editorial Split */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] border-b-2 border-secondary">
        <div className="p-8 md:p-16 flex flex-col justify-center space-y-12 border-b-2 lg:border-b-0 lg:border-r-2 border-secondary">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Marathi Lyrics Archive</span>
            <h1 className="text-[12vw] lg:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter text-secondary">
              Music <br />
              <span className="text-primary italic">Soul</span> <br />
              Poetry.
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-bold text-slate-500 max-w-md leading-tight">
            The most comprehensive collection of Marathi song lyrics, meanings, and stories.
          </p>
          <div className="flex gap-4">
            <Link to="/search" className="brutal-btn">
              Explore Library
            </Link>
          </div>
        </div>
        <div className="relative bg-secondary overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/marathi-music/1200/1200" 
            alt="Marathi Music" 
            className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center animate-pulse">
              <Play className="w-12 h-12 text-primary fill-current" />
            </div>
          </div>
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-white p-6 brutal-border">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Featured Today</span>
              <h3 className="text-2xl font-black uppercase tracking-tighter mt-2">Classical Marathi Melodies</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="bg-primary py-4 border-y-2 border-secondary overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              <span className="text-2xl font-black uppercase tracking-tighter text-secondary">गाणी-बीनी</span>
              <Music className="w-6 h-6 text-secondary" />
              <span className="text-2xl font-black uppercase tracking-tighter text-secondary">Marathi Lyrics Archive</span>
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
          ))}
        </div>
      </div>

      {/* Trending: Horizontal Rail */}
      <section className="py-24 border-b-2 border-secondary overflow-hidden">
        <div className="container mx-auto px-4 mb-16 flex items-end justify-between">
          <h2 className="section-title mb-0">Trending <span className="text-primary">Now</span></h2>
          <Link to="/search" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">View All Archive</Link>
        </div>
        <div className="flex overflow-x-auto gap-8 px-4 md:px-12 pb-12 scrollbar-hide">
          {trendingSongs.map((song, i) => (
            <div key={song.id} className="min-w-[350px] md:min-w-[450px] relative">
              <span className="absolute -top-10 -left-4 text-8xl font-black text-secondary/5 z-0">0{i + 1}</span>
              <SongCard song={song} />
            </div>
          ))}
        </div>
      </section>

      {/* Latest: Grid */}
      <section className="py-24 container mx-auto px-4">
        <h2 className="section-title">Latest <span className="text-primary">Additions</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {latestSongs.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Moods: Large Typographic Grid */}
      <section className="py-24 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-16 text-primary">Browse by <br />Mood</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Romantic', count: '120+ Songs', icon: '❤️' },
              { name: 'Devotional', count: '85+ Songs', icon: '🙏' },
              { name: 'Party', count: '50+ Songs', icon: '🎉' },
              { name: 'Sad', count: '90+ Songs', icon: '😢' },
            ].map((cat) => (
              <Link 
                key={cat.name}
                to={`/category/${cat.name.toLowerCase()}`}
                className="group border-2 border-white/10 p-12 flex items-center justify-between hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-500"
              >
                <div>
                  <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{cat.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-60 group-hover:opacity-100">{cat.count}</p>
                </div>
                <span className="text-6xl group-hover:scale-125 transition-transform duration-500">{cat.icon}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
