"use strict";

function handleUserInput(e) {
    e.preventDefault();
    let userInput = document.getElementById("location").value;
    console.log(userInput);
}
document.getElementById("weatherForm").addEventListener("submit", handleUserInput);