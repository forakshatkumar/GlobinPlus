import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UserAvatar({size=44}) {
  const {user,profile} = useAuth();
  const src=profile?.photoURL || user?.photoURL;
  return <span className="user-avatar" style={{width:size,height:size}}>{src ? <img src={src} alt="Your profile" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display='none';e.currentTarget.parentNode.classList.add('fallback-avatar')}}/> : (profile?.name||user?.displayName||user?.email||'U').slice(0,1).toUpperCase()}</span>;
}
export default function Navbar(){
 const [open,setOpen]=useState(false),[notifications,setNotifications]=useState(false);
 const items=[['/home','Home'],['/resources','Find Blood'],['/camps','Donation Camps'],['/donate','Donate'],['/dashboard','Dashboard']];
 return <header className="floating-header"><div className="floating-nav"><Link className="floating-brand" to="/home" onClick={()=>setOpen(false)}><img src="/globinplus-logo.png" alt="GlobinPlus"/></Link>
 <nav className={`floating-links ${open?'is-open':''}`} aria-label="Main navigation">{items.map(([path,label])=><NavLink key={path} to={path} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}</nav>
 <div className="floating-actions"><div className="notification-wrap"><button className="icon-round" type="button" aria-label="Notifications" aria-expanded={notifications} onClick={()=>setNotifications(!notifications)}><Bell size={20}/></button>{notifications&&<div className="notification-popover"><strong>Notifications</strong><p>No new notifications yet.</p></div>}</div><Link to="/profile" aria-label="Open your profile" className="avatar-link"><UserAvatar/></Link><button type="button" className="floating-menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?'Close menu':'Open menu'} aria-expanded={open}>{open?<X size={23}/>:<Menu size={23}/>}</button></div></div></header>;
}
