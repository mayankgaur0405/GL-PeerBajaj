import Modal from './Modal.jsx'
import ResourceList from './ResourceList.jsx'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../lib/api.js'
import FeedbackModal from './FeedbackModal.jsx'
import AdvancedFeedbackModal from './AdvancedFeedbackModal.jsx'
import FeedbackCarousel from './FeedbackCarousel.jsx'
import QuickFeedbackModal from './QuickFeedbackModal.jsx'
import TechnicalReportModal from './TechnicalReportModal.jsx'
import QuickFeedbackDetailModal from './QuickFeedbackDetailModal.jsx'
import TechnicalReportDetailModal from './TechnicalReportDetailModal.jsx'

const placementResources = {
  'DSA': {
    icon: '🧮',
    color: 'bg-sky-500/30',
    items: [
      { title: 'Love Babbar', pdf: '#', notes: '#', youtube: '#'},
      { title: 'Striver', pdf: '#', notes: '#', youtube: '#'}
    ]
  },
  'Web Dev': {
    icon: '🌐',
    color: 'bg-emerald-500/30',
    items: [
      { title: 'Full Stack Guide', pdf: '#', notes: '#', youtube: '#'}
    ]
  },
  'Operating Systems': {
    icon: '🖥️',
    color: 'bg-purple-500/30',
    items: [
      { title: 'OS Notes', pdf: '#', notes: '#', youtube: '#'}
    ]
  },
  'DBMS': {
    icon: '🗂️',
    color: 'bg-orange-500/30',
    items: [
      { title: 'DBMS Essentials', pdf: '#', notes: '#', youtube: '#'}
    ]
  },
  'Aptitude': {
    icon: '📝',
    color: 'bg-pink-500/30',
    items: [
      { title: 'Aptitude Set', pdf: '#', notes: '#', youtube: '#'}
    ]
  },
  'Verbal': {
    icon: '💬',
    color: 'bg-teal-500/30',
    items: [
      { title: 'Verbal Prep', pdf: '#', notes: '#', youtube: '#'}
    ]
  },
  'System Design': {
    icon: '🏗️',
    color: 'bg-indigo-500/30',
    items: [
      { title: 'System Design Primer', pdf: '#', notes: '#', youtube: '#'}
    ]
  }
}

export function PlacementPrepSection() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const entries = Object.entries(placementResources)
  return (
    <div id='PlacementPrepSection' className="space-y-4 band">
      <div className="section-header">
        <span className="section-badge">🎯</span>
        <h3 className="text-white font-semibold">Placement Preparation</h3>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 stagger">
        {entries.map(([subj, meta]) => (
          <div key={subj} className="glass-card p-5 text-white hover-glow hover-raise">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`inline-flex w-10 h-10 items-center justify-center rounded-full ${meta.color}`}>{meta.icon}</span>
                <div className="text-lg font-semibold">{subj}</div>
              </div>
              <div className="text-xs text-white/70">{meta.items.length} resources</div>
            </div>
            <button
              className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
              onClick={() => { setActive(subj); setOpen(true); }}
            >
              View Resources
            </button>
          </div>
        ))}
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={active ? `${active} Resources` : ''}
        footer={<button className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white" onClick={() => setOpen(false)}>Close</button>}
      >
        {active && <ResourceList items={placementResources[active].items} />}
      </Modal>
    </div>
  )
}


