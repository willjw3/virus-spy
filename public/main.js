const puppeteer = require('puppeteer');
const fs = require("fs")

const url = "https://ourworldindata.org/coronavirus"

async function scraper() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(".location", {
        visible: true,
    });
    await page.evaluate(async () => {
        let locations = [];
        let doublingDays = [];
        let totalCases = [];
        let newCases = [];
        let data = [];
        let locationtd = await document.getElementById("covid-table-embed").getElementsByTagName("tbody")[0].getElementsByTagName("tr").length
        for (let i=0; i<locationtd; i++) {
            locations.push(document.getElementById("covid-table-embed").getElementsByTagName("tbody")[0].getElementsByClassName("location")[i].innerText)
        }
        for (let i=0; i<locationtd; i++) {
            doublingDays.push(document.getElementById("covid-table-embed").getElementsByTagName("tbody")[0].getElementsByClassName("doubling-days")[i].getElementsByTagName("span")[1].innerText)
        }
        for (let i=0; i<locationtd; i++) {
            newCases.push(document.getElementById("covid-table-embed").getElementsByTagName("tbody")[0].getElementsByClassName("new-cases")[i].getElementsByClassName("value")[0].getElementsByTagName("span")[0].innerText)
        }
        for (let i=0; i<locationtd; i++) {
            totalCases.push(document.getElementById("covid-table-embed").getElementsByTagName("tbody")[0].getElementsByClassName("total-cases")[i].getElementsByClassName("value")[0].getElementsByTagName("span")[0].innerText)
        }
        await locations.forEach((location, index) => {
            let countryData = {
                "location": location,
                "doubling_days": doublingDays[index],
                "total_cases": totalCases[index],
                "new_cases": newCases[index]
            }
            data.push(countryData)
        });

        return data

    }).then(data => {
        //console.log(data)
        let dataList = JSON.stringify(data)
        fs.writeFileSync("src/corona.json", dataList)
        fs.writeFileSync("src/data/corona200319.json", dataList)
    }).catch(console.log("Faux-Error!"))
}

scraper()


