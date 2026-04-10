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
      <div className="border-4 border-secondary p-12 bg-white prose prose-slate max-w-none space-y-8">
        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">Introduction</h3>
          <p className="text-lg font-bold text-secondary">At Ganibini, accessible from ganibini.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Ganibini and how we use it.</p>
        </section>

        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">Log Files</h3>
          <p>Ganibini follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>
        </section>

        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">Cookies and Web Beacons</h3>
          <p>Like any other website, Ganibini uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
        </section>

        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">Google DoubleClick DART Cookie</h3>
          <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-primary underline">https://policies.google.com/technologies/ads</a></p>
        </section>

        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">Our Advertising Partners</h3>
          <p>Some of advertisers on our site may use cookies and web beacons. Our advertising partners include:</p>
          <ul className="list-disc pl-6 font-bold">
            <li>Google AdSense</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">Third Party Privacy Policies</h3>
          <p>Ganibini's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>
        </section>

        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">Children's Information</h3>
          <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Ganibini does not knowingly collect any Personal Identifiable Information from children under the age of 13.</p>
        </section>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl space-y-16">
      <div className="space-y-4">
        <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Legal</span>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Terms of <br /><span className="text-primary">Service</span></h1>
      </div>
      <div className="border-4 border-secondary p-12 bg-white prose prose-slate max-w-none space-y-8">
        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">1. Terms</h3>
          <p>By accessing the website at ganibini.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
        </section>

        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">2. Use License</h3>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Ganibini's website for personal, non-commercial transitory viewing only.</p>
        </section>

        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">3. Disclaimer</h3>
          <p>The materials on Ganibini's website are provided on an 'as is' basis. Ganibini makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>

        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">4. Limitations</h3>
          <p>In no event shall Ganibini or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Ganibini's website.</p>
        </section>

        <section>
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">5. Accuracy of materials</h3>
          <p>The materials appearing on Ganibini's website could include technical, typographical, or photographic errors. Ganibini does not warrant that any of the materials on its website are accurate, complete or current.</p>
        </section>
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
