import "./featuredProperties.css"
import useFetch from "../../hooks/useFetch"
import { Link } from "react-router-dom"

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch(
    "/api/hotels?featured=true&limit=4"
  )

  return (
    <div className="fp">
      {loading ? (
        "loading"
      ) : (
        <>
          {data.map((item) => (
            <div className="fpItem" key={item._id}>
              <Link
                to={`/hotels/${item._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img src={item.photos[0]} alt="" className="fpImg" />
                <div className="fpName">{item.name}</div>
                <div className="fpCity">{item.city}</div>
                <div className="fpPrice">
                  Starting from ${item.cheapestPrice}
                </div>
                {item.rating && (
                  <div className="fpRating">
                    <button>{item.rating}</button>
                    <span>Excellent</span>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default FeaturedProperties