export function HeroSection() {
  return (
    <section 
      className="min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-20"
      role="banner"
      aria-label="GL PeerBajaj - Student Resource Hub"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 animate-gradient-shift" />
      
      {/* Floating geometric shapes with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-float animate-delay-100 blur-sm"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/10 rounded-lg rotate-45 animate-float animate-delay-300 blur-sm"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-cyan-500/10 rounded-full animate-float animate-delay-500 blur-sm"></div>
        <div className="absolute top-60 right-1/3 w-8 h-8 bg-pink-500/10 rounded-lg animate-float animate-delay-200 blur-sm"></div>
        <div className="absolute bottom-60 right-10 w-24 h-24 bg-indigo-500/10 rounded-full animate-float animate-delay-400 blur-sm"></div>
        <div className="absolute top-1/3 left-1/4 w-14 h-14 bg-emerald-500/10 rounded-lg rotate-12 animate-float animate-delay-600 blur-sm"></div>
        
        {/* Additional floating elements for depth */}
        <div className="absolute top-32 left-1/3 w-6 h-6 bg-yellow-500/10 rounded-full animate-float animate-delay-700"></div>
        <div className="absolute bottom-32 right-1/4 w-10 h-10 bg-red-500/10 rounded-lg rotate-45 animate-float animate-delay-800"></div>
        <div className="absolute top-1/2 left-1/6 w-4 h-4 bg-green-500/10 rounded-full animate-float animate-delay-900"></div>
      </div>

      {/* Parallax layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      
      {/* Subtle particle effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-8">
        {/* Subtle glow effect around content */}
        <div className="absolute inset-0 -m-8 bg-gradient-radial from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl"></div>
        {/* Badge with animation */}
        <div className="animate-fade-in-down animate-delay-100">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 text-white/90 text-sm backdrop-blur-sm">
            <span className="text-lg">✨</span>
            <span className="font-medium">Learn together. Grow faster.</span>
          </div>
        </div>

        {/* Main heading with staggered animation */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white animate-fade-in-up animate-delay-200">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              GL PeerBajaj
            </span>
          </h1>
          
          {/* Founder mention */}
          <div className="animate-fade-in-up animate-delay-300">
            <p className="text-white/60 text-sm md:text-base font-medium">
              Founded by <span className="text-blue-300 font-semibold">Mayank Gaur</span>
            </p>
          </div>
        </div>

        {/* Subtitle with animation */}
        <div className="animate-fade-in-up animate-delay-400">
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Your comprehensive resource hub for B.Tech students — from study materials to career opportunities. 
            <span className="text-blue-300 font-medium"> Innovating education, one student at a time.</span>
          </p>
        </div>

        {/* Action buttons with staggered animation */}
        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up animate-delay-500">
          <a 
            href="/team" 
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
          >
            <span className="flex items-center gap-2">
              👥 Team Page
            </span>
          </a>
          <a 
            href="/guide" 
            className="group px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-lg border border-white/20 hover:border-white/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              📖 Guide Page
            </span>
          </a>
        </div>

        {/* Social links with scroll indicator positioned after LinkedIn */}
        <div className="flex items-center justify-center gap-4 pt-4 animate-fade-in-up animate-delay-600">
          <a 
            href="https://www.instagram.com/gl.peerbajaj/" 
            target="_blank" 
            rel="noreferrer" 
            className="group p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transform hover:scale-110 transition-all duration-300"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">📸</span>
          </a>
          <a 
            href="https://www.linkedin.com/company/glpeerbajaj" 
            target="_blank" 
            rel="noreferrer" 
            className="group p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transform hover:scale-110 transition-all duration-300"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">💼</span>
          </a>
          
          {/* Scroll indicator positioned after LinkedIn */}
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
          
          <a 
            href="mailto:glpeerbajaj@gmail.com" 
            className="group p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transform hover:scale-110 transition-all duration-300"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">✉️</span>
          </a>
          <a 
            href="#features" 
            className="group p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transform hover:scale-110 transition-all duration-300"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">⚙️</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export function AboutSection() {
  return (
    <div id="about" className="glass-card p-6 text-white section-wrap hover-glow hover-raise">
      <div className="section-header">
        <span className="section-badge">ℹ️</span>
        <h3 className="text-xl font-semibold">About GL PeerBajaj</h3>
      </div>
      <div className="space-y-4 text-white/80">
        <p>
          GL PeerBajaj is a community‑driven learning platform that helps students quickly find reliable study materials,
          prepare for placements, and grow with peer support. We organize cluttered content into clear roadmaps so you can
          focus on practice over searching.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="glass-card px-4 py-3 text-center hover-glow hover-raise">
            <div className="text-2xl">📚</div>
            <div className="font-semibold text-white">Curated Content</div>
            <div className="text-xs text-white/70">Notes, PDFs, and playlists</div>
          </div>
          <div className="glass-card px-4 py-3 text-center hover-glow hover-raise">
            <div className="text-2xl">🤝</div>
            <div className="font-semibold text-white">Peer Community</div>
            <div className="text-xs text-white/70">Learn together, faster</div>
          </div>
          <div className="glass-card px-4 py-3 text-center hover-glow hover-raise">
            <div className="text-2xl">🎯</div>
            <div className="font-semibold text-white">Placement Focus</div>
            <div className="text-xs text-white/70">Structured interview prep</div>
          </div>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Smart feed surfaces high‑value materials first</li>
          <li>Clean, modern UI with light/dark themes</li>
          <li>Messaging and notifications to stay on track</li>
          <li>Built with feedback from students and mentors</li>
        </ul>
      </div>
    </div>
  )
}

export function BenefitsSection() {
  return (
    <div id="benefits" className="space-y-3 section-wrap">
      <div className="section-header">
        <span className="section-badge">✅</span>
        <h3 className="text-white font-semibold">Benefits</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4 stagger">
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-blue-500/30">📚</span>
            <div className="text-lg font-semibold">Curated Study Materials</div>
          </div>
          <p className="text-white/80 text-sm">Save hours of searching with handpicked notes, PDFs, and playlists arranged by year, semester, and topic. You always know exactly where to start, and what to study next, with resources that are trusted by students across batches.</p>
        </div>
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-emerald-500/30">🤝</span>
            <div className="text-lg font-semibold">Peer Mentorship</div>
          </div>
          <p className="text-white/80 text-sm">Get practical guidance from seniors and peers who have already walked the path. From roadmaps to interview strategies, you get actionable advice and encouragement whenever you feel stuck.</p>
        </div>
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-purple-500/30">🧭</span>
            <div className="text-lg font-semibold">Career Guidance</div>
          </div>
          <p className="text-white/80 text-sm">Explore roles like Software Developer, Data Scientist, or Cloud Engineer with clarity. Learn required skills, recommended learning tracks, and how to showcase your work to recruiters confidently.</p>
        </div>
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-orange-500/30">📝</span>
            <div className="text-lg font-semibold">Interview Prep</div>
          </div>
          <p className="text-white/80 text-sm">Practice DSA, system design, and core concepts with structured drills and shared notes. Discuss solutions, compare approaches, and build confidence with peer feedback.</p>
        </div>
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-pink-500/30">💬</span>
            <div className="text-lg font-semibold">Empowers Introverted Students</div>
          </div>
          <p className="text-white/80 text-sm">Through anonymous posts and private chats, introverted students can seek help and advice comfortably without fear of judgment and connect with other students easily. It creates a safe environment to ask questions, learn quietly, and participate at your own pace.</p>
        </div>
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-teal-500/30">⚡</span>
            <div className="text-lg font-semibold">Real-time Support</div>
          </div>
          <p className="text-white/80 text-sm">Get quick help with messaging, notifications, and fresh resources pushed to you. Stay on track with reminders, updates, and community momentum that keeps you consistent.</p>
        </div>
      </div>
    </div>
  )
}

export function InternshipSection() {
  return (
    <section id="internships" className="space-y-3 section-wrap">
      <div className="section-header">
        <span className="section-badge">💼</span>
        <h3 className="text-white font-semibold">Featured Internships</h3>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[{
          img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
          title: 'Software Engineering Intern',
          company: 'TechCorp',
          time: 'June 2025 - August 2025',
          location: 'Remote',
          link: '#'
        },{
          img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          title: 'Data Scientist Intern',
          company: 'INTERNSHALA',
          time: 'May 2025 - July 2025',
          location: 'Bangalore',
          link: '#'
        },{
          img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
          title: 'Cloud Computing Intern',
          company: 'INTERNSHALA',
          time: 'July 2025 - September 2025',
          location: 'Hyderabad',
          link: '#'
        }].map((it, idx) => (
          <article key={idx} className="glass-card overflow-hidden hover-glow hover-raise">
            <div className="aspect-[16/9] w-full overflow-hidden">
              <img src={it.img} alt={it.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 text-white space-y-2">
              <h4 className="text-xl font-semibold">{it.title}</h4>
              <div className="text-white/80 font-medium">{it.company}</div>
              <div className="text-sm text-white/70">{it.time}</div>
              <div className="text-sm text-white/70">📍 {it.location}</div>
              <div className="pt-2">
                <a href={it.link} className="inline-block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Register Now</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function PlatformFeaturesSection() {
  return (
    <div id="features" className="space-y-3 section-wrap">
      <div className="section-header">
        <span className="section-badge">⚙️</span>
        <h3 className="text-white font-semibold">Platform Features</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4 stagger">
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-sky-500/30">💬</span>
            <div className="text-lg font-semibold">Real‑time Chat</div>
          </div>
          <p className="text-white/80 text-sm">Discuss doubts instantly with seniors and friends. Private groups and DMs make collaboration smooth during late‑night study sessions.</p>
        </div>
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-amber-500/30">🧠</span>
            <div className="text-lg font-semibold">Smart Feed</div>
          </div>
          <p className="text-white/80 text-sm">See relevant posts and resources based on your year, interests, and active goals so important content never gets lost.</p>
        </div>
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-fuchsia-500/30">📈</span>
            <div className="text-lg font-semibold">Trending Insights</div>
          </div>
          <p className="text-white/80 text-sm">Discover what’s popular right now—top posts, categories, and profiles—so you can jump into high‑value discussions quickly.</p>
        </div>
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-lime-500/30">🔔</span>
            <div className="text-lg font-semibold">Notifications</div>
          </div>
          <p className="text-white/80 text-sm">Stay updated with follows, comments, and mentions. Never miss a reply, opportunity, or shared resource from your network.</p>
        </div>
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-violet-500/30">☁️</span>
            <div className="text-lg font-semibold">Cloud Uploads</div>
          </div>
          <p className="text-white/80 text-sm">Share PDFs, images, and links neatly. Your materials stay organized and accessible across devices.</p>
        </div>
        <div className="glass-card p-6 text-white hover-glow hover-raise">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-rose-500/30">🧩</span>
            <div className="text-lg font-semibold">Modular UI</div>
          </div>
          <p className="text-white/80 text-sm">Clean, distraction‑free design with light/dark themes and reusable blocks so pages feel cohesive and fast.</p>
        </div>
      </div>
    </div>
  )
}

export function ReviewsSection() {
  return (
    <div id="reviews" className="space-y-3 section-wrap">
      <div className="section-header">
        <span className="section-badge">💬</span>
        <h3 className="text-white font-semibold">Reviews</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4 stagger">
        {[{n:'Jessica Andrew',t:'My college journey has been smoother thanks to the guidance I received here.'},{n:'Darlene Robertson',t:'Peer mentorship improved my programming skills. Seniors are very supportive.'},{n:'Dianne Russell',t:'Resources and advice made a big difference to my academic performance.'}].map((u, i) => (
          <div key={i} className="glass-card p-6 text-white hover-glow hover-raise">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i===0?'bg-purple-500':i===1?'bg-blue-500':'bg-green-500'}`}>{u.n.charAt(0)}</div>
              <div className="font-semibold">{u.n}</div>
            </div>
            <div className="flex gap-1 mb-3">{'★★★★★'.split('').map((s, idx)=>(<span key={idx}>⭐</span>))}</div>
            <div className="text-white/80 text-sm">{u.t}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FeedbackSection() {
  const { user } = useAuth();
  const [quickFeedback, setQuickFeedback] = useState([]);
  const [technicalFeedback, setTechnicalFeedback] = useState([]);
  const [quickLoading, setQuickLoading] = useState(true);
  const [technicalLoading, setTechnicalLoading] = useState(true);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [showTechnicalModal, setShowTechnicalModal] = useState(false);
  const [showQuickDetailModal, setShowQuickDetailModal] = useState(false);
  const [showTechnicalDetailModal, setShowTechnicalDetailModal] = useState(false);
  const [selectedQuickFeedback, setSelectedQuickFeedback] = useState(null);
  const [selectedTechnicalFeedback, setSelectedTechnicalFeedback] = useState(null);
  const [quickCurrentIndex, setQuickCurrentIndex] = useState(0);
  const [technicalCurrentIndex, setTechnicalCurrentIndex] = useState(0);

  // Fallback static data
  const staticQuickFeedback = [
    { 
      _id: '1',
      name: 'Aarav Sharma', 
      role: 'CSE, Year 3', 
      text: 'Found exactly what to study for placements. The community is super helpful and responsive.',
      rating: 5,
      createdAt: new Date().toISOString()
    },
    { 
      _id: '2',
      name: 'Isha Verma', 
      role: 'ECE, Year 2', 
      text: 'Neatly organized resources. Dark theme and clean UI are great! Easy to navigate.',
      rating: 5,
      createdAt: new Date().toISOString()
    }
  ];

  const staticTechnicalFeedback = [
    { 
      _id: '1',
      name: 'Rohit Mehra', 
      role: 'AIML, Year 4', 
      issues: 'Login page sometimes takes too long to load on mobile devices.',
      featureRequest: 'Would love to see dark mode toggle and better mobile navigation.',
      nonFunctional: 'Search functionality not working properly on mobile Safari.',
      generalFeedback: 'Great platform overall, very helpful for studies.',
      severity: 'Medium',
      deviceInfo: 'Chrome on Windows 11',
      createdAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchQuickFeedback();
    fetchTechnicalFeedback();
  }, []);

  // Fallback to static data if no backend data after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (quickFeedback.length === 0 && !quickLoading) {
        console.log('No quick feedback from backend, using static data');
        setQuickFeedback(staticQuickFeedback);
      }
      if (technicalFeedback.length === 0 && !technicalLoading) {
        console.log('No technical feedback from backend, using static data');
        setTechnicalFeedback(staticTechnicalFeedback);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [quickFeedback.length, technicalFeedback.length, quickLoading, technicalLoading]);

  // Auto-rotate carousels
  useEffect(() => {
    if (quickFeedback.length > 1) {
      const interval = setInterval(() => {
        setQuickCurrentIndex((prevIndex) => (prevIndex + 1) % quickFeedback.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [quickFeedback.length]);

  useEffect(() => {
    if (technicalFeedback.length > 1) {
      const interval = setInterval(() => {
        setTechnicalCurrentIndex((prevIndex) => (prevIndex + 1) % technicalFeedback.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [technicalFeedback.length]);

  const fetchQuickFeedback = async () => {
    try {
      setQuickLoading(true);
      console.log('Fetching quick feedback...');
      const response = await api.get('/feedback?type=quick&limit=10');
      console.log('Quick feedback response:', response.data);
      console.log('Quick feedback array:', response.data.feedback);
      console.log('Quick feedback length:', response.data.feedback?.length);
      setQuickFeedback(response.data.feedback || []);
    } catch (err) {
      console.error('Failed to fetch quick feedback:', err);
      console.log('Using static quick feedback as fallback');
      setQuickFeedback(staticQuickFeedback);
    } finally {
      setQuickLoading(false);
    }
  };

  const fetchTechnicalFeedback = async () => {
    try {
      setTechnicalLoading(true);
      console.log('Fetching technical feedback...');
      const response = await api.get('/feedback?type=technical&limit=10');
      console.log('Technical feedback response:', response.data);
      console.log('Technical feedback array:', response.data.feedback);
      console.log('Technical feedback length:', response.data.feedback?.length);
      setTechnicalFeedback(response.data.feedback || []);
    } catch (err) {
      console.error('Failed to fetch technical feedback:', err);
      console.log('Using static technical feedback as fallback');
      setTechnicalFeedback(staticTechnicalFeedback);
    } finally {
      setTechnicalLoading(false);
    }
  };

  const handleQuickFeedbackSubmitted = () => {
    console.log('Quick feedback submitted, refreshing data...');
    // Add a small delay to ensure backend has processed the data
    setTimeout(() => {
      fetchQuickFeedback();
    }, 1000);
  };

  const handleTechnicalFeedbackSubmitted = () => {
    console.log('Technical feedback submitted, refreshing data...');
    // Add a small delay to ensure backend has processed the data
    setTimeout(() => {
      fetchTechnicalFeedback();
    }, 1000);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'High': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'Low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  return (
    <section id="feedback" className="space-y-6 section-wrap">
      <div className="section-header">
        <span className="section-badge">🌟</span>
        <h3 className="text-white font-semibold">What students say about GL PeerBajaj</h3>
      </div>
      
      {/* Featured quote */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900 p-6 hover-glow hover-raise">
        <div className="absolute -top-10 -left-6 text-7xl opacity-10">"</div>
        <blockquote className="text-white/90 text-lg md:text-xl leading-relaxed">
          "A focused place to learn with peers. I spend less time searching and more time practicing."
        </blockquote>
        <div className="mt-3 text-white/60 text-sm">— Community Feedback</div>
      </div>

      {/* Two Cards Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick Feedback Card */}
        <div className="glass-card p-6 hover-glow hover-raise">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-blue-400">💬</span>
              Quick Feedback
            </h4>
            <div className="flex gap-2">
              <button
                onClick={fetchQuickFeedback}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={() => setShowQuickModal(true)}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
              >
                Share
              </button>
            </div>
          </div>

          {quickLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </div>
          ) : quickFeedback.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-white/70 text-sm">No quick feedback yet</p>
              <p className="text-white/50 text-xs mt-2">Debug: Array length = {quickFeedback.length}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Debug info */}
              <div className="text-xs text-white/50 mb-2">
                Debug: Showing {quickCurrentIndex + 1} of {quickFeedback.length} feedback items
              </div>
              {/* Current Quick Feedback */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {quickFeedback[quickCurrentIndex]?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{quickFeedback[quickCurrentIndex]?.name}</div>
                    <div className="text-xs text-white/60">{quickFeedback[quickCurrentIndex]?.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`text-sm ${
                        idx < (quickFeedback[quickCurrentIndex]?.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-white/20'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  {truncateText(quickFeedback[quickCurrentIndex]?.text)}
                </p>
                <button
                  onClick={() => {
                    setSelectedQuickFeedback(quickFeedback[quickCurrentIndex]);
                    setShowQuickDetailModal(true);
                  }}
                  className="mt-2 text-blue-400 hover:text-blue-300 text-xs underline"
                >
                  View Full Feedback
                </button>
              </div>

              {/* Navigation dots */}
              {quickFeedback.length > 1 && (
                <div className="flex justify-center gap-1">
                  {quickFeedback.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setQuickCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === quickCurrentIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Technical Feedback Card */}
        <div className="glass-card p-6 hover-glow hover-raise">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-purple-400">🔧</span>
              Technical Reports
            </h4>
            <div className="flex gap-2">
              <button
                onClick={fetchTechnicalFeedback}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={() => setShowTechnicalModal(true)}
                className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm transition-colors"
              >
                Submit
              </button>
            </div>
          </div>

          {technicalLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </div>
          ) : technicalFeedback.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔧</div>
              <p className="text-white/70 text-sm">No technical reports yet</p>
              <p className="text-white/50 text-xs mt-2">Debug: Array length = {technicalFeedback.length}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Debug info */}
              <div className="text-xs text-white/50 mb-2">
                Debug: Showing {technicalCurrentIndex + 1} of {technicalFeedback.length} reports
              </div>
              {/* Current Technical Feedback */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                      {technicalFeedback[technicalCurrentIndex]?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{technicalFeedback[technicalCurrentIndex]?.name}</div>
                      <div className="text-xs text-white/60">{technicalFeedback[technicalCurrentIndex]?.role}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(technicalFeedback[technicalCurrentIndex]?.severity)}`}>
                    {technicalFeedback[technicalCurrentIndex]?.severity}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {technicalFeedback[technicalCurrentIndex]?.issues && (
                    <div className="text-xs">
                      <span className="text-red-400 font-medium">Issues:</span>
                      <span className="text-white/80 ml-1">{truncateText(technicalFeedback[technicalCurrentIndex].issues, 60)}</span>
                    </div>
                  )}
                  {technicalFeedback[technicalCurrentIndex]?.featureRequest && (
                    <div className="text-xs">
                      <span className="text-blue-400 font-medium">Feature:</span>
                      <span className="text-white/80 ml-1">{truncateText(technicalFeedback[technicalCurrentIndex].featureRequest, 60)}</span>
                    </div>
                  )}
                  {technicalFeedback[technicalCurrentIndex]?.generalFeedback && (
                    <div className="text-xs">
                      <span className="text-green-400 font-medium">General:</span>
                      <span className="text-white/80 ml-1">{truncateText(technicalFeedback[technicalCurrentIndex].generalFeedback, 60)}</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setSelectedTechnicalFeedback(technicalFeedback[technicalCurrentIndex]);
                    setShowTechnicalDetailModal(true);
                  }}
                  className="mt-2 text-purple-400 hover:text-purple-300 text-xs underline"
                >
                  View Full Report
                </button>
              </div>

              {/* Navigation dots */}
              {technicalFeedback.length > 1 && (
                <div className="flex justify-center gap-1">
                  {technicalFeedback.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setTechnicalCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === technicalCurrentIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <QuickFeedbackModal
        isOpen={showQuickModal}
        onClose={() => setShowQuickModal(false)}
        onFeedbackSubmitted={handleQuickFeedbackSubmitted}
      />

      <TechnicalReportModal
        isOpen={showTechnicalModal}
        onClose={() => setShowTechnicalModal(false)}
        onReportSubmitted={handleTechnicalFeedbackSubmitted}
      />

      <QuickFeedbackDetailModal
        isOpen={showQuickDetailModal}
        onClose={() => setShowQuickDetailModal(false)}
        feedback={selectedQuickFeedback}
      />

      <TechnicalReportDetailModal
        isOpen={showTechnicalDetailModal}
        onClose={() => setShowTechnicalDetailModal(false)}
        report={selectedTechnicalFeedback}
      />
    </section>
  )
}

export function CareerSection() {
  const careers = [
    {
      title: "Software Developer",
      icon: "💻",
      desc: "Design, code, and test applications. Requires strong problem-solving and coding skills in multiple languages."
    },
    {
      title: "Data Scientist",
      icon: "📊",
      desc: "Analyze data to extract insights. Work with statistics, machine learning, and visualization to solve business problems."
    },
    {
      title: "DevOps Engineer",
      icon: "⚙️",
      desc: "Bridge development and operations. Focus on CI/CD, automation, and infrastructure monitoring for smooth deployments."
    },
    {
      title: "Cybersecurity Analyst",
      icon: "🔐",
      desc: "Protect systems from cyber threats. Monitor vulnerabilities, prevent attacks, and ensure data security."
    },
    {
      title: "ML Engineer",
      icon: "🤖",
      desc: "Build and deploy machine learning models. Requires skills in AI frameworks, optimization, and production-level coding."
    },
    {
      title: "Full Stack Engineer",
      icon: "🌐",
      desc: "Work on both frontend and backend. Master web technologies, databases, and APIs to build complete apps."
    }
  ]

  return (
    <div id="careers" className="space-y-3 section-wrap">
      <div className="section-header">
        <span className="section-badge">🧭</span>
        <h3 className="text-white font-semibold">Career Paths</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4 stagger">
        {careers.map((c, i) => (
          <div key={i} className="glass-card p-6 text-white hover-glow hover-raise">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-blue-500/30">
                {c.icon}
              </span>
              <div className="text-lg font-semibold">{c.title}</div>
            </div>
            <p className="text-white/80 text-sm">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FooterSection() {
  return (
    <footer className="glass-card p-8 text-white section-wrap hover-glow hover-raise">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="text-xl font-semibold">GL PeerBajaj</div>
          <p className="text-white/80 text-sm">A student community for curated learning, peer mentorship, and placement preparation.</p>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/gl.peerbajaj/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm">
              <span>📸</span><span>Instagram</span>
            </a>
            <a href="https://www.linkedin.com/company/glpeerbajaj" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm">
              <span>💼</span><span>LinkedIn</span>
            </a>
          </div>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">Quick Links</div>
          <ul className="space-y-2 text-white/80 text-sm">
            <li><a href="#about" className="hover:text-white">About</a></li>
            <li><a href="#benefits" className="hover:text-white">Benefits</a></li>
            <li><a href="#careers" className="hover:text-white">Career Paths</a></li>
            <li><a href="#internships" className="hover:text-white">Internships</a></li>
            <li><a href="#features" className="hover:text-white">Features</a></li>
            <li><a href="#feedback" className="hover:text-white">Reviews</a></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">Resources</div>
          <ul className="space-y-2 text-white/80 text-sm">
            <li><a href="/trending" className="hover:text-white">Trending</a></li>
            <li><a href="/feed" className="hover:text-white">Your Feed</a></li>
            <li><a href="/team" className="hover:text-white">Our Team</a></li>
            <li><a href="/guide" className="hover:text-white">User Guide</a></li>
            <li><a href="#StudyMaterials" className="hover:text-white">Study Materials</a></li>
            <li><a href="#PlacementPrepSection" className="hover:text-white">Placement Prep</a></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">Contact</div>
          <ul className="space-y-2 text-white/80 text-sm">
            <li className="flex items-center gap-2"><span>✉️</span><a href="mailto:glpeerbajaj@gmail.com" className="hover:text-white">glpeerbajaj@gmail.com</a></li>
            <li className="flex items-center gap-2"><span>☎️</span><a href="tel:+910000000000" className="hover:text-white">+91 0000000000</a></li>
            <li className="flex items-center gap-2"><span>📍</span><span>GL PeerBajaj, India</span></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-white/80">
        <div>© {new Date().getFullYear()} GL PeerBajaj. All rights reserved.</div>
        <nav className="flex flex-wrap gap-4">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Contact</a>
        </nav>
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
      <FeedbackSection />
      <FooterSection />
    </div>
  )
}


