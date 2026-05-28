import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import HeroPhoto from './HeroPhoto'
import { RiArrowDownLine, RiGithubFill, RiInstagramLine, RiLinkedinFill, RiMapPin2Fill } from 'react-icons/ri'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { useTranslation } from 'react-i18next'
// Reusable audio context for typewriter sound
let audioCtx: AudioContext | null = null

const playClickSound = () => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      audioCtx = new AudioContextClass()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
    const osc = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05)

    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05)

    osc.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    osc.start()
    osc.stop(audioCtx.currentTime + 0.05)
  } catch (e) {
    // Ignore
  }
}

const HeroSection = styled.section`
  min-height: 100vh;
  background: var(--white);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 80px 4rem 4rem;
  position: relative;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 100px 2rem 4rem;
    text-align: center;
  }
`

const HeroGrid = styled.div`
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 39px,
    rgba(0, 51, 204, 0.1) 39px,
    rgba(0, 51, 204, 0.1) 40px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 39px,
    rgba(0, 51, 204, 0.1) 39px,
    rgba(0, 51, 204, 0.1) 40px
  );
  position: absolute;
  inset: 0;
  pointer-events: none;
`

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  /* slight organic offset */
  transform: rotate(-1deg);
  
  @media (max-width: 1024px) {
    transform: none;
  }
`

const HeroTagsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`

const HeroTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--white);
  color: var(--blue);
  border: 3px solid var(--blue);
  box-shadow: 4px 4px 0 var(--yellow);
  padding: 4px 14px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transform: rotate(2deg);
`

const StatusDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 0;
  background: var(--blue);
  display: inline-block;
  animation: pulse 1.5s ease infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }
`

const HeroName = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 7vw, 6rem);
  font-weight: 700;
  color: var(--blue);
  line-height: 1.1;
  margin-bottom: 1rem;
  letter-spacing: -0.04em;
  text-shadow: 4px 4px 0 var(--yellow);

  span {
    color: var(--yellow);
    -webkit-text-stroke: 3px #000;
    text-shadow: 6px 6px 0 #000;
    display: inline-block;
  }

  @media (max-width: 1024px) {
    font-size: clamp(2.2rem, 8vw, 3rem);
    text-shadow: 3px 3px 0 var(--yellow);
    
    span {
      -webkit-text-stroke: 2px #000;
      text-shadow: 4px 4px 0 #000;
    }
  }
`

const HeroRole = styled.p`
  font-family: var(--font-mono);
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--white);
  background: var(--blue);
  display: inline-block;
  padding: 4px 12px;
  border: 2px solid var(--blue);
  margin-bottom: 1.5rem;
  font-weight: 700;
  min-height: 38px; /* Prevent height jump */
  
  &::after {
    content: '|';
    animation: blink 1s step-end infinite;
    margin-left: 2px;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`

const HeroDesc = styled.p`
  font-family: var(--font-sans);
  font-size: 1.1rem;
  color: var(--blue);
  max-width: 460px;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  font-weight: 500;

  @media (max-width: 1024px) {
    margin: 0 auto 2.5rem;
  }
`

const HeroCTAs = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`

const CTAPrimary = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--yellow);
  color: var(--blue);
  border: 3px solid var(--blue);
  box-shadow: 6px 6px 0 var(--blue);
  padding: 12px 32px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0 var(--blue);
  }

  &:active {
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0 var(--blue);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
  }
`

const CTASecondary = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  color: var(--blue);
  border: 3px solid var(--blue);
  box-shadow: 6px 6px 0 var(--yellow);
  padding: 12px 32px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0 var(--yellow);
  }

  &:active {
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0 var(--yellow);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
  }
`

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`

const SocialLink = styled.a`
  width: 48px;
  height: 48px;
  background: var(--white);
  border: 3px solid var(--blue);
  box-shadow: 4px 4px 0 var(--yellow);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--blue);
  font-size: 1.5rem;
  transition: all 0.1s ease;

  &:hover {
    background: var(--yellow);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 var(--yellow);
  }
`



const MarqueeBanner = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--blue);
  border-top: 4px solid var(--blue);
  padding: 12px 0;
  overflow: hidden;
  z-index: 5;
  transform: rotate(-1deg) scale(1.02);
`

const MarqueeTrack = styled.div`
  display: flex;
  width: max-content;
  will-change: transform;
`

const MarqueeText = styled.span`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0 2rem;
  white-space: nowrap;

  &::after {
    content: '*';
    padding-left: 2rem;
  }
`

const ScrollIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--blue);
  margin-top: 4rem;
  padding: 4px 12px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
