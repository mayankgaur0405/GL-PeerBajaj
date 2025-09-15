import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Sitemap() {
  const { theme, toggleTheme } = useTheme()

  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Links</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h2 className="font-semibold mb-3">Core</h2>
          <ul className="space-y-2 text-white/80">
            <li><Link className="hover:text-white" to="/">Home</Link></li>
            <li><Link className="hover:text-white" to="/notifications">Notifications</Link></li>
            <li><Link className="hover:text-white" to="/guide">Guide</Link></li>
          </ul>
        </div>

        {/* Explore */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h2 className="font-semibold mb-3">Explore</h2>
          <ul className="space-y-2 text-white/80">
            <li><Link className="hover:text-white" to="/feed">Your Feed</Link></li>
            <li><Link className="hover:text-white" to="/trending">Trending</Link></li>
            <li><Link className="hover:text-white" to="/team">Our Team</Link></li>
            <li><HashLink smooth className="hover:text-white" to="/#StudyMaterials">Study Materials</HashLink></li>
            <li><HashLink smooth className="hover:text-white" to="/#PlacementPrepSection">Placement Prep</HashLink></li>
          </ul>
        </div>

        {/* Create */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h2 className="font-semibold mb-3">Create</h2>
          <ul className="space-y-2 text-white/80">
            <li><Link className="hover:text-white" to="/chat">Messages</Link></li>
          </ul>
        </div>

        {/* Platform Features */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h2 className="font-semibold mb-3">Platform Features</h2>
          <ul className="space-y-2 text-white/80">
            <li><Link className="hover:text-white" to="/editor/demo">Realtime Code Editor</Link></li>
            <li><HashLink smooth className="hover:text-white" to="/guide#mock-interview">AI Mock Interview</HashLink></li>
            <li><HashLink smooth className="hover:text-white" to="/guide#resume">Resume Builder</HashLink></li>
            <li><HashLink smooth className="hover:text-white" to="/guide#tasks">Task Scheduler</HashLink></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h2 className="font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-white/80">
            <li><HashLink smooth className="hover:text-white" to="/#about">About</HashLink></li>
            <li><HashLink smooth className="hover:text-white" to="/#benefits">Benefits</HashLink></li>
            <li><HashLink smooth className="hover:text-white" to="/#careers">Career Paths</HashLink></li>
            <li><HashLink smooth className="hover:text-white" to="/#internships">Internships</HashLink></li>
            <li><HashLink smooth className="hover:text-white" to="/#features">Features</HashLink></li>
            <li><HashLink smooth className="hover:text-white" to="/#feedback">Reviews</HashLink></li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h2 className="font-semibold mb-3">Social Links</h2>
          <ul className="space-y-2 text-white/80">
            <li><a className="hover:text-white" href="https://www.instagram.com/gl.peerbajaj/" target="_blank" rel="noreferrer">📸 Instagram</a></li>
            <li><a className="hover:text-white" href="https://www.linkedin.com/company/glpeerbajaj" target="_blank" rel="noreferrer">💼 LinkedIn</a></li>
          </ul>
        </div>

        {/* Legal & Contact */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h2 className="font-semibold mb-3">Legal & Contact</h2>
          <ul className="space-y-2 text-white/80">
            <li><Link className="hover:text-white" to="/privacy">Privacy</Link></li>
            <li><Link className="hover:text-white" to="/terms">Terms</Link></li>
            <li><Link className="hover:text-white" to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Preferences */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 md:col-span-3">
          <h2 className="font-semibold mb-3">Preferences</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-base"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              Theme: {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
