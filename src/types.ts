import { Timestamp } from 'firebase/firestore';

export interface Song {
  id?: string;
  song_name: string;
  slug: string;
  singer: string;
  lyricist?: string;
  composer?: string;
  movie: string;
  year?: number;
  language: string;
  genre?: string;
  youtube_link: string;
  lyrics: string;
  meaning?: string;
  story?: string;
  tags?: string[];
  is_trending?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by?: string;
  created_at: Timestamp | Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'contributor' | 'user';
}
