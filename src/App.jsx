import DarkVeil from './components/DarkVeil/DarkVeil'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Profile from './components/Profile'
import Projects from './components/Projects'
import Capabilities from './components/Capabilities'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <DarkVeil />
      </div>
      <Navbar />
      <main>
        <Hero />
        <Profile />
        <Projects />
        <Capabilities />
      </main>
      <Footer />
    </>
  )
}
