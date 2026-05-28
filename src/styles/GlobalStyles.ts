import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --yellow: #FFE500;
    --yellow-dark: #E6CE00;
    --blue: #0033CC;
    --blue-dark: #0022AA;
    --blue-light: #3366FF;
    --white: #FFFFFF;
    
    --border: 3px solid var(--blue);
    --border-thick: 4px solid var(--blue);
    --shadow-sm: 3px 3px 0px var(--blue);
    --shadow-md: 4px 4px 0px var(--blue);
    --shadow-lg: 6px 6px 0px var(--blue);
    --shadow-xl: 8px 8px 0px var(--blue);
    --radius: 0px;
    --font-sans: 'Space Grotesk', sans-serif;
    --font-mono: 'DM Mono', monospace;
    --font-display: 'Space Mono', monospace;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
    overflow-x: hidden;
    width: 100vw;
  }

  body {
    font-family: var(--font-sans);
    background-color: var(--white);
    color: var(--blue);
    line-height: 1.6;
    overflow-x: hidden;
    width: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    line-height: 1.2;
    font-weight: 700;
  }

  code, pre {
    font-family: var(--font-mono);
  }

  img {
    max-width: 100%;
    display: block;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ::selection {
    background: var(--yellow);
    color: var(--blue);
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--white);
    border-left: 2px solid var(--blue);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--yellow);
    border: 2px solid var(--blue);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--yellow-dark);
  }

  /* Scroll Reveal Animations */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
`
