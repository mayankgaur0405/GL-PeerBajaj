import Modal from './Modal.jsx'
import ResourceList from './ResourceList.jsx'
import { useState } from 'react'

const placementResources = {
  'DSA': [
    { title: 'Love Babbar', pdf: '#', notes: '#', youtube: '#'},
    { title: 'Striver', pdf: '#', notes: '#', youtube: '#'}
  ],
  'Web Dev': [
    { title: 'Full Stack Guide', pdf: '#', notes: '#', youtube: '#'}
  ],
  'Operating Systems': [
    { title: 'OS Notes', pdf: '#', notes: '#', youtube: '#'}
  ],
  'DBMS': [
    { title: 'DBMS Essentials', pdf: '#', notes: '#', youtube: '#'}
  ],
  'Aptitude': [
    { title: 'Aptitude Set', pdf: '#', notes: '#', youtube: '#'}
  ],
  'Verbal': [
    { title: 'Verbal Prep', pdf: '#', notes: '#', youtube: '#'}
  ],
  'System Design': [
    { title: 'System Design Primer', pdf: '#', notes: '#', youtube: '#'}
  ]
}

export function PlacementPrepSection() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  return (
    <div className="space-y-3 band">
      <h3 className="text-white font-semibold">Placements Preparation</h3>
      <div className="grid md:grid-cols-3 gap-4 stagger">
        {Object.keys(placementResources).map((subj) => (
          <div key={subj} className="glass-card p-4 text-white flex items-center justify-between hover-glow hover-raise">
            <div className="font-medium">{subj}</div>
            <button className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm" onClick={() => { setActive(subj); setOpen(true); }}>View Resources</button>
          </div>
        ))}
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={active ? `${active} Resources` : ''}
        footer={<button className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white" onClick={() => setOpen(false)}>Close</button>}
      >
        {active && <ResourceList items={placementResources[active]} />}
      </Modal>
    </div>
  )
}

export function AboutSection() {
  return (
    <div className="glass-card p-6 text-white section-wrap hover-border-bright hover-tilt">
      <div className="section-header">
        <span className="section-badge">ℹ️</span>
        <h3 className="text-xl font-semibold">About GL PeerBajaj</h3>
      </div>
      <p className="text-white/80">A community-driven platform to share study resources, roadmaps, and grow together through collaboration and mentorship.</p>
    </div>
  )
}

export function BenefitsSection() {
  return (
    <div className="space-y-3 section-wrap">
      <div className="section-header">
        <span className="section-badge">✅</span>
        <h3 className="text-white font-semibold">Benefits</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4 stagger">
        {["Curated Study Materials", "Peer Mentorship", "Career Guidance", "Interview Prep", "Active Community", "Real-time Support"].map((b) => (
          <div key={b} className="glass-card p-4 text-white hover-glow hover-raise">{b}</div>
        ))}
      </div>
    </div>
  )
}

export function InternshipSection() {
  return (
    <div className="glass-card p-6 text-white flex items-center justify-between section-wrap hover-border-bright hover-tilt">
      <div>
        <div className="text-lg font-semibold">Featured Internship: Software Engineering</div>
        <div className="text-white/80">Fast-track your career with hands-on experience.</div>
      </div>
      <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">Apply</button>
    </div>
  )
}

export function PlatformFeaturesSection() {
  return (
    <div className="space-y-3 section-wrap">
      <div className="section-header">
        <span className="section-badge">⚙️</span>
        <h3 className="text-white font-semibold">Platform Features</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4 stagger">
        {["Real-time Chat", "Smart Feed", "Trending Insights", "Notifications", "Cloud Uploads", "Modular UI"].map((f) => (
          <div key={f} className="glass-card p-4 text-white hover-glow hover-raise">{f}</div>
        ))}
      </div>
    </div>
  )
}

export function ReviewsSection() {
  return (
    <div className="space-y-3 section-wrap">
      <div className="section-header">
        <span className="section-badge">💬</span>
        <h3 className="text-white font-semibold">Reviews</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4 stagger">
        {[1,2,3].map((i) => (
          <div key={i} className="glass-card p-4 text-white hover-glow hover-raise">
            <div className="font-medium">User {i}</div>
            <div className="text-white/80 text-sm">“Amazing platform for structured learning!”</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CareerSection() {
  return (
    <div className="space-y-3 section-wrap">
      <div className="section-header">
        <span className="section-badge">🧭</span>
        <h3 className="text-white font-semibold">Career Paths</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4 stagger">
        {["Software Developer", "Data Scientist", "DevOps Engineer", "Cybersecurity Analyst", "ML Engineer", "Full Stack Engineer"].map((c) => (
          <div key={c} className="glass-card p-4 text-white hover-glow hover-raise">{c}</div>
        ))}
      </div>
    </div>
  )
}

export function FooterSection() {
  return (
    <footer className="glass-card p-6 text-white section-wrap">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>© {new Date().getFullYear()} GL PeerBajaj</div>
        <div className="flex gap-4 text-white/80 text-sm">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default function Extras() {
  return (
    <div className="space-y-8">
      <AboutSection />
      <BenefitsSection />
      <InternshipSection />
      <PlatformFeaturesSection />
      <ReviewsSection />
      <CareerSection />
      <FooterSection />
    </div>
  )
}


