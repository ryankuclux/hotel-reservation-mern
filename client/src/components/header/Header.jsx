import "./header.css"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBed, faPerson } from "@fortawesome/free-solid-svg-icons"
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons"
import { SearchContext } from "../../context/SearchContext.jsx"
import { AuthContext } from "../../context/AuthContext.jsx"
import { DateRange } from "react-date-range"
import { format } from "date-fns"
import { useNavigate, useLocation } from "react-router-dom"
import { useContext, useState } from "react"

const Header = ({ type }) => {
  const [destination, setDestination] = useState("")
  const [openDate, setOpenDate] = useState(false)
  const [openOptions, setOpenOptions] = useState(false)
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    }
  ])
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1
  })
  const navigate = useNavigate()
  const location = useLocation()

  const { user, dispatch } = useContext(AuthContext)
  const { dispatch: searchDispatch } = useContext(SearchContext)

  useState(() => {
    if (location.state?.destination) {
      setDestination(location.state.destination)
    }
  }, [location.state])

  const handleOption = (name, operation) => {
    setOptions((prev) => {

      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1
      }
    })
  }

  const handleSearch = () => {
    searchDispatch({
      type: "NEW_SEARCH",
      payload: { destination, dates, options }
    })

    navigate("/hotels", { state: { destination, dates, options } })
  }

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className="headerList">
          <div className="headerListItem active">
            <FontAwesomeIcon icon={faBed} />
            <span>Stays</span>
          </div>
        </div>
        {type !== "list" && (
          <>
            <h1 className="headerTitle">Find Your Stay, Enjoy Your Day!</h1>
            <p className="headerDesc">
              Find your perfect room easily with FindMyRoom. A wide range of
              accommodations is ready to make your trip more comfortable and
              enjoyable. Find your stay, enjoy your day!
            </p>
            {user ? <div className="headerItem"></div> : <></>}
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="headerSearchInput"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="headerSearchText"
                >{`${format(dates[0].startDate, "MM-dd-yyyy")} to ${format(
                  dates[0].endDate,
                  "MM-dd-yyyy"
                )} `}</span>
                {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    moveRangeOnFirstSelection={false}
                    ranges={dates}
                    minDate={new Date()}
                    onChange={(item) => setDates([item.selection])}
                    className="date"
                  />
                )}
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="headerSearchText"
                >
                  {`${options.adult} adult • ${options.children} children • ${options.room}`}{" "}
                  room
                </span>
                {openOptions && (
                  <div className="options">
                    <div className="optionItem">
                      <span className="optionText">Adult</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.adult <= 1}
                          onClick={() => handleOption("adult", "d")}
                          className="optionCounterButton"
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.adult}
                        </span>
                        <button
                          onClick={() => handleOption("adult", "i")}
                          className="optionCounterButton"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Children</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.children <= 0}
                          onClick={() => handleOption("children", "d")}
                          className="optionCounterButton"
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.children}
                        </span>
                        <button
                          onClick={() => handleOption("children", "i")}
                          className="optionCounterButton"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Room</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.room <= 1}
                          onClick={() => handleOption("room", "d")}
                          className="optionCounterButton"
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.room}
                        </span>
                        <button
                          onClick={() => handleOption("room", "i")}
                          className="optionCounterButton"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="headerSearchItem">
                <button onClick={handleSearch}> className="headerBtn"
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Header