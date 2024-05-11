let displayWindow = true;
let displayWindowStorage = localStorage.getItem("displayWindow");

if (displayWindowStorage === "false") {
    displayWindow = false;
}

let nonModalWindow = document.getElementById("nonModalWindow");

setInterval(() => {
    if (displayWindow) {
        nonModalWindow.style.display = "block";
    }
}, 1000);


document.addEventListener("DOMContentLoaded", function () {
    let declineWindowBtn = document.getElementById("declineWindowBtn");
    let agreeWindowBtn = document.getElementById("agreeWindowbtn");
    
    agreeWindowBtn.addEventListener("click", function () {
        console.log("agree button clicked");
        let nonModalWindow = document.getElementById("nonModalWindow");
        nonModalWindow.style.display = "none";
        clickedAccept();
    });

    declineWindowBtn.addEventListener("click", function () {
        console.log("decline button clicked");
        let nonModalWindow = document.getElementById("nonModalWindow");
        nonModalWindow.style.display = "none";
    });
    
});


function clickedAccept() {
    displayWindow = false;
    localStorage.setItem("displayWindow", "false");
}