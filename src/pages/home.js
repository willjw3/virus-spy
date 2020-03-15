import React from "react"
import CountryTable from "../components/countryTable"
import Header from "../components/header"
import "../styles/home.scss"


const Home = () => {
    return (
        <div className="home">
            <Header />
            <CountryTable />
        </div>
    )
}

export default Home