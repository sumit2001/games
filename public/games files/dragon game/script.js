score = 0;
cross = true;

audio = new Audio('music/music.mp3');
audiogo = new Audio('music/gameover.mp3');
gameOn = false;

document.onkeydown = function (e) {
    audio.play();
    if (gameOn) {
        if (e.keyCode == 38) {
            dino = document.querySelector('.dino');
            dino.classList.add("animateDino");
            setTimeout(() => {
                dino.classList.remove("animateDino");
            }, 700);
        }
        if (e.keyCode == 39) {
            dino = document.querySelector('.dino');
            dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
            // console.log(screen.width);
            if (dinoX < screen.width - 300)
                dino.style.left = (dinoX + 104) + "px";
        }
        if (e.keyCode == 37) {
            dino = document.querySelector('.dino');
            dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
            if (dinoX > 0)
                dino.style.left = (dinoX - 104) + "px";
        }
    }
}

setInterval(() => {
    dino = document.querySelector(".dino");
    // scoreCont=document.querySelector("#scoreCont");
    gameOver = document.querySelector(".gameOver");
    obstacle = document.querySelector(".obstacle");
    dx = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
    dy = parseInt(window.getComputedStyle(dino, null).getPropertyValue('top'));
    ox = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
    oy = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('top'));
    offsetX = Math.abs(dx - ox);
    offsetY = Math.abs(dy - oy);
    // console.log(ox);
    if (gameOn)
        obstacle.classList.add("obstacleAni");
    if (ox == 1) {
        setTimeout(function () {
            aniDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'))
            if (aniDur > 3) {
                newDur = aniDur - 0.1;
                obstacle.style.animationDuration = newDur + 's';
            }
            console.log(aniDur);
        }, 500)
    }
    if (offsetX < 150 && offsetY < 52) {
        gameOver.innerHTML = "GAME OVER - Reload to Start Over";
        obstacle.classList.remove("obstacleAni");
        audio.pause();
        if (gameOn)
            audiogo.play();
        setTimeout(() => {
            audiogo.pause();
        }, 1000);
        gameOver.style.animation = 'gameAni 2s linear infinite';
        gameOn = false;
        obstacle.style.left = ox + 'px';
        document.querySelector(".reload").style.display = 'block';
    } else if (offsetX < 200 && cross) {
        score += 1;
        updateScore(score);
        cross = false;
        setTimeout(() => {
            cross = true;
        }, 1000);
    }
}, 10);

function updateScore(score) {
    scoreCont.innerHTML = "Your Score: " + score;
}

function fun() {
    location.reload();
}
function play() {
    gameOn = true;
    document.querySelector(".play").style.display = 'none';
}

function home() {
    window.location.href = "https://sumit2001.github.io/kidGames/";
}