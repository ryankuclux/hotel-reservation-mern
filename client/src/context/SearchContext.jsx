import { createContext, useReducer, useEffect } from "react"

const INITIAL_STATE = {
    city: undefined,
    dates: [],
    options: {
    adult: undefined,
    children: undefined,
    room: undefined
    }
}

export const SearchContext = createContext(INITIAL_STATE)

const SearchReducer = (state, action) => {
    switch (action.type) {
    case "NEW_SEARCH":
        return action.payload
    case "RESET_SEARCH":
        return INITIAL_STATE
    default:
        return state
    }
}

export const SearchContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE)

    useEffect(() => {
    const storedSearchData = localStorage.getItem("searchData")
    if (storedSearchData) {
        const parsedData = JSON.parse(storedSearchData)

        if (parsedData.dates && parsedData.dates.length > 0) {
        parsedData.dates = parsedData.dates.map((date) => ({
            startDate: new Date(date.startDate),
            endDate: new Date(date.endDate)
        }))
        }

        dispatch({ type: "NEW_SEARCH", payload: parsedData })
    }
    }, []);

    useEffect(() => {
    const saveData = {
        ...state,
        dates: state.dates.map((date) => ({
        startDate: date.startDate.toISOString(),
        endDate: date.endDate.toISOString()
        }))
    }

    localStorage.setItem("searchData", JSON.stringify(saveData))
    }, [state])

    return (
    <SearchContext.Provider
        value={{
        city: state.city,
        dates: state.dates,
        options: state.options,
        dispatch
        }}
    >
        {children}
    </SearchContext.Provider>
    )
}