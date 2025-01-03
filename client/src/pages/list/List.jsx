import "./list.css"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import SearchItem from "../../components/searchIten/SearchItem"
import useFetch from "../../hooks/useFetch"
import { DateRange } from "react-date-range"
import { format } from "date-fns"
import { useLocation } from "react-router-dom"
import { useState } from "react"

const List = () => {
  const [openDate, setOpenDate] = useState(false)
  const [min, setMin] = useState(undefined)
  const [max, setMax] = useState(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [destination, setDestination] = useState(
    location.state?.destination || ""
  )
  const [dates, setDates] = useState(
    location.state?.dates || [
      { startDate: new Date(), endDate: new Date(), key: "selection" }
    ]
  )
  const [options, setOptions] = useState(
    location.state?.options || { adult: 1, children: 0, room: 1 }
  )
  const location = useLocation()
  const { data, loading, error, reFetch } = useFetch(
    `/api/hotels?city=${destination}&min=${min || 0}&max=${max || 9999999999}`
  )

  const itemsPerPage = 7

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const handleClick = () => {
    reFetch()

    setCurrentPage(1)
  }

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                placeholder={destination}
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                  dates[0].endDate,
                  "MM/dd/yyyy"
                )}`}
              </span>
              {openDate && (
                <DateRange
                minDate={new Date()}
                ranges={dates}
                onChange={(item) => setDates([item.selection])}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    placeholder={options.adult}
                    onChange={(e) =>
                      setOptions({ ...options, adult: e.target.value })
                    }
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    placeholder={options.children}
                    onChange={(e) =>
                      setOptions({ ...options, children: e.target.value })
                    }
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    placeholder={options.room}
                    onChange={(e) =>
                      setOptions({ ...options, room: e.target.value })
                    }
                    className="lsOptionInput"
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className="listResult">
            {loading ? (
              "Loading..."
            ) : error ? (
              <div className="error">Error: {error.message}</div>
            ) : paginatedData.length > 0 ? (
              <>
                {paginatedData.map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))}
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="noHotels">Hotel tidak ditemukan</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default List