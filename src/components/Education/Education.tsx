import styled from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { useTranslation } from 'react-i18next'

const Section = styled.section`
  padding: 8rem 4rem;
  background: var(--blue);
  border-bottom: var(--border-thick);

  @media (max-width: 768px) {
    padding: 5rem 1.5rem;
  }
`

const SectionLabel = styled.span`
  display: inline-block;
  background: var(--white);
  color: var(--blue);
  padding: 4px 12px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
  transform: rotate(2deg);
  border: 2px solid var(--blue);
`

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--white);
  line-height: 1;
  margin-bottom: 4rem;
  text-shadow: 4px 4px 0 var(--blue);
`

const EduGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
`

const EduCard = styled.div<{ $rotate: string }>`
  display: flex;
  background: var(--white);
  border: 4px solid var(--blue);
  box-shadow: 8px 8px 0 var(--blue);
  transform: ${({ $rotate }) => $rotate};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translate(-4px, -4px) rotate(0deg);
    box-shadow: 12px 12px 0 var(--blue);
  }

  @media (max-width: 600px) {
    flex-direction: column;
  }
`

const TypoLogo = styled.div<{ $bg: string; $color: string }>`
  width: 140px;
  background: ${({ $bg }) => $bg};
  border-right: 4px solid var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 700;
    color: ${({ $color }) => $color};
    text-shadow: 2px 2px 0 var(--blue);
  }

  @media (max-width: 600px) {
    width: 100%;
    height: 100px;
    border-right: none;
    border-bottom: 4px solid var(--blue);
  }
`

const EduContent = styled.div`
  padding: 2rem;
`

const EduLevel = styled.span`
  display: inline-block;
  background: var(--blue);
  color: var(--white);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 10px;
  margin-bottom: 0.8rem;
  text-transform: uppercase;
`

const EduName = styled.h3`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 0.4rem;
`

const EduMeta = styled.div`
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 700;
  color: #444;
`

const GraduateBadge = styled.div`
  display: inline-block;
  background: var(--yellow);
  color: var(--blue);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.8rem;
  padding: 4px 10px;
  border: 2px solid var(--blue);
  margin-top: 1rem;
  box-shadow: 2px 2px 0 var(--blue);
  transform: rotate(-3deg);
`

// Using portfolioData.education

export default function Education() {
  const { ref, isVisible } = useScrollReveal()
  const portfolioData = usePortfolioData()
  const { t } = useTranslation()

  return (
    <Section id="education" ref={ref as any} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
      <SectionLabel>{t('sections.eduLabel')}</SectionLabel>
      <SectionTitle>{t('sections.eduTitle')}</SectionTitle>

      <EduGrid>
        {portfolioData.education.map((edu: any, i: number) => {
          const isLatest = i === 0;
          const rotation = i === 0 ? 'rotate(-1deg)' : (i === 1 ? 'rotate(1.5deg)' : 'rotate(-0.5deg)');
          return (
            <EduCard key={i} $rotate={rotation}>
              <TypoLogo $bg={edu.color} $color="var(--blue)">
                {edu.logo ? (
                  <img src={edu.logo} alt={edu.school} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                ) : (
                  <span>{edu.badgeText}</span>
                )}
              </TypoLogo>
              <EduContent>
                <EduLevel>{edu.status}</EduLevel>
                <EduName>{edu.school}</EduName>
                <EduMeta>{portfolioData?.hero?.location?.split(',')[0] || "Jakarta"} • {edu.year}</EduMeta>
                {isLatest && !edu.year.toString().includes('Sekarang') && !edu.year.toString().includes('Present') && (
                  <GraduateBadge>
                    {t('misc.latestGraduate')}
                  </GraduateBadge>
                )}
              </EduContent>
            </EduCard>
          )
        })}
      </EduGrid>
    </Section>
  )
}
