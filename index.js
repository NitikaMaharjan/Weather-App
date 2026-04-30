"use strict";

(function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const location = `${lat},${lon}`;
                fetchData(location);
            },
            (error) => {
                console.log("Error:", error.message);
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    const currentDateTime = new Date();
    document.getElementById("current-datetime").innerHTML = currentDateTime;
})();

function displayData(data) {
    let array = ["latitude", "longitude", "resolvedAddress", "currentConditions", "days", "timezone"];
    let array2 = ["conditions", "humidity", "temp", "visibility", "windspeed", "precipprob"];
    for(let key in data){
        if (array.includes(key)){
            if (key==="currentConditions"){
                console.log("current condiitions");
                for(let innerkey in data[key]){
                    if (array2.includes(innerkey)){
                        document.getElementById(innerkey).innerHTML=data[key][innerkey];
                        console.log(innerkey, data[key][innerkey]);
                    }
                }
            }
            if (key==="days"){
                let hours = data["days"]["0"]["hours"];

                let twentyfour = document.getElementById("twentyfour-hour");
                
                hours.forEach(hourData => {
                    // hourData is object
                    let hourNumber = document.createElement("h4");
                    console.log(hourData.datetime);
                    hourNumber.textContent = hourData.datetime;
                    twentyfour.appendChild(hourNumber);
                    array2.forEach(key => {
                        let p = document.createElement("p");
                        console.log(key, hourData[key]);
                        p.textContent = `${key==="precipprob"?"Chances of Rain":key} ${hourData[key]}`;
                        twentyfour.appendChild(p);
                    });
                });
            }
            if (key!=="currentConditions" && key!=="days"){
                document.getElementById(key).innerHTML=data[key];
                console.log(key, data[key]);
            }
        }
    }
}

async function fetchData(location) {
    try{
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=4TUZ9ERUN2ZP6N54MDMAQSUGU&contentType=json`);
        if (!response.ok) {
            throw new Error("Could not fetch data!");
        }
        const data = await response.json();
        console.log(data);
        displayData(data);
    }catch(error){
        console.log(error);
    }
}

function handleUserInput(e) {
    e.preventDefault();
    let userInput = document.getElementById("location").value;
    console.log(userInput);
    fetchData(userInput);
}
document.getElementById("weatherForm").addEventListener("submit", handleUserInput);