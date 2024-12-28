import { useContext } from "react"
import "./navbar.css"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext.jsx"

const Navbar = () => {
    const { user, dispatch } = useContext(AuthContext)

    const handleClick = () => {
        if (window.confirm("Apakah anda yakin ingin logout?")) {
            dispatch({ type: "LOGOUT" })
        }
    }

    return (
        <div className="navbar">
          <div className="navContainer">
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              <span className="logo">FindMyRoom</span>
            </Link>
            {user ? ( // Jika user sudah login, tampilkan username dan tombol logout
              <div className="navItem">
                <span className="navUsername">{user.username}</span>
                <button className="navButton" onClick={handleClick}>
                  Logout
                </button>
              </div>
            ) : (
              // Jika user belum login, tampilkan tombol Register dan Login
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
      );
}

export default Navbar