import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

const PhotoContainer = styled.div`
  perspective: 1000px;
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;

  @media (max-width: 1024px) {
    height: 420px;
    order: -1;
  }
`

const PhotoCard = styled.div<{ $rotateX: number; $rotateY: number; $isHovered: boolean }>`
  width: 320px;
  height: 420px;
  background: var(--white);
  border: 4px solid var(--blue);
  box-shadow: ${({ $isHovered }) => 
    $isHovered 
      ? '20px 20px 0 var(--yellow)' 
      : '10px 10px 0 var(--blue)'};
  padding: 16px;
  padding-bottom: 60px; /* Polaroid style */
  position: relative;
  transition: box-shadow 0.3s ease-out, transform 0.1s ease-out;
  transform-style: preserve-3d;
  
  transform: ${({ $rotateX, $rotateY, $isHovered }) => 
    $isHovered 
      ? `rotateX(${$rotateX}deg) rotateY(${$rotateY}deg) scale3d(1.05, 1.05, 1.05)`
      : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'};

  @media (max-width: 1024px) {
    width: 260px;
    height: 340px;
    padding-bottom: 50px;
  }
`

const PhotoImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid var(--blue);
  background: var(--yellow);
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(0, 51, 204, 0.1) 2px, transparent 2px),
                      linear-gradient(90deg, rgba(0, 51, 204, 0.1) 2px, transparent 2px);
    background-size: 20px 20px;
    pointer-events: none;
  }
`

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  filter: grayscale(100%) contrast(1.2); /* Brutalist aesthetic */

  ${PhotoCard}:hover & {
    transform: scale(1.05);
    filter: grayscale(0%) contrast(1.1); /* Reveal color on hover */
  }
`

const PlaceholderIcon = styled.div`
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 900;
  color: var(--blue);
  opacity: 0.5;
  transform: rotate(-10deg);
`

const PhotoCaption = styled.div`
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--blue);
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

const Tape = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%) rotate(-3deg);
  width: 120px;
  height: 35px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 51, 204, 0.2);
  box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  backdrop-filter: blur(4px);
  z-index: 10;
`

export default function HeroPhoto({ avatarUrl, name }: { avatarUrl?: string, name: string }) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    
    // Calculate mouse position relative to the center of the card
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    // Calculate rotation angles (max 15 degrees)
    const multiplier = 15
    const rX = -(y / (rect.height / 2)) * multiplier
    const rY = (x / (rect.width / 2)) * multiplier

    setRotateX(rX)
    setRotateY(rY)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <PhotoContainer>
      <PhotoCard 
        ref={cardRef}
        $rotateX={rotateX} 
        $rotateY={rotateY} 
        $isHovered={isHovered}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Tape />
        <PhotoImageWrapper>
          {avatarUrl ? (
            <PhotoImage src={avatarUrl} alt={name} />
          ) : (
            <PlaceholderIcon>{name.substring(0, 2).toUpperCase()}</PlaceholderIcon>
          )}
        </PhotoImageWrapper>
        <PhotoCaption>{name}</PhotoCaption>
      </PhotoCard>
    </PhotoContainer>
  )
}
