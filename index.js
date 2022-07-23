const fs = require("fs");
const http = require("http");
var requests = require("requests");

const replaceValue = (tempVal, orgVal) =>{
    let temperature = tempVal.replace("{%tempVal%}", (orgVal.main.temp-273.15).toString().slice(0,5));
    temperature = temperature.replace("{%tempMinVal%}", (orgVal.main.temp_min-273.15).toString().slice(0,5));
    temperature = temperature.replace("{%tempMaxVal%}", (orgVal.main.temp_max-273.15).toString().slice(0,5));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);

    return temperature;
}

const homeFile = fs.readFileSync("home.html", "utf-8");
let server = http.createServer((req, res) => {
    if(req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Kota&appid=93c670a251d24678eacbdc127edaecdd")
        .on("data", (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            // console.log(arrData[0].main.temp);
            const realTimeData = arrData.map(val => replaceValue(homeFile, val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }
    
});

server.listen(4000,"127.0.0.1");