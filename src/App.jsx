import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Profile from './components/Profile'
import Projects from './components/Projects'
import Capabilities from './components/Capabilities'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <ParticleField />
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
