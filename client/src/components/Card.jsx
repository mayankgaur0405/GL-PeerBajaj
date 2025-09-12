import useInView from '../hooks/useInView.js'

export default function Card({ className = '', hover = true, children, onClick }) {
  const { ref, inView } = useInView({ threshold: 0.15 })
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-white/10 border border-white/10 rounded-2xl shadow-sm ${
        hover ? 'transition transform hover:scale-[1.01] hover:shadow-xl' : ''
      } ${inView ? 'animate-[fadeInUp_.25s_ease-out]' : 'opacity-0 translate-y-2'} ${className}`}
    >
      {children}
    </div>
  )
}


