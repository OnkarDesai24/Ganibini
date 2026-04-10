import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Music, Send, ArrowLeft, AlertCircle } from 'lucide-react';

export default function SubmitLyrics() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

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
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title_mr.trim() && !formData.title_en.trim()) newErrors.title_mr = "At least one title is required";
    if (!formData.singer.trim()) newErrors.singer = "Singer name is required";
    if (!formData.movie.trim()) newErrors.movie = "Movie or Album name is required";
    if (!formData.lyrics_mr.trim()) newErrors.lyrics_mr = "Lyrics are required";
    if (formData.lyrics_mr.trim().length < 100) newErrors.lyrics_mr = "Lyrics are too short. Please provide full lyrics (min 100 characters).";
    
    if (formData.youtube_link) {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      if (!youtubeRegex.test(formData.youtube_link)) {
        newErrors.youtube_link = "Please provide a valid YouTube URL.";
      }
    } else {
      newErrors.youtube_link = "YouTube link is required for verification.";
    }

    if (formData.year && (formData.year < 1900 || formData.year > new Date().getFullYear() + 1)) {
      newErrors.year = "Please provide a valid year.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
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
    
    if (!user) {
      toast.error("Please sign in to submit lyrics.");
      return;
    }

    if (!validate()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setSubmitting(true);

    try {
      const slug = generateSlug(formData.title_en || formData.title_mr);
      
      // Check for duplicate slug
      const existingQ = query(collection(db, 'songs'), where('slug', '==', slug));
      const existingSnap = await getDocs(existingQ);
      
      if (!existingSnap.empty) {
        toast.error("A song with this name already exists. Try adding the movie name to the title.");
        setSubmitting(false);
        return;
      }

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
        status: 'pending',
        submitted_by: user.uid,
        submitted_by_email: user.email,
        submitted_by_name: user.displayName || 'User',
        year: Number(formData.year),
        movie: formData.movie,
        genre: formData.genre,
        youtube_link: formData.youtube_link,
        meaning: formData.meaning,
        story: formData.story,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        created_at: serverTimestamp(),
        is_trending: false,
      };

      await addDoc(collection(db, 'songs'), songData);
      toast.success('Submitted successfully! Our team will review it soon.');
      navigate('/');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'songs');
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthReady) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest">Loading...</div>;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-12">
        <div className="w-32 h-32 bg-secondary/5 rounded-full flex items-center justify-center mx-auto border-4 border-dashed border-secondary/20">
          <AlertCircle className="w-16 h-16 text-secondary/40" />
        </div>
        <div className="space-y-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter">Sign In <span className="text-primary italic">Required</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm max-w-md mx-auto">
            To maintain the quality of our archive, we require users to sign in before submitting lyrics.
          </p>
        </div>
        <Button onClick={() => navigate('/')} className="brutal-btn h-16 px-12 text-xl">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-12 gap-2 font-black uppercase tracking-widest hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </Button>

      <div className="border-4 border-secondary shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] bg-white">
        <div className="bg-secondary p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Music className="w-48 h-48 -rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-20 h-20 bg-primary flex items-center justify-center border-4 border-white">
              <Send className="text-secondary w-10 h-10" />
            </div>
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">Submit <br />Lyrics</h1>
              <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mt-4">Contribute to the Marathi Archive</p>
            </div>
          </div>
        </div>

        <div className="p-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Song Name (Marathi) *</label>
                <Input 
                  name="title_mr" 
                  value={formData.title_mr} 
                  onChange={handleChange} 
                  placeholder="E.G. सैराट झालं जी"
                  className={`rounded-none border-2 h-14 font-black tracking-tight text-lg ${errors.title_mr ? 'border-red-500 bg-red-50' : 'border-secondary focus:border-primary'}`} 
                />
                {errors.title_mr && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{errors.title_mr}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Song Name (English) *</label>
                <Input 
                  name="title_en" 
                  value={formData.title_en} 
                  onChange={handleChange} 
                  placeholder="E.G. SAIRAT ZALA JI"
                  className={`rounded-none border-2 h-14 font-black uppercase tracking-tight text-lg ${errors.title_en ? 'border-red-500 bg-red-50' : 'border-secondary focus:border-primary'}`} 
                />
                {errors.title_en && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{errors.title_en}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Singer(s) (Comma separated) *</label>
                <Input 
                  name="singer" 
                  value={formData.singer} 
                  onChange={handleChange} 
                  placeholder="E.G. AJAY GOGAVALE, SHREYA GHOSHAL"
                  className={`rounded-none border-2 h-14 font-black uppercase tracking-tight text-lg ${errors.singer ? 'border-red-500 bg-red-50' : 'border-secondary focus:border-primary'}`} 
                />
                {errors.singer && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{errors.singer}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Movie/Album *</label>
                <Input 
                  name="movie" 
                  value={formData.movie} 
                  onChange={handleChange} 
                  placeholder="E.G. SAIRAT"
                  className={`rounded-none border-2 h-14 font-black uppercase tracking-tight text-lg ${errors.movie ? 'border-red-500 bg-red-50' : 'border-secondary focus:border-primary'}`} 
                />
                {errors.movie && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{errors.movie}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">YouTube Link *</label>
                <Input 
                  name="youtube_link" 
                  value={formData.youtube_link} 
                  onChange={handleChange} 
                  placeholder="HTTPS://YOUTUBE.COM/WATCH?V=..."
                  className={`rounded-none border-2 h-14 font-bold ${errors.youtube_link ? 'border-red-500 bg-red-50' : 'border-secondary focus:border-primary'}`} 
                />
                {errors.youtube_link && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{errors.youtube_link}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lyricist</label>
                <Input name="lyricist" value={formData.lyricist} onChange={handleChange} className="rounded-none border-2 border-secondary focus:border-primary h-14 font-bold" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Composer</label>
                <Input name="composer" value={formData.composer} onChange={handleChange} className="rounded-none border-2 border-secondary focus:border-primary h-14 font-bold" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Year</label>
                <Input 
                  type="number" 
                  name="year" 
                  value={formData.year} 
                  onChange={handleChange} 
                  className={`rounded-none border-2 h-14 font-bold ${errors.year ? 'border-red-500 bg-red-50' : 'border-secondary focus:border-primary'}`} 
                />
                {errors.year && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{errors.year}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Genre</label>
                <Input name="genre" value={formData.genre} onChange={handleChange} className="rounded-none border-2 border-secondary focus:border-primary h-14 font-bold" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Lyrics *</label>
                <span className={`text-[10px] font-black uppercase ${formData.lyrics_mr.length < 100 ? 'text-red-500' : 'text-green-600'}`}>
                  {formData.lyrics_mr.length} Characters
                </span>
              </div>
              <Textarea 
                name="lyrics_mr" 
                rows={15} 
                value={formData.lyrics_mr} 
                onChange={handleChange} 
                placeholder="TYPE OR PASTE LYRICS HERE..."
                className={`rounded-none border-2 font-black text-2xl leading-tight p-8 ${errors.lyrics_mr ? 'border-red-500 bg-red-50' : 'border-secondary focus:border-primary'}`} 
              />
              {errors.lyrics_mr && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{errors.lyrics_mr}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Meaning / Explanation</label>
                <Textarea name="meaning" rows={6} value={formData.meaning} onChange={handleChange} className="rounded-none border-2 border-secondary focus:border-primary font-bold p-6" placeholder="Markdown supported..." />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Story / Interesting Facts</label>
                <Textarea name="story" rows={6} value={formData.story} onChange={handleChange} className="rounded-none border-2 border-secondary focus:border-primary font-bold p-6" placeholder="Markdown supported..." />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tags (Comma Separated)</label>
              <Input name="tags" value={formData.tags} onChange={handleChange} placeholder="ROMANTIC, SAD, CLASSIC..." className="rounded-none border-2 border-secondary focus:border-primary h-14 font-bold" />
            </div>

            <Button 
              type="submit" 
              disabled={submitting} 
              className="w-full bg-primary text-secondary h-20 text-2xl font-black uppercase tracking-[0.3em] border-4 border-secondary shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all hover:bg-secondary hover:text-primary"
            >
              {submitting ? 'PROCESSING...' : 'SUBMIT FOR REVIEW'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
