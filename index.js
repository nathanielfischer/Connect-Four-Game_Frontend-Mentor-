let timer = 30;
let currentTurnsPlayer = 2;
const playerOneCount = 0;
const playerTwoCount = 0;


//temp function as overview
$(".counter").click(function (event) {
    //unhides the clicked counter
    let v = '#' + event.target.id + '';
    $(v).attr("style", "opacity=1");

    //sets the color of the clicked counter
    const red = "assets/images/counter-red-small.svg";
    const yellow = "assets/images/counter-yellow-small.svg";
    $(v).attr("src", yellow);

    updateTimerEverySecond();
});

// ---------------------- Click listeners ----------------------

$("#menu-btn-play").click(function (event) {
    $("#main-menu").css("display", "none");
    $("#game-board").css("display", "block");
});



// ---------------------- Interface update functions ----------------------

const updatePlayersTurn = () => {
    $("#players-turn")[0].innerHTML = "Player " + currentTurnsPlayer + "'s turn";
}



// ---------------------- Timer functions ----------------------

/**
 * Updates the Timer every Second
 */
const updateTimerEverySecond = () => {
    const second = 1000; // 60000
    
    //do stuff here
    timer -= 1;
    $(".timer")[0].innerHTML = timer + "s";
    
    //if timer = 0 -> the win state is shown for the other player and their score is incremented by 1.
    if (timer === 0) {
        console.log("turn over");
        return;
    }

    //do stuff here
    setTimeout(updateTimerEverySecond, second);
}




