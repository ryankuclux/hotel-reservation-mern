import { useState, useContext } from "react"
import axios from "axios"
import "./register.css"
import { AuthContext } from "../../context/AuthContext.jsx"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    city: "",
    phone: ""
  })
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    city: "",
    phone: ""
  })
  const navigate = useNavigate()

  const { loading, error, dispatch } = useContext(AuthContext)

  const handleChange = (e) => {
    const { id, value } = e.target

    setCredentials((prev) => ({ ...prev, [id]: value }))

    setErrors((prev) => ({
      ...prev,
      [id]: value
        ? ""
        : `${id.charAt(0).toUpperCase() + id.slice(1)} is required`,
    }))
  }

  const handleClick = async (e) => {
    e.preventDefault()

    let isValid = true
    let tempErrors = { ...errors }

    Object.keys(credentials).forEach((key) => {
      if (!credentials[key]) {
        tempErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`

        isValid = false
      }
    })

    setErrors(tempErrors)

    if (!isValid) return

    dispatch({ type: "REGISTER_START" })

    try {
      const res = await axios.post("api/auth/register", credentials)

      dispatch({ type: "REGISTER_SUCCESS", payload: res.data })

      navigate("/login")
    } catch (err) {
      dispatch({ type: "REGISTER_FAILURE", payload: err.response.data })
    }
  }

  return (
    <div className="register">
      <div className="rContainer">
        <input
          type="text"
          id="username"
          value={credentials.username}
          placeholder="username"
          onChange={handleChange}
          className="rInput"
        />
        {errors.username && <span className="error">{errors.username}</span>}

        <input
          type="email"
          id="email"
          value={credentials.email}
          placeholder="email"
          onChange={handleChange}
          className="rInput"
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="password"
          id="password"
          value={credentials.password}
          placeholder="password"
          onChange={handleChange}
          className="rInput"
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <input
          type="text"
          id="country"
          value={credentials.country}
          placeholder="country"
          onChange={handleChange}
          className="rInput"
        />
        {errors.country && <span className="error">{errors.country}</span>}

        <input
          type="text"
          id="city"
          value={credentials.city}
          placeholder="city"
          onChange={handleChange}
          className="rInput"
        />
        {errors.city && <span className="error">{errors.city}</span>}

        <input
          type="number"
          id="phone"
          value={credentials.phone}
          placeholder="phone"
          onChange={handleChange}
          className="rInput"
        />
        {errors.phone && <span className="error">{errors.phone}</span>}

        <button disabled={loading} onClick={handleClick} className="rButton">
          Register
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  )
}

export default Register