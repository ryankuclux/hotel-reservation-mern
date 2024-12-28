import { useState, useContext } from "react";
import axios from "axios";
import "./register.css";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    city: "",
    phone: ""
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    dispatch({ type: "REGISTER_START" }); // Dispatch action untuk memulai proses register

    try {
      const res = await axios.post("api/auth/register", credentials); // Kirim data ke backend
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data }); // Dispatch action jika register berhasil
      navigate("/login"); // Redirect ke halaman login setelah register berhasil
    } catch (err) {
      dispatch({ type: "REGISTER_FAILURE", payload: err.response.data }); // Dispatch action jika register gagal
    }
  };

  return (
    <div className="register">
      <div className="rContainer">
        {/* Input Fields */}
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="text"
          placeholder="country"
          id="country"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="text"
          placeholder="city"
          id="city"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="number"
          placeholder="phone"
          id="phone"
          onChange={handleChange}
          className="rInput"
        />
        {/* Submit Button */}
        <button disabled={loading} onClick={handleClick} className="rButton">
          Register
        </button>
        {/* Error Message */}
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Register;