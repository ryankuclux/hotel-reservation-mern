import "./hotel.css"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import MailList from "../../components/mailList/MailList"
import Footer from "../../components/footer/Footer"
import Reserve from "../../components/reserve/Reserve.jsx"
import useFetch from "../../hooks/useFetch.js"
import { SearchContext } from "../../context/SearchContext.jsx"
import { AuthContext } from "../../context/AuthContext.jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCircleArrowLeft,
    faCircleArrowRight,
    faCircleXmark,
    faLocationDot
} from "@fortawesome/free-solid-svg-icons"
import { useLocation, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"

const Hotel = () => {
    const [sliderNumber, setSliderNumber] = useState(0)
    const [open, setOpen] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    const id = location.pathname.split("/")[2]

    const { dates, options } = useContext(SearchContext)
    const { user } = useContext(AuthContext)
    const { data, loading, error } = useFetch(`/api/hotels/find/${id}`)

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24

    function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime())
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY)

    return diffDays
    }

    const days =
    dates?.length > 0 && dates[0].startDate && dates[0].endDate
        ? dayDifference(new Date(dates[0].endDate), new Date(dates[0].startDate))
        : 0

    const handleOpen = (i) => {
    setSliderNumber(i)

    setOpen(true)
    }

    const handleMove = (direction) => {
    let newSlideNumber

    if (direction === "l") {
        newSlideNumber = sliderNumber === 0 ? 5 : sliderNumber - 1
    } else {
        newSlideNumber = sliderNumber === 5 ? 0 : sliderNumber + 1
    }

    setSliderNumber(newSlideNumber)
    }

    const handleClick = () => {
    if (user) {
        setOpenModal(true)
    } else {
        navigate("/login")
    }
    }

    return (
    <div>
        <Navbar />
        <Header type="list" />
        {loading ? (
        "loading"
        ) : (
        <div className="hotelContainer">
            {open && (
            <div className="slider">
                <FontAwesomeIcon
                icon={faCircleXmark}
                onClick={() => setOpen(false)}
                className="close"
                />
                <FontAwesomeIcon
                icon={faCircleArrowLeft}
                onClick={() => handleMove("l")}
                className="arrow"
                />
                <div className="sliderWrapper">
                <img
                    src={data.photos[sliderNumber]}
                    alt=""
                    className="sliderImg"
                />
                </div>
                <FontAwesomeIcon
                icon={faCircleArrowRight}
                onClick={() => handleMove("r")}
                className="arrow"
                />
            </div>
            )}
            <div className="hotelWrapper">
            <h1 className="hotelTitle">{data.name}</h1>
            <div className="hotelAddress">
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{data.address}</span>
            </div>
            <span className="hotelDistance">
                Excellent location - {data.distance}m from center
            </span>
            <span className="hotelPriceHighlight">
                Book a stay over ${data.cheapestPrice} at this property and get a
                free airport taxi
            </span>
            <div className="hotelImages">
                {data.photos?.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                    <img
                    src={photo}
                    alt=""
                    onClick={() => handleOpen(i)}
                    className="hotelImg"
                    />
                </div>
                ))}
            </div>
            <div className="hotelDetails">
                <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data.title}</h1>
                <p className="hotelDesc">{data.desc}</p>
                </div>
                <div className="hotelDetailsPrice">
                <h1>Perfect for a {days}-night stay!</h1>
                <span>
                    Located in the real heart of Krakow, this property has an
                    excellent location score of 9.8!
                </span>
                <button onClick={handleClick}>Reserve or Book Now!</button>
                </div>
            </div>
            </div>
            <MailList />
            <Footer />
        </div>
        )}
        {openModal && <Reserve setOpen={setOpenModal} hotelId={id} />}
    </div>
    )
}

export default Hotel