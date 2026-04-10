import { Timestamp } from 'firebase/firestore';

export interface Song {
  id?: string;
  title: {
    en: string;
    mr: string;
  };
  slug: string;
  artist_names: string[];
  language: string;
  lyrics: {
    mr: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  created_at: Timestamp | Date;
  // Keep some old fields as optional for compatibility during transition
  song_name?: string;
  singer?: string;
  movie?: string;
  youtube_link?: string;
  is_trending?: boolean;
  genre?: string;
  year?: number;
  tags?: string[];
  meaning?: string;
  story?: string;
  submitted_by?: string;
  submitted_by_name?: string;
  submitted_by_email?: string;
  lyricist?: string;
  composer?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'contributor' | 'user';
}
