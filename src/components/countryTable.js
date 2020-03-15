import React, {useState, useEffect} from 'react';
import Card from "../components/card"
import CoronaData from "../corona.json"
import '../styles/country-table.scss';

function CountryTable() {
  //console.log(CoronaData)
  const month = new Date().getMonth() + 1;
  console.log(month)
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [doublingDays, setDoublingDays] = useState("")
  const [totalCases, setTotalCases] = useState("")
  const [newCases, setNewCases] = useState("")
  const [message, setMessage] = useState("")
  const [show, setShow] = useState(false)

  const inputHandler = (e) => {
    setSearchTerm(e.target.value.toLowerCase())
  }
  const showDataCard = () => {
      setShow(true)
  }
  const hideDataCard = () => {
      setShow(false)
      setLocation("")
  }
  const submitHandler = async(e) => {
      e.preventDefault()
      await CoronaData.forEach((item, index) => {
          if (searchTerm === item.location.toLowerCase()) {
              setMessage("")
              setLocation(item.location)
              setDoublingDays(item.doubling_days)
              setTotalCases(item.total_cases)
              setNewCases(item.new_cases)
          } else {
              setMessage("No data found for the search term you entered.")
          }
      })
      showDataCard()
      setSearchTerm("")
      
  }

  console.log(searchTerm)
  return (
    <div className="country-table">
        <form className="form-group" onSubmit={submitHandler}>
            <label htmlFor="">Search By Country/Region</label>
            <input 
                type="text" 
                value={searchTerm} 
                placeholder="Enter country/region name"
                onChange={inputHandler}
            />
            <button type="submit">Submit</button>
        </form>
        <Card show={show} handleClose={hideDataCard}>
            {location && <div>
                <small>As of {new Date().getUTCMonth()+1}/{new Date().getDate()}</small>
                <h3>Country/Region: {location}</h3>
                <p>Cases doubled in {doublingDays}</p>
                <p>Total cases: {totalCases}</p>
                <p>New cases today: {newCases}</p>
            </div>
            }
            {!location && <div>{message}</div> }
            
        </Card>
      <div className="table-row">
        <h3 className="table-heading">Country/Region</h3>
        <h3 className="table-heading">Total Case Doubling Time</h3>
        <h3 className="table-heading">Total Cases</h3>
        <h3 className="table-heading">New Cases</h3>
      </div>
      <hr/>
      {CoronaData.map((country, i) => {
        return (
          <div className="row-wrap">
            <div key={i} className="table-row">
              <div className="data-wrap">
                <p className="values">{country.location}</p>
              </div>
              <div className="data-wrap">
                <small>Current total doubled in</small>
                <p className="values">{country.doubling_days}</p>
              </div>
              <div className="data-wrap">
                <small>As of {new Date().getMonth() + 1}/{new Date().getUTCDate()} (UTC + 9 hrs : Tokyo)</small>
                <p className="values">{country.total_cases}</p>
              </div>
              <div className="data-wrap">
              <small>As of {new Date().getMonth() + 1}/{new Date().getUTCDate()} (UTC + 9 hrs : Tokyo)</small>
                <p className="values">{country.new_cases}</p>
              </div>
            </div>
            <hr className="table-line"/>
          </div>  
        )
      })}
    </div>
  );
}

export default CountryTable;
