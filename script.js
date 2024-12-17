class Timer {
    constructor(timeDisplay, progressCircle, slider) {
        this.timeDisplay = timeDisplay;
        this.progressCircle = progressCircle;
        this.clearInterval();
        this.slider = slider;
        this.slider.value = this.startingMinutes;
        this.setDefaultTime(30); // Set default time once during initialization
        this.updateDisplay();
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
        console.log("yo");
        this.setDefaultTime(this.startingMinutes); // Re
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

    increase() {
        if (this.minutes < 60) {
            this.startingMinutes++;
            this.clearInterval();
            this.setDefaultTime(this.startingMinutes);
            this.updateDisplay(); // Update the display
            this.slider.value = this.startingMinutes;
        }
    }
    decrease() {
        if (this.minutes > 0) {
            this.startingMinutes--;
            this.clearInterval();
            this.setDefaultTime(this.startingMinutes);
            this.updateDisplay(); // Update the display
            this.slider.value = this.startingMinutes;
        }
    }

    decrementSeconds() {
        if (this.seconds === 0 && this.minutes > 0) {
            this.minutes--;
            this.seconds = 59;

        } else {
            this.seconds--;
        }
        this.updateDisplay();
        this.updateProgressCircle(); // Update the progress circle every second

    }

    updateDisplay() {
        const formattedMinutes = String(this.minutes).padStart(2, '0');
        const formattedSeconds = String(this.seconds).padStart(2, '0');
        this.timeDisplay.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
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
    


    // Select all buttons within the .fast-selectors container
    const fastButtons = document.querySelectorAll('.fast-selectors button');
    const circle = document.querySelector('circle');
    const playButton = document.querySelector('.play');
    const restartButton = document.querySelector('.restart-btn');
    const increaseButton = document.querySelector('.more');
    const decreaseButton = document.querySelector('.less');
    const timeDisplay = document.querySelector('.time-display');
    const progressCircle = document.querySelector('.progress-bar-svg > circle'); // Adjust this to match your SVG structure
    const slider = document.querySelector('.time-slider'); // Select the slider


    console.log(progressCircle);

    const timerInstance = new Timer(timeDisplay, progressCircle, slider);


    playButton.addEventListener('click', () => {
        timerInstance.start();
    })

    restartButton.addEventListener('click', () => {
        timerInstance.resetTimer();
        circle.classList.add("animated");

    })

    circle.addEventListener('animationend', function () {
        circle.classList.remove("animated");
    });


    increaseButton.addEventListener('click', () => {
        console.log("yo");
        timerInstance.increase();
    })
    decreaseButton.addEventListener('click', () => {
        timerInstance.decrease();
    });


    // Update the timer when the slider value changes
    slider.addEventListener('input', () => {
        const sliderValue = slider.value;

        timerInstance.clearInterval();
        timerInstance.setDefaultTime(Number(sliderValue)); // Call the function and pass the value
        timerInstance.updateDisplay(Number(sliderValue)); // Call the function and pass the value
    });

});




