import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Award, Building2, CheckCircle2, ChevronDown, Clock3,
  Factory, GraduationCap, HardHat, Hotel, Mail, MapPin, Menu, Phone, Quote,
  ShieldCheck, Store, Target, Users, Warehouse, X,
} from 'lucide-react';
import logo from './assets/cardrian-logo.png';

const services = [
  { icon: Building2, title: 'General Construction', text: 'End-to-end construction delivery for commercial, institutional, and mixed-use developments.' },
  { icon: HardHat, title: 'Interior Fit-Out', text: 'Precise, functional, and polished interior spaces delivered with close attention to schedule and detail.' },
  { icon: Clock3, title: 'Fast-Track Projects', text: 'Agile site teams and disciplined project controls for time-sensitive construction requirements.' },
  { icon: ShieldCheck, title: 'Renovation & Upgrading', text: 'Strategic modernization of existing facilities with minimal disruption to ongoing operations.' },
  { icon: Target, title: 'Project Management', text: 'Structured coordination, cost monitoring, quality control, and stakeholder communication from start to finish.' },
  { icon: Users, title: 'Collaborative Delivery', text: 'Strong coordination among clients, designers, architects, consultants, subcontractors, and field personnel.' },
];

const industries = [
  {
    slug: 'commercial-buildings', icon: Building2, eyebrow: 'Commercial Construction', title: 'Commercial Buildings',
    short: 'High-performing business environments built for long-term value.',
    description: 'From offices and mixed-use developments to business centers, we coordinate every construction discipline to deliver efficient, durable, and visually refined commercial spaces.',
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=88',
    gallery: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
    ],
    capabilities: ['New commercial construction', 'Office buildings and business centers', 'Common areas and building amenities', 'MEPF coordination', 'Site development and external works', 'Turnover and close-out management'],
    examples: ['Corporate Headquarters Development', 'Regional Business Center', 'Multi-Tenant Office Building'],
  },
  {
    slug: 'corporate-interiors', icon: Store, eyebrow: 'Interior Fit-Out', title: 'Corporate Interiors',
    short: 'Workplaces shaped around productivity, culture, and brand identity.',
    description: 'Our interior teams transform plans into polished workplaces through detailed coordination, disciplined scheduling, and careful management of finishes, systems, and specialist trades.',
    hero: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=88',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
    ],
    capabilities: ['Corporate office fit-out', 'Executive suites and boardrooms', 'Reception and collaboration areas', 'Custom millwork and finishes', 'Lighting and MEPF integration', 'Phased and occupied-site delivery'],
    examples: ['Executive Office Fit-Out', 'Technology Workplace Hub', 'Financial Services Office'],
  },
  {
    slug: 'retail-hospitality', icon: Hotel, eyebrow: 'Customer-Facing Spaces', title: 'Retail & Hospitality',
    short: 'Memorable spaces designed to welcome, perform, and endure.',
    description: 'We build customer-facing environments where finish quality, operational flow, and opening schedules matter. Our teams coordinate closely with owners, designers, suppliers, and operators.',
    hero: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=2000&q=88',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85',
    ],
    capabilities: ['Retail stores and showrooms', 'Hotels and serviced spaces', 'Restaurants and food outlets', 'Guest rooms and public areas', 'Specialty finishes and fixtures', 'Fast-track opening programs'],
    examples: ['Premium Retail Flagship', 'Boutique Hotel Renovation', 'Restaurant Rollout Program'],
  },
  {
    slug: 'industrial-warehousing', icon: Warehouse, eyebrow: 'Industrial Construction', title: 'Industrial & Warehousing',
    short: 'Practical, efficient facilities built around operational needs.',
    description: 'We deliver functional industrial facilities with careful attention to structural requirements, logistics, safety, equipment interfaces, and future operational flexibility.',
    hero: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=88',
    gallery: [
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=85',
    ],
    capabilities: ['Warehouses and distribution centers', 'Production and support facilities', 'Loading bays and logistics areas', 'Heavy-duty flooring', 'Utility and equipment coordination', 'Office and staff support spaces'],
    examples: ['Regional Distribution Warehouse', 'Light Manufacturing Facility', 'Operations Support Center'],
  },
  {
    slug: 'institutional', icon: GraduationCap, eyebrow: 'Institutional Projects', title: 'Institutional Facilities',
    short: 'Purpose-built environments for education, health, and public service.',
    description: 'Institutional projects demand durability, safety, accessibility, and detailed stakeholder coordination. We bring organized project controls to spaces that support people and communities.',
    hero: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=88',
    gallery: [
      'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85',
    ],
    capabilities: ['Schools and training facilities', 'Clinics and healthcare spaces', 'Government and civic offices', 'Assembly and multi-purpose halls', 'Accessibility upgrades', 'Renovation within active facilities'],
    examples: ['Learning Center Development', 'Community Health Facility', 'Public Service Office Upgrade'],
  },
  {
    slug: 'renovation-upgrading', icon: Factory, eyebrow: 'Adaptive Construction', title: 'Renovation & Upgrading',
    short: 'Existing spaces renewed with minimal disruption and maximum value.',
    description: 'Our renovation teams investigate existing conditions, plan phased work, protect ongoing operations, and coordinate upgrades that extend the life and improve the performance of facilities.',
    hero: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=88',
    gallery: [
      'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=1200&q=85',
    ],
    capabilities: ['Building refurbishment', 'Interior modernization', 'Facade and exterior upgrades', 'MEPF replacement and enhancement', 'Phased construction planning', 'Occupied-building coordination'],
    examples: ['Commercial Building Repositioning', 'Office Modernization Program', 'Operational Facility Upgrade'],
  },
];

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 30);
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll(); window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const close = () => setMenuOpen(false);
  return <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
    <Link className="brand" to="/" aria-label="Cardrian Builders home" onClick={close}>
      <img src={logo} alt="Cardrian Builders Corporation logo" /><span><strong>Cardrian Builders</strong><small>Corporation</small></span>
    </Link>
    <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation">{menuOpen ? <X size={25}/> : <Menu size={25}/>}</button>
    <nav className={menuOpen ? 'open' : ''}>
      <Link to="/#about" onClick={close}>About</Link><Link to="/#services" onClick={close}>Services</Link>
      <NavLink to="/industries" onClick={close}>Projects</NavLink><Link to="/#mission" onClick={close}>Mission</Link><Link to="/#contact" onClick={close}>Contact</Link>
      <Link className="nav-cta" to="/#contact" onClick={close}>Start a Project</Link>
    </nav>
  </header>;
}

