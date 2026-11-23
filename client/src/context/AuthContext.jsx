/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let stopProfile = () => {};
    let syncTimeout;
    const stopAuth = onAuthStateChanged(auth, current => {
      stopProfile();
      clearTimeout(syncTimeout);
      setUser(current);
      setProfile(null);
      setProfileError('');
      setLoading(false); // Authentication never waits on Firestore connectivity.
      if (!current) { setProfileLoading(false); return; }
      setProfileLoading(true);
      syncTimeout = setTimeout(() => { setProfileError('Firestore is taking too long to respond. Check your network and retry.'); setProfileLoading(false); }, 10000);
      stopProfile = onSnapshot(doc(db, 'users', current.uid), snapshot => {
        clearTimeout(syncTimeout);
        setProfile(snapshot.exists() ? snapshot.data() : null);
        setProfileError('');
        setProfileLoading(false);
      }, error => {
        clearTimeout(syncTimeout);
        setProfileError(error.message);
        setProfileLoading(false);
      });
    }, error => { setProfileError(error.message); setLoading(false); });
    return () => { clearTimeout(syncTimeout); stopProfile(); stopAuth(); };
  }, [retry]);
  return <AuthContext.Provider value={{ user, profile, loading, profileLoading, profileError, retryProfile: () => setRetry(n => n + 1), logout: () => signOut(auth) }}>{children}</AuthContext.Provider>;
}
