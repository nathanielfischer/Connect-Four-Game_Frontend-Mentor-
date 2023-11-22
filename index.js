let timer = 30;
let timerTimeout;
let firstTurn = 1;
let currentTurnsPlayer = 1;
let playerOneScore = 0;
let playerTwoScore = 0;
let pauseTimer = 0;




// ---------------------- Button listeners ----------------------

// Menu -> start game
$("#menu-btn-play").click(function (event) {
    $("#main-menu").css("display", "none");
    $("#game-board").css("display", "block");
    resetGame();
});

// Menu -> show rules
$("#menu-btn-rules").click(function (event) {
    $("#main-menu").css("display", "none");
    $("#rules-overlay").css("display", "block");
});

// Rules -> back to menu
$(".btn-check").click(function (event) {
    $("#rules-overlay").css("display", "none");
    $("#main-menu").css("display", "block");
});

// Ingame -> pop up menu overlay
$("#back-to-menu").click(function (event) {
    $("#ingame-menu").css("display", "block");
    
    //stop timer and remember the current time in pauseTimer
    pauseTimer = timer;
    timer = 0;

    //TODO: transparent background
});

// Ingame -> restart game
$("#restart").click(function (event) {
    timer = 0;
    clearTimeout(timerTimeout);
    resetGame();
});

// Ingame win state -> play next round
$("#play-again").click(function (event) {
    hideWinState();
    startGame();
});

// pop up menu -> continue game
$("#ingame-btn-continue").click(function (event) {
    $("#ingame-menu").css("display", "none");

    //continue timer
    timer = pauseTimer + 1;
    updateTimerEverySecond();
});

// pop up menu -> restart game
$("#ingame-btn-restart").click(function (event) {
    timer = 0;
    clearTimeout(timerTimeout);
    resetGame();
    $("#ingame-menu").css("display", "none");
});

// pop up menu -> quit game (back to main menu)
$("#ingame-btn-quit").click(function (event) {
    timer = 0;
    $("#ingame-menu").css("display", "none");
    $("#game-board").css("display", "none");
    $("#main-menu").css("display", "block");
});

// ---------------------- Ingame listeners ----------------------

//counter click listener
$(".counter").click(function (event) {
    const clickedField = '#' + event.target.id + '';

    //TODO: check if clicked field is valid, then update
    setCounter(clickedField);
    nextTurn();
});


// ---------------------- Interface update functions ----------------------

const updatePlayersTurn = () => {
    $("#players-turn")[0].innerHTML = "Player " + currentTurnsPlayer + "'s turn";
    if (currentTurnsPlayer === 1) {
        $(".turn-bg").attr("src", "assets/images/turn-background-red.svg");
    } else {
        $(".turn-bg").attr("src", "assets/images/turn-background-yellow.svg");
    }
}

// Unhides the counter in the clicked field
const setCounter = (clickedField) => {
    $(clickedField).attr("style", "opacity: 1");
    //sets the color of the clicked counter
    const red = "assets/images/counter-red-small.svg";
    const yellow = "assets/images/counter-yellow-small.svg";

    if (currentTurnsPlayer === 1) {
        $(clickedField).attr("src", red);
    } else {
        $(clickedField).attr("src", yellow);
    }
}

// updates the win score of the player who won & show win state
const updateScore = (playerWon) => {
    if (playerWon === 1) {
        playerOneScore += 1;
        $("#player-one-score")[0].innerHTML = playerOneScore;
    } else {
        playerTwoScore += 1;
        $("#player-two-score")[0].innerHTML = playerTwoScore;
    }
    showWinState(playerWon);
}

// hides the timer & shows the win state card
const showWinState = (playerWon) => {
    $(".timer-modal").css("display", "none");
    $(".win-modal").css("display", "block");
    $("#player-won")[0].innerHTML = "Player " + playerWon;
}

// hides the win state & shows the timer & sets next Player
const hideWinState = () => {
    if (currentTurnsPlayer === 1) {
        currentTurnsPlayer = 2;
    } else {
        currentTurnsPlayer = 1;
    }

    //updates the interface
    updatePlayersTurn();

    $(".win-modal").css("display", "none");
    $(".timer-modal").css("display", "block");
}

//updates the interface accordingly to who as the first turn 
//& sets the first turn to the other player for the next round
const updateFirstTurn = () => {
    if (firstTurn === 1) {
        currentTurnsPlayer = 1;
        updatePlayersTurn();
        firstTurn = 2;
    } else {
        currentTurnsPlayer = 2;
        updatePlayersTurn();
        firstTurn = 1;
    }
}

// for all counters: set opacity back to 0 (equals hide element)
const resetCounters = () => {
    $('img', $('.counter-grid')).each(function () {
        $(this).attr("style", "opacity: 0");
    });
}



// ---------------------- Game logic ----------------------

const startGame = () => {
    timer = 30;
    updateFirstTurn();
    resetCounters();
    updateTimerEverySecond();
}

// reset all data + interface & start new game
const resetGame = () => {
    firstTurn = 1;
    playerOneScore = 0;
    playerTwoScore = 0;

    $("#player-one-score")[0].innerHTML = playerOneScore;
    $("#player-two-score")[0].innerHTML = playerTwoScore;

    $(".win-modal").css("display", "none");
    $(".timer-modal").css("display", "block");
    
    startGame();
}

const nextTurn = () => {
    //restart timer & set new time in interface
    timer = 30;
    $(".timer")[0].innerHTML = timer + "s";

    //update Interface (Players turn)
    if (currentTurnsPlayer === 1) {
        currentTurnsPlayer = 2;
    } else {
        currentTurnsPlayer = 1;
    }
    updatePlayersTurn();

    //update next players counter color

}

//if timer = 0 -> the win state is shown for the other player and their score is incremented by 1.
const timeIsUp = () => {
    //stop timer
    timer = 0;

    if (currentTurnsPlayer === 1) {
        updateScore(2);
    } else {
        updateScore(1)
    }
}

// If a player won -> updates the score, ends timer, shows win state
const gameOver = (playerWon) => {
    //TODO: who won ???
    //TODO: mark the counters which made the player win -> timeIsUp ?!

    //stop timer
    timer = 0;

    //update score for the other player & show win state
    updateScore(playerWon);
}


// ---------------------- Timer functions ----------------------

/**
 * Updates the Timer every Second
 */
const updateTimerEverySecond = () => {
    const second = 1000; // 60000

    if (timer === 0) {
        //just stop the timer
        return;
    }

    //do stuff here
    timer -= 1;
    $(".timer")[0].innerHTML = timer + "s";

    if (timer === 0) {
        //player lost
        timeIsUp();
        return;
    }

    //do stuff here
    timerTimeout = setTimeout(updateTimerEverySecond, second);
}




