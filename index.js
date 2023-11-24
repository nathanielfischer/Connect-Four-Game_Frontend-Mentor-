let timer = 30;
let timerTimeout;
let firstTurn = 1;
let currentTurnsPlayer = 1;
let playerOneScore = 0;
let playerTwoScore = 0;
let pauseTimer = 0;
let gameWonState = false; //set true if the won message is displayed

//0 if no counter is set, 1 for player one counter, 2 for player two
let gameTable = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];



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

// Ingame -> open pop up menu overlay
$("#back-to-menu").click(function (event) {
    $("#ingame-menu").css("display", "block");

    //stop timer and remember the current time in pauseTimer
    pauseTimer = timer;
    timer = 0;

    //make background a bit transparent
    $("#game-board").css("opacity", 0.5);
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
    $("#game-board").css("opacity", 1);

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
    $("#game-board").css("opacity", 1);
});

// pop up menu -> quit game (back to main menu)
$("#ingame-btn-quit").click(function (event) {
    timer = 0;
    $("#ingame-menu").css("display", "none");
    $("#game-board").css("display", "none");
    $("#main-menu").css("display", "block");
    $("#game-board").css("opacity", 1);
});

// ---------------------- Ingame listeners ----------------------

//counter click listener
$(".counter").click(function (event) {
    // if the win message is currently displayed, do nothing
    if (gameWonState === false) {
        const clickedField = event.target.id + '';
        counterFall(clickedField);
    }
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

// updates the win score of the player who won & shows win state 
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
    gameWonState = true;
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

    gameWonState = false;

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
// reset the game table
const resetCounters = () => {
    $('img', $('.counter-grid')).each(function () {
        $(this).attr("style", "opacity: 0");
    });

    gameTable = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
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
    gameWonState = false;

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
    //TODO: mark the counters which made the player win -> timeIsUp ?!

    //stop timer
    timer = 0;

    //update score for the other player & show win state
    updateScore(playerWon);
}


//sets the counter to the correct field on the board & in the table array
const counterFall = (clickedField) => {
    const y = clickedField.substring(0, 1);
    const x = clickedField.substring(1, 2)

    for (let index = 5; index >= 0; index--) {
        //check the y-axis from bottom to top if a field is empty
        if (gameTable[index][x] === 0) {
            setCounter("#" + index + x);
            gameTable[index][x] = currentTurnsPlayer;
            checkIfWon(x, index);
            //TODO: Promise -> no next turn if someone won
            nextTurn();
            break;
        }
        //error message if collum is already full
        if (index === 0) {
            console.log("error");
        }
    }
}

//TODO: break even
//checks if the current player has won the game
// x and y are the coordinates of the last placed counter
const checkIfWon = (x, y) => {
    //if less than 4 counters are in a collumn, skip 
    if (y < 3) {
        let count = 0;

        for (let index = y; index < 6; index++) {
            if (gameTable[index][x] === currentTurnsPlayer) {
                count++;
            } else {
                count = 0;
            }
            // if count is 4, the current player has won
            if (count === 4) {
                //TODO: return Promise player WON
                updateScore(currentTurnsPlayer);
            }
        }
    }
}


// ---------------------- Timer functions ----------------------

/**
 * Updates the Timer every Second
 */
const updateTimerEverySecond = () => {
    const second = 1000;

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




