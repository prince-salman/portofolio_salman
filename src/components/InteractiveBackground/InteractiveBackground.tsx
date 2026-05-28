import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const GridBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1; /* Send it behind everything */
  pointer-events: none; /* Let clicks pass through */
  background-image: radial-gradient(rgba(0, 51, 204, 0.12) 2px, transparent 2px);
  background-size: 35px 35px;
  background-position: 0px 0px;
  will-change: background-position;
`

export default function InteractiveBackground() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationFrameId: number
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse offset from center of screen, scaled down
      const xOffset = (e.clientX - window.innerWidth / 2) * -0.05
      const yOffset = (e.clientY - window.innerHeight / 2) * -0.05
      targetX = xOffset
      targetY = yOffset
    }

    const animate = () => {
      // LERP for smooth movement
      currentX += (targetX - currentX) * 0.1
      currentY += (targetY - currentY) * 0.1

      if (bgRef.current) {
        bgRef.current.style.backgroundPosition = `${currentX}px ${currentY}px`
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <GridBackground ref={bgRef} />
}
