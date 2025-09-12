import Modal from './Modal.jsx'
import ResourceList from './ResourceList.jsx'
import { useState } from 'react'

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
    <div className="space-y-4 band">
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
    <section className="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs">
          <span>✨</span>
          <span>Learn together. Grow faster.</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
          GL PeerBajaj
        </h1>
        <p className="text-white/80 text-lg">
          Your comprehensive resource hub for B.Tech students — from study materials to career opportunities.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="#internships" className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Explore Internships</a>
          <a href="#careers" className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/10">Explore Careers</a>
        </div>
        <div className="flex items-center justify-center gap-4 pt-2 text-white/70">
          <a href="https://instagram.com/glpeerbajaj" target="_blank" rel="noreferrer" className="hover:text-white">📸</a>
          <a href="https://www.linkedin.com/company/glpeerbajaj" target="_blank" rel="noreferrer" className="hover:text-white">💼</a>
          <a href="mailto:glpeerbajaj@gmail.com" className="hover:text-white">✉️</a>
          <a href="#features" className="hover:text-white">⚙️</a>
        </div>
      </div>
    </section>
  )
}

export function AboutSection() {
  return (
    <div id="about" className="glass-card p-6 text-white section-wrap hover-border-bright hover-tilt">
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
          <div className="glass-card px-4 py-3 text-center">
            <div className="text-2xl">📚</div>
            <div className="font-semibold text-white">Curated Content</div>
            <div className="text-xs text-white/70">Notes, PDFs, and playlists</div>
          </div>
          <div className="glass-card px-4 py-3 text-center">
            <div className="text-2xl">🤝</div>
            <div className="font-semibold text-white">Peer Community</div>
            <div className="text-xs text-white/70">Learn together, faster</div>
          </div>
          <div className="glass-card px-4 py-3 text-center">
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
  const feedback = [
    { name: 'Aarav Sharma', role: 'CSE, Year 3', text: 'Found exactly what to study for placements. The community is super helpful.', rating: 5 },
    { name: 'Isha Verma', role: 'ECE, Year 2', text: 'Neatly organized resources. Dark theme and clean UI are great!', rating: 5 },
    { name: 'Rohit Mehra', role: 'AIML, Year 4', text: 'Discussions and quick feedback kept me consistent. Highly recommended.', rating: 5 },
    { name: 'Sara Khan', role: 'IT, Year 1', text: 'As a beginner it felt easy to start. Learning is less overwhelming now.', rating: 4 }
  ]
  return (
    <section id="feedback" className="space-y-6 section-wrap">
      <div className="section-header">
        <span className="section-badge">🌟</span>
        <h3 className="text-white font-semibold">What students say about GL PeerBajaj</h3>
      </div>
      {/* Featured quote */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900 p-6">
        <div className="absolute -top-10 -left-6 text-7xl opacity-10">“</div>
        <blockquote className="text-white/90 text-lg md:text-xl leading-relaxed">
          “A focused place to learn with peers. I spend less time searching and more time practicing.”
        </blockquote>
        <div className="mt-3 text-white/60 text-sm">— Community Feedback</div>
      </div>
      {/* Testimonials grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {feedback.map((f, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-rose-500/30">
            <div className="h-full w-full rounded-2xl bg-slate-900 p-5 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/10">{f.name.charAt(0)}</div>
                <div>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-white/60">{f.role}</div>
                </div>
              </div>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: f.rating }).map((_, idx) => (<span key={idx}>⭐</span>))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{f.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 text-white/70 text-sm">
        <div>Have feedback for us?</div>
        <a href="#" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/10">Share Feedback</a>
      </div>
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
    <footer className="glass-card p-8 text-white section-wrap">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="text-xl font-semibold">GL PeerBajaj</div>
          <p className="text-white/80 text-sm">A student community for curated learning, peer mentorship, and placement preparation.</p>
          <div className="flex items-center gap-3">
            <a href="https://instagram.com/glpeerbajaj" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm">
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
            <li><a href="#reviews" className="hover:text-white">Reviews</a></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">Resources</div>
          <ul className="space-y-2 text-white/80 text-sm">
            <li><a href="/trending" className="hover:text-white">Trending</a></li>
            <li><a href="/feed" className="hover:text-white">Your Feed</a></li>
            <li><a href="#" className="hover:text-white">Guides</a></li>
            <li><a href="#" className="hover:text-white">Study Materials</a></li>
            <li><a href="#" className="hover:text-white">Placement Prep</a></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">Contact</div>
          <ul className="space-y-2 text-white/80 text-sm">
            <li className="flex items-center gap-2"><span>✉️</span><a href="mailto:glpeerbajaj@gmail.com" className="hover:text-white">glpeerbajaj@gmail.com</a></li>
            <li className="flex items-center gap-2"><span>☎️</span><a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a></li>
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


