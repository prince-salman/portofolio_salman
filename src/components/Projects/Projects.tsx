import { useState } from 'react'
import styled from 'styled-components'
import { RiGithubFill, RiExternalLinkLine } from 'react-icons/ri'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { useTranslation } from 'react-i18next'

const Section = styled.section`
  padding: 8rem 4rem;
  background: var(--white);
  border-bottom: var(--border-thick);
  position: relative;
  overflow: hidden;

  /* Decor */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    background: repeating-linear-gradient(
      90deg,
      var(--blue),
      var(--blue) 20px,
      var(--yellow) 20px,
      var(--yellow) 40px
    );
  }

  @media (max-width: 768px) {
    padding: 5rem 1.5rem;
  }
`

const SectionLabel = styled.span`
  display: inline-block;
  background: var(--blue);
  color: var(--white);
  padding: 4px 12px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
  border: 2px solid var(--blue);
  transform: rotate(-1deg);
`

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--blue);
  line-height: 1;
  margin-bottom: 4rem;
`

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 3rem;
`

const ProjectCard = styled.div`
  background: var(--white);
  border: 4px solid var(--blue);
  box-shadow: 8px 8px 0 var(--blue);
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translate(-4px, -4px) rotate(1deg);
    box-shadow: 12px 12px 0 var(--blue);
  }
`

const ProjectImageFallback = styled.div<{ $bg: string }>`
  height: 200px;
  background: ${({ $bg }) => $bg};
  border-bottom: 4px solid var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  /* simple grid pattern */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(0, 51, 204, 0.1) 2px, transparent 2px),
                      linear-gradient(90deg, rgba(0, 51, 204, 0.1) 2px, transparent 2px);
    background-size: 20px 20px;
  }

  span {
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 700;
    color: var(--blue);
    position: relative;
    z-index: 1;
    transform: rotate(-5deg);
    text-shadow: 3px 3px 0 rgba(255,255,255,0.8);
  }
`

const ProjectContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`

const ProjectName = styled.h3`
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 0.5rem;
`

const ProjectDesc = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--blue);
  line-height: 1.6;
  font-weight: 500;
  margin-bottom: 1.5rem;
  flex: 1;
`

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`

const TechItem = styled.span`
  background: rgba(0, 51, 204, 0.05);
  color: var(--blue);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border: 1px solid var(--blue);
`

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
  }
`

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--blue);
  text-decoration: none;
  border-bottom: 2px solid var(--blue);
  padding-bottom: 2px;
  transition: color 0.1s, border-color 0.1s;

  &:hover {
    color: var(--yellow);
    border-color: var(--yellow);
  }

  svg {
    font-size: 1.1rem;
  }
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 4rem;
`

const PageButton = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active }) => $active ? 'var(--blue)' : 'var(--white)'};
  color: ${({ $active }) => $active ? 'var(--white)' : 'var(--blue)'};
  border: 2px solid var(--blue);
  font-family: var(--font-mono);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--blue);
    color: var(--white);
    transform: translateY(-2px);
    box-shadow: 4px 4px 0 var(--yellow);
  }
`

export default function Projects() {
  const { ref, isVisible } = useScrollReveal()
  const portfolioData = usePortfolioData()
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)

  const projectsPerPage = 3
  const totalPages = Math.ceil(portfolioData.projects.length / projectsPerPage)
  
  const currentProjects = portfolioData.projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  )

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Optional: scroll back to top of projects section
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Section id="projects" ref={ref as any} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
      <SectionLabel>{t('sections.projLabel')}</SectionLabel>
      <SectionTitle>{t('sections.projTitle')}</SectionTitle>

      <ProjectsGrid>
        {currentProjects.map((project: any, i: number) => (
          <ProjectCard key={i}>
            {project.image ? (
              <img src={project.image} alt={project.name} style={{ width: '100%', height: '220px', objectFit: 'cover', borderBottom: '4px solid var(--blue)', display: 'block' }} />
            ) : (
              <ProjectImageFallback $bg={project.bg}>
                <span>{project.name.substring(0, 3).toUpperCase()}*</span>
              </ProjectImageFallback>
            )}
            <ProjectContent>
              <ProjectName>{project.name}</ProjectName>
              <ProjectDesc>{project.desc}</ProjectDesc>
              
              <TechList>
                {project.tech.map((t: any, idx: number) => (
                  <TechItem key={idx}>{t}</TechItem>
                ))}
              </TechList>

                <ProjectLinks>
                  {project.live && (
                    <ProjectLink href={project.live} target="_blank" className="primary">
                      {t('misc.livePreview')} <RiExternalLinkLine />
                    </ProjectLink>
                  )}
                  {project.github && (
                    <ProjectLink href={project.github} target="_blank">
                      {t('misc.sourceCode')} <RiGithubFill />
                    </ProjectLink>
                  )}
                </ProjectLinks>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectsGrid>

      {totalPages > 1 && (
        <PaginationContainer>
          {Array.from({ length: totalPages }, (_, index) => (
            <PageButton 
              key={index + 1} 
              $active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PageButton>
          ))}
        </PaginationContainer>
      )}
    </Section>
  )
}
