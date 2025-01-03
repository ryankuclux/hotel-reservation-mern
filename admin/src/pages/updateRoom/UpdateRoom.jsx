import "./updateRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { roomInputs } from "../../formSource";

const UpdateRoom = () => {
  const location = useLocation();
  const roomId = location.pathname.split("/")[2];
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState("");
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const { data, loading, error } = useFetch("/hotels");

  useEffect(() => {
    const fetchRoom = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`/rooms/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInfo(res.data);
        setHotelId(res.data.hotel);
        setRooms(res.data.roomNumbers.map((room) => room.number));
      } catch (err) {
        console.log(err);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!hotelId) {
      alert("Please select a hotel.");
      return;
    }

    const roomNumbers = rooms.map((room) => ({ number: room }));
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/rooms/${info._id}`, { ...info, roomNumbers, hotelId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
          <h1>Update Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    value={info[input.id]} 
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Rooms</label>
                <textarea
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="give comma between room numbers."
                  value={rooms.join(",")}
                />
              </div>
              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                  value={hotelId}
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
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoom;