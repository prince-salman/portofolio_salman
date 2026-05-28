import { useEffect } from 'react'
import styled from 'styled-components'
import Hero from './components/Hero/Hero'
import Organizations from './components/Organizations/Organizations'
import Education from './components/Education/Education'
import Companies from './components/Companies/Companies'
import TechStack from './components/TechStack/TechStack'
import Projects from './components/Projects/Projects'
import Certificates from './components/Certificates/Certificates'
import Guestbook from './components/Guestbook/Guestbook'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import CustomCursor from './components/CustomCursor/CustomCursor'
import InteractiveBackground from './components/InteractiveBackground/InteractiveBackground'

const AppWrapper = styled.div`
  min-height: 100vh;
  background: var(--white);
`

function App() {
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
      window.location.href = '/admin/index.html'
    }
  }, [])

  return (
    <AppWrapper>
      <InteractiveBackground />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Organizations />
        <Education />
        <Companies />
        <TechStack />
        <Projects />
        <Certificates />
        <Guestbook />
      </main>
      <Footer />
    </AppWrapper>
  )
}

export default App
