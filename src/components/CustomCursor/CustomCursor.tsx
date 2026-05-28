import { useEffect, useState } from 'react'
import styled from 'styled-components'

const CursorDot = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  background: #000;
  transform: translate(-50%, -50%) translate3d(${props => props.$x}px, ${props => props.$y}px, 0);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;

  @media (max-width: 768px) {
    display: none;
  }
`

const CursorOutline = styled.div<{ $x: number; $y: number; $isHovering: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => props.$isHovering ? '60px' : '30px'};
  height: ${props => props.$isHovering ? '60px' : '30px'};
  border: 3px solid var(--blue);
  background: ${props => props.$isHovering ? 'rgba(255, 229, 0, 0.4)' : 'transparent'};
  box-shadow: ${props => props.$isHovering ? 'none' : '4px 4px 0 var(--yellow)'};
  transform: translate(-50%, -50%) translate3d(${props => props.$x}px, ${props => props.$y}px, 0);
  pointer-events: none;
  z-index: 9998;
  transition: width 0.2s ease, height 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  will-change: transform;

  @media (max-width: 768px) {
    display: none;
  }
`

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [trailingPosition, setTrailingPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none'

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if hovering over interactive elements
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovering(true)
        document.body.style.cursor = 'none' // Keep it hidden
      } else {
        setIsHovering(false)
        document.body.style.cursor = 'none'
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.body.style.cursor = 'auto'
    }
  }, [])

  // Smooth trailing animation loop
  useEffect(() => {
    let animationFrameId: number

    const renderLoop = () => {
      setTrailingPosition((prev) => {
        // LERP (Linear Interpolation) for smooth trailing
        const dx = mousePosition.x - prev.x
        const dy = mousePosition.y - prev.y
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        }
      })
      animationFrameId = requestAnimationFrame(renderLoop)
    }

    animationFrameId = requestAnimationFrame(renderLoop)

    return () => cancelAnimationFrame(animationFrameId)
  }, [mousePosition])

  return (
    <>
      <CursorDot $x={mousePosition.x} $y={mousePosition.y} />
      <CursorOutline $x={trailingPosition.x} $y={trailingPosition.y} $isHovering={isHovering} />
    </>
  )
}
