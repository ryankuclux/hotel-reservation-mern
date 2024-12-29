import React, { useContext, useEffect, useState } from "react";
import "./reserve.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";

const KEY = "pk_test_51QbMGcJIZEdecxEeHYkDS9M5QBIrvMn0K3STu180mmKTBouFsZFjMxluLOq2JXIe2DkQraNRZkXWs8M8H53N6KKJ001sELoFXj"; // Publishable Key

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/api/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      allDates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;

    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();

  const handleClick = () => {
    if (selectedRooms.length === 0) {
      alert("Please select at least one room.");
    }
  };

  const onToken = async (token) => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`/api/rooms/availability/${roomId}`, {
            dates: allDates,
          });
          return res.data;
        })
      );

      // Kirim token ke backend untuk diproses
      const response = await axios.post("/api/checkout/payment", {
        tokenId: token.id,
        amount: 20000, // Ganti dengan jumlah yang seharusnya
      });

      console.log(response.data); // Tangani response dari backend

      setOpen(false);
      navigate("/");
    } catch (err) {
      console.error(err); // Tangani error dari backend, misalnya tampilkan pesan error ke user
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room" key={roomNumber._id}>
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <StripeCheckout
          name="name"
          billingAddress
          shippingAddress
          description="desc"
          amount={20000} // Ganti dengan jumlah yang seharusnya
          token={onToken}
          stripeKey={KEY}
        >
          <button onClick={handleClick} className="rButton">
            Reserve Now!
          </button>
        </StripeCheckout>
      </div>
    </div>
  );
};

export default Reserve;