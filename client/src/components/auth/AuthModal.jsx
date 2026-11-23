import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, X, ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const withTimeout = (promise, ms=8000) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore connection timed out')), ms))]);
const friendlyError = error => ({'auth/email-already-in-use':'An account with this email already exists.', 'auth/invalid-credential':'Invalid email or password.', 'auth/popup-closed-by-user':'Google sign-in was cancelled.', 'auth/weak-password':'Choose a stronger password.', 'auth/unauthorized-domain':'Add localhost to Firebase authorized domains.'}[error.code] || error.message || 'Something went wrong. Please try again.');
export default function AuthModal({ mode, onClose }) {
  const [view, setView] = useState(mode || 'login');
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('patient'), [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('');

  const dialogRef = useRef(null), navigate = useNavigate();
  useEffect(() => {
    if (!mode) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = e => {
      if (e.key === 'Escape' && !busy) onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const elements = [...dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]')];
        if (!elements.length) return;
        if (e.shiftKey && document.activeElement === elements[0]) { e.preventDefault(); elements.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === elements.at(-1)) { e.preventDefault(); elements[0].focus(); }
      }
    };
    window.addEventListener('keydown', handleKey);
    const focus = setTimeout(() => dialogRef.current?.focus(), 40);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', handleKey); clearTimeout(focus); };
  }, [mode, onClose, busy]);
  if (!mode) return null;
  async function createProfile(u, chosenRole) {
    const profileRef = doc(db, 'users', u.uid);
    const existing = await withTimeout(getDoc(profileRef));
    if (!existing.exists()) await withTimeout(setDoc(profileRef, {
      uid: u.uid, name: u.displayName || name.trim() || '', email: u.email || '', role: chosenRole,
      username: '', bio: '', photoURL: u.photoURL || '', photoSource: u.photoURL ? 'google' : 'default',
      hospitalVerified: false, privacy: { shareHealthInfo: false },
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    }));
  }
  function finish() { onClose(); navigate('/home'); }
  async function withProfile(u, selectedRole) {
    try { await createProfile(u, selectedRole); }
    catch { /* Authentication works offline; AuthContext can initialize missing profiles later. */ }
    finish();
  }
  async function submit(e) {
    e.preventDefault(); setError(''); setMessage('');
    if (view === 'signup' && password !== confirm) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try {
      if (view === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(result.user, { displayName: name.trim() });
        try { await sendEmailVerification(result.user); } catch { /* Optional mail can be retried later */ }
        await withProfile(result.user, role);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        finish();
      }
    } catch (err) { setError(friendlyError(err)); } finally { setBusy(false); }
  }
  async function google() {
    setBusy(true); setError(''); setMessage('');
    try { const result = await signInWithPopup(auth, new GoogleAuthProvider()); await withProfile(result.user, role); }
    catch (err) { setError(friendlyError(err)); }
    finally { setBusy(false); }
  }
  async function resetPassword() {
    if (!email) { setError('Enter your email address first.'); return; }
    setBusy(true); setError('');
    try { await sendPasswordResetEmail(auth, email.trim()); setMessage('If an account exists, a password reset email has been sent.'); }
    catch (err) { setError(friendlyError(err)); } finally { setBusy(false); }
  }
  return <AnimatePresence><motion.div className="auth-modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e => { if (e.target === e.currentTarget && !busy) onClose(); }}>
    <motion.div className="auth-modal-card" ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="auth-heading" initial={{opacity:0,scale:.94,y:22}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.95,y:10}} transition={{duration:.22}}>
      <button type="button" className="auth-modal-close" onClick={onClose} aria-label="Close authentication"><X size={20}/></button>
      <img src="/globinplus-logo.png" className="auth-logo" alt="GlobinPlus"/>
      <h2 id="auth-heading">{view === 'signup' ? 'Join GlobinPlus' : 'Welcome back'}</h2>
      <p className="auth-modal-intro">A healthier community starts here.</p>
      <form onSubmit={submit} className="auth-form">
        {view === 'signup' && <label>Full name<input required autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/></label>}
        <label>Email address<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
        <label>Password<div className="password-wrap"><input required type={showPassword ? 'text':'password'} minLength={6} autoComplete={view === 'signup' ? 'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters"/><button type="button" aria-label="Toggle password visibility" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
        {view === 'signup' && <><label>Confirm password<input type="password" required minLength={6} autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)}/></label><label>Account type<select value={role} onChange={e=>setRole(e.target.value)}><option value="patient">Patient</option><option value="donor">Blood Donor</option><option value="hospital">Hospital (approval required)</option></select></label></>}
        {view === 'login' && <button type="button" className="text-action" onClick={resetPassword}>Forgot password?</button>}
        <button className="auth-primary" type="submit" disabled={busy}>{busy ? 'Please wait…' : view === 'signup' ? 'Create account' : 'Sign in'} <ArrowRight size={17}/></button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}
      <><div className="auth-divider">or continue with</div><button className="google-button" disabled={busy} onClick={google} type="button"><span className="google-g">G</span> Continue with Google</button><p className="auth-switch">{view === 'signup' ? 'Already have an account?' : 'New to GlobinPlus?'} <button type="button" onClick={()=>{setView(view==='signup'?'login':'signup');setError('');setMessage('');}}>{view === 'signup' ? 'Sign in' : 'Create account'}</button></p></>
    </motion.div>
  </motion.div></AnimatePresence>;
}
