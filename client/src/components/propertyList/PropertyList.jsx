import useFetch from "../../hooks/useFetch"
import "./propertyList.css"

const PropertyList = () => {
    const { data, loading, error } = useFetch("/api/hotels/countByType")
    
    const images = [
        "https://cf.bstatic.com/xdata/images/hotel/square600/325397189.jpg?k=e788b2b0d197a00c951413937a61d56ee227c825636b2375e814c766086adff5&o=",
        "https://cf.bstatic.com/xdata/images/hotel/square600/133935186.jpg?k=24713eb52d9139a1d0b78821fc33b2e96857a642bc49a3e84e0cd525b194618e&o=",
        "https://cf.bstatic.com/xdata/images/hotel/square600/133935186.jpg?k=24713eb52d9139a1d0b78821fc33b2e96857a642bc49a3e84e0cd525b194618e&o=",
        "https://cf.bstatic.com/xdata/images/hotel/square600/133935186.jpg?k=24713eb52d9139a1d0b78821fc33b2e96857a642bc49a3e84e0cd525b194618e&o=",
        "https://cf.bstatic.com/xdata/images/hotel/square600/133935186.jpg?k=24713eb52d9139a1d0b78821fc33b2e96857a642bc49a3e84e0cd525b194618e&o="
    ]

    return (
        <div className="pList">
            { loading ? ("loading") : (<>
            { data && images.slice(0, data.length).map((img, i) => (
                <div className="pListItem" key={i}>
                <img src={img} alt="" className="pListImg" />
                <div className="pListTitles">
                    <h1>{data[i]?.type}</h1>
                    <h2>{data[i]?.count} {data[i]?.type}</h2>
                </div>
            </div>))}
        </>)}
        </div>
    )
}

export default PropertyList