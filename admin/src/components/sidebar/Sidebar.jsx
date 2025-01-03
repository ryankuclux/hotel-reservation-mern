import "./sidebar.scss"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import StoreIcon from "@mui/icons-material/Store"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import { AuthContext } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { useContext } from "react"

const Sidebar = () => {
  const { dispatch: authDispatch } = useContext(AuthContext)

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      authDispatch({ type: "LOGOUT" })
    }
  }

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">FindMyRoom</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/" style={{textDecoration: "none" }}>
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          </Link>
          <p className="title">LISTS</p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
          <Link to="/hotels" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Hotels</span>
            </li>
          </Link>
          <Link to="/rooms" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className="icon" />
              <span>Rooms</span>
            </li>
          </Link>
          <p className="title">USER</p>
          <li onClick={handleLogout}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar