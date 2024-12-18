class Timer {
    constructor(timeDisplay, progressCircle, slider, logList) {
        this.log = [];
        this.timeDisplay = timeDisplay;
        this.progressCircle = progressCircle;
        this.clearInterval();
        this.slider = slider;
        this.slider.value = this.startingMinutes;
        this.setDefaultTime(30); // Set default time once during initialization
        this.updateDisplay();
        this.logList = logList;
    }

    // Set default time (in minutes) for starting and the timer
    setDefaultTime(minutes) {
        this.progressCircle.style.strokeDashoffset = 24;
        this.startingMinutes = minutes;
        this.minutes = minutes;
        this.seconds = 0;
    }

    clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    resetTimer() {
        this.setDefaultTime(this.startingMinutes);
        this.updateDisplay();
        this.clearInterval();
    }

    pause() {
        this.clearInterval();
        this.setDefaultTime(this.startingMinutes);

    }

    start() {
        if (this.interval) {
            // Prevent multiple intervals
            return;
        }
        this.interval = setInterval(() => {
            if (this.minutes === 0 && this.seconds === 0) {
                clearInterval(this.interval);
                this.interval = null;
            } else {
                this.decrementSeconds();
            }
        }, 10); // 1000
    }

    changeTime(change) {
        this.startingMinutes = Math.max(0, Math.min(60, this.startingMinutes + change));
        this.setDefaultTime(this.startingMinutes);
        this.updateDisplay();
        this.slider.value = this.startingMinutes;
        if (this.startingMinutes === 0) this.resetTimer();
    }

    decrementSeconds() {
        if (this.seconds === 0 && this.minutes > 0) {
            this.minutes--;
            this.seconds = 59;
        } 
        else {
            this.seconds--;
        }
        this.updateDisplay();
        this.updateProgressCircle(); // Update the progress circle every second
        if (this.seconds === 0 && this.minutes === 0){
            this.addToLog();
        }

    }

    updateDisplay() {
        const formattedMinutes = String(this.minutes).padStart(2, '0');
        const formattedSeconds = String(this.seconds).padStart(2, '0');
        this.timeDisplay.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
    }

    addToLog(){
        if (this.startingMinutes > 0){
            const formattedMinutes = String(this.startingMinutes).padStart(2, '0');
            const formattedSeconds = String(this.seconds).padStart(2, '0');
            this.log.push(`${formattedMinutes}:${formattedSeconds}`);
            const lastEntry = document.createElement('li');
            lastEntry.classList.add('log-entry');
            lastEntry.innerHTML = this.log[this.log.length - 1];
            this.logList.appendChild(lastEntry);
        }
        
    }

    updateProgressCircle() {
        const totalTimeInSeconds = this.startingMinutes * 60;
        // Calculate remaining time in seconds
        const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
        // Calculate the percentage of the remaining time
        const percentageRemaining = remainingTimeInSeconds * 100 / totalTimeInSeconds;
        // The stroke-dashoffset value is proportional to the percentage remaining
        const dashOffset = 570 - (546 * percentageRemaining / 100);
        // Update the stroke-dashoffset of the circle (adjust for your specific SVG structure)
        this.progressCircle.style.strokeDashoffset = dashOffset;
    }


}


document.addEventListener("DOMContentLoaded", function () {

    /* --------------- DOM manipulation: timer display --------------- */

    const innerCircle = document.querySelector('.inner');
    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'time-display';
    innerCircle.insertBefore(timeDisplay, innerCircle.firstChild);

    /* --------------- DOM manipulation: - & + buttons --------------- */

    const sliderWrapper = document.querySelector('.slider-wrapper');

    const decreaseButton = document.createElement('button');
    decreaseButton.className = 'slider-btn less';
    decreaseButton.innerHTML = '<i class="fa-solid fa-minus"></i>';
    sliderWrapper.insertBefore(decreaseButton, sliderWrapper.firstChild);

    const increaseButton = document.createElement('button');
    increaseButton.className = 'slider-btn more';
    increaseButton.innerHTML = '<i class="fa-solid fa-plus"></i>';
    sliderWrapper.append(increaseButton);

    /* --------------- SELECT EVERYTHING ELSE AND CREATE NEW INSTANCE --------------- */

    const circle = document.querySelector('circle');
    const playButton = document.querySelector('.play');
    const restartButton = document.querySelector('.restart-btn');
    const progressCircle = document.querySelector('.progress-bar-svg > circle');
    const slider = document.querySelector('.time-slider');
    const logList = document.querySelector('.log-list');

    const timerInstance = new Timer(timeDisplay, progressCircle, slider, logList);

    /*  --------------- MOUSEDOWN INCREASING/DECREASING ---------------- */

    let intervalId = null;

    // Function to handle button behavior
    function setupButton(button, action) {
        button.addEventListener('mousedown', () => {
            action();
            intervalId = setInterval(action, 100);
        });
        button.addEventListener('mouseup', () => clearInterval(intervalId)); // Stop the interval
        button.addEventListener('mouseleave', () => clearInterval(intervalId)); // Stop on leave
    }

    // Setup buttons with their respective actions
    setupButton(increaseButton, () => timerInstance.changeTime(+1));
    setupButton(decreaseButton, () => timerInstance.changeTime(-1));

    /*  --------------- SLIDER ---------------- */

    slider.addEventListener('input', () => {
        timerInstance.clearInterval();
        timerInstance.setDefaultTime(Number(slider.value)); // Call the function and pass the value
        timerInstance.updateDisplay(Number(slider.value)); // Call the function and pass the value
    });

    /*  --------------- PLAY/RESTART/ANIMATION ---------------- */

    playButton.addEventListener('click', () => timerInstance.start())

    restartButton.addEventListener('click', () => {
        timerInstance.resetTimer();
        circle.classList.add("animated");
    })

    circle.addEventListener('animationend', () => circle.classList.remove("animated"));

});




