import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import Home from '@/src/pages/Home';
import SongPage from '@/src/pages/SongPage';
import CategoryPage from '@/src/pages/CategoryPage';
import SearchPage from '@/src/pages/SearchPage';
import AdminAddSong from '@/src/pages/AdminAddSong';
import SubmitLyrics from '@/src/pages/SubmitLyrics';
import AdminDashboard from '@/src/pages/AdminDashboard';
import UserDashboard from '@/src/pages/UserDashboard';
import { AboutPage, ContactPage, PrivacyPage, DisclaimerPage, TermsPage } from '@/src/pages/StaticPages';
import ErrorBoundary from '@/src/components/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lyrics/:slug" element={<SongPage />} />
              <Route path="/category/:name" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/submit-lyrics" element={<SubmitLyrics />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin/add-song" element={<AdminAddSong />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  );
}
