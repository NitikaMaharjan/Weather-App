"use strict";

function showAlert(message) {
    let bg = document.getElementById("alert-background");
    let alert = document.getElementById("alert");

    alert.innerHTML = "";

    bg.style.display = "block";

    let p = document.createElement("p");
    p.textContent = message;

    alert.appendChild(p);
}

(function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // getCurrentPosition asks the browser for the user's location
            (position) => {
                // successCallback
                // this function runs if location is successfully retrieved.
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                let location = `${latitude},${longitude}`;
                fetchData(location);
            },
            (error) => {
                // errorCallback
                // this function runs if something goes wrong
                console.log("Error:", error.message);
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    let currentDateTime = new Date();
    document.getElementById("current-day").innerHTML = currentDateTime.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    document.getElementById("current-time").innerHTML = currentDateTime.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
})();

function displayData(data) {
    let generalWeather = ["latitude", "longitude", "resolvedAddress", "currentConditions", "days", "timezone"];
    let currentConditions = ["conditions", "humidity", "temp", "visibility", "windspeed", "precipprob"];
    for(let key in data){
        if (generalWeather.includes(key)){
            if (key==="currentConditions"){
                console.log("current conditions");
                for(let innerkey in data[key]){
                    if (currentConditions.includes(innerkey)){
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
                    
                    let today = new Date().toISOString().split("T")[0];
                    let dateObj = new Date(`${today}T${hourData.datetime}`);
                    
                    let hourNumber = document.createElement("h4");
                    hourNumber.textContent = dateObj.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
                    console.log(dateObj.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));                    

                    twentyfour.appendChild(hourNumber);
                    currentConditions.forEach(key => {
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
        showAlert("The entered location does not exists!");
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

document.getElementById("alert-background").addEventListener("click", ()=>{
    document.getElementById("alert-background").style.display="none";
    document.getElementById("location").value="";
});