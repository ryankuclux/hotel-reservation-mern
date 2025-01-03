import "./login.css"
import { AuthContext } from "../../context/AuthContext.jsx"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useContext, useState } from "react"

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined
    })
    const navigate = useNavigate()

    const { loading, error, dispatch } = useContext(AuthContext)

    const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleClick = async (e) => {
    e.preventDefault()

    dispatch({ type: "LOGIN_START" })

    try {
        const res = await axios.post("api/auth/login", credentials)
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data })
        localStorage.setItem("user", JSON.stringify(res.data))

        navigate("/")
    } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err.response.data })
    }
    }

    return (
    <div className="login">
        <div className="lContainer">
        <input
            type="text"
            id="username"
            placeholder="username"
            onChange={handleChange}
            className="lInput"
        />
        <input
            type="password"
            id="password"
            placeholder="password"
            onChange={handleChange}
            className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
            Login
        </button>
        {error && <span>{error.message}</span>}
        </div>
    </div>
    )
}

export default Login