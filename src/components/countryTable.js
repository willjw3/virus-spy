import React, {useState} from 'react';
import Card from "../components/card";
import CovidCountryData from "../data/country/covid19.json";
import CovidProvinceData from "../data/province/covid19.json";
import WorldTotal from "../data/world/worldtotal.json"
import '../styles/country-table.scss';

function CountryTable() {
  const [provinceSearchTerm, setProvinceSearchTerm] = useState("");
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [countrySearch, setCountrySearch] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState(false);
  const [countryShow, setCountryShow] = useState(true);
  const [provinceShow, setProvinceShow] = useState(true);
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [updated, setUpdated] = useState("");
  const [totalCases, setTotalCases] = useState("");
  const [totalDeaths, setTotalDeaths] = useState("");
  const [newCases, setNewCases] = useState("");
  //const [newDeaths, setNewDeaths] = useState("");
  const [recovered, setRecovered] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const provinceSearchHandler = () => {
    setCountrySearch(false)
    setProvinceSearch(true)
  }
  const countrySearchHandler = () => {
    setProvinceSearch(false);
    setCountrySearch(true);
  }
  const provinceHandler = (e) => {
    setProvinceSearchTerm(e.target.value.toLowerCase())
  }
  const countryHandler = (e) => {
    setCountrySearchTerm(e.target.value.toLowerCase())
  }
  const countryShowHandler = () => {
    setProvinceShow(false);
    setCountryShow(true);
  }
  const provinceShowHandler = () => {
    setCountryShow(false);
    setProvinceShow(true);
  }
  const showDataCard = () => {
      setShow(true)
  }
  const hideDataCard = () => {
      setShow(false);
      setProvince("");
      setCountry("");
      setCountrySearch(false);
      setProvinceSearch(false);
  }
  const submitProvinceHandler = async(e) => {
      e.preventDefault()
      await CovidProvinceData.forEach((item, index) => {
          if (provinceSearchTerm === item.province.toLowerCase()) {
              setMessage("");
              setProvince(item.province);
              setCountry(item.country);
              setTotalCases(item.confirmed);
              setTotalDeaths(item.deaths);
          } else {
              setMessage("No data found for the search term you entered.")
          }
      })
      showDataCard()
      setProvinceSearchTerm("")
      
  }
  const submitCountryHandler = async(e) => {
      e.preventDefault()
      await CovidCountryData.forEach((item, index) => {
          if (countrySearchTerm === item.country.toLowerCase()) {
              setMessage("");
              setCountry(item.country);
              setTotalCases(item.confirmed);
              setTotalDeaths(item.deaths);
              setUpdated(item.updated);
              setNewCases(item.newCases);
          } else {
              setMessage("No data found for the search term you entered.")
          }
      })
      showDataCard()
      setCountrySearchTerm("")
      
  }

  return (
    <div className="country-table">
      <div className="totals">
        <div className="totals-wrap">
          <h3 className="world-total">Total Confirmed Cases Worldwide: <span className="total-number">{WorldTotal[0].totalConfirmedCases}</span></h3>
          <small>{new Date().getMonth() + 1}/{new Date().getDate()}/{new Date().getFullYear()} (Tokyo: UTC + 9)</small>
        </div>
        <div className="totals-wrap">
          <h3 className="world-total">Total Deaths Worldwide: <span className="total-number">{WorldTotal[0].totalDeaths}</span></h3>
          <small>{new Date().getMonth() + 1}/{new Date().getDate()}/{new Date().getFullYear()} (Tokyo: UTC + 9)</small>
        </div> 
      </div>
      <div className="search">
        <p>Search by:</p>
        <p className="click-text" value={`province`} onClick={provinceSearchHandler}>province/state</p>
        <p className="click-text" value={`country`} onClick={countrySearchHandler}>country</p>
      </div>
      {provinceSearch && 
        <form className="form-group" onSubmit={submitProvinceHandler}>
          <label htmlFor="">Search By Province/State</label>
          <input 
              type="text" 
              value={provinceSearchTerm} 
              placeholder="Enter province/state name"
              onChange={provinceHandler}
          />
          <button type="submit">Submit</button>
        </form>
      }
      {countrySearch && 
        <form className="form-group" onSubmit={submitCountryHandler}>
          <label htmlFor="">Search By Country</label>
          <input 
              type="text" 
              value={countrySearchTerm} 
              placeholder="Enter country name"
              onChange={countryHandler}
          />
          <button type="submit">Submit</button>
        </form>
      }
      <Card show={show} handleClose={hideDataCard}>
          {country && <div>
              <h3>Province/State: {province ? province : "not given"}</h3>
              <h3>Country: {country}</h3>
              <p>Total cases: {totalCases}</p>
              <p>Total deaths: {totalDeaths}</p>
          </div>
          }
          {!country && <div>{message}</div> }
          
      </Card>
      <div className="choose-data">
        <p className="click-text" onClick={countryShowHandler}>Data by country</p>
        <p className="click-text" onClick={provinceShowHandler}>Data by province/state</p>
      </div>
          {/* <p className="date">Data for {new Date().getMonth() + 1}/{new Date().getDate() - 1}/{new Date().getFullYear()}</p> */}
      {countryShow && 
      <div>
        <div className="table-row">
          <h3 className="table-heading">Country</h3>
          <h3 className="table-heading">Total Cases</h3>
          <h3 className="table-heading">Total Deaths</h3>
        </div>
        <hr/>
        {CovidCountryData.map((country, i) => {
          return (
            <div className="row-wrap">
              <div key={i} className="table-row">
                <div className="data-wrap">
                  <p className="values">{country.country}</p>
                  <small>{new Date().getMonth() + 1}/{new Date().getDate()}/{new Date().getFullYear()} (Tokyo: UTC + 9)</small>
                </div>
                <div className="data-wrap">
                  <p className="values">{country.confirmed}</p>
                  <small>New: {country.newCases}</small>
                </div>
                <div className="data-wrap">
                  <p className="values">{country.deaths}</p>
                </div>
              </div>
              <hr className="table-line"/>
            </div>  
          )
        })}
      </div>
      }
      {provinceShow && 
      <div>
        <div className="table-row">
          <h3 className="table-heading">Province/State</h3>
          <h3 className="table-heading">Country</h3>
          <h3 className="table-heading">Total Cases</h3>
          <h3 className="table-heading">Total Deaths</h3>
        </div>
        <hr/>
        {CovidProvinceData.map((country, i) => {
          return (
            <div className="row-wrap">
              <div key={i} className="table-row">
                <div className="data-wrap">
                  <p className="values">{country.province}</p>
                  <small>{new Date().getMonth() + 1}/{new Date().getDate()}/{new Date().getFullYear()} (Tokyo: UTC + 9)</small>
                </div>
                <div className="data-wrap">
                  <p className="values">{country.country}</p>
                </div>
                <div className="data-wrap">
                  <p className="values">{country.confirmed}</p>
                  <small>New: {country.newCases}</small>
                </div>
                <div className="data-wrap">
                  <p className="values">{country.deaths}</p>
                </div>
              </div>
              <hr className="table-line"/>
            </div>  
          )
        })}
      </div>
      }
    </div>
  );
}

export default CountryTable;
