import { useRef } from 'react'
import { usePageProgress } from '../../hooks/useScrollEffects.js'
import './ScrollProgress.css'

function ScrollProgress() {
  const ref = useRef(null)
  usePageProgress(ref)

  return (
    <div ref={ref} className="page-progress" aria-hidden="true">
      <div className="page-progress__bar" />
    </div>
  )
}

export default ScrollProgress