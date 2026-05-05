"use strict";

const currentConditions = ["conditions", "humidity", "temp", "visibility", "precipprob"];
const weatherIconRules = [
    { pattern: /clear|sunny/i, icon: "./images/sunny.png" },
    { pattern: /partly|cloudy/i, icon: "./images/partly-cloudy.png" },
    { pattern: /rain/i, icon: "./images/rainy.png" },
    { pattern: /overcast/i, icon: "./images/cloudy.png" },
    { pattern: /thunder|storm/i, icon: "./images/stormy.png" },
    { pattern: /snow/i, icon: "./images/snowy.png" },
    { pattern: /fog/i, icon: "./images/foggy.png" },
    { pattern: /wind/i, icon: "./images/windy.png" }
];

const bg = document.getElementById("alert-background");
const input = document.getElementById("location");
const closeBtn = document.getElementById("close-btn");

function showAlert(message) {
    bg.style.display = "block";
    
    const alert_msg = document.getElementById("alert-msg");
    alert_msg.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = message;
    alert_msg.appendChild(p);

    setTimeout(() => {
        bg.style.display = "none";
    }, 2000);
}

function handleCloseAlert() {
    bg.style.display = "none";
}

(function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // getCurrentPosition asks the browser for the user's location
            (position) => {
                // successCallback
                // this function runs if location is successfully retrieved.
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const location = `${latitude},${longitude}`;
                fetchData(location);
            },
            (error) => {
                // errorCallback
                // this function runs if something goes wrong
                showAlert("Location access denied. Please enter location manually.");
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    const currentDateTime = new Date();
    document.getElementById("current-day").innerHTML = currentDateTime.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    document.getElementById("current-time").innerHTML = currentDateTime.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
})();

function updateText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function displayCurrentConditions(data) {
    currentConditions.forEach(key => {
        updateText(key, data[key]);
    });
}

function updateWeatherIcon(conditions) {
    const icon = document.getElementById("weather-icon");

    const match = weatherIconRules.find(rule =>
        rule.pattern.test(conditions)
    );

    icon.src = match ? match.icon : "./images/cloudy.png";
}

function displayHourly(hours) {
    const twentyfourcontainer = document.getElementById("twentyfour-hour");
    const today = new Date().toLocaleDateString("en-CA");

    hours.forEach(hourData => {
        const dateObj = new Date(`${today}T${hourData.datetime}`);

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
    updateText("timezone", data.timezone);
    displayCurrentConditions(data.currentConditions);
    updateWeatherIcon(data.currentConditions.conditions);
    displayHourly(data.days[0].hours);
}

async function fetchData(location) {
    if (location==="") {
        showAlert("Enter a location to get its weather!");
        return;
    } else {        
        try{
            const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=4TUZ9ERUN2ZP6N54MDMAQSUGU&contentType=json`);
            if (!response.ok) {
                throw new Error("Could not fetch data!");
            }
            const data = await response.json();
            displayData(data);
        }catch(error){
            showAlert("Location not found. Please try again!");
            console.log(error);
        }
    }
}

document.getElementById("weatherForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    fetchData(input.value.trim());
});

input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
        closeBtn.style.opacity = "80%";
        closeBtn.style.cursor = "pointer";
    } else {
        closeBtn.style.opacity = "0%";
    }
});

function handleClear() {
    input.value = "";
    closeBtn.style.opacity = "0%";
}