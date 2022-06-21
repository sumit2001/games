move = new Audio('music/move.mp3');
win = new Audio('music/win.wav');
lose = new Audio('music/lose.wav');
var arr = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];                        //default board

var startingX, startingY, movingX, movingY;
function touchStart(evt) {
    startingX = evt.touches[0].clientX;
    startingY = evt.touches[0].clientY;
}
function touchMove(evt) {
    movingX = evt.touches[0].clientX;
    movingY = evt.touches[0].clientY;
}

var colMap = {
    0: "FFCCCC",
    2: "FFE5CC",
    4: "FFCC99",
    8: "FFB266",
    16: "FF9933",
    32: "FF8000",
    64: "CC6600",
    128: "994C00",
    256: "663300",
    512: "660000",
    1024: "333300",
    2048: "331900",
    4096: "000000",
}

var arr24 = [2, 4];           // values to be inserted randomly in array
var highest = 0;            // highest value till the game
var gameOn = false;         // game is on or not
var won = false;
function random(n) {       // return a random value between 0 and n (includes 0)
    return Math.floor((Math.random() * n));
}

document.onkeydown = checkKey;

function checkKey(e) {         // detecting arrow keys
    move.play();

    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
    e = e || window.event;
    if (gameOn) {
        if (e.keyCode == '38') {
            topp();
            // up arrow
        }
        else if (e.keyCode == '40') {
            bottom();               // down arrow
        }
        else if (e.keyCode == '37') {
            // left arrow
            left();
        }
        else if (e.keyCode == '39') {
            // right arrow
            right();
        }
        ui();
    }


}
function touchEnd() {

    const swipe = 50;
    if (gameOn) {
        if (startingX + swipe < movingX) {
            move.play();
            right();
        } else if (movingX != 0 && startingX - swipe > movingX) {
            move.play();
            left();
        }

        else if (startingY + swipe < movingY) {
            move.play();
            bottom();
        } else if (movingY != 0 && startingY - swipe > movingY) {
            move.play();
            topp();
        }
    }
    ui();
    movingX = 0;
    movingY = 0;
}

function engine() {                        //This function is engine of the program.It will go and call all the functions
    let rn2 = arr24[random(2)];             //will get a random value from 0 to 1 (basically it will help in chosing the number to be placed 2 or 4)
    var rn41 = random(4);                   //will get a random value from 0 to 4 (basically it will help in chosing the row number in which number to be placed)
    var rn42 = random(4);                   //will get a random value from 0 to 4 (basically it will help in chosing the column number in which number to be placed)
    arr[rn41][rn42] = rn2;                  //placed the number at its corresponding place
    highest = Math.max(highest, rn2);        //will manage highest value till
    rn2 = arr24[random(2)];                 //second value to be placed initially
    highest = Math.max(highest, rn2);
    let rn = rasi();                          //will get a place where no number is placed initially
    arr[rn[0]][rn[1]] = rn2;
    ui();

}

startGame();
function startGame() {                 //this function will start the game
    highest = 0;
    gameOn = true;
    arr = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    document.querySelector('.message').style["display"] = "none";
    document.querySelector('.resume').style["display"] = "none";
    //   printMessages("New Game Started");
    engine();
    win.pause();
    lose.pause();
}

function rasi() {                      //this will return a random place where no number is filled
    var str = "";
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var val = arr[i][j];
            if (val == 0) {
                str += i + " " + j + ",";
            }
        }
    }
    var sarr = str.split(",");
    var rnfs = sarr[random(sarr.length - 1)];
    var sind = rnfs.split(" ");
    sind[2] = sarr.length;
    return sind;
}
function checkIfOver() {               //this function will check whether game is over or not (if game is over return true else false)
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1; j++) {
            if (arr[i][j] == arr[i][j + 1])
                return false;
        }
    }
    for (let j = 0; j < arr.length; j++) {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i][j] == arr[i + 1][j])
                return false;
        }
    }
    document.querySelector('.message').style["display"] = "block";
    document.querySelector('.message').innerText = "Game Over";
    lose.play();
    return true;
}

function checkIfWon() {                //this function will check if game is won or not
    if (highest == 2048 && !won) {
        document.querySelector('.message').style["display"] = "block";
        document.querySelector('.message').innerText = "You Won";
        document.querySelector('.resume').style["display"] = "inline";
        gameOn = false;
        won = true;
        win.play();
        return true;
    }
    return false;
}

function resume() {
    document.querySelector('.resume').style["display"] = "none";
    document.querySelector('.message').style["display"] = "none";
    gameOn = true;
    win.pause();
    lose.pause();
}

function findAndEnterNextRandom() {            //this will place some digit in next random value
    let rn2 = arr24[random(2)];
    let rn = rasi();
    arr[rn[0]][rn[1]] = rn2;
    if (rn[2] == 2) {
        if (checkIfOver()) {
            gameOn = false;
        }
    }
}

