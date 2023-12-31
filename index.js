let timer = 30;
let timerTimeout;
let firstTurn = 1;
let currentTurnsPlayer = 1;
let playerOneScore = 0;
let playerTwoScore = 0;
let pauseTimer = 0;
let gameWonState = false; //set true if the won message is displayed
let windowSize = "small"; //"large" or "small" board svg

//0 if no counter is set, 1 for player one counter, 2 for player two
let gameTable = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];


// set the correct SVG size file of the counter on window load
window.onload = function () {
    // if screen width on load is over 720px 
    if (document.body.clientWidth > 720) {
        windowSize = "large";
        changeCounterSvgSize();
    }
}



// ---------------------- Window listeners ----------------------


window.addEventListener("resize", function (event) {
    if (document.body.clientWidth > 720 && windowSize === "small") {
        windowSize = "large";
        changeCounterSvgSize();
    } else if (document.body.clientWidth < 720 && windowSize === "large") {
        windowSize = "small";
        changeCounterSvgSize();
    }
    changeTimerSectionBackgroundHeight();
})



// ---------------------- Button listeners ----------------------

// Menu -> start game
$("#menu-btn-play").click(function (event) {
    $("#main-menu").css("display", "none");
    $("#game-board").css("display", "block");
    changeTimerSectionBackgroundHeight();
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
    //sets the color of the clicked counter, size according to the window size
    const red = "assets/images/counter-red-" + windowSize + ".svg";
    const yellow = "assets/images/counter-yellow-" + windowSize + ".svg";

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
    $(".wins-heading")[0].innerHTML = "WINS";
    if (playerWon === 1) {
        $(".timer-section").css("background-color", "var(--red-color)");
    } else { 
        $(".timer-section").css("background-color", "var(--yellow-color)");
    }
}

// hides the timer & shows the win state card
const showBreakEvenState = () => {
    gameWonState = true;
    $(".timer-modal").css("display", "none");
    $(".win-modal").css("display", "block");
    $("#player-won")[0].innerHTML = "BREAK";
    $(".wins-heading")[0].innerHTML = "EVEN";
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
    $(".timer-section").css("background-color", "var(--dark-purple-color)");
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

const changeCounterSvgSize = () => {
    // erste Zahl
    for (let i = 0; i < 6; i++) {
        //zweite Zahl
        for (let z = 0; z < 7; z++) {
            //console.log("#" + i + z);
            let selector = "#" + i + z;
            let originalSrc = $(selector).attr("src");
            if (originalSrc.includes("red")) {
                $(selector).attr("src", "assets/images/counter-red-" + windowSize + ".svg");
            } else {
                $(selector).attr("src", "assets/images/counter-yellow-" + windowSize + ".svg");
            }
        }

    }
}

// sets the height of the timer-section background dynamically to fit till the bottom of the screen
const changeTimerSectionBackgroundHeight = () => {
    //TODO: evalute beim button click
    let gameSectionHeight = $(".game-section").height();
    let timerSectionHeight = "calc( 100vh - 2rem - 0.8rem - " + gameSectionHeight + "px )";

    // if content height is greater than viewport height, set no specific height
    if((gameSectionHeight + 45 + $(".win-modal").height()) > $(window).height()){
        timerSectionHeight = "";
    }
    
    $(".timer-section").css("height", timerSectionHeight);
}


const showMarker = (field) => {
    $(".marker").css("display", "");
    //calculates the offset in rem
    const markerPosition = (field.substring(1, 2) - 3) * 5.5;
    const markerPositionString = "calc(50% + " + markerPosition + "rem)";
    $(".marker").css("left", markerPositionString);
}

const hideMarker = () => {
    $(".marker").css("display", "none");
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
    $(".timer-section").css("background-color", "var(--dark-purple-color)");

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

const breakEven = () => {
    timer = 0;
    showBreakEvenState();
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
            checkIfWon(x, index).then(function (result) {
                // resolve someone won -> end function
                timer = 0;
                updateScore(currentTurnsPlayer);
                return;
            }, function (err) {
                // reject -> next turn;
                if (err !== "break even") {
                    nextTurn();
                }
            });
            break;
        }
        //error message if collum is already full
        if (index === 0) {
            console.log("error");
        }
    }
}

//checks if the current player has won the game
// x and y are the coordinates of the last placed counter
// resolve if someone won, reject if not
const checkIfWon = (x, y) => {
    return new Promise((resolve, reject) => {
        let count = 0;
        x = Number(x);
        y = Number(y);

        //check if break even, if one player hit y = 0
        if (y === 0) {
            checkIfBreakEven().then(function (result) {
                // resolve break even -> end function
                console.log("break even");
                reject("break even");
                return;
            }, function (err) {
                // reject -> do nothing
            });
        }

        //check if 4 counters are next to each other horizontaly
        if (x > 2) {
            for (let index = 0; index < 4; index++) {
                if (gameTable[y][x - index] === currentTurnsPlayer) {
                    count++;
                } else {
                    count = 0;
                }
                // if count is 4, the current player has won
                if (count === 4) {
                    console.log("Won hor left");
                    resolve();
                    return;
                }
            }
            count = 0;
        }
        if (x < 4) {
            for (let index = 0; index < 4; index++) {
                if (gameTable[y][x + index] === currentTurnsPlayer) {
                    count++;
                } else {
                    count = 0;
                }
                // if count is 4, the current player has won
                if (count === 4) {
                    console.log("Won hor right");
                    resolve();
                    return;
                }
            }
            count = 0;
        }


        //for vertical / diagonal check: if less than 4 counters are in a collumn, skip 
        if (y < 3) {
            // four counters vertically next to each other
            for (let index = 0; index < 4; index++) {
                if (gameTable[y + index][x] === currentTurnsPlayer) {
                    count++;
                } else {
                    count = 0;
                }
                // if count is 4, the current player has won
                if (count === 4) {
                    console.log("Won vert");
                    resolve();
                    return;
                }
            }
            count = 0;

            // four counters diagonal to the right side
            if (x < 4) {
                for (let index = 0; index < 4; index++) {
                    if (gameTable[y + index][x + index] === currentTurnsPlayer) {
                        count++;
                    } else {
                        count = 0;
                    }
                    // if count is 4, the current player has won
                    if (count === 4) {
                        console.log("Won dia right");
                        resolve();
                        return;
                    }
                }
                count = 0;
            }

            // four counters diagonal to the left side
            if (x > 2) {
                for (let index = 0; index < 4; index++) {
                    if (gameTable[y + index][x - index] === currentTurnsPlayer) {
                        count++;
                    } else {
                        count = 0;
                    }
                    // if count is 4, the current player has won
                    if (count === 4) {
                        console.log("Won dia left");
                        resolve();
                        return;
                    }
                }
            }

        }
        reject();
    });
}

// checks if the game is break even, which means all fields are set
const checkIfBreakEven = () => {
    return new Promise((resolve, reject) => {
        let count = 0;

        // if there are any empty fields left, reject
        for (let index = 0; index < 7; index++) {
            if (gameTable[0][index] === 0) {
                reject();
                return;
            }
        }

        // else trigger break even
        breakEven();
        resolve();
    })
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


// ---------------------- Hover ----------------------


$(".counter-grid > img").on("mouseover", function (data) {
    showMarker(data.currentTarget.id);
});

$(".counter-grid > img").on("mouseout", function () {
    hideMarker();
});
