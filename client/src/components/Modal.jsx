export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-100 transition-opacity"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur rounded-2xl shadow-xl transform transition-all animate-[fadeIn_.15s_ease-out]">
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-4">{children}</div>
          {footer && (
            <div className="p-4 border-t border-white/20 flex justify-end">{footer}</div>
          )}
        </div>
      </div>
    </div>
  )
}


