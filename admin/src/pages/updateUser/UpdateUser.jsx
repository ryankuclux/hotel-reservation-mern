import "./updateUser.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { userInputs } from "../../formSource";

const UpdateUser = () => {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInfo(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "upload");
    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dicsirrb7/image/upload",
        data
      );

      const { url } = uploadRes.data;

      const updatedUser = {
        ...info,
        img: url,
      };

      const token = localStorage.getItem("token");

      await axios.put(`/users/${info._id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/users");
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
          <h1>Update User</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : info.img ||
                    "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
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
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {userInputs.map((input) => (
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

              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;