function RevealObserver() {
  const { pathname } = useLocation();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .12 });
    const timer = setTimeout(() => document.querySelectorAll('.reveal').forEach(el => observer.observe(el)), 10);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [pathname]);
  return null;
}

function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return <footer><div className="container footer-grid">
    <div className="footer-brand"><img src={logo} alt="Cardrian Builders Corporation"/><div><strong>Cardrian Builders Corporation</strong><span>Construction excellence since 1998.</span></div></div>
    <div className="footer-links"><Link to="/#about">About</Link><Link to="/#services">Services</Link><Link to="/industries">Projects</Link><Link to="/#contact">Contact</Link></div>
    <p>© {year} Cardrian Builders Corporation. All rights reserved.</p>
  </div></footer>;
}

function Layout({ children }) { return <div className="site-shell"><ScrollManager/><RevealObserver/><Header/><main>{children}</main><Footer/></div>; }

function HomePage() {
  const [formStatus, setFormStatus] = useState('');
  const handleSubmit = e => { e.preventDefault(); setFormStatus('Thank you. Your inquiry has been prepared for submission.'); e.currentTarget.reset(); };
  return <Layout>
    <section className="hero" id="home"><div className="hero-overlay"/><div className="hero-grid container">
      <div className="hero-copy reveal is-visible"><span className="eyebrow"><span/> Building with integrity since 1998</span><h1>Construction excellence, built to perform.</h1>
        <p>Cardrian Builders Corporation delivers high-quality construction and renovation projects through skilled people, disciplined project management, and strong client collaboration.</p>
        <div className="hero-actions"><Link className="btn btn-primary" to="/industries">Explore Our Projects <ArrowRight size={18}/></Link><a className="btn btn-ghost" href="#about">Discover Our Story</a></div>
        <div className="hero-trust"><div><strong>25+</strong><span>Years of experience</span></div><div><strong>100+</strong><span>Projects delivered early on</span></div><div><strong>1998</strong><span>Year established</span></div></div>
      </div>
      <div className="hero-card reveal is-visible"><div className="hero-card-top"><Award size={28}/><span>Built on proven principles</span></div><ul><li><CheckCircle2/> Experienced professionals</li><li><CheckCircle2/> Effective cost control</li><li><CheckCircle2/> Reliable project delivery</li><li><CheckCircle2/> Client-focused collaboration</li></ul><a href="#contact">Discuss your next project <ArrowRight size={17}/></a></div>
    </div><a className="scroll-cue" href="#about" aria-label="Scroll to about section"><ChevronDown/></a></section>

    <section className="about-section section" id="about"><div className="container about-grid"><div className="about-visual reveal"><img src="https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1400&q=85" alt="Construction team reviewing a project"/><div className="experience-badge"><strong>25+</strong><span>Years of building excellence</span></div><div className="blueprint-lines"/></div><div className="section-copy reveal"><span className="section-kicker">Our Team</span><h2>Experienced people. Disciplined execution. Lasting value.</h2><p>Since its establishment in 1998, Cardrian Builders Corporation has focused on the principles that drive successful construction: skilled professionals, effective project management, disciplined cost control, dependable subcontractor relationships, and close communication among the client, designer, architect, and project management consultants.</p><p>Our project managers, engineers, administrative staff, field personnel, and workers combine practical experience with dedication and genuine concern for every client.</p><div className="value-list"><span><CheckCircle2/> Competitive project cost</span><span><CheckCircle2/> On-schedule completion</span><span><CheckCircle2/> Quality craftsmanship</span><span><CheckCircle2/> Fast-track capability</span></div></div></div></section>

    <section className="services-section section" id="services"><div className="container"><div className="section-heading centered reveal"><span className="section-kicker">What We Do</span><h2>Integrated construction solutions</h2><p>From interior fit-outs to complex commercial projects, we bring control, craftsmanship, and coordination to every stage.</p></div><div className="service-grid">{services.map(({icon:Icon,title,text},i)=><article className="service-card reveal" key={title} style={{'--delay':`${i*70}ms`}}><div className="service-number">0{i+1}</div><div className="service-icon"><Icon size={27}/></div><h3>{title}</h3><p>{text}</p><span className="card-line"/></article>)}</div></div></section>

    <section className="statement-section"><div className="statement-overlay"/><div className="container reveal"><Quote size={44}/><h2>We do more than construct spaces—we build confidence through quality, accountability, and partnership.</h2></div></section>

    <section className="projects-section section" id="projects"><div className="container"><div className="section-heading split reveal"><div><span className="section-kicker">Industries We Serve</span><h2>Built for business. Made to last.</h2></div><p>Explore our capabilities by industry. Every page uses replaceable project imagery so your actual portfolio can be added later.</p></div><div className="project-grid">{industries.slice(0,3).map((item,i)=><Link className="project-card reveal" to={`/industries/${item.slug}`} key={item.slug} style={{'--delay':`${i*100}ms`}}><img src={item.hero} alt={item.title}/><div className="project-shade"/><div className="project-content"><span>{item.eyebrow}</span><h3>{item.title}</h3><b aria-label={`View ${item.title}`}><ArrowRight/></b></div></Link>)}</div><div className="projects-footer reveal"><p>Discover all six industry pages and sample project galleries.</p><Link className="btn btn-dark" to="/industries">Explore All Industries <ArrowRight size={18}/></Link></div></div></section>

    <section className="mission-section section" id="mission"><div className="container mission-grid"><div className="mission-card primary reveal"><span className="section-kicker light">Our Mission</span><h2>Professional service without compromise.</h2><p>Cardrian Builders Corporation's mission is to provide services of the highest professional standard by completing projects at competitive cost and on schedule, while nurturing loyal relationships with clients and co-professionals.</p><Target size={64}/></div><div className="mission-card reveal"><span className="section-kicker">Our Vision</span><h2>To advance construction excellence in the Philippines.</h2><p>We aim to grow responsibly, continuously improve our capabilities, and become a trusted builder recognized for quality craftsmanship, dependable people, and superior project value.</p><div className="vision-values"><span>Quality</span><span>Integrity</span><span>Collaboration</span><span>Reliability</span></div></div></div></section>

    <section className="contact-section section" id="contact"><div className="container contact-grid"><div className="contact-copy reveal"><span className="section-kicker light">Build With Us</span><h2>Let us turn your plans into a well-built reality.</h2><p>Tell us about your project requirements, target schedule, and location. Our team will be ready to discuss the next steps.</p><div className="contact-details"><a href="mailto:info@cardrian.com"><Mail/> info@cardrian.com</a><a href="tel:+(02) 8671-4078 | (02) 8671-4008"><Phone/> +(02) 8671-4078 | (02) 8671-4008</a><span><MapPin/> No. 40 Chestnut St. West Fairview, Quezon Ciy, Metro Manila, Philippines</span></div><small>Replace the sample contact details with the company’s official information.</small></div><form className="contact-form reveal" onSubmit={handleSubmit}><div className="field-row"><label>Full Name<input name="name" required placeholder="Your name"/></label><label>Company<input name="company" placeholder="Company name"/></label></div><div className="field-row"><label>Email Address<input type="email" name="email" required placeholder="name@company.com"/></label><label>Contact Number<input name="phone" placeholder="+63"/></label></div><label>Project Type<select name="projectType" defaultValue=""><option value="" disabled>Select a service</option><option>General Construction</option><option>Interior Fit-Out</option><option>Renovation</option><option>Project Management</option></select></label><label>Project Details<textarea name="message" rows="5" required placeholder="Briefly describe your project..."/></label><button className="btn btn-primary" type="submit">Send Project Inquiry <ArrowRight size={18}/></button>{formStatus&&<p className="form-status">{formStatus}</p>}</form></div></section>
  </Layout>;
}

