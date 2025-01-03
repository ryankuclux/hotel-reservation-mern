import "./reserve.css"
import useFetch from "../../hooks/useFetch"
import { SearchContext } from "../../context/SearchContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import StripeCheckout from "react-stripe-checkout"
import axios from "axios"
import { React, useContext, useState } from "react"

const KEY = "pk_test_51QbMGcJIZEdecxEeHYkDS9M5QBIrvMn0K3STu180mmKTBouFsZFjMxluLOq2JXIe2DkQraNRZkXWs8M8H53N6KKJ001sELoFXj"

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([])
  const { dates } = useContext(SearchContext)
  const { data, loading, error } = useFetch(`/api/hotels/room/${hotelId}`)

  const navigate = useNavigate()

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const date = new Date(start.getTime())
    const dates = []

    while (date <= end) {
      dates.push(new Date(date).getTime())
      date.setDate(date.getDate() + 1)
    }

    return dates
  }

  const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate)

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      allDates.includes(new Date(date).getTime())
    )

    return !isFound
  }

  const handleSelect = (e) => {
    const checked = e.target.checked
    const value = e.target.value

    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    )
  }

  const handleClick = () => {
    if (selectedRooms.length === 0) {
      alert("Please select at least one room!")

      return
    }
  }

  const calculateTotalPrice = () => {
    let total = 0

    selectedRooms.forEach((roomId) => {
      const room = data.find((item) =>
        item.roomNumbers.some((roomNumber) => roomNumber._id === roomId)
      )

      if (room) {
        total += room.price * (dates[0].endDate - dates[0].startDate) / (1000 * 60 * 60 * 24)
      }
    })

    return total
  }

  const createTransaction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      const userId = user._id

      const transactionData = {
        userId,
        hotelId,
        roomId: selectedRooms[0],
        dates: allDates,
        amount: calculateTotalPrice()
      }

      await axios.post("/api/transactions", transactionData)
    } catch (err) {
      console.error(err)
    }
  }

  const onToken = async (token) => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) =>
          axios.put(`/api/rooms/availability/${roomId}`, { dates: allDates })
        )
      )

      await axios.post("/api/checkout/payment", {
        tokenId: token.id,
        amount: calculateTotalPrice() * 100,
      });

      await createTransaction()

      setOpen(false)

      navigate("/")
    } catch (err) {
      console.error(err)
    }
  };  

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          onClick={() => setOpen(false)}
          className="rClose"
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
                    disabled={!isAvailable(roomNumber)}
                    onChange={handleSelect}
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
          amount={calculateTotalPrice() * 100}
          token={onToken}
          stripeKey={KEY}
        >
          <button onClick={handleClick} className="rButton">
            Reserve Now!
          </button>
        </StripeCheckout>
      </div>
    </div>
  )
}

export default Reserve