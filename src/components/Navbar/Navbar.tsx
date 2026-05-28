import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { RiMenuLine, RiCloseLine } from 'react-icons/ri'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { usePortfolioData } from '../../hooks/usePortfolioData'

/* ─────────────────────────────────────────────
   NAV SHELL
───────────────────────────────────────────── */
const NavShell = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: var(--blue);
  display: flex;
  align-items: center;
  padding: 15px 40px;
  gap: 20px;
  min-height: 80px;

  @media (max-width: 860px) {
    padding: 15px 20px;
    justify-content: space-between;
  }
`

/* ─────────────────────────────────────────────
   LOGO
───────────────────────────────────────────── */
const Logo = styled.a`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--white);
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  gap: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 #000;
  }
`

const LogoMark = styled.span`
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 900;
  color: #000;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

/* ─────────────────────────────────────────────
   LINKS — desktop
───────────────────────────────────────────── */
const DesktopLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto;

  @media (max-width: 1024px) {
    display: none;
  }
`

const NavLink = styled.a<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 20px;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 800;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $isActive }) => ($isActive ? 'var(--yellow)' : 'var(--white)')};
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background: var(--yellow);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 #000;
  }
`

/* ─────────────────────────────────────────────
   HAMBURGER
───────────────────────────────────────────── */
const Burger = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--yellow);
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  color: #000;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 #000;
  }

  @media (max-width: 1024px) {
    display: flex;
  }
`

/* ─────────────────────────────────────────────
   MOBILE DRAWER
───────────────────────────────────────────── */
const MobileDrawer = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: var(--blue);
  border-bottom: 3px solid #000;
  transform: ${({ $open }) => ($open ? 'translateY(0)' : 'translateY(-100%)')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
  z-index: 998;
  pointer-events: ${({ $open }) => ($open ? 'all' : 'none')};
  display: none;
  padding: 20px;
  gap: 15px;
  flex-direction: column;

  @media (max-width: 1024px) {
    display: flex;
  }
`

const MobileLink = styled.a<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
  color: #000;
  background: ${({ $isActive }) => ($isActive ? 'var(--yellow)' : 'var(--white)')};
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  text-decoration: none;
  text-transform: uppercase;
  transition: transform 0.1s, box-shadow 0.1s, background 0.1s;

  &:hover {
    background: var(--yellow);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 #000;
  }
`

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
export default function Navbar() {
  const { t } = useTranslation();
  const portfolioData = usePortfolioData();
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('#hero')

  const NAV = [
    { href: '#hero',          label: t('nav.home') },
    { href: '#organisations', label: t('nav.organizations') },
    { href: '#education',     label: t('nav.education') },
    { href: '#companies',     label: t('nav.companies') },
    { href: '#techstack',     label: t('nav.skills') },
    { href: '#projects',      label: t('nav.projects') },
    { href: '#certificates',  label: t('nav.certificates') },
    { href: '#guestbook',     label: t('nav.comments') },
  ];

  // Close drawer on scroll and update active section
  useEffect(() => {
    const handleScroll = () => {
      // Simple active section detection
      const sections = NAV.map(n => n.href.substring(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(`#${section}`)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [open])

  return (
    <>
      <NavShell>
        {/* Logo */}
        <Logo href="#hero">
          <LogoMark>MUHAMAD SALMAN</LogoMark>
        </Logo>

        {/* Desktop links */}
        <DesktopLinks>
          {NAV.map(n => (
            <NavLink 
              key={n.href} 
              href={n.href}
              $isActive={activeSection === n.href}
            >
              {n.label}
            </NavLink>
          ))}
          <LanguageSwitcher />
        </DesktopLinks>

        {/* Hamburger */}
        <Burger onClick={() => setOpen(v => !v)} aria-label="menu">
          {open ? <RiCloseLine /> : <RiMenuLine />}
        </Burger>
      </NavShell>

      {/* Mobile drawer */}
      <MobileDrawer $open={open}>
        {NAV.map(n => (
          <MobileLink 
            key={n.href} 
            href={n.href} 
            onClick={() => setOpen(false)}
            $isActive={activeSection === n.href}
          >
            {n.label}
          </MobileLink>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <LanguageSwitcher />
        </div>
      </MobileDrawer>
    </>
  )
}