function IndustriesPage() {
  return <Layout><section className="inner-hero industries-hero"><div className="inner-hero-overlay"/><div className="container reveal is-visible"><span className="eyebrow"><span/> Project Portfolio</span><h1>Industries we build for.</h1><p>Explore Cardrian Builders Corporation's capabilities across commercial, corporate, hospitality, industrial, institutional, and renovation projects.</p></div></section>
    <section className="industry-index section"><div className="container"><div className="section-heading split reveal"><div><span className="section-kicker">Explore Our Projects</span><h2>Specialized by industry. Unified by quality.</h2></div><p>Each industry page contains sample descriptions and placeholder imagery that can be replaced with your completed projects.</p></div><div className="industry-card-grid">{industries.map((item,i)=>{const Icon=item.icon;return <Link className="industry-card reveal" to={`/industries/${item.slug}`} key={item.slug} style={{'--delay':`${i*70}ms`}}><div className="industry-image"><img src={item.hero} alt={item.title}/><span className="industry-icon"><Icon size={25}/></span></div><div className="industry-card-body"><span>{item.eyebrow}</span><h2>{item.title}</h2><p>{item.short}</p><b>View Industry <ArrowRight size={17}/></b></div></Link>})}</div></div></section>
    <section className="portfolio-cta"><div className="container reveal"><div><span className="section-kicker light">Have a project in mind?</span><h2>Let us build the next success story together.</h2></div><Link className="btn btn-primary" to="/#contact">Start a Project <ArrowRight size={18}/></Link></div></section>
  </Layout>;
}

