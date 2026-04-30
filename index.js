"use strict";

function displayData(data) {
    let array = ["latitude", "longitude", "resolvedAddress", "currentConditions", "days", "timezone"];
    let array2 = ["conditions", "datetime", "humidity", "temp", "visibility", "windspeed", "precipprob"];
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
                for(let innerkey2 in data[key]){
                    if (innerkey2==="0"){
                        for(let innerkey3 in data[key][innerkey2]){
                            if (innerkey3==="hours"){
                                for(let innerkey4 in data[key][innerkey2][innerkey3]){
                                    console.log(innerkey4);
                                    for(let innerkey5 in data[key][innerkey2][innerkey3][innerkey4]){
                                        if (array2.includes(innerkey5)){
                                            document.getElementById(innerkey5+"2").innerHTML=data[key][innerkey2][innerkey3][innerkey4][innerkey5];
                                            console.log(innerkey5, data[key][innerkey2][innerkey3][innerkey4][innerkey5]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
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