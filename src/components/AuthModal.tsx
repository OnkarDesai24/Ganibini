import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/src/firebase';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent!");
        setIsForgotPassword(false);
      } else if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully!");
        onClose();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
        onClose();
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let message = "An error occurred. Please try again.";
      if (error.code === 'auth/user-not-found') message = "User not found.";
      if (error.code === 'auth/wrong-password') message = "Incorrect password.";
      if (error.code === 'auth/email-already-in-use') message = "Email already in use.";
      if (error.code === 'auth/invalid-email') message = "Invalid email address.";
      if (error.code === 'auth/weak-password') message = "Password should be at least 6 characters.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] border-4 border-secondary rounded-none bg-white p-8">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-4xl font-black uppercase tracking-tighter leading-none">
            {isForgotPassword ? 'Reset' : isSignUp ? 'Join' : 'Enter'} <br />
            <span className="text-primary">{isForgotPassword ? 'Password' : 'Ganibini'}</span>
          </DialogTitle>
          <DialogDescription className="text-xs font-black uppercase tracking-widest text-slate-400">
            {isForgotPassword 
              ? "We'll send you a link to get back in." 
              : isSignUp 
                ? "Create an account to submit lyrics." 
                : "Sign in to manage your submissions."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
            <Input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-none border-2 border-secondary h-12 font-bold" 
              placeholder="YOUR@EMAIL.COM"
            />
          </div>

          {!isForgotPassword && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
              <Input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-none border-2 border-secondary h-12 font-bold" 
                placeholder="••••••••"
              />
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full brutal-btn h-14 bg-secondary text-white hover:bg-primary hover:text-secondary transition-all"
          >
            {loading ? 'PROCESSING...' : isForgotPassword ? 'SEND RESET LINK' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </Button>
        </form>

        <div className="mt-8 space-y-4 text-center">
          {!isForgotPassword && (
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Join Us"}
            </button>
          )}
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => {
                setIsForgotPassword(!isForgotPassword);
                setIsSignUp(false);
              }}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-secondary transition-colors"
            >
              {isForgotPassword ? 'Back to Sign In' : 'Forgot Password?'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
