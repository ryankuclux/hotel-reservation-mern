import "./updateHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateHotel = () => {
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const { id } = useParams(); // Ambil ID dari URL

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.g(`/hotels/${id}`);
        setHotel(res.data);
        setInfo(res.data);
        setRooms(res.data.rooms || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchHotel();
  }, [id]);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let list = [];
      if (files.length > 0) {
        list = await Promise.all(
          Object.values(files).map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "upload");
            const uploadRes = await axios.post(
              "https://api.cloudinary.com/v1_1/dicsirrb7/image/upload",
              data
            );

            const { url } = uploadRes.data;
            return url;
          })
        );
      }

      const updatedHotel = {
        ...info,
        rooms,
        ...(list.length > 0 && { photos: list }), // Update foto jika ada
      };

      await axios.put(`/hotels/${id}`, updatedHotel);
      alert("Hotel updated successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="update">
      <Sidebar />
      <div className="updateContainer">
        <Navbar />
        <div className="top">
          <h1>Update Hotel</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files.length > 0
                  ? URL.createObjectURL(files[0])
                  : hotel?.photos?.[0] || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

              {hotel &&
                Object.keys(info).map((key) => (
                  <div className="formInput" key={key}>
                    <label>{key}</label>
                    <input
                      id={key}
                      value={info[key]}
                      onChange={handleChange}
                      type="text"
                      placeholder={`Enter ${key}`}
                    />
                  </div>
                ))}
              <button onClick={handleClick}>Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateHotel;