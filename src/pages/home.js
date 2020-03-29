import React from "react";
import CountryTable from "../components/countryTable";
import WorldMap from "../components/worldmap"
import Header from "../components/header";
import "../styles/home.scss";


const Home = () => {
    return (
        <div className="home">
            <Header />
            {/* <WorldMap /> */}
            <CountryTable />
        </div>
    )
}

export default Home