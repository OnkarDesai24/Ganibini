import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { Song } from '@/src/types';
import SongCard from '@/src/components/SongCard';

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!name) return;
      setLoading(true);
      try {
        // Capitalize first letter for display and matching
        const categoryName = name.charAt(0).toUpperCase() + name.slice(1);
        const q = query(
          collection(db, 'songs'),
          where('genre', '==', categoryName),
          where('status', '==', 'approved')
        );
        const snap = await getDocs(q);
        const songsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
        
        // Sort in memory
        const sortedSongs = songsData.sort((a, b) => {
          const timeA = a.created_at instanceof Date ? a.created_at.getTime() : (a.created_at?.toMillis?.() || 0);
          const timeB = b.created_at instanceof Date ? b.created_at.getTime() : (b.created_at?.toMillis?.() || 0);
          return timeB - timeA;
        });
        
        setSongs(sortedSongs);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `songs/category/${name}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [name]);

  const categoryTitle = name ? name.charAt(0).toUpperCase() + name.slice(1) : '';

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient">
          {categoryTitle} Songs
        </h1>
        <p className="text-slate-400">Explore the best {categoryTitle.toLowerCase()} Marathi lyrics.</p>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {songs.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}

      {!loading && songs.length === 0 && (
        <div className="text-center py-20 glass rounded-3xl">
          <p className="text-slate-400">No songs found in this category yet.</p>
        </div>
      )}
    </div>
  );
}
