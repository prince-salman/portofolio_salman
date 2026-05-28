import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  z-index: 100;

  @media (max-width: 1024px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const SwitcherButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--white);
  color: var(--blue);
  border: 2px solid var(--blue);
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 3px 3px 0 var(--blue);
  transition: transform 0.1s, box-shadow 0.1s;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 var(--blue);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--white);
  border: 2px solid var(--blue);
  box-shadow: 4px 4px 0 var(--blue);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  min-width: 140px;

  @media (max-width: 1024px) {
    position: static;
    width: 100%;
    box-shadow: none;
    border: 2px solid var(--blue);
    margin-top: 15px;
  }
`;

const LangOption = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ $active }) => ($active ? 'var(--blue)' : 'var(--white)')};
  color: ${({ $active }) => ($active ? 'var(--white)' : 'var(--blue)')};
  border: none;
  border-bottom: 2px solid var(--blue);
  padding: 10px 15px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ $active }) => ($active ? 'var(--blue)' : 'var(--yellow)')};
    color: var(--blue);
  }

  .code {
    font-size: 0.75rem;
    padding: 2px 4px;
    background: ${({ $active }) => ($active ? 'var(--white)' : 'var(--blue)')};
    color: ${({ $active }) => ($active ? 'var(--blue)' : 'var(--white)')};
    border-radius: 2px;
  }
`;

const LANGUAGES = [
  { code: 'id', label: 'Indonesia', flagUrl: 'https://flagcdn.com/w40/id.png' },
  { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png' },
  { code: 'zh', label: '中文 (Mandarin)', flagUrl: 'https://flagcdn.com/w40/cn.png' },
  { code: 'pt', label: 'Português', flagUrl: 'https://flagcdn.com/w40/pt.png' },
  { code: 'ar', label: 'العربية (Arabic)', flagUrl: 'https://flagcdn.com/w40/sa.png' },
];

// SVG Icon definition to avoid importing react-icons if not strictly needed
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    setIsOpen(false);
    
    document.documentElement.dir = 'ltr';
  };

  return (
    <DropdownContainer>
      <SwitcherButton onClick={() => setIsOpen(!isOpen)}>
        <img src={currentLang.flagUrl} alt={currentLang.code} style={{ width: '20px', borderRadius: '2px', border: '1px solid rgba(0,0,0,0.1)' }} />
        <span>{currentLang.code.toUpperCase()}</span>
        <ChevronIcon />
      </SwitcherButton>
      
      <DropdownMenu $isOpen={isOpen}>
        {LANGUAGES.map((lang) => (
          <LangOption 
            key={lang.code} 
            $active={i18n.language === lang.code}
            onClick={() => changeLanguage(lang.code)}
          >
            <img src={lang.flagUrl} alt={lang.code} style={{ width: '20px', borderRadius: '2px', marginRight: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
            {lang.label}
          </LangOption>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
}