`

// No need for hardcoded marqueeItems array, it's in portfolioData.hero.marquee

export default function Hero() {
  const { ref, isVisible } = useScrollReveal()
  const portfolioData = usePortfolioData()
  const { t } = useTranslation()

  const hero = portfolioData.hero || {}
  const socials = portfolioData.socials || {}

  const lanyard = hero.lanyard || {}
  const ropeColor = lanyard.ropeColor || '#FFE500'
  const trackRef = useRef<HTMLDivElement>(null)
  const xPos = useRef(0)
  const direction = useRef(-1) // -1 left (scroll down), 1 right (scroll up)
  const lastScrollY = useRef(0)

  // Typewriter effect state
  const [typedRole, setTypedRole] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  
  useEffect(() => {
    const currentWord = hero.marquee[wordIndex % hero.marquee.length]
    let typingSpeed = isDeleting ? 40 : 100
    
    // Add randomness to make it look like real typing
    if (!isDeleting) {
      typingSpeed += Math.random() * 50
    }

    const handleType = () => {
      // Play sound on type
      playClickSound()
      
      setTypedRole(current => {
        if (isDeleting) {
          return current.substring(0, current.length - 1)
        }
        return currentWord.substring(0, current.length + 1)
      })
    }

    let timer: number
    
    if (isDeleting && typedRole === '') {
      setIsDeleting(false)
      setWordIndex(prev => prev + 1)
      timer = setTimeout(handleType, 400) // Pause before typing new word
    } else if (!isDeleting && typedRole === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), 2000) // Pause at end of word
    } else {
      timer = setTimeout(handleType, typingSpeed)
    }

    return () => clearTimeout(timer as unknown as number)
  }, [typedRole, isDeleting, wordIndex])
  
  const velocity = useRef(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY.current
      
      if (delta < 0) {
        // Scroll ke atas -> arah berbalik (kanan)
        direction.current = 1
      } else if (delta > 0) {
        // Scroll ke bawah -> arah normal (kiri)
        direction.current = -1
      }
      
      // Beri dorongan kecepatan (absolut)
      const impact = Math.abs(delta) * 0.003
      velocity.current = Math.min(0.5, velocity.current + impact)
      
      lastScrollY.current = currentScrollY
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useEffect(() => {
    let animationFrameId: number
    
    const animate = () => {
      // Base speed (slower) dikalikan dengan arah
      let baseSpeed = 0.015 * direction.current
      
      // Apply friction/decay to velocity so it eventually stops
      velocity.current *= 0.95
      
      // Tambahkan kecepatan base dan velocity dorongan (sesuai arah)
      xPos.current += baseSpeed + (velocity.current * direction.current)
      
      if (xPos.current <= -25) {
        xPos.current += 25
      } else if (xPos.current > 0) {
        xPos.current -= 25
      }
      
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${xPos.current}%)`
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <HeroSection id="hero">
      <HeroGrid />

      <HeroContent>
        <HeroTagsWrapper>
          <HeroTag>
            <StatusDot />
            {hero.statusTag}
          </HeroTag>
          {hero.location && (
            <HeroTag style={{ transform: 'rotate(-2deg)' }}>
              <RiMapPin2Fill />
              {hero.location}
            </HeroTag>
          )}
        </HeroTagsWrapper>

        <HeroName>
          {t('hero.helloIAm')}{' '}<span>{hero.name}</span>
        </HeroName>

        <HeroRole>
          {typedRole}
        </HeroRole>

        <HeroDesc>
          {hero.description}
        </HeroDesc>

        <HeroCTAs>
          <CTAPrimary href="#projects">
            Lihat Portofolio
          </CTAPrimary>
          <CTASecondary href={hero.cvLink} target="_blank">
            Download CV
          </CTASecondary>
        </HeroCTAs>

        <SocialLinks>
          {socials.github && (
            <SocialLink href={socials.github} target="_blank" aria-label="GitHub">
              <RiGithubFill />
            </SocialLink>
          )}
          {socials.linkedin && (
            <SocialLink href={socials.linkedin} target="_blank" aria-label="LinkedIn">
              <RiLinkedinFill />
            </SocialLink>
          )}
          {socials.instagram && (
            <SocialLink href={socials.instagram} target="_blank" aria-label="Instagram">
              <RiInstagramLine />
            </SocialLink>
          )}
        </SocialLinks>

        <ScrollIndicator>
          <div className="icon">
            <RiArrowDownLine />
          </div>
          Jelajahi Profil
        </ScrollIndicator>
      </HeroContent>

      <HeroPhoto avatarUrl={hero.lanyard?.avatar} name={hero.name} />

      <MarqueeBanner>
        <MarqueeTrack ref={trackRef}>
          {/* Render 4 identical sets for safe infinite wrapping on ultrawide screens */}
          {[...hero.marquee, ...hero.marquee, ...hero.marquee, ...hero.marquee].map((item, i) => (
            <MarqueeText key={i}>{item}</MarqueeText>
          ))}
        </MarqueeTrack>
      </MarqueeBanner>
    </HeroSection>
  )
}