function IndustryDetailPage() {
  const { slug } = useParams(); const navigate = useNavigate(); const industry = industries.find(x=>x.slug===slug);
  if (!industry) return <Layout><section className="not-found section"><div className="container"><h1>Industry not found.</h1><button className="btn btn-primary" onClick={()=>navigate('/industries')}>View all industries</button></div></section></Layout>;
  const Icon=industry.icon; const others=industries.filter(x=>x.slug!==slug).slice(0,3);
  return <Layout><section className="industry-detail-hero" style={{backgroundImage:`url(${industry.hero})`}}><div className="inner-hero-overlay"/><div className="container reveal is-visible"><Link className="back-link" to="/industries"><ArrowLeft size={17}/> All Industries</Link><span className="industry-hero-icon"><Icon size={30}/></span><span className="eyebrow"><span/> {industry.eyebrow}</span><h1>{industry.title}</h1><p>{industry.description}</p><Link className="btn btn-primary" to="/#contact">Discuss a Project <ArrowRight size={18}/></Link></div></section>
    <section className="industry-overview section"><div className="container industry-overview-grid"><div className="section-copy reveal"><span className="section-kicker">Our Capability</span><h2>{industry.short}</h2><p>{industry.description}</p><p>Cardrian Builders applies practical field experience, coordinated project controls, quality monitoring, and close client communication from pre-construction through final turnover.</p></div><div className="capability-panel reveal"><h3>Core capabilities</h3>{industry.capabilities.map(x=><span key={x}><CheckCircle2 size={19}/>{x}</span>)}</div></div></section>
    <section className="project-gallery section"><div className="container"><div className="section-heading split reveal"><div><span className="section-kicker">Sample Project Gallery</span><h2>Spaces built with purpose.</h2></div><p>These images are visual placeholders. Replace each image and title with Cardrian Builders' actual project photography.</p></div><div className="detail-gallery">{industry.gallery.map((image,i)=><figure className="reveal" key={image}><img src={image} alt={`${industry.examples[i]} placeholder`}/><figcaption><span>Sample Project 0{i+1}</span><h3>{industry.examples[i]}</h3></figcaption></figure>)}</div></div></section>
    <section className="delivery-section"><div className="container reveal"><span className="section-kicker light">How We Deliver</span><h2>Planning, coordination, execution, and accountability.</h2><div className="delivery-steps"><div><b>01</b><h3>Plan</h3><p>Scope validation, constructability review, program, and cost planning.</p></div><div><b>02</b><h3>Coordinate</h3><p>Close alignment with owners, designers, consultants, and specialist trades.</p></div><div><b>03</b><h3>Build</h3><p>Disciplined site execution with safety, quality, and schedule controls.</p></div><div><b>04</b><h3>Turn Over</h3><p>Testing, documentation, close-out, and responsive completion support.</p></div></div></div></section>
    <section className="related-industries section"><div className="container"><div className="section-heading split reveal"><div><span className="section-kicker">Continue Exploring</span><h2>More industries we serve.</h2></div><Link className="text-link" to="/industries">View all industries <ArrowRight size={17}/></Link></div><div className="related-grid">{others.map(x=><Link className="related-card reveal" to={`/industries/${x.slug}`} key={x.slug}><img src={x.hero} alt={x.title}/><div><span>{x.eyebrow}</span><h3>{x.title}</h3><ArrowRight/></div></Link>)}</div></div></section>
  </Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/industries" element={<IndustriesPage />} />
      <Route
        path="/industries/:slug"
        element={<IndustryDetailPage />}
      />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
