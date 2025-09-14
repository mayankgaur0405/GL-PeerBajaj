import { useState } from 'react'
import Modal from './Modal.jsx'
import ResourceList from './ResourceList.jsx'
import { studyPlan } from '../data/studyMaterials.js' // removed placementsResources

export default function StudyMaterials() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null) // {year, sem, subjects}
  const [favorites, setFavorites] = useState({}) // subjectKey -> boolean

  const openSem = (year, semObj) => {
    setActive({ year, ...semObj })
    setOpen(true)
  }

  const toggleFav = (key) => {
    setFavorites((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div id='StudyMaterials' className="space-y-8">
      {/* Main Heading */}
      <div className="section-header text-center">
        <span className="section-badge">🏫</span>
        <h2 className="text-3xl font-bold text-white">
          Resources By GL PeerBajaj
        </h2>
      </div>

      {/* Subheading */}
      <h3 className="text-xl font-semibold text-white/90 border-b border-white/20 pb-2">
        Academics Preparation
      </h3>

      {/* Academic Study Plan */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {studyPlan.map((y) => (
          <div key={y.year} className="space-y-3">
            <div className="glass-card p-4 text-white hover-glow hover-raise">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-blue-500/30">🎓</span>
                  <div className="font-semibold">Year {y.year}</div>
                </div>
                <div className="text-xs text-white/70">{y.semesters.length} semesters</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {y.semesters.map((s) => (
                  <div key={s.sem} className="bg-white/10 rounded-xl p-3 text-white border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Sem {s.sem}</div>
                      <div className="text-[10px] text-white/70">{s.subjects.length} subjects</div>
                    </div>
                    <button
                      className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg px-3 py-1"
                      onClick={() => openSem(y.year, s)}
                    >
                      View Subjects
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Semester Subjects */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={active ? `Year ${active.year} • Semester ${active.sem}` : ''}
        footer={
          <button
            className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        }
      >
        {active && (
          <div className="space-y-3">
            {active.subjects.map((sub) => {
              const key = `${active.year}-${active.sem}-${sub.name}`
              const fav = favorites[key]
              return (
                <div key={sub.name} className="rounded-xl border border-white/20 p-3 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-white/90 flex items-center gap-2">
                      <span className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-emerald-500/30">📘</span>
                      {sub.name}
                    </div>
                    <button
                      onClick={() => toggleFav(key)}
                      className={`px-2 py-1 rounded text-sm ${
                        fav ? 'text-white' : 'text-white/60'
                      }`}
                      aria-label="favorite"
                    >
                      {fav ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <ResourceList
                    items={[{ title: 'Resources', pdf: sub.pdf, youtube: sub.youtube }]}
                  />
                </div>
              )
            })}
          </div>
        )}
      </Modal>
    </div>
  )
}
