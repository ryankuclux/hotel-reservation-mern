import App from "./App.jsx"
import { SearchContextProvider } from "./context/SearchContext.jsx"
import { AuthContextProvider } from "./context/AuthContext.jsx"
import ReactDOM from "react-dom/client"
import React from "react"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SearchContextProvider>
        <App />
      </SearchContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
)