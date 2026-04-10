import { Link } from 'react-router-dom';
import { Play, Music } from 'lucide-react';
import { Song } from '@/src/types';

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  // Extract YouTube ID for thumbnail
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(song.youtube_link || '');
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  const displayTitle = song.title?.mr || song.title?.en || song.song_name || 'Untitled Song';
  const displayArtists = song.artist_names?.join(', ') || song.singer || 'Unknown Artist';

  return (
    <Link to={`/lyrics/${song.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden border-2 border-secondary bg-secondary">
        <img
          src={thumbnailUrl || `https://picsum.photos/seed/${song.id}/600/800`}
          alt={displayTitle}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-60"></div>
        
        {/* Editorial Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-primary text-secondary px-2 py-1 text-[10px] font-black uppercase tracking-widest">
            {song.genre || song.language || 'Marathi'}
          </div>
          {song.is_trending && (
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center brutal-border">
              <Music className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="space-y-1">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">
              {displayTitle}
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              {song.movie || displayArtists}
            </p>
          </div>
        </div>
      </div>
      
      {/* Meta Info below card */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {displayArtists.split(',')[0]}
        </span>
        <div className="h-[1px] flex-1 mx-4 bg-secondary/10"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {song.year || '2024'}
        </span>
      </div>
    </Link>
  );
}
