import { useState, useEffect } from 'react'
import thumbnailImg from './assets/Sih thumbnail.png'
import './App.css'
import AdminPanel from './components/admin/AdminPanel'
import AdminAuth from './components/admin/AdminAuth'
import FarmerSignUp from './components/farmer/signup'
import FarmerPanel from './components/farmer/farmerpanel'

const phrases = [
  "Solution Before the Crisis ...",
  "संकट से पहले समाधान |||"
]

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentChars = Array.from(phrases[phraseIndex])
    let timer

    if (!isDeleting && charIndex === currentChars.length) {
      // Hold completed text for 1.5 seconds
      timer = setTimeout(() => {
        setIsDeleting(true)
      }, 1500)
    } else if (isDeleting && charIndex === 0) {
      // Pause briefly after erasing then switch language
      timer = setTimeout(() => {
        setIsDeleting(false)
        setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
      }, 400)
    } else {
      // Typing (80ms) or Deleting (40ms)
      const speed = isDeleting ? 40 : 80
      timer = setTimeout(() => {
        setCharIndex((prev) => prev + (isDeleting ? -1 : 1))
      }, speed)
    }

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, phraseIndex])

  const displayText = Array.from(phrases[phraseIndex]).slice(0, charIndex).join('')

  if (currentPage === 'admin-auth') {
    return (
      <AdminAuth
        onLoginSuccess={() => setCurrentPage('admin')}
        onBackToHome={() => setCurrentPage('landing')}
      />
    )
  }

  if (currentPage === 'admin') {
    return <AdminPanel onBackToHome={() => setCurrentPage('landing')} />
  }

  if (currentPage === 'farmer-auth') {
    return (
      <FarmerSignUp
        onLoginSuccess={() => setCurrentPage('farmer')}
        onBackToHome={() => setCurrentPage('landing')}
      />
    )
  }

  if (currentPage === 'farmer') {
    return <FarmerPanel onBackToHome={() => setCurrentPage('landing')} />
  }

  return (
    <div className="landing-container">
      <img src={thumbnailImg} alt="Hackathon Thumbnail" className="thumbnail-img" />
      <div className="hero-overlay">
        <h2 className="slogan-text">
          <span>{displayText}</span>
          <span className="slogan-cursor"></span>
        </h2>
      </div>
      <div className="bottom-panel-buttons">
        <button className="btn btn-farmer" onClick={() => setCurrentPage('farmer-auth')}>
          Farmer Panel
        </button>
        <button className="btn btn-admin" onClick={() => setCurrentPage('admin-auth')}>
          Admin Panel
        </button>
      </div>
    </div>
  )
}


export default App
