const path = require("path");
const fs = require("fs");

const dirPath = path.join(__dirname, "../src/data/world/history");
let datalist = [];
let chartdata = [];
const getWorldData = async () => {
    await fs.readdir(dirPath, async (err, files) => {
        if (err) console.log("Failed to get world data")
        await files.forEach((file, i) => {
            let dayData;
            fs.readFile(`${dirPath}/${file}`, "utf8", (err, contents) => {
                const cases = contents.split(",")[0].split(":")[1];
                const deaths = contents.split(",")[1].split(":")[1];
                const date = contents.split(",")[2].split(":")[1].replace(/}]/, "").replace(/"/g, "");
                const id = new Date(date).getTime() / 1000;
                dayData = {
                    cases: cases,
                    deaths: deaths,
                    date: date,
                    id: id
                }
                datalist.push(dayData);
                if (i === files.length - 1) {
                    //console.log(new Date(datalist[0].date).getTime() / 1000)
                    const sortedList = datalist.sort((a,b) => {
                        return a.id > b.id ? 1 : -1;
                    });
                    let data = JSON.stringify(sortedList);
                    fs.writeFileSync("src/data/chart/chartdata.json", data)
                }
            })
        })
    });
    // setTimeout(() => {
    //     console.log(chartdata);
    // }, 2000)
    
}

getWorldData();