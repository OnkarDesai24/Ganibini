import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, orderBy, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Song, UserProfile } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Check, X, Eye, Trash2, Users, Music, Shield } from 'lucide-react';

const ADMIN_EMAIL = 'desaisupriya12@gmail.com';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingSongs, setPendingSongs] = useState<Song[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'songs' | 'users'>('songs');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Use getDoc instead of query to avoid permission errors on listing users
          const userSnap = await getDoc(doc(db, 'users', user.uid));
          
          if (userSnap.exists()) {
            const userData = userSnap.data() as UserProfile;
            if (userData.role === 'admin' || user.email === ADMIN_EMAIL) {
              setIsAdmin(true);
              fetchPendingSongs();
              fetchUsers();
            } else {
              navigate('/');
            }
          } else if (user.email === ADMIN_EMAIL) {
            // Fallback for first-time admin login
            setIsAdmin(true);
            fetchPendingSongs();
            fetchUsers();
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error("Error checking admin status", error);
          if (user.email === ADMIN_EMAIL) {
            setIsAdmin(true);
            fetchPendingSongs();
            fetchUsers();
          } else {
            navigate('/');
          }
        }
      } else {
        navigate('/');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchPendingSongs = async () => {
    try {
      const q = query(collection(db, 'songs'), where('status', '==', 'pending'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      setPendingSongs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song)));
    } catch (error) {
      console.error("Error fetching pending songs", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(doc => ({ ...doc.data() } as UserProfile)));
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleApprove = async (songId: string) => {
    try {
      await updateDoc(doc(db, 'songs', songId), { status: 'approved' });
      toast.success('Song approved!');
      fetchPendingSongs();
    } catch (error) {
      toast.error('Failed to approve.');
    }
  };

  const handleReject = async (songId: string) => {
    try {
      await updateDoc(doc(db, 'songs', songId), { status: 'rejected' });
      toast.success('Song rejected.');
      fetchPendingSongs();
    } catch (error) {
      toast.error('Failed to reject.');
    }
  };

  const handleUpdateRole = async (uid: string, newRole: 'admin' | 'contributor' | 'user') => {
    try {
      const userSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', uid)));
      if (!userSnap.empty) {
        await updateDoc(userSnap.docs[0].ref, { role: newRole });
        toast.success(`Role updated to ${newRole}`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update role.');
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Dashboard...</div>;
  if (!isAdmin) return <div className="p-20 text-center">Access Denied.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-6xl font-black uppercase tracking-tighter">Admin <span className="text-primary">Panel</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Manage content and community</p>
        </div>
        <div className="flex gap-2 bg-secondary p-1">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/add-song')}
            className="rounded-none font-black uppercase tracking-widest bg-white text-secondary hover:bg-primary hover:text-secondary border-none"
          >
            <Music className="w-4 h-4 mr-2" /> Add New Song
          </Button>
          <Button 
            variant={activeTab === 'songs' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('songs')}
            className={`rounded-none font-black uppercase tracking-widest ${activeTab === 'songs' ? 'bg-primary text-secondary' : 'text-white'}`}
          >
            <Music className="w-4 h-4 mr-2" /> Submissions
          </Button>
          <Button 
            variant={activeTab === 'users' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('users')}
            className={`rounded-none font-black uppercase tracking-widest ${activeTab === 'users' ? 'bg-primary text-secondary' : 'text-white'}`}
          >
            <Users className="w-4 h-4 mr-2" /> Users
          </Button>
        </div>
      </div>

      {activeTab === 'songs' ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Pending Submissions ({pendingSongs.length})</h2>
          {pendingSongs.length === 0 ? (
            <div className="p-20 border-4 border-dashed border-secondary/10 text-center text-slate-400 font-bold uppercase tracking-widest">
              No pending submissions
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingSongs.map(song => (
                <div key={song.id} className="border-2 border-secondary p-6 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">
                      {song.title?.mr || song.title?.en || song.song_name}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {song.artist_names?.join(', ') || song.singer} • {song.movie}
                    </p>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-2">Submitted by: {song.submitted_by_name || song.submitted_by}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(`/lyrics/${song.slug}`)} className="border-2 border-secondary rounded-none font-black uppercase tracking-widest text-[10px]">
                      <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                    <Button onClick={() => handleApprove(song.id!)} className="bg-green-600 text-white rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-green-700">
                      <Check className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button onClick={() => handleReject(song.id!)} className="bg-red-600 text-white rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-red-700">
                      <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">User Management</h2>
          <div className="border-2 border-secondary overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-secondary text-white">
                <tr>
                  <th className="p-4 text-xs font-black uppercase tracking-widest">Email</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest">Current Role</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {users.map(user => (
                  <tr key={user.uid} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-sm">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-primary text-secondary' : 
                        user.role === 'contributor' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleUpdateRole(user.uid, 'admin')}
                        className="border-2 border-secondary rounded-none text-[10px] font-black uppercase tracking-widest"
                        disabled={user.email === ADMIN_EMAIL}
                      >
                        Make Admin
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleUpdateRole(user.uid, 'contributor')}
                        className="border-2 border-secondary rounded-none text-[10px] font-black uppercase tracking-widest"
                      >
                        Make Contributor
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleUpdateRole(user.uid, 'user')}
                        className="border-2 border-secondary rounded-none text-[10px] font-black uppercase tracking-widest"
                        disabled={user.email === ADMIN_EMAIL}
                      >
                        Revoke
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
