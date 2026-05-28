import styled from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { useTranslation } from 'react-i18next'

const Section = styled.section`
  padding: 8rem 4rem;
  background: var(--yellow);
  border-bottom: var(--border-thick);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 5rem 1.5rem;
  }
`

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--blue);
  line-height: 1;
  margin-bottom: 1.5rem;
`

const SectionSub = styled.p`
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--blue);
  background: var(--white);
  display: inline-block;
  padding: 4px 12px;
  border: 2px solid var(--blue);
  margin-bottom: 4rem;
  transform: rotate(-1deg);
`

const CompaniesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 480px;
  }
`

const CompanyCard = styled.div<{ $rotate: string }>`
  background: var(--white);
  border: 4px solid var(--blue);
  box-shadow: 8px 8px 0 var(--blue);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  transform: ${({ $rotate }) => $rotate};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translate(-4px, -4px) rotate(0deg);
    box-shadow: 12px 12px 0 var(--blue);
  }
`

const CompanyLogo = styled.div<{ $bg: string }>`
  width: 60px;
  height: 60px;
  background: ${({ $bg }) => $bg};
  border: 3px solid var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const CompanyInfo = styled.div`
  h3 {
    font-family: var(--font-display);
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }
  .role {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 1rem;
    padding: 2px 6px;
    background: #eee;
    display: inline-block;
  }
  p {
    font-family: var(--font-sans);
    font-size: 0.95rem;
    line-height: 1.6;
  }
`

export default function Companies() {
  const { ref, isVisible } = useScrollReveal()
  const portfolioData = usePortfolioData()
  const { t } = useTranslation()

  return (
    <Section id="companies" ref={ref as any} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
      <div>
        <SectionSub>{t('sections.compLabel')}</SectionSub>
        <SectionTitle>{t('sections.compTitle')}</SectionTitle>
      </div>

      <CompaniesGrid>
        {portfolioData.companies.map((company: any, i: number) => (
          <CompanyCard key={i} $rotate={company.tilt}>
            <CompanyLogo $bg={company.color}>
              {(company as any).logo ? (
                <img src={(company as any).logo} alt={company.name} />
              ) : (
                <span>{company.badgeText}</span>
              )}
            </CompanyLogo>
            <CompanyInfo>
              <h3>{company.name}</h3>
              <div className="role">{company.role}</div>
              <p>{company.desc}</p>
            </CompanyInfo>
          </CompanyCard>
        ))}
      </CompaniesGrid>
    </Section>
  )
}
