import "./featured.css"
import useFetch from "../../hooks/useFetch"
import { useNavigate } from "react-router-dom"

const Featured = () => {
    const navigate = useNavigate()
    const { data, loading, error } = useFetch(
    "/api/hotels/countByCity?cities=newyork,california,hawaii"
    )

    const handleCityClick = (city) => {
    navigate("/hotels", { state: { destination: city } })
    }

    return (
    <div>
        {loading ? (
        "Loading please wait"
        ) : error ? (
        <div className="error">Error: {error.message}</div>
        ) : (
        <div className="featured">
            <div
            className="featuredItem"
            onClick={() => handleCityClick("NewYork")}
            >
            <img
                src="https://cf.bstatic.com/xdata/images/city/600x600/688189.jpg?k=f1e882ea63a9ac9b680d43ba379069f878951bdcbb2ea53bdcd6b05d524de87a&o="
                alt=""
                className="featuredImg"
            />
            <div className="featuredTitles">
                <h1>New York</h1>
                <h2>{data[0]} properties</h2>
            </div>
            </div>
            <div
            className="featuredItem"
            onClick={() => handleCityClick("California")}
            >
            <img
                src="https://cf.bstatic.com/xdata/images/city/600x600/688158.jpg?k=b8f1f71a222042bccae5226bf2499d4c0004282ef74be158c9a85c2679b4b634&o="
                alt=""
                className="featuredImg"
            />
            <div className="featuredTitles">
                <h1>California</h1>
                <h2>{data[1]} properties</h2>
            </div>
            </div>
            <div
            className="featuredItem"
            onClick={() => handleCityClick("Hawaii")}
            >
            <img
                src="https://cf.bstatic.com/xdata/images/city/600x600/688136.jpg?k=62ebfac2c20bd63f27dae839e078563e56a9681c29c6633b0b9c7fbd4aa9c6ba&o="
                alt=""
                className="featuredImg"
            />
            <div className="featuredTitles">
                <h1>Hawaii</h1>
                <h2>{data[2]} properties</h2>
            </div>
            </div>
        </div>
        )}
    </div>
    )
}

export default Featured