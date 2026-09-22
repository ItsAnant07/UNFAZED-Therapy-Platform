import React, {useEffect, useMemo, useState} from 'react';
import {BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams} from 'react-router-dom';
import api from './api';

const therapists = [
  {id:'meera-kapoor', name:'Dr. Meera Kapoor', role:'Clinical Psychologist', exp:'9+ years', tags:['Anxiety','Relationships','Stress'], languages:'English · Hindi', price:'₹1,500', img:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85'},
  {id:'rhea-malhotra', name:'Rhea Malhotra', role:'Counselling Psychologist', exp:'6+ years', tags:['Self-esteem','Burnout','Life transitions'], languages:'English · Hindi', price:'₹1,200', img:'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=85'},
  {id:'arjun-rao', name:'Dr. Arjun Rao', role:'Clinical Psychologist', exp:'11+ years', tags:['Trauma','Anxiety','Young adults'], languages:'English · Hindi · Telugu', price:'₹1,800', img:'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=900&q=85'},
  {id:'ananya-sen', name:'Ananya Sen', role:'Counsellor & Therapist', exp:'7+ years', tags:['Couples','Family','Communication'], languages:'English · Bengali · Hindi', price:'₹1,300', img:'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=85'},
  {id:'kabir-mehta', name:'Kabir Mehta', role:'Psychotherapist', exp:'8+ years', tags:['Men’s mental health','Work stress','Confidence'], languages:'English · Hindi', price:'₹1,400', img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85'},
  {id:'nisha-verma', name:'Dr. Nisha Verma', role:'Clinical Psychologist', exp:'10+ years', tags:['Depression','Anxiety','Grief'], languages:'English · Hindi', price:'₹1,600', img:'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=85'},
];

const therapistImages={
  'meera-kapoor':'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85',
  'rhea-malhotra':'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=85',
  'arjun-rao':'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=900&q=85',
  'ananya-sen':'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=85',
  'kabir-mehta':'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85',
  'nisha-verma':'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=85'
};

function useTherapists(){
  const [data,setData]=useState(therapists);

  useEffect(()=>{
    api.get('/therapist/public-list')
      .then(r=>{
        const list=r.data.therapists || [];

        if(list.length){
          setData(list.map(t=>{
            const fallback=therapists.find(x=>x.id===t.slug) || {};

            return {
              id:t.slug,
              name:t.name,
              role:fallback.role || 'Therapist',
              exp:fallback.exp || 'Experienced practitioner',
              tags:t.specializations?.length
                ? t.specializations
                : (fallback.tags || []),
              languages:(t.languages || fallback.languages || ['English']).join(' · '),
              price:fallback.price || '₹1,500',
              img:therapistImages[t.slug] || fallback.img
            };
          }));
        }
      })
      .catch(err=>{
        console.error('Could not load therapists:',err);
      });
  },[]);

  return data;
}

function Icon({name,size=20}){const p={width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'1.8',strokeLinecap:'round',strokeLinejoin:'round'};const paths={search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,arrow:<><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></>,check:<path d="m5 12 4 4L19 6"/>,calendar:<><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 9h18"/></>,heart:<path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z"/>,menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>,x:<><path d="M6 6l12 12M18 6 6 18"/></>,user:<><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6"/></>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>};return <svg {...p}>{paths[name]}</svg>}

function Layout({children}){
  const [open,setOpen]=useState(false);
  const token=localStorage.getItem('unfazed_token');
  const hasProfile=!!localStorage.getItem('unfazed_profile');
  return <>
  <header className="nav"><div className="nav-inner"><Link to="/" className="brand"><span className="brand-mark">u</span><span>unfazed</span></Link>
  <nav className={open?'nav-links open':'nav-links'}><Link to="/therapists" onClick={()=>setOpen(false)}>Find a therapist</Link><Link to="/how-it-works" onClick={()=>setOpen(false)}>How it works</Link><Link to="/about" onClick={()=>setOpen(false)}>Why Unfazed</Link><Link to="/resources" onClick={()=>setOpen(false)}>Resources</Link></nav>
  <div className="nav-actions"><Link className="login-link" to="/my-bookings">My bookings</Link> {hasProfile&&!token&&<Link className="login-link" to="/profile">Profile</Link>}<Link className="login-link" to={token?'/dashboard':'/login'}>{token?'My space':'Log in'}</Link><Link className="btn btn-dark btn-small" to="/therapists">Find your therapist <Icon name="arrow" size={16}/></Link><button className="mobile-menu" onClick={()=>setOpen(!open)}><Icon name={open?'x':'menu'}/></button></div></div></header>
  {children}
  <footer className="footer"><div className="footer-top"><div><Link to="/" className="brand footer-brand"><span className="brand-mark">u</span><span>unfazed</span></Link><p>A calmer way to find support, one conversation at a time.</p></div><div className="footer-links"><div><b>Explore</b><Link to="/therapists">Therapists</Link><Link to="/how-it-works">How it works</Link><Link to="/resources">Resources</Link><Link to="/my-bookings">My bookings</Link></div><div><b>Company</b><Link to="/about">About us</Link><Link to="/contact">Help & support</Link><Link to="/login">Log in</Link></div><div><b>For therapists</b><Link to="/therapists">Join Unfazed</Link><Link to="/how-it-works">Our approach</Link></div></div></div><div className="footer-bottom"><span>© 2026 Unfazed. Made for better conversations.</span><span>Private · Secure · Human</span></div></footer></>
}
function Home(){const therapistsData=useTherapists();return <Layout><section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="dot"/> Mental health support, made human</div><h1>You don't have to figure it all out <em>alone.</em></h1><p className="hero-text">Talk to a qualified therapist who feels right for you. Private, thoughtful and completely online.</p><div className="hero-actions"><Link className="btn btn-dark" to="/therapists">Find a therapist <Icon name="arrow" size={17}/></Link><Link className="text-link" to="/how-it-works">See how it works <Icon name="arrow" size={16}/></Link></div><div className="trust-row"><span><Icon name="check" size={16}/> Qualified therapists</span><span><Icon name="check" size={16}/> Private sessions</span><span><Icon name="check" size={16}/> Online, anywhere</span></div></div><div className="hero-art"><div className="blob blob-a"/><div className="blob blob-b"/><img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85"/><div className="floating-note"><span className="mini-icon"><Icon name="heart" size={16}/></span><div><b>A space that feels safe</b><small>Take it at your own pace.</small></div></div></div></section>
<section className="intro-strip"><p>Sometimes the first step is simply having someone who listens.</p><span>— and that can make a difference.</span></section>
<section className="section discovery"><div className="section-heading"><div><span className="eyebrow">Find the right fit</span><h2>Therapy works better when it feels like <em>a good fit.</em></h2></div><Link className="text-link" to="/therapists">Meet all therapists <Icon name="arrow" size={16}/></Link></div><div className="therapist-grid">{therapistsData.slice(0,3).map(t=><TherapistCard key={t.id} t={t}/>)}</div></section>
<section className="soft-section"><div className="split"><div className="image-card"><img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=85"/><div className="image-caption">There is no perfect time to start. <b>There is only your time.</b></div></div><div className="split-copy"><span className="eyebrow">A little less overwhelming</span><h2>Therapy should feel like a conversation, not a process.</h2><p>We make it easier to discover someone you can trust, understand what to expect, and take the first step without pressure.</p><div className="feature-list"><div><span>01</span><p><b>Tell us what you need</b><small>Start with what’s on your mind. There is no right way to say it.</small></p></div><div><span>02</span><p><b>Choose someone who fits</b><small>Browse therapists by focus, experience, language and approach.</small></p></div><div><span>03</span><p><b>Start at your pace</b><small>Book a private online session when you feel ready.</small></p></div></div><Link className="btn btn-outline" to="/how-it-works">Explore how it works <Icon name="arrow" size={16}/></Link></div></div></section>
<section className="topics"><div className="section-heading"><div><span className="eyebrow">You can talk about anything</span><h2>Whatever is taking up <em>space in your head.</em></h2></div></div><div className="topic-grid">{['Anxiety & overthinking','Relationships','Work & burnout','Self-esteem','Family & boundaries','Life transitions'].map((x,i)=><Link to="/therapists" className="topic" key={x}><span>0{i+1}</span><b>{x}</b><Icon name="arrow" size={18}/></Link>)}</div></section>
<section className="cta"><div><span className="eyebrow">Your next chapter can start small</span><h2>Maybe you don't need all the answers.<br/><em>Just someone to talk to.</em></h2><Link className="btn btn-light" to="/therapists">Find a therapist <Icon name="arrow" size={16}/></Link></div><div className="cta-shape">♡</div></section>
</Layout>}

function TherapistCard({t}){return <article className="therapist-card"><div className="portrait"><img src={t.img}/><span className="online"><i/> Available online</span></div><div className="therapist-info"><div className="card-top"><div><h3>{t.name}</h3><p>{t.role}</p></div><span className="price">{t.price}<small>/ session</small></span></div><p className="meta">{t.exp} · {t.languages}</p><div className="tags">{t.tags.map(x=><span key={x}>{x}</span>)}</div><Link to={'/therapists/'+t.id} className="card-link">View profile <Icon name="arrow" size={15}/></Link></div></article>}

function Therapists(){const therapistsData=useTherapists(); const [q,setQ]=useState(''); const [focus,setFocus]=useState('All'); const filtered=therapistsData.filter(t=>(t.name+t.role+t.tags.join(' ')).toLowerCase().includes(q.toLowerCase())&&(focus==='All'||t.tags.includes(focus))); const options=['All','Anxiety','Relationships','Stress','Self-esteem','Burnout'];return <Layout><section className="page-hero"><div><span className="eyebrow">Meet your match</span><h1>Find a therapist who <em>gets it.</em></h1><p>Explore qualified professionals by what you’re going through, how you want to work, and what feels comfortable.</p></div></section><section className="browse"><div className="search-panel"><div className="searchbox"><Icon name="search" size={20}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search therapist or concern..."/></div><div className="filter-row">{options.map(o=><button className={focus===o?'filter active':'filter'} key={o} onClick={()=>setFocus(o)}>{o}</button>)}</div></div><div className="results-head"><span>{filtered.length} therapists</span><span>Online sessions · India</span></div><div className="therapist-grid all">{filtered.map(t=><TherapistCard key={t.id} t={t}/>)}</div>{!filtered.length&&<div className="empty">No matches yet. Try another concern or search term.</div>}</section></Layout>}

function TherapistProfile(){const therapistsData=useTherapists(); const {id}=useParams(); const t=therapistsData.find(x=>x.id===id)||therapistsData[0]; const nav=useNavigate(); return <Layout><section className="profile-head"><div className="profile-photo"><img src={t.img}/><span><i/> Taking new clients</span></div><div className="profile-intro"><span className="eyebrow">Therapist profile</span><h1>{t.name}</h1><p className="profile-role">{t.role} · {t.exp}</p><p className="profile-summary">A warm, collaborative space for understanding what’s happening beneath the surface and finding practical ways forward.</p><div className="tags">{t.tags.map(x=><span key={x}>{x}</span>)}</div><div className="profile-actions"><button className="btn btn-dark" onClick={()=>nav('/book/'+t.id)}>Book a session <Icon name="arrow" size={17}/></button><span><Icon name="clock" size={17}/> Online · 50 minutes</span></div></div></section><section className="profile-body"><div className="profile-main"><span className="eyebrow">About the work</span><h2>Therapy can be a place to slow down and make sense of things.</h2><p>I work with people navigating anxiety, relationships, self-doubt, stress and life transitions. Sessions are conversational, non-judgmental and shaped around what matters to you.</p><p>My approach combines evidence-based tools with curiosity and compassion. We will move at a pace that feels manageable, while making room for honest conversations.</p><div className="credentials"><div><b>Qualifications</b><span>MA Clinical Psychology</span><span>Licensed practitioner</span></div><div><b>Languages</b><span>{t.languages}</span></div><div><b>Session fee</b><span>{t.price} · 50 min</span></div></div></div><aside className="booking-card"><span className="eyebrow">Start here</span><h3>Book your first conversation</h3><p>Choose a time that works for you. You can change or cancel according to the session policy.</p><div className="slot"><Icon name="calendar" size={19}/><span>Next available</span><b>Tomorrow · 6:30 PM</b></div><button className="btn btn-dark full" onClick={()=>nav('/book/'+t.id)}>See available times <Icon name="arrow" size={16}/></button><small>Private · Secure booking</small></aside></section></Layout>}

function Booking(){
  const therapistsData=useTherapists(); const {id}=useParams(); const t=therapistsData.find(x=>x.id===id)||therapistsData[0];
  const [date,setDate]=useState('Tomorrow'); const [time,setTime]=useState('6:30 PM');
  const savedProfile=JSON.parse(localStorage.getItem('unfazed_profile')||'null');
  const [form,setForm]=useState({name:savedProfile?.name||'',email:savedProfile?.email||'',phone:savedProfile?.phone||''});
  const [done,setDone]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState(''),[booking,setBooking]=useState(null),[bookedSlots,setBookedSlots]=useState([]),[slotsLoading,setSlotsLoading]=useState(true);
  const slots=['5:00 PM','6:30 PM','7:30 PM','8:30 PM'];
  const dateOptions=(()=>{const result=[];for(let i=1;i<=3;i++){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+i);result.push({label:i===1?'Tomorrow':d.toLocaleDateString('en-IN',{weekday:'short',day:'2-digit',month:'short'}),value:d});}return result;})();
  const toDateTime=(dateLabel,timeLabel)=>{const option=dateOptions.find(x=>x.label===dateLabel)||dateOptions[0];const [clock,period]=timeLabel.split(' ');let [hour,minute]=clock.split(':').map(Number);if(period==='PM'&&hour!==12)hour+=12;if(period==='AM'&&hour===12)hour=0;const start=new Date(option.value);start.setHours(hour,minute,0,0);return {start,end:new Date(start.getTime()+50*60*1000)}};
  const isSlotBooked=(dateLabel,timeLabel)=>{const {start}=toDateTime(dateLabel,timeLabel);return bookedSlots.some(x=>Math.abs(new Date(x.start).getTime()-start.getTime())<60000);};
  useEffect(()=>{let active=true;setSlotsLoading(true);api.get('/scheduling/public/'+t.id).then(r=>{if(active)setBookedSlots(r.data.booked||[])}).catch(()=>{if(active)setBookedSlots([])}).finally(()=>{if(active)setSlotsLoading(false)});return()=>{active=false}},[t.id]);
  const confirmBooking=async(e)=>{e?.preventDefault();setError('');if(!form.name.trim()||!form.email.trim()){setError('Please enter your name and email before confirming.');return;}if(isSlotBooked(date,time)){setError('That time has just been booked. Please choose another available time.');return;}try{setSaving(true);const {start,end}=toDateTime(date,time);const r=await api.post('/scheduling/public/book',{therapistSlug:t.id,name:form.name,email:form.email,phone:form.phone,start:start.toISOString(),end:end.toISOString(),amount:Number(String(t.price).replace(/[^0-9.]/g,''))||0});const session=r.data.session;setBooking({...session,emailSent:Boolean(r.data.email?.sent)});localStorage.setItem('unfazed_profile',JSON.stringify({name:form.name.trim(),email:form.email.toLowerCase().trim(),phone:form.phone||''}));localStorage.setItem('unfazed_last_booking',JSON.stringify({bookingCode:session.bookingCode,email:form.email.toLowerCase().trim()}));setDone(true)}catch(err){setError(err.response?.data?.message||'We could not confirm this session. Please try another time.')}finally{setSaving(false)}};
  if(done)return <Layout><div className="success"><div className="success-icon">✓</div><span className="eyebrow">You're booked</span><h1>Your session is confirmed.</h1><p>Your session with <b>{t.name}</b> is scheduled for {date}, {time}.</p><div className="booking-confirm-box"><span>Booking reference</span><b>{booking?.bookingCode||'Generating…'}</b><span>Client</span><b>{booking?.client?.name||form.name}</b><span>Session fee</span><b>₹{Number(booking?.amount||0).toLocaleString('en-IN')}</b><span>Email confirmation</span><b>{booking?.emailSent?'Sent to '+form.email:'Not sent yet — SMTP needs to be configured'}</b></div><div className="hero-actions"><Link className="btn btn-dark" to={`/pay/${booking?._id}`}>Pay with UPI <Icon name="arrow" size={16}/></Link><Link className="btn btn-outline" to={'/my-bookings?code='+(booking?.bookingCode||'')}>View my booking</Link></div><p className="fine">Save your booking reference. You can use it with your email to find this booking later.</p></div></Layout>;
  return <Layout><section className="booking-page"><div className="booking-copy"><span className="eyebrow">Book a session</span><h1>A quiet first step.</h1><p>Choose a time that feels comfortable. Your booking will be securely saved to the server and you will receive a booking reference and email confirmation.</p><div className="selected-therapist"><img src={t.img}/><div><b>{t.name}</b><span>{t.role}</span><small>{t.price} · 50 min · Online</small></div></div><div className="booking-note">After booking, use <b>My bookings</b> with your email or booking reference to view the complete booking details, pay or cancel the session.</div></div><form className="booking-form" onSubmit={confirmBooking}><label>Your details</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name"/><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email address"/><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone (optional)"/><label>Choose a day</label><div className="day-row">{dateOptions.map(d=><button type="button" className={date===d.label?'choice selected':'choice'} onClick={()=>setDate(d.label)} key={d.label}>{d.label}</button>)}</div><label>Choose a time</label><div className="slot-grid">{slots.map(s=>{const unavailable=isSlotBooked(date,s);return <button type="button" disabled={unavailable||slotsLoading} className={(time===s?'time selected ':'time ')+(unavailable?'time-unavailable':'')} onClick={()=>setTime(s)} key={s}>{s}{unavailable?' · Booked':''}</button>})}</div><div className="booking-summary"><span>Session</span><b>{t.price}</b><small>{date} · {time} · Online · 50 minutes</small></div>{error&&<div className="form-error">{error}</div>}<button className="btn btn-dark full" type="submit" disabled={saving||slotsLoading||isSlotBooked(date,time)}>{saving?'Confirming…':'Confirm session'} <Icon name="arrow" size={16}/></button><p className="fine">By booking, you agree to the session and privacy information shown on this website.</p></form></section></Layout>
}
function HowItWorks(){return <Layout><section className="page-hero centered"><span className="eyebrow">Simple by design</span><h1>Therapy, without <em>the overwhelm.</em></h1><p>We built Unfazed around the things that make starting therapy easier: choice, clarity and a little more breathing room.</p></section><section className="steps">{[['01','Start with you','Tell us what’s going on, in your own words. You don’t need to know what kind of therapy you need.'],['02','Find your fit','Browse therapists by specialisation, language, experience and style.'],['03','Choose a time','See available online slots and book when it feels right.'],['04','Have the conversation','Meet privately, talk openly, and take the process one session at a time.']].map(s=><div className="step" key={s[0]}><span>{s[0]}</span><h2>{s[1]}</h2><p>{s[2]}</p></div>)}</section><section className="quote-section"><div className="quote">“The right therapist doesn’t have to have all the answers. They just need to make it feel safe enough for you to find yours.”</div></section></Layout>}

function About(){return <Layout><section className="page-hero about-hero"><span className="eyebrow">Why Unfazed</span><h1>Because asking for help should feel <em>human.</em></h1><p>Unfazed is a digital space for people who want mental-health support without the clinical coldness or the pressure to have everything figured out.</p></section><section className="about-grid"><div><span className="eyebrow">Our belief</span><h2>There is strength in saying, “I think I need someone.”</h2></div><div><p>We believe therapy should be approachable, private and personal. That means helping you discover a therapist who fits your needs, giving you enough information to make a confident choice, and making the first booking feel less intimidating.</p><p>Our platform is designed to put the person—not the process—at the centre.</p></div></section><section className="values"><div><b>Human first</b><p>Technology should make support easier, not make people feel like a number.</p></div><div><b>Choice matters</b><p>The right fit is personal. Explore, compare and choose without pressure.</p></div><div><b>Privacy always</b><p>Your conversations and choices deserve a thoughtful, secure environment.</p></div></section></Layout>}

function Resources(){const articles=[['How to know if therapy might help','15 signs that it could be time to talk to someone.','Anxiety'],['When your mind won’t switch off','A gentle guide to understanding overthinking.','Self-care'],['Boundaries are not walls','Why saying no can be an act of care.','Relationships'],['Burnout is more than being tired','What your body and mind may be trying to tell you.','Work']];return <Layout><section className="page-hero"><span className="eyebrow">The Unfazed journal</span><h1>Small things to help you understand <em>yourself better.</em></h1><p>Thoughtful, practical mental-health reading—without the jargon.</p></section><section className="articles">{articles.map((a,i)=><article className="article" key={a[0]}><div className={'article-art art-'+i}>{['○','∿','◇','◌'][i]}</div><span>{a[2]}</span><h2>{a[0]}</h2><p>{a[1]}</p><Link to="/therapists">Read more <Icon name="arrow" size={15}/></Link></article>)}</section></Layout>}

function Auth({register=false}){const nav=useNavigate(); const [form,setForm]=useState({name:'',email:'',password:''}); const [error,setError]=useState(''); const submit=async e=>{e.preventDefault();setError('');try{const url=register?'/auth/register':'/auth/login';const r=await api.post(url,form);localStorage.setItem('unfazed_token',r.data.token);nav('/dashboard')}catch(err){setError(err.response?.data?.message||'Something went wrong. Please try again.')}};return <div className="auth"><div className="auth-visual"><Link to="/" className="brand light"><span className="brand-mark">u</span><span>unfazed</span></Link><div><span className="eyebrow">A softer place to start</span><h1>Come as you are.<br/><em>There’s no perfect way.</em></h1><p>Continue your journey with private access to sessions, bookings and your personal space.</p></div><small>Private · Secure · Human</small></div><div className="auth-form"><Link to="/" className="back">← Back to Unfazed</Link><div className="form-box"><span className="eyebrow">{register?'Create your space':'Welcome back'}</span><h2>{register?'Start with a simple account.':'Good to see you again.'}</h2><p>{register?'Your account lets you book sessions and keep everything in one place.':'Log in to manage your sessions and bookings.'}</p><form onSubmit={submit}>{register&&<label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></label>}<label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>Password<input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"/></label>{error&&<div className="form-error">{error}</div>}<button className="btn btn-dark full" type="submit">{register?'Create account':'Log in'} <Icon name="arrow" size={16}/></button></form><div className="auth-switch">{register?'Already have an account?':'New to Unfazed?'} <Link to={register?'/login':'/register'}>{register?'Log in':'Create an account'}</Link></div></div></div></div>}

function Dashboard(){
 const [sessions,setSessions]=useState([]);const [payments,setPayments]=useState([]);const [clients,setClients]=useState([]);const [profile,setProfile]=useState(null);const [upiId,setUpiId]=useState('');const [saving,setSaving]=useState(false);const [refundRef,setRefundRef]=useState({});const [bookingForm,setBookingForm]=useState({clientId:'',start:'',amount:''});const [bookingSaving,setBookingSaving]=useState(false);const nav=useNavigate();
 useEffect(()=>{const token=localStorage.getItem('unfazed_token');if(!token){nav('/my-bookings');return;} (async()=>{try{const [p,s,pay,c]=await Promise.all([api.get('/therapist/me'),api.get('/scheduling/sessions'),api.get('/payments'),api.get('/clients')]);setProfile(p.data.therapist);setUpiId(p.data.therapist?.upiId||'');setSessions(s.data.sessions||[]);setPayments(pay.data.payments||[]);setClients(c.data.clients||[])}catch(e){}})()},[]);
 const logout=()=>{localStorage.removeItem('unfazed_token');nav('/')};
 const saveProfile=async()=>{try{setSaving(true);const r=await api.put('/therapist/me',{upiId});setProfile(r.data.therapist)}catch(e){}finally{setSaving(false)}};
 const cancel=async(id)=>{if(!window.confirm('Cancel this session? If this session has a paid UPI payment, a refund will be required.'))return;try{const r=await api.post('/scheduling/'+id+'/cancel');setSessions(x=>x.map(s=>s._id===id?{...s,status:'Cancelled'}:s));if(r.data.refund?.paymentId)setPayments(x=>x.map(p=>p._id===r.data.refund.paymentId?{...p,refund_status:'pending'}:p));alert(r.data.message)}catch(e){alert(e.response?.data?.message||'Could not cancel session')}};
 const processRefund=async(paymentId)=>{try{const r=await api.patch('/payments/'+paymentId+'/refund',{refundReference:refundRef[paymentId]||''});setPayments(x=>x.map(p=>p._id===paymentId?{...p,...r.data.payment}:p));alert('Refund recorded. Please make the actual refund in your UPI/bank app first.')}catch(e){alert(e.response?.data?.message||'Could not record refund')}};
 const verifyPayment=async(id,status)=>{try{await api.patch('/payments/'+id+'/status',{status});}catch(e){alert(e.response?.data?.message||'Could not update payment')}};
 const createTherapistBooking=async(e)=>{e.preventDefault();if(!bookingForm.clientId||!bookingForm.start){alert('Select a client and session date/time.');return;}const client=clients.find(c=>c._id===bookingForm.clientId);try{setBookingSaving(true);const start=new Date(bookingForm.start);const end=new Date(start.getTime()+50*60*1000);const amount=Number(bookingForm.amount||0);const r=await api.post('/scheduling/book',{clientId:bookingForm.clientId,start:start.toISOString(),end:end.toISOString(),amount});const session={...r.data.session,payment:null};setSessions(x=>[...x,session].sort((a,b)=>new Date(a.start)-new Date(b.start)));setBookingForm({clientId:'',start:'',amount:''});alert(r.data.email?.sent?`Booking confirmed and email sent to ${client?.email}. Reference: ${r.data.session.bookingCode}`:`Booking confirmed. Reference: ${r.data.session.bookingCode}. Email was not sent because SMTP is not configured.`)}catch(e){alert(e.response?.data?.message||'Could not create booking')}finally{setBookingSaving(false)}};
 return <div className="dash"><aside className="dash-side"><Link to="/" className="brand"><span className="brand-mark">u</span><span>unfazed</span></Link><div className="dash-user"><div className="avatar">{(profile?.name||'A')[0]}</div><div><b>{profile?.name||'My space'}</b><span>Therapist dashboard</span></div></div><nav><NavLink to="/dashboard">Overview</NavLink><NavLink to="/therapists">Find a therapist</NavLink><NavLink to="/resources">Resources</NavLink></nav><button className="logout" onClick={logout}>Log out</button></aside><main className="dash-main"><div className="dash-top"><div><span className="eyebrow">Therapist space</span><h1>Practice overview</h1></div><Link className="btn btn-dark" to="/therapists">View public profile <Icon name="arrow" size={16}/></Link></div><section className="dash-card therapist-booking-card"><div className="dash-label">Create a booking</div><h3>Book a client manually</h3><p className="small-muted">Use this when you arrange a session for a client from your therapist dashboard. The client receives the booking reference and can view it in My bookings.</p><form className="therapist-booking-form" onSubmit={createTherapistBooking}><select className="settings-input" value={bookingForm.clientId} onChange={e=>setBookingForm({...bookingForm,clientId:e.target.value})} required><option value="">Select client</option>{clients.map(c=><option value={c._id} key={c._id}>{c.name} · {c.email}</option>)}</select><input className="settings-input" type="datetime-local" value={bookingForm.start} onChange={e=>setBookingForm({...bookingForm,start:e.target.value})} required/><input className="settings-input" type="number" min="0" value={bookingForm.amount} onChange={e=>setBookingForm({...bookingForm,amount:e.target.value})} placeholder="Session fee (₹)"/><button className="btn btn-dark full" disabled={bookingSaving}>{bookingSaving?'Creating…':'Book client & send confirmation'}</button></form></section><div className="dash-grid"><section className="next-session"><div className="dash-label">Sessions</div>{sessions.length?<div className="session-list">{sessions.map((session)=><div className="session-row" key={session._id}><div className="session-date"><b>{new Date(session.start).toLocaleDateString()}</b><span>{new Date(session.start).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</span></div><div><b>{session.client?.name||'Client'}</b><p>{session.client?.email||''} · Online</p></div><div className="session-actions"><span className={'session-status '+(session.status==='Cancelled'?'cancelled':'')}>{session.status}</span>{session.status==='Booked'&&<button className="mini-btn danger" onClick={()=>cancel(session._id)}>Cancel</button>}</div></div>)}</div>:<><h2>No sessions yet.</h2><p>New public bookings will appear here automatically.</p></>}</section><section className="dash-card"><div className="dash-label">Payment verification</div><h3>UPI payments</h3>{payments.length?<div className="payment-list">{payments.slice(0,8).map(p=><div className="payment-row" key={p._id}><div><b>₹{Number(p.amount||0).toLocaleString('en-IN')}</b><span>{p.client?.name||'Client'} · {p.utr||'No UTR'}{p.refund_status==='pending'?' · Refund pending':''}</span></div><div className="session-actions"><span className="session-status">{p.status}</span>{p.status==='pending'&&<><button className="mini-btn" onClick={async()=>{await verifyPayment(p._id,'paid');setPayments(x=>x.map(i=>i._id===p._id?{...i,status:'paid'}:i))}}>Verify</button><button className="mini-btn danger" onClick={async()=>{await verifyPayment(p._id,'rejected');setPayments(x=>x.map(i=>i._id===p._id?{...i,status:'rejected'}:i))}}>Reject</button></>}{p.refund_status==='pending'&&<><input className="mini-input" value={refundRef[p._id]||''} onChange={e=>setRefundRef({...refundRef,[p._id]:e.target.value})} placeholder="Refund UTR"/><button className="mini-btn" onClick={()=>processRefund(p._id)}>Mark refunded</button></>}</div></div>)}</div>:<p className="small-muted">No UPI payments submitted yet.</p>}</section><section className="dash-card"><div className="dash-label">Your UPI</div><h3>Receive direct payments</h3><p className="small-muted">Set the UPI ID patients should pay. This is a real UPI payment flow, not a fake gateway.</p><input className="settings-input" value={upiId} onChange={e=>setUpiId(e.target.value)} placeholder="yourname@upi"/><button className="btn btn-dark full" disabled={saving} onClick={saveProfile}>{saving?'Saving…':'Save UPI ID'}</button></section></div><section className="dash-bottom"><div><span className="eyebrow">Payment workflow</span><h2>Patients pay you directly by UPI.</h2><p className="small-muted">They scan your QR, pay in their UPI app, enter the UTR, and you verify the payment here.</p></div><div className="privacy-card"><b>Important</b><p>Only mark a payment as paid after checking the amount and UTR in your UPI app/bank statement.</p></div></section></main></div>
}
function Profile(){
  const existing = JSON.parse(
    localStorage.getItem('unfazed_profile') || '{}'
  );

  const [form,setForm] = useState({
    name: existing.name || '',
    email: existing.email || '',
    phone: existing.phone || '',
    upiId: existing.upiId || ''
  });

  const [saving,setSaving] = useState(false);
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');
  const nav = useNavigate();

  useEffect(()=>{
    api.get('/therapist/me')
      .then(r=>{
        const t = r.data.therapist || r.data;

        setForm(prev=>({
          ...prev,
          name: t.name || prev.name,
          upiId: t.upiId || ''
        }));
      })
      .catch(()=>{});
  },[]);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await api.put('/therapist/me',{
        name: form.name,
        upiId: form.upiId
      });

      localStorage.setItem(
        'unfazed_profile',
        JSON.stringify(form)
      );

      setMessage('Profile and UPI ID saved successfully.');
    } catch(e) {
      setError(
        e.response?.data?.message ||
        'Could not save profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  return <Layout>
    <section className="page-hero centered">
      <span className="eyebrow">Your profile</span>

      <h1>
        A space that keeps your <em>details handy.</em>
      </h1>

      <p>
        Your profile is used to pre-fill future bookings
        and manage your therapist payment details.
      </p>
    </section>

    <section className="profile-form-card">
      <form onSubmit={save}>

        <label>
          Full name
          <input
            required
            value={form.name}
            onChange={e=>
              setForm({...form,name:e.target.value})
            }
          />
        </label>

        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={e=>
              setForm({...form,email:e.target.value})
            }
          />
        </label>

        <label>
          Phone
          <input
            value={form.phone}
            onChange={e=>
              setForm({...form,phone:e.target.value})
            }
          />
        </label>

        <label>
          UPI ID
          <input
            value={form.upiId}
            onChange={e=>
              setForm({...form,upiId:e.target.value})
            }
            placeholder="example@upi"
          />
        </label>

        <small className="fine">
          This UPI ID is used to generate the payment QR
          for your therapy sessions.
        </small>

        {error &&
          <div className="form-error">
            {error}
          </div>
        }

        {message &&
          <div className="success-message">
            ✓ {message}
          </div>
        }

        <button
          type="submit"
          className="btn btn-dark full"
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save profile'}
          <Icon name="arrow" size={16}/>
        </button>

      </form>
    </section>
  </Layout>
}

function MyBookings(){
 const existing=JSON.parse(localStorage.getItem('unfazed_profile')||'{}'); const last=JSON.parse(localStorage.getItem('unfazed_last_booking')||'{}');
 const params=new URLSearchParams(window.location.search); const [email,setEmail]=useState(params.get('email')||existing.email||''); const [code,setCode]=useState(params.get('code')||last.bookingCode||'');
 const [sessions,setSessions]=useState([]);const [loading,setLoading]=useState(false);const [error,setError]=useState('');
 const load=async()=>{setError('');if(!email.trim()&&!code.trim()){setError('Enter the email used while booking or your booking reference.');return;}try{setLoading(true);const r=await api.get('/scheduling/public/client-sessions',{params:{email:email.trim().toLowerCase(),bookingCode:code.trim().toUpperCase()}});setSessions(r.data.sessions||[]);if(!r.data.sessions?.length)setError('No bookings found. Check the email or booking reference from your confirmation.');}catch(e){setError(e.response?.data?.message||'Could not load bookings.')}finally{setLoading(false)}};
 useEffect(()=>{if(email||code)load()},[]);
 const cancel=async(s)=>{if(!window.confirm('Cancel this booking? If you have a verified paid payment, a refund will be marked as pending.'))return;try{const r=await api.post('/scheduling/public/'+s._id+'/cancel',{email:s.client?.email||email});setSessions(x=>x.map(item=>item._id===s._id?{...item,status:'Cancelled',payment:r.data.refund?.paymentId?{...(item.payment||{}),refund_status:'pending',refund_amount:r.data.refund.amount}:item.payment}:item));}catch(e){alert(e.response?.data?.message||'Could not cancel booking')}};
 return <Layout><section className="page-hero centered"><span className="eyebrow">My bookings</span><h1>Your sessions, <em>all in one place.</em></h1><p>Use either your booking email or the booking reference shown after confirmation. Your bookings are loaded from MongoDB, not just your browser.</p><div className="booking-lookup"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Booking email"/><input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Booking reference e.g. UF-AB12CD"/><button className="btn btn-dark" onClick={load}>{loading?'Checking…':'View bookings'}</button></div>{error&&<div className="form-error">{error}</div>}</section><section className="my-bookings-list">{sessions.length?sessions.map(s=><article className="booking-card-row" key={s._id}><div><span className="eyebrow">{s.status}</span><h2>{s.therapist?.name||'Therapist'}</h2><p>{new Date(s.start).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})} · {new Date(s.start).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</p><small>Ref: <b>{s.bookingCode||'—'}</b> · {s.client?.name} · {s.client?.email||email} · ₹{Number(s.amount||0).toLocaleString('en-IN')} · Online · 50 min</small><small className="booking-detail-line">Booking created: {new Date(s.createdAt||s.start).toLocaleString('en-IN')} {s.cancelledBy?` · Cancelled by ${s.cancelledBy}`:''}</small>{s.payment?.status&&<small className="booking-payment">Payment: {s.payment.status}{s.payment.refund_status==='pending'?' · Refund pending':s.payment.refund_status==='refunded'?' · Refunded':''}</small>}</div><div className="booking-row-actions">{s.status==='Booked'&&<><Link className="btn btn-dark" to={'/pay/'+s._id}>Pay with UPI</Link><button className="btn btn-outline danger-outline" onClick={()=>cancel(s)}>Cancel booking</button></>}{s.status==='Cancelled'&&<span className="muted-pill">Cancelled{s.payment?.refund_status==='pending'?' · Refund pending':''}</span>}</div></article>):<div className="empty"><h2>No bookings found.</h2><p>After a successful booking, your confirmation contains a booking reference. Use that reference or the same email here.</p><Link className="btn btn-dark" to="/therapists">Find a therapist</Link></div>}</section></Layout>
}
function PaymentPage(){
 const {sessionId}=useParams();const [data,setData]=useState(null);const [utr,setUtr]=useState('');const [email,setEmail]=useState(()=>JSON.parse(localStorage.getItem('unfazed_profile')||'{}').email||'');const [loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 useEffect(()=>{api.get('/payments/public/'+sessionId).then(r=>setData(r.data)).catch(e=>setError(e.response?.data?.message||'Payment details unavailable')).finally(()=>setLoading(false))},[sessionId]);
 if(loading)return <Layout><div className="success"><h1>Loading payment details…</h1></div></Layout>;
 if(error)return <Layout><div className="success"><h1>{error}</h1><Link className="btn btn-dark" to="/my-bookings">Back to bookings</Link></div></Layout>;
 const session=data.session,upiId=data.upiId;const amount=Number(session.amount||0);const upiUrl=upiId?`upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(session.therapist?.name||'Unfazed Therapist')}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Unfazed therapy session')}`:'';
 const submit=async()=>{setError('');if(!email.trim()){setError('Enter the booking email.');return;}try{setSaving(true);const r=await api.post('/payments/public/'+sessionId+'/upi',{email,utr});setMessage(r.data.message||'Payment submitted for verification.')}catch(e){setError(e.response?.data?.message||'Could not record payment.')}finally{setSaving(false)}};
 return <Layout><section className="payment-page"><div><span className="eyebrow">Secure payment</span><h1>Pay your therapist <em>directly.</em></h1><p>This uses your real UPI app. Unfazed does not pretend the payment is complete—we record it as pending until the therapist verifies it.</p><div className="payment-summary"><span>Therapist</span><b>{session.therapist?.name}</b><span>Session</span><b>{new Date(session.start).toLocaleDateString('en-IN')} · {new Date(session.start).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</b><span>Amount</span><b>₹{amount.toLocaleString('en-IN')}</b></div></div><div className="upi-card"><span className="eyebrow">Pay by UPI</span>{upiId?<><div className="qr-wrap"><img className="upi-qr" src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`} alt="UPI payment QR code"/></div><b className="upi-id">{upiId}</b><p>Scan the QR with Google Pay, PhonePe, Paytm or another UPI app.</p></>:<div className="form-error">The therapist has not added a UPI ID yet. Ask the therapist to set one in their dashboard.</div>}<label>Booking email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>UPI transaction / UTR number<input value={utr} onChange={e=>setUtr(e.target.value)} placeholder="Enter the UTR after paying"/></label>{error&&<div className="form-error">{error}</div>}{message&&<div className="success-message">✓ {message}</div>}<button className="btn btn-dark full" disabled={!upiId||saving||!!message} onClick={submit}>{saving?'Recording…':'I have paid — submit UTR'}</button><small className="fine">Never share your UPI PIN, OTP or banking password with anyone.</small></div></section></Layout>
}

function Contact(){return <Layout><section className="page-hero centered"><span className="eyebrow">Help & support</span><h1>Need help? <em>We’re here.</em></h1><p>Get help with bookings, payments, cancellations, refunds or your account.</p><a className="btn btn-dark" href="mailto:support@unfazed.in">support@unfazed.in <Icon name="arrow" size={16}/></a></section><section className="support-grid"><article><span>01</span><h2>Booking help</h2><p>If a booking does not appear, use the exact email entered during booking and open My bookings.</p></article><article><span>02</span><h2>Payment help</h2><p>UPI payments are verified manually. Keep your UTR and payment receipt until the therapist confirms it.</p></article><article><span>03</span><h2>Cancellation & refunds</h2><p>If a therapist cancels a paid session, the refund is processed back to the client through the payment method used. For direct UPI payments, the therapist must send the refund from their UPI/bank app and record the refund reference.</p></article><article><span>04</span><h2>General support</h2><p>Email support@unfazed.in with your booking email, session date and a short description of the issue. Never share your UPI PIN, OTP or password.</p></article></section></Layout>}

export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/therapists" element={<Therapists/>}/><Route path="/therapists/:id" element={<TherapistProfile/>}/><Route path="/book/:id" element={<Booking/>}/><Route path="/how-it-works" element={<HowItWorks/>}/><Route path="/about" element={<About/>}/><Route path="/resources" element={<Resources/>}/><Route path="/contact" element={<Contact/>}/><Route path="/login" element={<Auth/>}/><Route path="/register" element={<Auth register/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/profile" element={<Profile/>}/><Route path="/my-bookings" element={<MyBookings/>}/><Route path="/pay/:sessionId" element={<PaymentPage/>}/></Routes>}
