const puppeteer = require('puppeteer');
const fetch = require("node-fetch");
const fs = require("fs");

const yesterdayCountryData = require("../src/data/country/history/covid19200320.json");
const yesterdayProvinceData = require("../src/data/province/history/covid19200320.json")
//const url = "https://ourworldindata.org/coronavirus";
const url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-21-2020.csv";

const getAllData = async () => {
    let covid19Data = [];
    let covid19DataArray = [];
    await fetch(url).then(response => {
        return response.text();
    }).then(async(data) => {
        let rows = await data.split("\n").slice(1);
        try {
            await rows.forEach((row) => {
                let countryData = {};
                let datestring;
                let country = row.split(",");
                if (row.split(",").length === 8) {
                    datestring = country[2].split("T")[0]
                    countryData = {
                        province: country[0],
                        country: country[1],
                        updated: datestring,
                        confirmed: country[3],
                        deaths: country[4],
                        recovered: country[5],
                        latitude: country[6],
                        longitude: country[7]
                    }
                } else {
                    datestring = country[3].split("T")[0]
                    countryData = {
                        province: country[0],
                        country: `${country[1].replace(/"/, "")}, ${country[2].replace(/"/, "")}`,
                        updated: datestring,
                        confirmed: country[4],
                        deaths: country[5],
                        recovered: country[6],
                        latitude: country[7],
                        longitude: country[8]
                    }
                }
                
                covid19Data.push(countryData)  
            })
        } catch {
            console.log("Cannot read property `split` of undefined")
        }
        
        covid19DataArray = await JSON.stringify(covid19Data);
        await fs.writeFileSync("src/covid19.json", covid19DataArray);  
        await fs.writeFileSync("src/data/all/history/covid19200321.json", covid19DataArray);  
    })
    return covid19Data
}

const getCountryList = async () => {
    let countries = [];
    await fetch(url).then(response => {
        return response.text();
    }).then(async(data) => {
        let rows = await data.split("\n").slice(1);
        try {
            await rows.forEach((row, i) => {
                let country = row.split(",");
                if (row.split(",").length === 8) {
                    if (!countries.includes(country[1])) {
                        countries.push(country[1])
                    }
                } else {
                    if (!countries.includes(`${country[1].replace(/"/, "")}, ${country[2].replace(/"/, "")}`)) {
                        countries.push(`${country[1].replace(/"/, "")}, ${country[2].replace(/"/, "")}`)
                    }    
                }
            })
        } catch {
            console.log("Oh noes!")
        }
    })
    return countries
}
const getProvinceList = async () => {
    let provinces = [];
    await fetch(url).then(response => {
        return response.text();
    }).then(async(data) => {
        let rows = await data.split("\n").slice(1);
        try {
            await rows.forEach((row, i) => {
                let country = row.split(",");
                if (country[0] !== "") {
                    if (!provinces.includes(country[0])) {
                        provinces.push(country[0])
                    }
                } 
            })
        } catch {
            console.log("Oh noes!")
        }
    })
    return provinces
}

const getCountryData = async() => {
    let countryData = [];
    let countryDataArray = []
    let countries = await getCountryList()
    let allData = await getAllData();
    await countries.forEach(async(nation) => {
        let confirmedCount = 0;
        let deathCount = 0;
        let updatedDate = "";
        try {
            for (let country of allData) {
                if (nation === country.country) {
                    confirmedCount = confirmedCount + Number(country.confirmed);
                    deathCount = deathCount + Number(country.deaths);
                    updatedDate = country.updated;
                }
            }
            await countryData.push({
                country: nation,
                confirmed: confirmedCount,
                deaths: deathCount,
                updated: updatedDate
            })
        } catch {
            console.log("Prolly bad")
        }
    })
    // countryDataArray = JSON.stringify(countryData);
    // fs.writeFileSync("src/data/country/covid19.json", countryDataArray);    
    // fs.writeFileSync("src/data/country/history/covid19200320.json", countryDataArray); 
    return countryData;   
}

const getProvinceData = async() => {
    let provinceData = [];
    let provinceDataArray = []
    let provinces = await getProvinceList()
    let allData = await getAllData();
    await provinces.forEach(async(province) => {
        let confirmedCount = 0;
        let deathCount = 0;
        let updatedDate = "";
        let nation;
        try {
            for (let country of allData) {
                if (province === country.province) {
                    confirmedCount = confirmedCount + Number(country.confirmed);
                    deathCount = deathCount + Number(country.deaths);
                    nation = country.country;
                    updatedDate = country.updated;
                }
            }
            await provinceData.push({
                province: province,
                country: nation,
                confirmed: confirmedCount,
                deaths: deathCount,
                updated: updatedDate
            })
        } catch {
            console.log("Prolly bad")
        }
    })
    // provinceDataArray = JSON.stringify(provinceData);
    // fs.writeFileSync("src/data/province/covid19.json", provinceDataArray);    
    // fs.writeFileSync("src/data/province/history/covid19200320.json", provinceDataArray);
    return provinceData;    
}

