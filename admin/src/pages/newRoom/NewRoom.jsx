import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [rooms, setRooms] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { data, loading, error } = useFetch("/hotels");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};

    roomInputs.forEach((input) => {
      if (!info[input.id]) {
        newErrors[input.id] = `${input.label} is required`;
      }
    });

    if (!rooms) {
      newErrors.rooms = "Rooms are required";
    }

    if (!hotelId) {
      newErrors.hotelId = "Hotel is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const roomNumbers = rooms.split(",").map((room) => ({ number: room }));
    try {
      await axios.post(`/rooms/${hotelId}`, { ...info, roomNumbers });
      navigate("/rooms");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                  {errors[input.id] && <p className="error">{errors[input.id]}</p>}
                </div>
              ))}
              <div className="formInput">
                <label>Rooms</label>
                <textarea
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="Give comma between room numbers."
                />
                {errors.rooms && <p className="error">{errors.rooms}</p>}
              </div>
              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                >
                  {loading
                    ? "loading"
                    : data &&
                      data.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                </select>
                {errors.hotelId && <p className="error">{errors.hotelId}</p>}
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;