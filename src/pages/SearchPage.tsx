import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { Song } from '@/src/types';
import SongCard from '@/src/components/SongCard';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(queryParam);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        // Firestore doesn't support full-text search natively without third-party tools
        // For this "simple" architecture, we'll fetch all and filter client-side 
        // OR we can do a prefix search if we had a specific field.
        // Given the scale of a lyrics site, client-side filtering is okay for a few hundred songs.
        // For a real production app, we'd use Algolia or similar.
        const q = query(
          collection(db, 'songs'), 
          where('status', 'in', ['approved', 'Approved', 'APPROVED'])
        );
        const snap = await getDocs(q);
        const allSongsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
        
        // Sort in memory
        const allSongs = allSongsData.sort((a, b) => {
          const timeA = a.created_at instanceof Date ? a.created_at.getTime() : (a.created_at?.toMillis?.() || 0);
          const timeB = b.created_at instanceof Date ? b.created_at.getTime() : (b.created_at?.toMillis?.() || 0);
          return timeB - timeA;
        });
        
        if (queryParam) {
          const filtered = allSongs.filter(s => {
            const titleEn = s.title?.en || s.song_name || '';
            const titleMr = s.title?.mr || '';
            const artists = s.artist_names?.join(' ') || s.singer || '';
            const movie = s.movie || '';
            
            const searchStr = `${titleEn} ${titleMr} ${artists} ${movie}`.toLowerCase();
            return searchStr.includes(queryParam.toLowerCase());
          });
          setSongs(filtered);
        } else {
          setSongs(allSongs);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'songs');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [queryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-black tracking-tight text-center">Search Lyrics</h1>
        <form onSubmit={handleSearch} className="relative">
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for songs, singers, or movies..."
            className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-lg"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        </form>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            {queryParam ? `Results for "${queryParam}"` : 'All Songs'}
          </h2>
          <span className="text-sm text-slate-500">{songs.length} songs found</span>
        </div>

        {loading ? (
          <div className="text-center py-20">Searching...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {songs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}

        {!loading && songs.length === 0 && (
          <div className="text-center py-20 glass rounded-3xl">
            <p className="text-slate-400">No songs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
