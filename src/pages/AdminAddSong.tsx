import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { UserProfile } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Music, Save, ArrowLeft } from 'lucide-react';

const ADMIN_EMAIL = 'desaisupriya12@gmail.com';

export default function AdminAddSong() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title_en: '',
    title_mr: '',
    singer: '',
    lyricist: '',
    composer: '',
    movie: '',
    year: new Date().getFullYear(),
    language: 'Marathi',
    genre: 'Romantic',
    youtube_link: '',
    lyrics_mr: '',
    meaning: '',
    story: '',
    tags: '',
    is_trending: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userSnap = await getDoc(doc(db, 'users', user.uid));
          if (userSnap.exists()) {
            const userData = userSnap.data() as UserProfile;
            if (userData.role === 'admin' || user.email === ADMIN_EMAIL) {
              setIsAdmin(true);
            } else {
              navigate('/');
            }
          } else if (user.email === ADMIN_EMAIL) {
            setIsAdmin(true);
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error("Error checking admin status", error);
          if (user.email === ADMIN_EMAIL) {
            setIsAdmin(true);
          } else {
            navigate('/');
          }
        }
      } else {
        navigate('/');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_trending: checked }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    setSubmitting(true);
    try {
      const slug = generateSlug(formData.title_en || formData.title_mr);
      const songData = {
        title: {
          en: formData.title_en,
          mr: formData.title_mr,
        },
        slug,
        artist_names: formData.singer.split(',').map(s => s.trim()).filter(s => s),
        language: formData.language,
        lyrics: {
          mr: formData.lyrics_mr,
        },
        status: 'approved',
        submitted_by: auth.currentUser?.uid,
        year: Number(formData.year),
        movie: formData.movie,
        genre: formData.genre,
        youtube_link: formData.youtube_link,
        is_trending: formData.is_trending,
        meaning: formData.meaning,
        story: formData.story,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        created_at: serverTimestamp(),
      };

      await addDoc(collection(db, 'songs'), songData);
      toast.success('Song added successfully!');
      
      if ((e.nativeEvent as any).submitter?.name === 'addAnother') {
        setFormData({
          title_en: '',
          title_mr: '',
          singer: '',
          lyricist: '',
          composer: '',
          movie: '',
          year: new Date().getFullYear(),
          language: 'Marathi',
          genre: 'Romantic',
          youtube_link: '',
          lyrics_mr: '',
          meaning: '',
          story: '',
          tags: '',
          is_trending: false,
        });
        window.scrollTo(0, 0);
      } else {
        navigate(`/lyrics/${slug}`);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'songs');
      toast.error('Failed to add song.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Checking permissions...</div>;
  if (!isAdmin) return <div className="p-20 text-center">Access Denied.</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 gap-2 font-black uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <div className="border-4 border-secondary overflow-hidden">
        <div className="bg-secondary p-10 text-white">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary flex items-center justify-center">
              <Music className="text-secondary w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">Add New Song</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Content Management System</p>
            </div>
          </div>
        </div>
        <div className="p-10 bg-white">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Title (Marathi) *</label>
                <Input name="title_mr" required value={formData.title_mr} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary h-12 font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Title (English) *</label>
                <Input name="title_en" required value={formData.title_en} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary h-12 font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Singer(s) (Comma separated) *</label>
                <Input name="singer" required value={formData.singer} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary h-12 font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Movie/Album *</label>
                <Input name="movie" required value={formData.movie} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary h-12 font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">YouTube Link *</label>
                <Input name="youtube_link" required value={formData.youtube_link} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary h-12 font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lyricist</label>
                <Input name="lyricist" value={formData.lyricist} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary h-12 font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Composer</label>
                <Input name="composer" value={formData.composer} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary h-12 font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Year</label>
                <Input type="number" name="year" value={formData.year} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary h-12 font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Genre</label>
                <Input name="genre" value={formData.genre} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary h-12 font-bold" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lyrics (Marathi) *</label>
              <Textarea name="lyrics_mr" required rows={12} value={formData.lyrics_mr} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary font-bold text-lg leading-tight" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Meaning / Explanation</label>
              <Textarea name="meaning" rows={5} value={formData.meaning} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary font-medium" placeholder="Markdown supported..." />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Story / Interesting Facts</label>
              <Textarea name="story" rows={5} value={formData.story} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary font-medium" placeholder="Markdown supported..." />
            </div>

            <div className="flex items-center space-x-4 bg-card p-6 border-2 border-secondary">
              <Checkbox id="trending" checked={formData.is_trending} onCheckedChange={handleCheckboxChange} className="w-6 h-6 border-2 border-secondary data-[state=checked]:bg-primary data-[state=checked]:text-secondary" />
              <label htmlFor="trending" className="text-sm font-black uppercase tracking-widest cursor-pointer">
                Mark as Trending Song
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button type="submit" disabled={submitting} className="w-full bg-primary text-secondary h-16 text-xl font-black uppercase tracking-[0.2em] border-2 border-secondary shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                {submitting ? 'Publishing...' : 'Publish Lyrics'}
              </Button>
              <Button type="submit" name="addAnother" disabled={submitting} variant="outline" className="w-full border-4 border-secondary h-16 text-xl font-black uppercase tracking-[0.2em] hover:bg-secondary hover:text-white transition-all">
                {submitting ? 'Saving...' : 'Publish & Add Another'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
