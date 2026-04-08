import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl space-y-16">
      <div className="space-y-4">
        <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Our Mission</span>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">About <br /><span className="text-primary">Ganibini</span></h1>
      </div>
      <div className="border-4 border-secondary p-12 bg-white space-y-8">
        <p className="text-2xl font-bold text-secondary leading-tight">
          Ganibini is a dedicated platform for Marathi music enthusiasts. Our mission is to preserve and celebrate the soul of Marathi music through accurate lyrics, deep meanings, and the untold stories behind the songs.
        </p>
        <div className="h-[2px] w-24 bg-primary"></div>
        <p className="text-lg font-medium text-slate-500 leading-relaxed">
          Whether you're looking for the latest movie hits or timeless devotional songs, Ganibini offers a clean, minimal, and premium experience for everyone. We believe that every song has a story worth telling, and every lyric has a depth worth exploring.
        </p>
      </div>
    </div>
  );
}

export function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl space-y-16">
      <div className="space-y-4">
        <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Get in Touch</span>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Contact <br /><span className="text-primary">Us</span></h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-12">
          <div className="border-4 border-secondary p-8 bg-white">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Direct Contact</h3>
            <p className="text-2xl font-black uppercase tracking-tighter">support@ganibini.com</p>
          </div>
          <div className="border-4 border-secondary p-8 bg-secondary text-white">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Social Media</h3>
            <p className="text-2xl font-black uppercase tracking-tighter">@GanibiniLyrics</p>
          </div>
        </div>

        <div className="border-4 border-secondary p-10 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
              <Input required className="rounded-none border-2 border-secondary h-12 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
              <Input type="email" required className="rounded-none border-2 border-secondary h-12 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
              <Textarea required rows={5} className="rounded-none border-2 border-secondary font-bold" />
            </div>
            <Button type="submit" className="w-full brutal-btn h-14">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl space-y-16">
      <div className="space-y-4">
        <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Legal</span>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Privacy <br /><span className="text-primary">Policy</span></h1>
      </div>
      <div className="border-4 border-secondary p-12 bg-white prose prose-slate max-w-none">
        <p className="text-xl font-bold text-secondary">At Ganibini, we value your privacy. We do not sell your personal data to third parties.</p>
        <h3 className="font-black uppercase tracking-widest text-primary mt-8">Data Collection</h3>
        <p>We collect basic information like email when you log in via Google to provide a personalized experience and admin access.</p>
        <h3 className="font-black uppercase tracking-widest text-primary mt-8">Cookies</h3>
        <p>We use cookies to analyze traffic and serve personalized ads via Google AdSense.</p>
      </div>
    </div>
  );
}

export function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl space-y-16">
      <div className="space-y-4">
        <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Legal</span>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Disclaimer</h1>
      </div>
      <div className="border-4 border-secondary p-12 bg-white prose prose-slate max-w-none">
        <p className="text-xl font-bold text-secondary">All lyrics provided on Ganibini are for educational and informational purposes only.</p>
        <p>All rights belong to their respective owners, including singers, lyricists, composers, and music labels. We do not host any copyrighted audio files.</p>
        <p>If you are a copyright owner and want your content removed, please contact us at support@ganibini.com.</p>
      </div>
    </div>
  );
}
