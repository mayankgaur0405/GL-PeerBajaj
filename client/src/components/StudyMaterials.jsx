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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Resources by GL PeerBajaj</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {studyPlan.map((y) => (
          <div key={y.year} className="space-y-3">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 shadow hover:shadow-lg transition hover:translate-y-[-2px]">
              <div className="text-white font-semibold mb-2">Year {y.year}</div>
              <div className="grid grid-cols-2 gap-2">
                {y.semesters.map((s) => (
                  <div key={s.sem} className="bg-white/20 rounded-xl p-3 text-white">
                    <div className="font-medium">Semester {s.sem}</div>
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

      {/* Removed Placements Preparation */}

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
                <div key={sub.name} className="rounded-xl border border-white/20 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-white/90">{sub.name}</div>
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
