"use strict";

const currentConditions = ["conditions", "humidity", "temp", "visibility", "precipprob"];

const weatherIcons = {
    "clear": "./images/sunny.png",
    "sunny": "./images/sunny.png",
    "partly cloudy": "./images/partly-cloudy.png",
    "cloudy": "./images/cloudy.png",
    "overcast": "./images/cloudy.png",
    "rain": "./images/rainy.png",
    "rainy": "./images/rainy.png",
    "showers": "./images/rainy.png",
    "thunderstorm": "./images/stormy.png",
    "storm": "./images/stormy.png",
    "snow": "./images/snowy.png",
    "fog": "./images/foggy.png",
    "wind": "./images/windy.png"
};

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

function updateText(id, value) {
    const element = document.getElementById(id);
    element.textContent = value;
}

function displayCurrentConditions(data) {
    currentConditions.forEach(key => {
        updateText(key, data[key]);
    });
}

function displayHourly(hours) {
    const twentyfourcontainer = document.getElementById("twentyfour-hour");
    const hour = new Date().toISOString().split("T")[0];

    hours.forEach(hourData => {
        const dateObj = new Date(`${hour}T${hourData.datetime}`);

        const hourElement = document.createElement("h4");
        hourElement.textContent = dateObj.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

        twentyfourcontainer.appendChild(hourElement);

        currentConditions.forEach(key => {
            const p = document.createElement("p");
            p.textContent = `${key==="precipprob"?"Chances of Rain":key} ${hourData[key]}`;
            twentyfourcontainer.appendChild(p);
        });
    });
}

function displayData(data) {
    const { latitude, longitude, resolvedAddress, currentConditions, days, timezone } = data;

    updateText("latitude", latitude);
    updateText("longitude", longitude);
    updateText("resolvedAddress", resolvedAddress);
    updateText("timezone", timezone);

    displayCurrentConditions(currentConditions);

    updateWeatherIcon(currentConditions.conditions);

    displayHourly(days[0].hours);
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

const input = document.getElementById("location");
const closeBtn = document.getElementById("close-btn");

input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
        closeBtn.style.opacity = "80%";
    } else {
        closeBtn.style.opacity = "0%";
    }
});

function handleClear() {
    input.value = "";
    closeBtn.style.opacity = "0%";
    location.reload();
}

function updateWeatherIcon(condition) {
    const icon = document.getElementById("weather-icon");

    if (!condition) return;

    const key = condition.toLowerCase();

    for (let k in weatherIcons) {
        if (key.includes(k)) {
            icon.src = weatherIcons[k];
            return;
        }
    }

    icon.src = "./images/cloudy.png";
}