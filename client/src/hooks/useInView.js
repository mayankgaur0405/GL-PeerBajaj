import { useEffect, useRef, useState } from 'react'

export default function useInView(options = { threshold: 0.1 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        obs.unobserve(entry.target)
      }
    }, options)
    obs.observe(el)
    return () => obs.disconnect()
  }, [options.threshold])

  return { ref, inView }
}


