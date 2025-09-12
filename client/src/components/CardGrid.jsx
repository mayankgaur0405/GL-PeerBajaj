export default function CardGrid({ title, subtitle, items = [], renderItem, cols = 'md:grid-cols-2' }) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-white font-semibold">{title}</h3>
          {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
        </div>
        <div className="text-xs text-white/40">{items.length} items</div>
      </div>
      <div className={`grid ${cols} gap-3`}>
        {items.map((it, idx) => (
          <div key={idx} className="animate-[fadeInUp_.2s_ease-out]" style={{animationDelay: `${idx*40}ms`, animationFillMode:'backwards'}}>
            {renderItem(it, idx)}
          </div>
        ))}
      </div>
    </div>
  )}


