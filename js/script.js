class Timer {
    constructor(timeDisplay, progressCircle, slider, logList, sound, playButton) {
        this.log = [];
        this.timeDisplay = timeDisplay;
        this.progressCircle = progressCircle;
        this.stopTimer();
        this.slider = slider;
        this.initializeTimer(0);
        this.slider.value = this.startingMinutes;
        this.updateDisplay();
        this.logList = logList;
        this.sound = sound;
        this.playButton = playButton;
        this.intervalDuration = 10; // 1000
    }

    initializeTimer(minutes) {
        this.stopTimer();
        // reset progress bar
        this.progressCircle.style.strokeDashoffset = 24;
        // reset time values
        this.startingMinutes = minutes;
        this.minutes = minutes;
        this.seconds = 0;
        // update timer display
        this.updateDisplay();
    }

    setPlayIcon() {
        if (this.playButton) {
            this.playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    }

    setPauseIcon() {
        if (this.playButton && this.minutes) {
            this.playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
    }

    stopTimer() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.setPlayIcon();
    }

    start() {
        if (this.interval || (this.minutes === 0 && this.seconds === 0)) {
            // Prevent starting if the timer has already finished or is running
            return;
        }
        this.interval = setInterval(() => {
            if (this.minutes === 0 && this.seconds === 0) {
                clearInterval(this.interval);
                this.interval = null;
            } else {
                this.decrementSeconds();
            }
        }, this.intervalDuration); // 1000
    }

    changeTime(change) {
        this.startingMinutes = Math.max(0, Math.min(60, this.startingMinutes + change));
        this.initializeTimer(this.startingMinutes);
        this.slider.value = this.startingMinutes;
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
        if (this.seconds === 0 && this.minutes === 0) {
            this.addToLog();
        }

    }

    updateDisplay() {
        const formattedMinutes = String(this.minutes).padStart(2, '0');
        const formattedSeconds = String(this.seconds).padStart(2, '0');
        this.timeDisplay.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
    }

    addToLog() {
        if (this.startingMinutes > 0) {
            const now = new Date();
            const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const minutesFormatted = String(this.startingMinutes).padStart(2, '0');
            const logEntry = `${minutesFormatted} m session ended at ${timestamp}`;

            this.log.push(logEntry);
            const lastEntry = document.createElement('li');
            lastEntry.classList.add('log-entry');
            lastEntry.textContent = logEntry;
            this.logList.appendChild(lastEntry);
            this.sound.currentTime = 0
            this.sound.play();
            this.setPlayIcon();
        }

    }

    updateProgressCircle() {
        const FULL_DASH_OFFSET = 570;
        const DASH_REDUCTION = 546;
        const totalTimeInSeconds = this.startingMinutes * 60;
        // Calculate remaining time in seconds
        const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
        // Calculate the percentage of the remaining time
        const percentageRemaining = remainingTimeInSeconds * 100 / totalTimeInSeconds;
        // The stroke-dashoffset value is proportional to the percentage remaining
        const dashOffset = FULL_DASH_OFFSET - (DASH_REDUCTION * percentageRemaining / 100);
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
    decreaseButton.className = 'less';
    decreaseButton.innerHTML = '<i class="fa-solid fa-minus"></i>';
    sliderWrapper.insertBefore(decreaseButton, sliderWrapper.firstChild);

    const increaseButton = document.createElement('button');
    increaseButton.className = 'more';
    increaseButton.innerHTML = '<i class="fa-solid fa-plus"></i>';
    sliderWrapper.append(increaseButton);

    /* --------------- SELECT EVERYTHING ELSE AND CREATE NEW INSTANCE --------------- */

    const circle = document.querySelector('circle');
    const playButton = document.querySelector('.play-btn');
    const restartButton = document.querySelector('.restart-btn');
    const progressCircle = document.querySelector('.progress-bar-svg > circle');
    const slider = document.querySelector('.time-slider');
    const logList = document.querySelector('.log-list');
    const sound = new Audio('./assets/doorbell.wav');
    sound.muted = false;
    sound.preload = 'auto';

    const timerInstance = new Timer(timeDisplay, progressCircle, slider, logList, sound, playButton);

    /*  --------------- BUTTONS MOUSEDOWN SLIDER INCREASING/DECREASING ---------------- */

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

    /*  --------------- THUMB SLIDER INPUT ---------------- */

    slider.addEventListener('input', () => {
        timerInstance.initializeTimer(Number(slider.value));
    });

    /*  --------------- PLAY/RESTART/ANIMATION ---------------- */

    playButton.addEventListener('click', () => {
        if (timerInstance.interval) {
            // Timer is running; pause it
            timerInstance.stopTimer();
            timerInstance.setPlayIcon();
        } else {
            // Timer is paused or stopped; start it
            timerInstance.start();
            timerInstance.setPauseIcon();
        }
    })

    function animateCircle() {
        progressCircle.classList.add("animated");
        progressCircle.addEventListener('animationend', () =>
            progressCircle.classList.remove("animated"), { once: true }
        );
    }

    restartButton.addEventListener('click', () => {
        timerInstance.initializeTimer(timerInstance.startingMinutes);
        timerInstance.setPlayIcon();
        animateCircle();
    })


});




