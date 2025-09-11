export default function SectionCard({ section }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h4 className="font-semibold text-lg">{section.title}</h4>
      
      {/* Preserve line breaks and spacing */}
      {section.description && (
        <div className="text-gray-600 mt-1 whitespace-pre-wrap">
          {section.description}
        </div>
      )}
      
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {section.resources?.map((r, idx) => (
          <a
            key={idx}
            href={r.link}
            target="_blank"
            rel="noreferrer"
            className="border rounded p-3 hover:bg-gray-50 flex items-center gap-3"
          >
            {r.img ? (
              <img
                src={r.img}
                alt={r.description || 'resource'}
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded" />
            )}
            <div>
              <div className="font-medium line-clamp-1">{r.description || r.link}</div>
              <div className="text-sm text-gray-500 line-clamp-1">{r.link}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
