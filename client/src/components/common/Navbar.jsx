import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import {useAuth} from '../../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const {user,profile}=useAuth();
  const avatar=profile?.photoURL||user?.photoURL;
  return <header className="site-header">
    <div className="nav-container">
      <Link to="/" className="brand" aria-label="GlobinPlus home" onClick={() => setOpen(false)}>
        <img src="/globinplus-logo.png" alt="GlobinPlus" />
      </Link>
      <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        <a href="/#about" onClick={() => setOpen(false)}>About</a>
        <a href="/#resources" onClick={() => setOpen(false)}>Resources</a>
        <a href="/#donate" onClick={() => setOpen(false)}>Donor guide</a>
        <a href="/#impact" onClick={() => setOpen(false)}>Our impact</a>
        <div className="mobile-auth">{user?<Link to="/profile" onClick={() => setOpen(false)}>My Profile</Link>:<><Link to="/login" onClick={() => setOpen(false)}>Login</Link><Link to="/signup" onClick={() => setOpen(false)}>Sign up</Link></>}</div>
      </nav>
      <div className="nav-actions">{user?<Link className="navbar-avatar-link" to="/profile" aria-label="Open profile">{avatar?<img src={avatar} alt="Your profile" referrerPolicy="no-referrer"/>:<span>{(profile?.name||user.displayName||user.email||"U").charAt(0).toUpperCase()}</span>}</Link>:<><Link to="/login" className="nav-login">Login</Link><Link to="/signup" className="nav-signup">Sign Up <ArrowUpRight size={15}/></Link></>}</div>
      <button className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </div>
  </header>
}
