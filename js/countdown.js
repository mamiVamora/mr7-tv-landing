// Countdown Timer Logic
document.addEventListener('DOMContentLoaded', () => {
    // Set the date we're counting down to (e.g., 3 days from now)
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 3); // Adds 3 days
    
    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the elements
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl && hoursEl && minutesEl && secondsEl) {
            daysEl.innerText = days < 10 ? "0" + days : days;
            hoursEl.innerText = hours < 10 ? "0" + hours : hours;
            minutesEl.innerText = minutes < 10 ? "0" + minutes : minutes;
            secondsEl.innerText = seconds < 10 ? "0" + seconds : seconds;
        }

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(timer);
            document.querySelector(".countdown-timer").innerHTML = "<div class='timer-item' style='width:100%'><span class='timer-number'>انتهى العرض</span></div>";
        }
    }, 1000);
});
