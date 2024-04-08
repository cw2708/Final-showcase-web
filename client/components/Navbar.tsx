import { useAuth0 } from '@auth0/auth0-react'

function Navbar() {
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0()
  const auth = useAuth0()
  // TODO: replace placeholder user object with the one from auth0
  const user = {
    nickname: auth.user?.name,
  }

  const handleSignOut = () => {
    // console.log('sign out')
    logout()
  }

  const handleSignIn = () => {
    loginWithRedirect()
    console.log(user.nickname)
    // console.log('sign in'
  }

  return (
    <>
      <div className="Visvine-Nav-Banner">
        <h1 className="Visvine-Title">Visvine</h1>
        {isAuthenticated ? (
          <button className="Button" id="Sign-in-out" onClick={handleSignOut}>
            Sign out
          </button>
        ) : (
          <button className="Button" id="Sign-in-out" onClick={handleSignIn}>
            Sign in
          </button>
        )}
      </div>
    </>
  )
}
export default Navbar