function printAndGetRandom(overall) {          //this function will help in prining and finding next random value
    if (overall) {
        findAndEnterNextRandom();
    }
}

function right() {                             //this function will manage the board when right arrow will be pressed
    let overall = false;
    for (var i = 0; i < 4; i++) {
        var idx = 3;
        for (var j = 3; j >= 0; j--) {
            var val = arr[i][j];
            if (val == 0) continue;
            arr[i][j] = 0;

            var flag = false;
            for (var k = j - 1; k >= 0; k--) {
                if (arr[i][k] != 0) {
                    if (arr[i][k] == val) {
                        arr[i][k] = 0;
                        flag = true;
                    }
                    break;
                }
            }

            if (j - 1 >= 0 && flag) {
                overall = true;
                var sum = val * 2;
                arr[i][j - 1] = 0;
                arr[i][idx] = sum;
                idx--;
                highest = Math.max(highest, sum);
                checkIfWon();
            } else if (val != 0) {
                if (idx != j) {
                    overall = true;
                }
                arr[i][idx] = val;
                idx--;
            }
        }
    }
    printAndGetRandom(overall);
}

function left() {                             //this function will manage the board when left arrow will be pressed
    let overall = false;
    for (var i = 0; i < 4; i++) {
        var idx = 0;
        for (var j = 0; j <= 3; j++) {
            var val = arr[i][j];
            if (val == 0) continue;
            arr[i][j] = 0;

            var flag = false;
            for (var k = j + 1; k < 4; k++) {
                if (arr[i][k] != 0) {
                    if (arr[i][k] == val) {
                        arr[i][k] = 0;
                        flag = true;
                    }
                    break;
                }
            }

            if (j + 1 <= 3 && flag) {
                overall = true;
                var sum = val * 2;
                arr[i][j + 1] = 0;
                arr[i][idx] = sum;
                idx++;
                highest = Math.max(highest, sum);
                checkIfWon();
            } else if (val != 0) {
                if (idx != j) {
                    overall = true;
                }
                arr[i][idx] = val;
                idx++;
            }
        }
    }
    printAndGetRandom(overall);

}

function topp() {                             //this function will manage the board when top arrow will be pressed
    let overall = false;
    for (var j = 0; j < 4; j++) {
        var idx = 0;
        for (var i = 0; i <= 3; i++) {
            var val = arr[i][j];
            if (val == 0) continue;
            arr[i][j] = 0;

            var flag = false;
            for (var k = i + 1; k < 4; k++) {
                if (arr[k][j] != 0) {
                    if (arr[k][j] == val) {
                        arr[k][j] = 0;
                        flag = true;
                    }
                    break;
                }
            }

            if (i + 1 <= 3 && flag) {
                overall = true;
                var sum = val * 2;
                arr[i + 1][j] = 0;
                arr[idx][j] = sum;
                idx++;
                highest = Math.max(highest, sum);
                checkIfWon();
            } else if (val != 0) {
                if (idx != i) {
                    overall = true;
                }
                arr[idx][j] = val;
                idx++;
            }
        }
    }
    printAndGetRandom(overall);

}

function bottom() {                             //this function will manage the board when bottom arrow will be pressed
    let overall = false;
    for (var j = 0; j < 4; j++) {
        var idx = 3;
        for (var i = 3; i >= 0; i--) {
            var val = arr[i][j];
            if (val == 0) continue;
            arr[i][j] = 0;

            var flag = false;
            for (var k = i - 1; k >= 0; k--) {
                if (arr[k][j] != 0) {
                    if (arr[k][j] == val) {
                        arr[k][j] = 0;
                        flag = true;
                    }
                    break;
                }
            }

            if (i - 1 >= 0 && flag) {
                overall = true;
                var sum = val * 2;
                arr[i - 1][j] = 0;
                arr[idx][j] = sum;
                idx--;
                highest = Math.max(highest, sum);
                checkIfWon();
            } else if (val != 0) {
                if (idx != i) {
                    overall = true;
                }
                arr[idx][j] = val;
                idx--;
            }
        }
    }
    printAndGetRandom(overall);
}

function ui() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            let n = i * 4 + j;
            let change = '';
            if (arr[i][j] != 0)
                change = arr[i][j];
            document.querySelector('.box' + n).querySelector('.boxtext').innerText = change;
            // console.log(colMap[arr[i][j]]);
            document.querySelector('.box' + n).style["background-color"] = "#" + colMap[arr[i][j]];
            if (arr[i][j] >= 64) {
                document.querySelector('.box' + n).style["color"] = "white";
            } else {
                document.querySelector('.box' + n).style["color"] = "black";
            }
            if (arr[i][j] > 512) {
                document.querySelector('.box' + n).style["font-size"] = "3vw";
            } else {
                document.querySelector('.box' + n).style["font-size"] = "4vw";
            }
        }
    }
}

function home() {
    window.location.href = "https://sumit2001.github.io/kidGames/";
}

