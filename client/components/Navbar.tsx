import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0()
  const navigate = useNavigate()

  const handleSignOut = () => {
    logout()
  }

  const handleSignIn = () => {
    loginWithRedirect()
  }

  const handleDashboardClick = () => {
    navigate('/Dashboard')
  }
  const handleFavouritesClick = () => {
    navigate('/Favourites')
  }
  const handleDetectorClick = () => {
    navigate('/Detector')
  }

  return (
    <div className="Visvine-Nav-Banner">
      <h1 className="Visvine-Title">Visvine</h1>
      {isAuthenticated ? (
        <div id="button-div">
          <button className="Button-2" onClick={handleDetectorClick}>
            Detector
          </button>
          <button className="Button-2" onClick={handleFavouritesClick}>
            Favourites
          </button>
          <button className="Button-2" onClick={handleDashboardClick}>
            Dashboard
          </button>
          <button className="Button" id="Sign-in-out" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      ) : (
        <button className="Button" id="Sign-in-out" onClick={handleSignIn}>
          Sign in
        </button>
      )}
    </div>
  )
}

export default Navbar
