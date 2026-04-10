import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '@/src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Song } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { Music, Clock, CheckCircle, XCircle, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function UserDashboard() {
  const [submissions, setSubmissions] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchSubmissions(user.uid);
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchSubmissions = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'songs'),
        where('submitted_by', '==', uid),
        orderBy('created_at', 'desc')
      );
      const snap = await getDocs(q);
      setSubmissions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song)));
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest">Loading Dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-6xl font-black uppercase tracking-tighter">My <span className="text-primary italic">Dashboard</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Track your contributions to Ganibini</p>
        </div>
        <Link to="/submit-lyrics">
          <Button className="brutal-btn bg-primary text-secondary h-14 px-8">
            Submit New Lyrics
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border-4 border-secondary p-8 bg-white shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Overview</h3>
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold uppercase tracking-widest">Total Submissions</span>
                <span className="text-4xl font-black">{submissions.length}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold uppercase tracking-widest text-green-600">Approved</span>
                <span className="text-4xl font-black">{submissions.filter(s => s.status === 'approved').length}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold uppercase tracking-widest text-primary">Pending</span>
                <span className="text-4xl font-black">{submissions.filter(s => s.status === 'pending').length}</span>
              </div>
            </div>
          </div>

          <div className="border-4 border-secondary p-8 bg-secondary text-white shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
            <LayoutDashboard className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Contributor Level</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {submissions.filter(s => s.status === 'approved').length >= 10 ? 'Elite Contributor' : 'Rising Star'}
            </p>
          </div>
        </div>

        {/* Submissions List */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
            Recent Submissions
            <div className="h-1 flex-1 bg-secondary/10"></div>
          </h2>

          {submissions.length === 0 ? (
            <div className="p-20 border-4 border-dashed border-secondary/10 text-center space-y-6">
              <Music className="w-16 h-16 text-secondary/10 mx-auto" />
              <p className="text-slate-400 font-bold uppercase tracking-widest">You haven't submitted any lyrics yet.</p>
              <Link to="/submit-lyrics" className="inline-block">
                <Button variant="outline" className="border-2 border-secondary rounded-none font-black uppercase tracking-widest">Start Contributing</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(song => (
                <div key={song.id} className="border-2 border-secondary p-6 bg-white hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-primary transition-colors">{song.song_name}</h3>
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border ${
                          song.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                          song.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {song.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{song.movie} • {song.singer}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="flex-1 md:flex-none text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          {song.created_at instanceof Date ? song.created_at.toLocaleDateString() : (song.created_at as any)?.toDate?.().toLocaleDateString() || 'Recently'}
                        </p>
                      </div>
                      {song.status === 'approved' && (
                        <Link to={`/lyrics/${song.slug}`}>
                          <Button size="sm" variant="outline" className="border-2 border-secondary rounded-none font-black uppercase tracking-widest text-[10px]">
                            View Post <ArrowRight className="w-3 h-3 ml-2" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
