import styled from 'styled-components'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { useTranslation, Trans } from 'react-i18next'
import { RiGithubFill, RiInstagramLine, RiLinkedinFill, RiArrowUpLine, RiArrowRightUpLine } from 'react-icons/ri'

const FooterSection = styled.footer`
  background: var(--yellow);
  color: var(--blue);
  padding: 8rem 4rem 2rem;
  border-top: 2px solid var(--blue);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 5rem 2rem 2rem;
  }
`

const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 6rem;
  border-bottom: 2px solid var(--blue);
  padding-bottom: 4rem;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 3rem;
  }
`

const MegaText = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 10vw, 8rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  max-width: 900px;
  word-wrap: break-word;

  span {
    color: var(--blue);
    -webkit-text-stroke: 2px var(--blue);
    color: transparent;
  }

  @media (max-width: 768px) {
    font-size: clamp(2.5rem, 12vw, 4rem);
    line-height: 1.1;
    -webkit-text-stroke: 1px var(--blue);
  }
`

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: var(--blue);
  color: var(--yellow);
  padding: 1.5rem 3rem;
  border-radius: 100px;
  font-family: var(--font-sans);
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;

  svg {
    font-size: 1.5rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 51, 204, 0.2);
    
    svg {
      transform: translate(4px, -4px);
    }
  }
`

const FooterMiddle = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 6rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const ColTitle = styled.h4`
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(0, 51, 204, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`

const DescText = styled.p`
  font-family: var(--font-sans);
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 400px;
  font-weight: 500;
`

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  color: var(--blue);
  text-decoration: none;
  width: fit-content;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--blue);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  svg {
    font-size: 1.25rem;
  }
`

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 51, 204, 0.15);

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    gap: 2rem;
  }
`

const Copyright = styled.div`
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(0, 51, 204, 0.7);
`

const BackToTop = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid var(--blue);
  color: var(--blue);
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  &:hover {
    background: var(--blue);
    color: var(--yellow);
    transform: translateY(-5px);
  }

  svg {
    font-size: 1.5rem;
  }
`

const formatUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const formatHandle = (url: string) => '@' + (url.split('/').filter(Boolean).pop() || '')

export default function Footer() {
  const portfolioData = usePortfolioData()
  const { t } = useTranslation()
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <FooterSection id="footer">
      <FooterTop>
        <MegaText>
          <Trans i18nKey="footer.collaborate" components={{ span: <span />, br: <br/> }} />
        </MegaText>
        <ContactButton href={`mailto:${portfolioData.socials.email}`}>
          {t('footer.contactMe')} <RiArrowRightUpLine />
        </ContactButton>
      </FooterTop>

      <FooterMiddle>
        <Column>
          <ColTitle>{t('footer.about')}</ColTitle>
          <DescText>
            {t('footer.aboutText')}
          </DescText>
        </Column>

        <Column>
          <ColTitle>{t('footer.socialMedia')}</ColTitle>
          {portfolioData.socials.github && (
            <SocialLink href={portfolioData.socials.github} target="_blank" rel="noopener noreferrer">
              <RiGithubFill /> {formatUrl(portfolioData.socials.github)}
            </SocialLink>
          )}
          {portfolioData.socials.linkedin && (
            <SocialLink href={portfolioData.socials.linkedin} target="_blank" rel="noopener noreferrer">
              <RiLinkedinFill /> {formatUrl(portfolioData.socials.linkedin)}
            </SocialLink>
          )}
          {portfolioData.socials.instagram && (
            <SocialLink href={portfolioData.socials.instagram} target="_blank" rel="noopener noreferrer">
              <RiInstagramLine /> {formatHandle(portfolioData.socials.instagram)}
            </SocialLink>
          )}
        </Column>

        <Column>
          <ColTitle>{t('footer.location')}</ColTitle>
          <SocialLink href={`https://maps.google.com/?q=${portfolioData.hero.location || "Jakarta, Indonesia"}`} target="_blank" rel="noopener noreferrer">
            {portfolioData.hero.location || "Jakarta, Indonesia"}
          </SocialLink>
        </Column>
      </FooterMiddle>

      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} {portfolioData.hero.fullName}. All rights reserved.
        </Copyright>
        
        <BackToTop onClick={scrollToTop} aria-label="Kembali ke atas">
          <RiArrowUpLine />
        </BackToTop>
      </FooterBottom>
    </FooterSection>
  )
}
