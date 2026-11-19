"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AirVent, ArrowRight, ArrowUpRight, BadgeCheck, CalendarClock, CheckCircle2, ClipboardCheck, CreditCard, Laptop, Refrigerator, Search, ShieldCheck, Smartphone, Tv, WashingMachine, Zap } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { SectionHeading } from "@/components/section-heading";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/types";

const categories = [
  { name: "Smartphone", hint: "Screens, batteries", icon: Smartphone },
  { name: "Laptop & PC", hint: "Performance, hardware", icon: Laptop },
  { name: "AC", hint: "Cooling, servicing", icon: AirVent },
  { name: "Refrigerator", hint: "Cooling, leaks", icon: Refrigerator },
  { name: "TV", hint: "Display, setup", icon: Tv },
  { name: "Washing Machine", hint: "Drain, install", icon: WashingMachine },
  { name: "Electrical", hint: "Safe home wiring", icon: Zap }
];
const steps = [
  { number: "01", title: "Find the right service", text: "Compare approved repair options, service modes and starting prices.", icon: Search },
  { number: "02", title: "Send your request", text: "Tell the technician what is wrong and choose a preferred date.", icon: ClipboardCheck },
  { number: "03", title: "Follow the repair", text: "See when your request is accepted, work starts and the job is complete.", icon: CalendarClock },
  { number: "04", title: "Pay after completion", text: "Review the final amount and complete payment through secure Checkout.", icon: CreditCard }
];

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    let alive = true;
    apiFetch<{ data: Service[] }>("/api/services?limit=6&sort=newest")
      .then((result) => { if (alive) setServices(result.data || []); })
      .catch(() => { if (alive) setServices([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = search.trim();
    window.location.href = query ? `/services?search=${encodeURIComponent(query)}` : "/services";
  };
  return <>
    <section className="hero-section"><div className="shell">
      <div className="hero-grid">
        <div className="hero-copy"><span className="hero-kicker"><span/> A clearer way to get things fixed</span>
          <h1>Repairs, without the <em>blind spots.</em></h1>
          <p>Find dependable technicians, know what happens next, and keep payment until the repair is complete. Every step stays visible.</p>
          <form className="search-row hero-search-row" onSubmit={submitSearch}><div className="search-field"><Search size={17}/><input className="search-control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="What needs fixing today?" aria-label="Search repair services"/></div><button className="button button-primary" type="submit">Find a repair <ArrowUpRight size={16}/></button></form>
          <div className="hero-trust-row"><span><ShieldCheck size={15}/> Approved service listings</span><span><CheckCircle2 size={15}/> Trackable job status</span><span><CreditCard size={15}/> Pay after repair</span></div>
        </div>
        <div className="hero-art" aria-label="FixMate repair diagnostic illustration"><div className="hero-art-panel"><div className="hero-art-grid"/><div className="hero-art-glow"/><div className="circuit-line circuit-one"/><div className="circuit-line circuit-two"/><div className="device-stage"><div className="device-shadow"/><div className="phone-device"><div className="phone-notch"/><div className="phone-screen"><small>FIXMATE DIAGNOSTIC</small><strong>Device health</strong><div className="phone-diagnostic"><ShieldCheck size={39}/></div><div className="phone-reading"><span>Display scan</span><strong>PASS</strong></div><div className="phone-reading"><span>Power check</span><strong>STABLE</strong></div><div className="scan-line"/></div></div></div>
          <div className="float-card float-card-top"><span className="float-card-icon"><BadgeCheck size={17}/></span><div><small>TECHNICIAN STATUS</small><strong>Profile approved</strong></div></div>
          <div className="float-card float-card-bottom"><span className="float-card-check"><CheckCircle2 size={22}/></span><div><small>JOB VISIBILITY</small><strong>Every step, in view</strong></div></div><span className="art-caption">DEVICE CARE // STATUS 04: VERIFIED</span></div></div>
      </div>
      <div className="hero-stat-strip"><div className="hero-stat"><strong>01 → 05</strong><span>One clear repair journey</span></div><div className="hero-stat"><strong>3 roles</strong><span>Customer, technician, admin</span></div><div className="hero-stat"><strong>After</strong><span>Payment only on completion</span></div></div>
    </div></section>

    <section className="content-section"><div className="shell"><SectionHeading eyebrow="Recently approved" title="Repair options, ready when you are." description="Explore the latest services approved by FixMate. Compare the scope, estimated duration and starting price before you request a repair." action={<Link className="button button-quiet button-small" href="/services">View all services <ArrowRight size={15}/></Link>}/>
      {loading ? <div className="skeleton-grid">{Array.from({length:6}).map((_,index)=><div key={index} className="skeleton-card"/>)}</div> : services.length ? <div className="services-grid">{services.map((service)=><ServiceCard key={service._id} service={service}/>)}</div> : <div className="empty-state"><span className="empty-icon"><WashingMachine size={23}/></span><h3>New repair services are on the way</h3><p>Our technicians are preparing their service listings. Browse again soon.</p><Link href="/services" className="button button-primary button-small">Explore directory</Link></div>}
    </div></section>

    <section className="content-section content-section-soft"><div className="shell"><SectionHeading eyebrow="Find your category" title="Start with what stopped working." description="Choose the device or appliance. We’ll help you find the repair service that fits the problem." align="left"/><div className="category-grid">{categories.map(({name,hint,icon:Icon})=><Link href={`/services?category=${encodeURIComponent(name)}`} className="category-tile" key={name}><span className="category-icon"><Icon size={20}/></span><strong>{name}</strong><small>{hint}</small></Link>)}</div></div></section>

    <section className="content-section"><div className="shell"><SectionHeading eyebrow="The FixMate flow" title="A repair journey with no guessing." description="From the first request to the final payment, everyone knows what happens next." align="center"/><div className="process-grid">{steps.map(({number,title,text,icon:Icon})=><article className="process-card" key={number}><span className="process-number">STEP / {number}</span><span className="process-icon"><Icon size={20}/></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="content-section content-section-soft"><div className="shell"><div className="trust-panel"><div className="trust-copy"><span className="eyebrow">Why FixMate</span><h2>Trust is built into the workflow.</h2><p>FixMate puts the important details in the open: approved listings, clear job states, ownership checks and payment after completion. No black box after the request is sent.</p><Link href="/about" className="button button-primary button-small" style={{marginTop:22}}>See how it works <ArrowUpRight size={15}/></Link></div><div className="trust-points"><article className="trust-point"><ShieldCheck size={22}/><h3>Reviewed services</h3><p>Technician listings wait for admin approval before appearing in the directory.</p></article><article className="trust-point"><ActivityIcon/><h3>Visible progress</h3><p>Requests move through clear stages, with the next action tied to the right role.</p></article><article className="trust-point"><CreditCard size={22}/><h3>Pay after service</h3><p>The customer pays only after a completed repair and a final amount is set.</p></article><article className="trust-point"><LockIcon/><h3>Account boundaries</h3><p>Customers and technicians see only the bookings and records they own.</p></article></div></div></div></section>
  </>;
}
function ActivityIcon(){return <span className="trust-inline-icon">↗</span>}
function LockIcon(){return <span className="trust-inline-icon">⌁</span>}
