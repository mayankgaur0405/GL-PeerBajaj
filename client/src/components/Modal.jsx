export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-100 transition-opacity"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all animate-[fadeIn_.15s_ease-out] bg-white text-slate-900 dark:bg-slate-900/90 dark:text-slate-100 backdrop-blur">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white">✕</button>
          </div>
          <div className="p-5 leading-relaxed">
            {children}
          </div>
          {footer && (
            <div className="p-4 border-t border-slate-200 dark:border-white/10 flex justify-end bg-slate-50/60 dark:bg-white/5 rounded-b-2xl">{footer}</div>
          )}
        </div>
      </div>
    </div>
  )
}


