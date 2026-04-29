"use strict";

async function fetchData(location) {
    try{
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=4TUZ9ERUN2ZP6N54MDMAQSUGU&contentType=json`);
        if (!response.ok) {
            throw new Error("Could not fetch data!");
        }
        const data = await response.json();
        console.log(data);
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