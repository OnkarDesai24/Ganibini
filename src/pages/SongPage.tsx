import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Song, UserProfile } from '@/src/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Music2, User, Film, Calendar, Globe, Tag, Youtube, Info, BookOpen, Sparkles, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import SongCard from '@/src/components/SongCard';

export default function SongPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);
  const [relatedSongs, setRelatedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
        const userData = userDoc.docs[0]?.data() as UserProfile;
        if (userData?.role === 'admin' || user.email === 'desaisupriya12@gmail.com') {
          setIsAdmin(true);
        }
      }
    });
    return () => checkAdmin();
  }, []);

  useEffect(() => {
    const fetchSong = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'songs'), where('slug', '==', slug), limit(1));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const songData = { id: snap.docs[0].id, ...snap.docs[0].data() } as Song;
          
          if (songData.status !== 'approved' && !isAdmin) {
            setSong(null);
          } else {
            setSong(songData);

            // Fetch Related
            const relatedQ = query(
              collection(db, 'songs'),
              where('movie', '==', songData.movie),
              where('status', '==', 'approved'),
              limit(5)
            );
            const relatedSnap = await getDocs(relatedQ);
            setRelatedSongs(
              relatedSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Song))
                .filter(s => s.slug !== slug)
            );
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `songs/${slug}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
    window.scrollTo(0, 0);
  }, [slug, isAdmin]);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  );
  if (!song) return <div className="container mx-auto p-20 text-center font-black uppercase tracking-widest">Song not found.</div>;

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  const videoId = getYoutubeId(song.youtube_link);

  return (
    <div className="pb-24">
      {/* Header Section: Editorial Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 border-b-2 border-secondary">
        <div className="p-8 md:p-16 flex flex-col justify-center space-y-8 border-b-2 lg:border-b-0 lg:border-r-2 border-secondary">
          <div className="flex gap-2">
            <span className="bg-primary text-secondary px-2 py-1 text-[10px] font-black uppercase tracking-widest">{song.language}</span>
            <span className="border-2 border-secondary px-2 py-1 text-[10px] font-black uppercase tracking-widest">{song.genre}</span>
            {song.status !== 'approved' && (
              <span className="bg-red-600 text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest">Pending Review</span>
            )}
          </div>
          <h1 className="text-[10vw] lg:text-[6vw] font-black uppercase leading-[0.85] tracking-tighter text-secondary">
            {song.song_name}
          </h1>
          <div className="space-y-2">
            <p className="text-xl font-black uppercase tracking-widest text-primary">{song.movie}</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">{song.singer}</p>
          </div>
        </div>
        <div className="relative aspect-video lg:aspect-auto bg-secondary">
          {videoId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
              title={song.song_name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-24 h-24 text-white/10" />
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-24">
            {/* Lyrics */}
            <section className="space-y-12">
              <div className="flex items-center justify-between border-b-2 border-secondary pb-6">
                <h2 className="text-4xl font-black uppercase tracking-tighter">The Lyrics</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-2 border-secondary rounded-none font-black uppercase tracking-widest text-[10px]">Copy</Button>
                  <Button variant="outline" size="sm" className="border-2 border-secondary rounded-none font-black uppercase tracking-widest text-[10px]">Share</Button>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-3xl md:text-5xl leading-[1.1] font-black text-secondary tracking-tight">
                {song.lyrics}
              </div>
            </section>

            {/* Meaning & Story */}
            {(song.meaning || song.story) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {song.meaning && (
                  <div className="p-8 border-2 border-secondary space-y-6">
                    <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Meaning
                    </h3>
                    <div className="prose prose-slate text-sm font-bold text-slate-500 leading-relaxed">
                      <ReactMarkdown>{song.meaning}</ReactMarkdown>
                    </div>
                  </div>
                )}
                {song.story && (
                  <div className="p-8 border-2 border-secondary bg-secondary text-white space-y-6">
                    <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      The Story
                    </h3>
                    <div className="prose prose-invert text-sm font-bold text-slate-300 leading-relaxed">
                      <ReactMarkdown>{song.story}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-16">
            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary border-b-2 border-primary pb-2">Credits</h3>
              <div className="space-y-6">
                {[
                  { label: 'Singer', value: song.singer },
                  { label: 'Lyricist', value: song.lyricist },
                  { label: 'Composer', value: song.composer },
                  { label: 'Year', value: song.year },
                ].map((item, i) => item.value && (
                  <div key={i} className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                    <p className="text-xl font-black uppercase tracking-tighter text-secondary">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {relatedSongs.length > 0 && (
              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary border-b-2 border-primary pb-2">Related</h3>
                <div className="space-y-12">
                  {relatedSongs.map(s => (
                    <SongCard key={s.id} song={s} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
