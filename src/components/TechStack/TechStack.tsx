import styled, { keyframes } from 'styled-components'
import {
  SiJavascript, SiTypescript, SiPython, SiPhp,
  SiReact, SiNextdotjs, SiNodedotjs, SiLaravel,
  SiMysql, SiPostgresql, SiMongodb,
  SiDocker, SiGit, SiLinux,
  SiTailwindcss, SiVite
} from 'react-icons/si'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { useTranslation } from 'react-i18next'

const Section = styled.section`
  padding: 6rem 4rem;
  background: var(--yellow);
  border-bottom: var(--border-thick);

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`

const SectionLabel = styled.span`
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--white);
  background: var(--blue);
  padding: 4px 12px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  display: inline-block;
  margin-bottom: 1rem;
`

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--blue);
  line-height: 1;
  margin-bottom: 3.5rem;
  text-shadow: 2px 2px 0 var(--white);
`

const CategoryBlock = styled.div`
  margin-bottom: 2.5rem;
`

const CategoryLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--blue);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  opacity: 0.7;

  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: rgba(0, 51, 204, 0.2);
    max-width: 300px;
  }
`

const TechGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`

const TechCard = styled.div<{ $delay: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  background: var(--white);
  border: var(--border-thick);
  box-shadow: var(--shadow-md);
  padding: 1rem 1.25rem;
  min-width: 90px;
  cursor: default;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: var(--shadow-lg);
    background: var(--blue);
    color: var(--yellow);

    svg { color: var(--yellow); }
    span { color: var(--yellow); }
  }
`

const TechIcon = styled.div<{ $color: string }>`
  font-size: 2rem;
  color: ${({ $color }) => $color};
  transition: color 0.15s ease;
  line-height: 1;
`

const TechName = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--blue);
  text-align: center;
  transition: color 0.15s ease;
`

type TechItem = {
  name: string
  icon: React.ReactElement
  color: string
}

const categories: { label: string; items: TechItem[] }[] = [
  {
    label: 'Languages',
    items: [
      { name: 'JavaScript', icon: <SiJavascript />, color: '#F7DF1E' },
      { name: 'TypeScript', icon: <SiTypescript />, color: '#3178C6' },
      { name: 'Python', icon: <SiPython />, color: '#3776AB' },
      { name: 'PHP', icon: <SiPhp />, color: '#777BB4' }
    ],
  },
  {
    label: 'Frameworks & Libraries',
    items: [
      { name: 'React', icon: <SiReact />, color: '#61DAFB' },
      { name: 'Next.js', icon: <SiNextdotjs />, color: 'var(--blue)' },
      { name: 'Node.js', icon: <SiNodedotjs />, color: '#339933' },
      { name: 'Laravel', icon: <SiLaravel />, color: '#FF2D20' },
      { name: 'Tailwind', icon: <SiTailwindcss />, color: '#06B6D4' },
      { name: 'Vite', icon: <SiVite />, color: '#646CFF' },
    ],
  },
  {
    label: 'Database',
    items: [
      { name: 'MySQL', icon: <SiMysql />, color: '#4479A1' },
      { name: 'PostgreSQL', icon: <SiPostgresql />, color: '#336791' },
      { name: 'MongoDB', icon: <SiMongodb />, color: '#47A248' }
    ],
  },
  {
    label: 'Tools & DevOps',
    items: [
      { name: 'Docker', icon: <SiDocker />, color: '#2496ED' },
      { name: 'Git', icon: <SiGit />, color: '#F05032' },
      { name: 'Linux', icon: <SiLinux />, color: '#FCC624' }
    ],
  },
]

export default function TechStack() {
  const { ref, isVisible } = useScrollReveal()
  const portfolioData = usePortfolioData()
  const { t } = useTranslation()

  return (
    <Section id="techstack" ref={ref as any} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
      <SectionLabel>{t('sections.techLabel')}</SectionLabel>
      <SectionTitle>{t('sections.techTitle')}</SectionTitle>

      {categories.map((cat) => (
        <CategoryBlock key={cat.label}>
          <CategoryLabel>{cat.label}</CategoryLabel>
          <TechGrid>
            {cat.items.map((tech, i) => (
              <TechCard key={tech.name} $delay={i * 0.05}>
                <TechIcon $color={tech.color}>
                  {tech.icon}
                </TechIcon>
                <TechName>{tech.name}</TechName>
              </TechCard>
            ))}
          </TechGrid>
        </CategoryBlock>
      ))}
    </Section>
  )
}
