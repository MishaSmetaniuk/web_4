document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("myModal");
    let closeAdvBtn = document.getElementById("closeAdvBtn");
    let advertismentTimer = document.getElementById("advertismentTimer");
  
    setTimeout(function() {
        modal.style.display = "block";
        startTimer();
    }, 10000);

    closeAdvBtn.onclick = function() {
      modal.style.display = "none";
    }
  
    function startTimer() {
        let remainTime = 5; 
    
        let intervalId = setInterval(function() {
            advertismentTimer.innerHTML = "Advertisement closes in " + remainTime + " seconds.";
    
            if (remainTime <= 0) {
                clearInterval(intervalId); 
                advertismentTimer.innerHTML = "Advertisement closed.";
                setInterval(function() {
                    modal.style.display = "none";
                }, 1000);
            }
    
            remainTime--;
        }, 1000); 
    } 
  });
  
  
  