const getWorldTotal = async() => {
    let total = await getAllData();
    let worldData = []
    let totalConfirmedCount = 0;
    let totalDeathCount = 0;
    for (let item of total) {
        totalConfirmedCount = totalConfirmedCount + Number(item.confirmed)
    };
    for (let elem of total) {
        totalDeathCount = totalDeathCount + Number(elem.deaths)
    }
    const worldTotal = {
        totalConfirmedCases: totalConfirmedCount,
        totalDeaths: totalDeathCount
    }
    worldData.push(worldTotal)
    let worldDataArray = JSON.stringify(worldData)
    fs.writeFileSync("src/data/world/worldtotal.json", worldDataArray)
    fs.writeFileSync("src/data/world/history/worldtotal200321.json", worldDataArray)
}
const makeCountryDataFile = async () => {
    const oldCountryData = await yesterdayCountryData;
    const countries = await getCountryData();
    let countryCasesArray = [];
    let stringyCountryCasesArray = [];
    await countries.forEach(nation => {
        let newCases = 0;
        try {
            for (let country of oldCountryData) {
                if (nation.country === country.country) {
                    newCases = Number(nation.confirmed) - Number(country.confirmed)
                }
            }
        } catch {
            console.log("Failed to match country data")
        }
        countryCasesArray.push({
            country: nation.country,
            confirmed: nation.confirmed,
            deaths: nation.deaths,
            updated: nation.updated,
            newCases: newCases
        })
    })
    stringyCountryCasesArray = JSON.stringify(countryCasesArray);
    fs.writeFileSync("src/data/country/covid19.json", stringyCountryCasesArray);    
    fs.writeFileSync("src/data/country/history/covid19200321.json", stringyCountryCasesArray);
}
const makeProvinceDataFile = async () => {
    const oldProvinceData = await yesterdayProvinceData;
    const provinces = await getProvinceData();
    let provinceCasesArray = [];
    let stringyProvinceCasesArray = [];
    await provinces.forEach(province => {
        let newCases = 0;
        try {
            for (let country of oldProvinceData) {
                if (province.province === country.province) {
                    newCases = Number(province.confirmed) - Number(country.confirmed)
                }
            }
        } catch {
            console.log("Failed to match country data")
        }
        provinceCasesArray.push({
            province: province.province,
            country: province.country,
            confirmed: province.confirmed,
            deaths: province.deaths,
            updated: province.updated,
            newCases: newCases
        })
    })
    stringyProvinceCasesArray = JSON.stringify(provinceCasesArray);
    fs.writeFileSync("src/data/province/covid19.json", stringyProvinceCasesArray);    
    fs.writeFileSync("src/data/province/history/covid19200321.json", stringyProvinceCasesArray);
}
// getCountryData();
// getProvinceData();
getWorldTotal();
makeCountryDataFile();
makeProvinceDataFile();

//getAllData();
// async function scraper() {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url);
//     await page.waitForSelector(".location", {
//         visible: true,
//     });
//     await page.evaluate(async () => {
//         let locations = [];
//         let doublingDays = [];
//         let totalCases = [];
//         let newCases = [];
//         let data = [];
//         let locationtd = await document.getElementById("covid-table-embed").getElementsByTagName("tbody")[0].getElementsByTagName("tr").length
//         for (let i=0; i<locationtd; i++) {
//             locations.push(document.getElementById("covid-table-embed").getElementsByTagName("tbody")[0].getElementsByClassName("location")[i].innerText)
//         }
//         for (let i=0; i<locationtd; i++) {
//             doublingDays.push(document.getElementById("covid-table-embed").getElementsByTagName("tbody")[0].getElementsByClassName("doubling-days")[i].getElementsByTagName("span")[1].innerText)
//         }
//         for (let i=0; i<locationtd; i++) {
//             newCases.push(document.getElementById("covid-table-embed").getElementsByTagName("tbody")[0].getElementsByClassName("new-cases")[i].getElementsByClassName("value")[0].getElementsByTagName("span")[0].innerText)
//         }
//         for (let i=0; i<locationtd; i++) {
//             totalCases.push(document.getElementById("covid-table-embed").getElementsByTagName("tbody")[0].getElementsByClassName("total-cases")[i].getElementsByClassName("value")[0].getElementsByTagName("span")[0].innerText)
//         }
//         await locations.forEach((location, index) => {
//             let countryData = {
//                 "location": location,
//                 "doubling_days": doublingDays[index],
//                 "total_cases": totalCases[index],
//                 "new_cases": newCases[index]
//             }
//             data.push(countryData)
//         });

//         return data

//     }).then(data => {
//         //console.log(data)
//         let dataList = JSON.stringify(data)
//         fs.writeFileSync("src/corona.json", dataList)
//         fs.writeFileSync("src/data/corona200320.json", dataList)
//     }).catch(console.log("Faux-Error!"))
// }

// scraper()

// await countries.forEach(async (nation) => {
//     let confirmedCount = 0;
//     let deathCount = 0;
//     await rows.forEach(row => {
//         let country = row.split(",");
//         if (row.split(",").length === 8) {
//             if (nation === country[1]) {
//                 confirmedCount = confirmedCount + country[3];
//                 deathCount = deathCount + country[4];
//             }
//         } else {
//             if (nation === `${country[1].replace(/"/, "")}, ${country[2].replace(/"/, "")}`) {
//                 confirmedCount = confirmedCount + country[4];
//                 deathCount = deathCount + country[5];
//             }
//         }
//     })
//     countryData.push({
//         country: nation,
//         confirmed: confirmedCount,
//         deaths: deathCount
//     })
// })
// setTimeout(() => {
//     console.log(countryData)
// }, 5000)


