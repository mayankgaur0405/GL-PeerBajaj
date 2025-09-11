import { Link } from 'react-router-dom'

export default function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      {/* Top Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-gray-600">@{user.username}</p>
        </div>
        <span className="text-sm text-gray-500">{user.year || '-'} year</span>
      </div>

      {/* Bio */}
      {user.bio && <p className="mt-2 text-gray-700 line-clamp-3">{user.bio}</p>}

      {/* Department / Specialization */}
      <div className="mt-3 text-sm text-gray-500">
        {user.department} • {user.specialization}
      </div>

      {/* Sections */}
      {user.sections?.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="font-medium text-gray-800">Sections</h4>
          {user.sections.map((section) => (
            <div key={section._id} className="border rounded p-2">
              <div className="font-semibold">{section.title}</div>
              {section.description && (
                <p className="text-sm text-gray-600">{section.description}</p>
              )}

              {/* Resources */}
              {section.resources?.length ? (
                <ul className="list-disc ml-5 mt-1 text-sm">
                  {section.resources.map((r, idx) => (
                    <li key={idx}>
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600"
                      >
                        {r.description || r.link}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">No resources yet</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* View Profile Button */}
      <Link
        to={`/profile/${user._id}`}
        className="mt-4 px-3 py-2 rounded bg-blue-600 text-white text-center"
      >
        View Profile
      </Link>
    </div>
  )
}
