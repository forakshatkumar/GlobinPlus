import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import Navbar from '../components/common/Navbar'
import { Eye, EyeOff } from 'lucide-react'
export default function AuthPage({ mode = 'login' }) {
    const navigate = useNavigate(),
        [name, setName] = useState(''),
        [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        [confirm, setConfirm] = useState(''),
        [role, setRole] = useState('patient'),
        [show, setShow] = useState(false),
        [busy, setBusy] = useState(false),
        [error, setError] = useState(''),
        [message, setMessage] = useState('')
    const isSignup = mode === 'signup'
    async function saveUser(u, selectedRole) {
        const ref = doc(db, 'users', u.uid),
            snap = await getDoc(ref)
        if (!snap.exists())
            await setDoc(ref, {
                uid: u.uid,
                name: u.displayName || name || '',
                email: u.email || '',
                role: selectedRole || 'patient',
                bio: '',
                photoURL: u.photoURL || '',
                photoSource: u.photoURL ? 'google' : 'default',
                hospitalVerified: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
    }
    async function submit(e) {
        e.preventDefault()
        setError('')
        setMessage('')
        if (isSignup && password !== confirm) {
            setError('Passwords do not match.')
            return
        }
        setBusy(true)
        try {
            if (isSignup) {
                const r = await createUserWithEmailAndPassword(auth, email, password)
                await updateProfile(r.user, { displayName: name })
                await saveUser(r.user, role)
                await sendEmailVerification(r.user)
                navigate('/profile')
            } else {
                const r = await signInWithEmailAndPassword(
                    auth, email, password
                );

                console.log("Login successful:", r.user.email);

                navigate("/profile");
            }
        } catch (e) {
            setError(e.message)
        } finally {
            setBusy(false)
        }
    }
    async function google() {
        setBusy(true)
        setError('')
        try {
            const r = await signInWithPopup(auth, new GoogleAuthProvider())
            await saveUser(r.user, isSignup ? role : 'patient')
            navigate('/profile')
        } catch (e) {
            setError(e.message)
        } finally {
            setBusy(false)
        }
    }
    async function reset() {
        if (!email) {
            setError('Enter your email first.')
            return
        }
        try {
            await sendPasswordResetEmail(auth, email)
            setMessage('Password reset email sent.')
        } catch (e) {
            setError(e.message)
        }
    }
    return (
        <div className='landing'>
            <Navbar />
            <main className='auth-layout'>
                <form className='auth-card' onSubmit={submit}>
                    <img
                        src='/globinplus-logo.png'
                        alt='GlobinPlus'
                        className='auth-logo'
                    />
                    <h1>{isSignup ? 'Join GlobinPlus' : 'Welcome back'}</h1>
                    <p>Connect, care, and help save lives.</p>
                    {isSignup && (
                        <label>
                            Full name
                            <input
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder='Your name'
                            />
                        </label>
                    )}
                    <label>
                        Email
                        <input
                            type='email'
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder='you@example.com'
                        />
                    </label>
                    <label>
                        Password
                        <div className='password-wrap'>
                            <input
                                type={show ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder='At least 6 characters'
                            />
                            <button
                                type='button'
                                onClick={() => setShow(!show)}
                                aria-label='Toggle password visibility'
                            >
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </label>
                    {isSignup && (
                        <>
                            <label>
                                Confirm password
                                <input
                                    type='password'
                                    required
                                    minLength={6}
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                />
                            </label>
                            <label>
                                Account type
                                <select value={role} onChange={e => setRole(e.target.value)}>
                                    <option value='patient'>Patient</option>
                                    <option value='donor'>Blood Donor</option>
                                    <option value='hospital'>Hospital (approval required)</option>
                                </select>
                            </label>
                        </>
                    )}
                    {!isSignup && (
                        <button className='text-action' type='button' onClick={reset}>
                            Forgot password?
                        </button>
                    )}
                    {error && (
                        <p className='form-error' role='alert'>
                            {error}
                        </p>
                    )}
                    {message && <p className='form-success'>{message}</p>}
                    <button className='auth-primary' disabled={busy}>
                        {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
                    </button>
                    <div className='auth-divider'>or continue with</div>
                    <button
                        type='button'
                        className='google-button'
                        onClick={google}
                        disabled={busy}
                    >
                        🌐 Continue with Google
                    </button>
                    <p className='auth-switch'>
                        {isSignup ? 'Already have an account?' : 'New to GlobinPlus?'}{' '}
                        <Link to={isSignup ? '/login' : '/signup'}>
                            {isSignup ? 'Sign in' : 'Create account'}
                        </Link>
                    </p>
                </form>
            </main>
        </div>
    )
}
