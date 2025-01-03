import "./navbar.css"
import { AuthContext } from "../../context/AuthContext.jsx"
import { Link } from "react-router-dom"
import { useContext } from "react"

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext)

  const handleClick = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch({ type: "LOGOUT" })
    }
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">FindMyRoom</span>
        </Link>
        {user ? (
          <div className="navItem">
            <span className="navUsername">{user.username}</span>
            <button onClick={handleClick} className="navButton">Logout</button>
          </div>
        ) : (
          <div className="navItem">
            <Link to="/register">
              <button className="navButton">Register</button>
            </Link>
            <Link to="/login">
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar