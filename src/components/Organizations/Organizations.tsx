import styled from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { RiLeafLine, RiTeamLine } from 'react-icons/ri'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { useTranslation } from 'react-i18next'

const Section = styled.section`
  padding: 8rem 4rem;
  background: var(--white);
  border-bottom: var(--border-thick);
  position: relative;
  overflow: hidden;

  /* background pattern decoration */
  &::after {
    content: '+ + + + +';
    position: absolute;
    top: 2rem;
    right: 2rem;
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--blue);
    opacity: 0.1;
    word-spacing: 1rem;
  }

  @media (max-width: 768px) {
    padding: 5rem 1.5rem;
  }
`

const SectionLabel = styled.span`
  display: inline-block;
  background: var(--blue);
  color: var(--yellow);
  padding: 4px 12px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
  transform: rotate(-2deg);
`

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--blue);
  line-height: 1;
  margin-bottom: 4rem;
  text-shadow: 3px 3px 0 var(--gray-200);
`

const Timeline = styled.div`
  position: relative;
  max-width: 800px;
  margin-left: 1rem;

  &::before {
    content: '';
    position: absolute;
    left: 28px;
    top: 0;
    bottom: 0;
    width: 6px;
    background: var(--blue);
  }
`

const TimelineItem = styled.div<{ $rotate: string }>`
  display: flex;
  gap: 2.5rem;
  margin-bottom: 4rem;
  position: relative;

  @media (max-width: 600px) {
    gap: 1.5rem;
  }
`

const TimelineDot = styled.div`
  width: 64px;
  height: 64px;
  min-width: 64px;
  background: var(--yellow);
  border: 4px solid var(--blue);
  box-shadow: 4px 4px 0 var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--blue);
  position: relative;
  z-index: 1;
  transform: rotate(5deg);

  @media (max-width: 600px) {
    width: 54px;
    height: 54px;
    min-width: 54px;
  }
`

const TimelineCard = styled.div<{ $rotate: string }>`
  flex: 1;
  background: var(--white);
  border: 4px solid var(--blue);
  box-shadow: 8px 8px 0 var(--blue);
  padding: 2rem;
  transform: ${({ $rotate }) => $rotate};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translate(-4px, -4px) rotate(0deg);
    box-shadow: 12px 12px 0 var(--blue);
  }
`

const TimelineYear = styled.div`
  display: inline-block;
  background: var(--blue);
  color: var(--white);
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  padding: 4px 12px;
  margin-bottom: 1rem;
  border: 2px solid var(--blue);
  box-shadow: 2px 2px 0 var(--blue);
`

const TimelineRole = styled.h3`
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 0.2rem;
  line-height: 1.2;
`

const TimelineOrg = styled.p`
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--blue);
  background: var(--yellow);
  display: inline-block;
  padding: 2px 8px;
  font-weight: 700;
  margin-bottom: 1rem;
`

const TimelineDesc = styled.p`
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--blue);
  line-height: 1.6;
  font-weight: 500;
`

export default function Organizations() {
  const { ref, isVisible } = useScrollReveal()
  const portfolioData = usePortfolioData()
  const { t } = useTranslation()

  return (
    <Section id="organisations" ref={ref as any} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
      <div>
        <SectionLabel>{t('sections.orgLabel')}</SectionLabel>
        <SectionTitle>{t('sections.orgTitle')}</SectionTitle>
      </div>

      <Timeline>
        {portfolioData.organizations.map((org: any, i: number) => {
          const rotation = i % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1.5deg)'
          const Icon = i % 2 === 0 ? RiTeamLine : RiLeafLine
          return (
            <TimelineItem key={i} $rotate={rotation}>
              <TimelineDot>
                {org.logo ? (
                  <img src={org.logo} alt={org.name} style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
                ) : (
                  <Icon />
                )}
              </TimelineDot>
              <TimelineCard $rotate={rotation}>
                <TimelineYear>{org.period}</TimelineYear>
                <TimelineRole>{org.role}</TimelineRole>
                <br/>
                <TimelineOrg>{org.name}</TimelineOrg>
                <TimelineDesc>{org.desc}</TimelineDesc>
              </TimelineCard>
            </TimelineItem>
          )
        })}
      </Timeline>
    </Section>
  )
}
