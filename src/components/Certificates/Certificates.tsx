import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'

const Section = styled.section`
  padding: 8rem 4rem;
  background: var(--yellow);
  border-bottom: var(--border-thick);
  position: relative;

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
`

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--blue);
  line-height: 1;
  margin-bottom: 4rem;
`

const CertsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 3rem;
`

const CertCard = styled.div<{ $rotate: string }>`
  background: var(--white);
  border: 4px solid var(--blue);
  box-shadow: 8px 8px 0 var(--blue);
  padding: 1.5rem;
  transform: ${({ $rotate }) => $rotate};
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: block;
  text-decoration: none;

  &:hover {
    transform: translate(-4px, -4px) rotate(0deg);
    box-shadow: 12px 12px 0 var(--blue);
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(5px);
`

const ModalContent = styled.div`
  background: var(--white);
  border: 5px solid var(--blue);
  box-shadow: 15px 15px 0 var(--yellow);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    box-shadow: 8px 8px 0 var(--yellow);
    border-width: 3px;
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 3px solid var(--blue);
  background: var(--yellow);

  h3 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--blue);
    margin: 0;
  }
`

const CloseButton = styled.button`
  background: var(--white);
  border: 3px solid var(--blue);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 4px 4px 0 var(--blue);
  transition: transform 0.1s;

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 var(--blue);
  }
`

const ModalBody = styled.div`
  flex: 1;
  min-height: 0;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  img {
    width: 100%;
    height: auto;
    border: 3px solid var(--blue);
    object-fit: contain;
    max-height: 60vh;
  }

  .details {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
    border-bottom: 2px dashed var(--blue);
    padding-bottom: 1rem;
  }

  .desc {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    line-height: 1.6;
    white-space: pre-wrap;
    color: var(--blue);
  }
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 4rem;
  flex-wrap: wrap;
`

const PageButton = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.1rem;
  color: #000;
  background: ${props => props.$active ? 'var(--yellow)' : 'var(--white)'};
  border: 3px solid #000;
  box-shadow: ${props => props.$active ? '2px 2px 0 #000' : '4px 4px 0 #000'};
  transform: ${props => props.$active ? 'translate(2px, 2px)' : 'none'};
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;

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

const CertGraphic = styled.div`
  height: 200px;
  background: #f4f4f4;
  border: 3px solid var(--blue);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 2;
  }

  /* background lines */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 10px,
      rgba(0, 51, 204, 0.05) 10px,
      rgba(0, 51, 204, 0.05) 11px
    );
  }
`

const CertStamp = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid var(--blue);
  color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 1.5rem;
  transform: rotate(-15deg);
  opacity: 0.8;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    inset: -10px;
    border: 1px dashed var(--blue);
    border-radius: 50%;
    animation: spin 10s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const CertName = styled.h3`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 0.5rem;
  line-height: 1.3;
`

const CertIssuer = styled.p`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 1rem;
`

const CertDate = styled.div`
  display: inline-block;
  background: var(--blue);
  color: var(--white);
  padding: 4px 8px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
`

export default function Certificates() {
  const { ref, isVisible } = useScrollReveal()
  const portfolioData = usePortfolioData()
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCert, setSelectedCert] = useState<any>(null)
  
  const certsPerPage = 3
  const certs = portfolioData.certificates || []
  const totalPages = Math.ceil(certs.length / certsPerPage)

  const currentCerts = certs.slice(
    (currentPage - 1) * certsPerPage,
    currentPage * certsPerPage
  )

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [selectedCert])

  return (
    <Section id="certificates" ref={ref as any} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
      <div>
        <SectionLabel>{t('sections.certLabel')}</SectionLabel>
        <SectionTitle>{t('sections.certTitle')}</SectionTitle>
      </div>

      <CertsGrid>
        {currentCerts.map((cert: any, i: number) => (
          <CertCard 
            key={i} 
            $rotate={cert.rotate} 
            as="button"
            onClick={() => setSelectedCert(cert)}
            style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }}
          >
            <CertGraphic>
              {cert.file ? (
                <img src={cert.file} alt={cert.name} />
              ) : (
                <CertStamp>CERT</CertStamp>
              )}
            </CertGraphic>
            <CertName>{cert.name}</CertName>
            <CertIssuer>{cert.issuer}</CertIssuer>
            <CertDate>{cert.date}</CertDate>
          </CertCard>
        ))}
      </CertsGrid>

      {totalPages > 1 && (
        <PaginationWrapper>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PageButton 
              key={index} 
              $active={currentPage === index + 1}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </PageButton>
          ))}
        </PaginationWrapper>
      )}

      {selectedCert && createPortal(
        <ModalOverlay onClick={() => setSelectedCert(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h3>{t('nav.certificates')}</h3>
              <CloseButton onClick={() => setSelectedCert(null)}>X</CloseButton>
            </ModalHeader>
            <ModalBody>
              {selectedCert.file ? (
                <img src={selectedCert.file} alt={selectedCert.name} />
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px dashed var(--blue)' }}>
                  <h3>...</h3>
                </div>
              )}
              <div className="details">
                <div>
                  <CertName style={{ fontSize: '1.8rem' }}>{selectedCert.name}</CertName>
                  <CertIssuer style={{ fontSize: '1.1rem' }}>{selectedCert.issuer}</CertIssuer>
                </div>
                <CertDate style={{ fontSize: '1rem', padding: '8px 16px' }}>{selectedCert.date}</CertDate>
              </div>
              {selectedCert.desc && (
                <div className="desc">
                  {selectedCert.desc}
                </div>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>,
        document.body
      )}
    </Section>
  )
}
