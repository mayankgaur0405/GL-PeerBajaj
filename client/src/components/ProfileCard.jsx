import { Link } from 'react-router-dom'

export default function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-gray-600">@{user.username}</p>
        </div>
        <span className="text-sm text-gray-500">{user.year || '-'} year</span>
      </div>
      <p className="mt-2 text-gray-700 line-clamp-3">{user.bio}</p>
      <div className="mt-3 text-sm text-gray-500">{user.department} • {user.specialization}</div>
      <Link to={`/profile/${user._id}`} className="mt-4 px-3 py-2 rounded bg-blue-600 text-white text-center">View Profile</Link>
    </div>
  )
}


