import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, HeartPulse, Hospital, Search, Tent, HandHeart, Check, Droplets, Users } from 'lucide-react';
import Navbar from './components/common/Navbar.jsx';
import AuthModal from './components/auth/AuthModal.jsx';
import Footer from './components/common/Footer.jsx';
import { Home, Resources, Camps, Donate, Dashboard } from './pages/Home.jsx';
import { FAQ, Settings, Contact, LegalPage } from './pages/InfoPages.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import './App.css';

function Reveal({ children, className = '', delay = 0 }) {
  return <div className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>{children}</div>;
}
function BloodDrop({ small = false }) {
  return <svg className={small ? 'droplet-icon small' : 'droplet-icon'} viewBox="0 0 350 440" role="img" aria-label="Red blood drop with medical cross">
    <defs>
      <linearGradient id="dropGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffb7a2"/><stop offset=".27" stopColor="#ff615a"/><stop offset=".63" stopColor="#ef292a"/><stop offset="1" stopColor="#9d0615"/></linearGradient>
      <linearGradient id="dropLight" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".85"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
      <filter id="dropShadow"><feGaussianBlur stdDeviation="13"/></filter>
    </defs>
    <ellipse cx="178" cy="405" rx="94" ry="16" fill="#cc4237" opacity=".17" filter="url(#dropShadow)" />
    <path d="M175 15 C148 95 58 179 50 261 C37 352 98 413 175 415 C257 416 312 348 301 268 C290 189 202 82 175 15 Z" fill="url(#dropGradient)"/>
    <path d="M164 74 C139 132 87 188 76 256 C64 321 94 357 115 365 C92 310 104 260 123 221 C145 175 169 143 164 74 Z" fill="url(#dropLight)" opacity=".72"/>
    <path d="M223 131 C266 205 287 253 276 308 C267 356 237 383 211 394" stroke="#ff9b83" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".35"/>
    <rect x="153" y="230" width="44" height="117" rx="7" fill="white"/><rect x="116" y="266" width="119" height="44" rx="7" fill="white"/>
  </svg>;
}
function BloodCell({ className = '' }) {return <span className={`blood-cell ${className}`} aria-hidden="true"/>}
function HeroArt() {return <div className="hero-art" aria-label="Medical blood donation illustration">
  <div className="hero-art-halo"/><svg className="orbit" viewBox="0 0 620 470" aria-hidden="true"><ellipse cx="308" cy="236" rx="247" ry="78" transform="rotate(-29 308 236)" fill="none" stroke="#e67b67" strokeWidth="5"/><ellipse cx="310" cy="235" rx="231" ry="64" transform="rotate(-29 310 235)" fill="none" stroke="#ffd6c8" strokeWidth="2" /></svg>
  <svg className="ecg" viewBox="0 0 690 90" aria-hidden="true"><path d="M0 50H100l12-12 13 31 18-69 18 78 15-28h162l11-12 14 20 16-45 18 65 14-28h279" stroke="#f09981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
  <div className="hero-drop-float"><BloodDrop/></div><BloodCell className="cell-one"/><BloodCell className="cell-two"/><BloodCell className="cell-three"/><BloodCell className="cell-four"/><BloodCell className="cell-five"/>
  <Heart className="hero-heart" size={65} strokeWidth={1.4} aria-hidden="true"/><span className="sparkle sp1">✦</span><span className="sparkle sp2">✧</span><span className="sparkle sp3">✦</span>
</div>}
function BloodBagArt(){return <div className="blood-bag-area" aria-hidden="true"><div className="bag-halo"/><svg className="blood-bag" viewBox="0 0 235 255"><defs><linearGradient id="bagFill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fd9486"/><stop offset="1" stopColor="#c81826"/></linearGradient></defs><rect x="94" y="15" width="47" height="24" rx="8" fill="#fce8de" stroke="#eeb8a7" strokeWidth="4"/><path d="M78 34 Q69 34 69 46 L61 170 Q60 198 88 199 H149 Q174 198 173 170 L164 46 Q164 34 153 34 Z" fill="#ffefe7" stroke="#ee9e92" strokeWidth="5"/><path d="M75 110 H159 L162 170 Q162 188 146 188 H90 Q75 188 74 170Z" fill="url(#bagFill)"/><path d="M116 114 C109 129 100 139 100 151a16 16 0 0 0 32 0c0-12-9-22-16-37Z" fill="#fff2ea"/><path d="M115 141l-6 12h12Z" fill="#e73a3c"/><path d="M116 199v34q0 10 12 10h22" fill="none" stroke="#d73939" strokeWidth="8" strokeLinecap="round"/><path d="M113 9h10" stroke="#e5b6a7" strokeWidth="5" strokeLinecap="round"/></svg><span className="bag-spark b1">✚</span><span className="bag-spark b2">✦</span><span className="bag-spark b3">✚</span><div className="script-quote">Together,<br/>we can save lives <Heart size={23}/></div></div>}
const features=[{icon:Search,title:'Find Blood Group',desc:'Locate hospitals with your required blood group nearby.',href:'/resources',kind:'search'},{icon:Tent,title:'Blood Donation Camps Near You',desc:'Discover upcoming donation camps in your area.',href:'/camps',kind:'camp'},{icon:HandHeart,title:'Donate Blood, Help People',desc:'Be a hero. Donate blood and make a difference.',href:'/donate',kind:'donate'}];
const impacts=[{icon:HeartPulse,title:'For Patients',desc:'Find nearby hospitals for critical blood during emergencies.'},{icon:Hospital,title:'For Hospitals',desc:'Manage inventory and anticipate shortages.'},{icon:Users,title:'For Donors',desc:'Contribute to community health and save lives.'}];
function Landing(){const location=useLocation(),navigate=useNavigate();const [authMode,setAuthMode]=useState(location.state?.authMode||null);useEffect(()=>{if(location.state?.authMode){navigate(location.pathname,{replace:true,state:null})}},[location.state,location.pathname,navigate]);useEffect(()=>{const elements=document.querySelectorAll('.reveal');if(!('IntersectionObserver' in window)){elements.forEach(el=>el.classList.add('in-view'));return;}const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');obs.unobserve(e.target)}}),{threshold:.12});elements.forEach(el=>obs.observe(el));return()=>obs.disconnect()},[]);return <div className="landing">
  <main>
    <section className="hero container" id="home"><div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> A smarter way to save lives</div><h1>Every Drop Counts.<br/>Every Second <span>Matters.</span></h1><p>GlobinPlus connects patients, hospitals, and donors through a unified platform — ensuring you can find, manage, and share blood resources in real time.</p><div className="landing-auth-actions"><button type="button" className="btn btn-soft" onClick={()=>setAuthMode("login")}>Sign In</button><button type="button" className="btn btn-primary" onClick={()=>setAuthMode("signup")}>Sign Up <ArrowRight size={19}/></button></div><div className="hero-note"><Heart size={16} fill="currentColor"/> Connecting communities. Saving lives.</div></div><HeroArt/></section>
    <section className="about container section" id="about"><Reveal className="about-copy"><span className="section-pill">About GlobinPlus</span><h2>What is <span>GlobinPlus?</span></h2><p>A centralized, real-time platform that bridges the gap between hospitals, blood donors, and patients. Get live updates on blood inventory, discover donation camps, and access valuable insights — all in one place.</p></Reveal><Reveal className="about-art" delay={100}><BloodBagArt/></Reveal></section>
    <section className="resources container section" id="resources"><Reveal><div className="center-heading"><span className="divider-line"/><h2>Find Blood. <span>Give Hope.</span> Save Lives.</h2><span className="divider-line"/></div><p className="section-subtitle">Everything you need to make a life-saving difference, all in one place.</p></Reveal><div className="feature-grid">{features.map((f,i)=><Reveal delay={i*85} key={f.title}><Link className="feature-card" to={f.href}><div className={`feature-icon ${f.kind}`}><f.icon size={39} strokeWidth={1.8}/></div><div className="feature-content"><h3>{f.title}</h3><p>{f.desc}</p></div><span className="card-arrow"><ArrowRight size={18}/></span></Link></Reveal>)}</div></section>
    <section className="donation container section" id="donate"><Reveal><div className="donation-panel"><span className="section-pill floating-pill">Tips &amp; Donor Criteria</span><div className="donation-heading"><h2>Give Smart. <span>Donate Safe.</span></h2><p>Follow these tips and criteria for a safe and healthy donation experience.</p></div><div className="donation-columns"><div className="tip-list"><h3>Tips for Healthy Donation</h3>{['Stay hydrated before donation','Eat a nutritious meal','Get enough sleep'].map(x=><div className="tip" key={x}><Check size={15}/>{x}</div>)}</div><div className="hands-art"><HandHeart size={154} strokeWidth={1.05}/><Droplets className="hands-drop" size={65} fill="#e43a3f" stroke="#e43a3f"/></div><div className="tip-list criteria"><h3>Criteria for a Healthy Donor</h3>{['Age: 18–65 years','Weight: ≥ 50 kg','Good overall health'].map(x=><div className="tip" key={x}><Check size={15}/>{x}</div>)}</div></div><p className="eligibility-note">Eligibility can vary by location and health history. Always follow your blood bank’s screening requirements.</p></div></Reveal></section>
    <section className="impact container section" id="impact"><Reveal><span className="section-pill">Our Impact</span><h2>Creating a Healthier, <span>More Prepared Community</span></h2></Reveal><div className="impact-grid">{impacts.map((f,i)=><Reveal key={f.title} delay={i*85}><div className="impact-card"><div className="impact-icon"><f.icon size={44} strokeWidth={1.8}/></div><div><h3>{f.title}</h3><p>{f.desc}</p></div></div></Reveal>)}</div></section>
    <section className="community container section"><Reveal><div className="community-banner"><div><h2>Join the <span>GlobinPlus</span> Community</h2><p>Be a part of a life-saving network. Because together, we save lives.</p></div><Heart size={54} strokeWidth={1.4} className="community-heart"/></div></Reveal></section>
  </main>
  <Footer/><AuthModal key={authMode||"closed"} mode={authMode} onClose={()=>setAuthMode(null)}/>
</div>}

function AppShell({children}){const {user}=useAuth();return <div className="app-shell">{user&&<Navbar/>}{children}<Footer/></div>}
function ProtectedPage({children}){return <ProtectedRoute><AppShell>{children}</AppShell></ProtectedRoute>}
function App(){return <Routes>
 <Route path="/" element={<Landing/>}/>
 <Route path="/home" element={<ProtectedPage><Home/></ProtectedPage>}/>
 <Route path="/resources" element={<ProtectedPage><Resources/></ProtectedPage>}/>
 <Route path="/camps" element={<ProtectedPage><Camps/></ProtectedPage>}/>
 <Route path="/donate" element={<ProtectedPage><Donate/></ProtectedPage>}/>
 <Route path="/dashboard" element={<ProtectedPage><Dashboard/></ProtectedPage>}/>
 <Route path="/profile" element={<ProtectedPage><Profile/></ProtectedPage>}/>
 <Route path="/settings" element={<ProtectedPage><Settings/></ProtectedPage>}/>
 <Route path="/faq" element={<AppShell><FAQ/></AppShell>}/>
 <Route path="/contact" element={<AppShell><Contact/></AppShell>}/>
 <Route path="/privacy" element={<AppShell><LegalPage type="privacy"/></AppShell>}/>
 <Route path="/terms" element={<AppShell><LegalPage type="terms"/></AppShell>}/>
 <Route path="/disclaimer" element={<AppShell><LegalPage type="disclaimer"/></AppShell>}/>
 <Route path="/login" element={<RedirectAuth mode="login"/>}/>
 <Route path="/signup" element={<RedirectAuth mode="signup"/>}/>
 <Route path="*" element={<AppShell><div className="app-page empty-state"><h1>Page not found</h1><Link to="/home">Return home →</Link></div></AppShell>}/>
 </Routes>}
function RedirectAuth({mode}){const navigate=useNavigate();useEffect(()=>{navigate('/',{replace:true,state:{authMode:mode}})},[navigate,mode]);return null}
export default App;
