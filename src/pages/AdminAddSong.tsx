import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
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
    song_name: '',
    singer: '',
    lyricist: '',
    composer: '',
    movie: '',
    year: new Date().getFullYear(),
    language: 'Marathi',
    genre: 'Romantic',
    youtube_link: '',
    lyrics: '',
    meaning: '',
    story: '',
    tags: '',
    is_trending: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
        const userData = userDoc.docs[0]?.data() as UserProfile;
        
        if (userData?.role === 'admin' || user.email === ADMIN_EMAIL) {
          setIsAdmin(true);
        } else {
          navigate('/');
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
      const slug = generateSlug(formData.song_name);
      const songData = {
        ...formData,
        slug,
        status: 'approved',
        submitted_by: auth.currentUser?.uid,
        year: Number(formData.year),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        created_at: serverTimestamp(),
      };

      await addDoc(collection(db, 'songs'), songData);
      toast.success('Song added successfully!');
      navigate(`/lyrics/${slug}`);
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
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Song Name *</label>
                <Input name="song_name" required value={formData.song_name} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary h-12 font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Singer *</label>
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
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lyrics *</label>
              <Textarea name="lyrics" required rows={12} value={formData.lyrics} onChange={handleChange} className="rounded-none border-2 border-border focus:border-secondary font-bold text-lg leading-tight" />
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

            <Button type="submit" disabled={submitting} className="w-full bg-primary text-secondary h-16 text-xl font-black uppercase tracking-[0.2em] border-2 border-secondary shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
              {submitting ? 'Publishing...' : 'Publish Lyrics'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
