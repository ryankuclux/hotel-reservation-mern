import "./navbar.scss"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import { DarkModeContext } from "../../context/darkModeContext"
import { useContext } from "react"

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="items">
          <div className="item">
            <DarkModeOutlinedIcon
              onClick={() => dispatch({ type: "TOGGLE" })}
              className="icon"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar