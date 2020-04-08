var canvas = document.getElementById("snakeCanvas");
var score = document.getElementById("score");
var startBtn = document.getElementById("startBtn");
var pauseBtn = document.getElementById("pauseBtn");
var resumeBtn = document.getElementById("resumeBtn");
var context = canvas.getContext("2d");
var fruit=document.getElementById("fruit");
//coordinates of snake head
var snakeHeadX, snakeHeadY, fruitX, fruitY, tail, totalTail, direction, previousDir;
var speed=1, xSpeed, ySpeed;
const scale = 20;
var rows = canvas.height / scale;
var columns = canvas.width / scale;
var min = scale / 10; //for min coordinate of fruit
var max = rows - min; //for max 
var interval;
var playing=false, gameStarted=false;
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
resumeBtn.addEventListener("click", resumeGame)

function startGame() {
    
    gameStarted=true;
    playing=true;
    // clearInterval(interval);
    init();
}

function init() {
    reset();
    //fruit position at starting
    fruitPosition();
    main();
}

function pauseGame()
{
    window.clearInterval(interval);
    pauseBtn.style.backgroundColor="#ccc";
    resumeBtn.style.backgroundColor="#fff";
    playing=false;
}

function resumeGame()
{
    main();
    pauseBtn.style.backgroundColor="#fff";
    resumeBtn.style.backgroundColor="#ccc";
    playing=true;
}

//EventListener to check which arrow key is pressed
window.addEventListener("keydown", (event) => {
    if(event.keyCode===32 && gameStarted) {
        if(playing) {
            pauseGame();
        }
        else{
            resumeGame();
        }
    }
    else {
        previousDir = direction;
        direction = event.key.replace("Arrow", "");
        changeDirection();
    }
});

//reset the variables to starting value
function reset() {
    tail = [];
    totalTail = 0;
    direction = "Right";
    previousDir = "Right";
    xSpeed = scale * speed;
    ySpeed = 0;
    snakeHeadX = 0;
    snakeHeadY = 0;
    pauseBtn.style.backgroundColor="#fff";
    resumeBtn.style.backgroundColor="#fff";
}

//check snake's collision 
function checkCollision() {
    let tailCollision=false, boundaryCollision=false;
    //with its own tail
    for (let i = 0; i < tail.length; i++) {
        if (snakeHeadX == tail[i].tailX && snakeHeadY == tail[i].tailY) {
            tailCollision=true;
        }
    }
    //with boundaries
    if(snakeHeadX >= canvas.width || snakeHeadX < 0 || snakeHeadY >= canvas.height || snakeHeadY < 0)
    {
        boundaryCollision=true;
    }
    return (tailCollision || boundaryCollision);
}

//display snake
function drawSnake() {
    //check collision with canvas boundaries or its own tail
    if (checkCollision()) {
        alert("Game Over! Your Score is: " + totalTail * 5);
        window.location = window.location; //reload the page        
    } else {
        //draw snake's head
        context.beginPath();
        context.arc(snakeHeadX+scale/2, snakeHeadY+scale/2, scale/2, 0, 2 * Math.PI);
        context.fillStyle = "#7d4350";
        // context.fillStyle = "#ff391d";
        context.fill();
        //eyes
        context.beginPath();
        if(direction==="Up") {
            //1st eye
            context.arc(snakeHeadX+4, snakeHeadY+4, 2.5, 0, 2 * Math.PI);
            //2nd eye
            context.arc(snakeHeadX+scale-4, snakeHeadY+4, 2.5, 0, 2 * Math.PI);
        }
        else if(direction==="Down") {
            //1st eye
            context.arc(snakeHeadX+4, snakeHeadY+scale-4, 2.5, 0, 2 * Math.PI);
            //2nd eye
            context.arc(snakeHeadX+scale-4, snakeHeadY+scale-4, 2.5, 0, 2 * Math.PI);
        }
        else if(direction==="Left") {
            //1st eye
            context.arc(snakeHeadX+4, snakeHeadY+4, 2.5, 0, 2 * Math.PI);
            //2nd eye
            context.arc(snakeHeadX+4, snakeHeadY+scale-4, 2.5, 0, 2 * Math.PI);
        }
        else {
            //1st eye
            context.arc(snakeHeadX+scale-4, snakeHeadY+4, 2.5, 0, 2 * Math.PI);
            //2nd eye
            context.arc(snakeHeadX+scale-4, snakeHeadY+scale-4, 2.5, 0, 2 * Math.PI);
        }
        context.fillStyle = "black";
        context.fill();
        //draw snake's tail
        let tailRadius = 5;
        for (i = 0; i < tail.length; i++) {
            tailRadius=tailRadius+(5/tail.length);
            context.beginPath();
            context.fillStyle = "#6c2c3a";
            context.arc((tail[i].tailX+scale/2), (tail[i].tailY+scale/2), tailRadius, 0, 2 * Math.PI);
            context.fill();
        }
        
    }

}

//move snake by shifting previous coordinates of snake's head and tail
function updateSnakePosition() {
    for (let i = 0; i < tail.length - 1; i++) {
        tail[i] = tail[i + 1];
    }
    tail[totalTail - 1] = { tailX: snakeHeadX, tailY: snakeHeadY };
    snakeHeadX += xSpeed;
    snakeHeadY += ySpeed;

}

//generate random fruit position within canvas boundaries
function fruitPosition() {
    fruitX = (Math.floor(Math.random() * (max - min) + min)) * scale;
    fruitY = (Math.floor(Math.random() * (max - min) + min)) * scale;
    //generate position again if it is same as some part of snake's tail (as it will hide behind tail) 
    for(let i=0; i< tail.length; i++){
        if(fruitX===tail[i].tailX && fruitY===tail[i].tailY)
        {
            console.log("same",fruitX,fruitY);
            fruitPosition();
        }
    }
}

//draw image of fruit
function drawFruit() {
    context.drawImage(fruit, fruitX, fruitY, scale, scale);
}

//change the direction of snake
function changeDirection() {
    switch (direction) {
        case "Up":
            //move "up" only when previous direction is not "down"
            if (previousDir !== "Down") {
                xSpeed = 0;
                ySpeed = scale * -speed;
            } else {
                direction = "Down";
            }
            break;

        case "Down":
            //move "down" only when previous direction is not "up"
            if (previousDir !== "Up") {
                xSpeed = 0;
                ySpeed = scale * speed;
            } else {
                direction = "Up";
            }
            break;

        case "Left":
            //move "left" only when previous direction is not "right"
            if (previousDir !== "Right") {
                xSpeed = scale * -speed;
                ySpeed = 0;
            } else {
                direction = "Right";
            }
            break;

        case "Right":
            //move "right" only when previous direction is not "left"
            if (previousDir !== "Left") {
                xSpeed = scale * speed;
                ySpeed = 0;
            } else {
                direction = "Left";
            }
            break;
    }
}

function main() {
    //update state at specified interval
    interval = window.setInterval(() => {
        context.clearRect(0, 0, 500, 500);
        drawFruit();
        updateSnakePosition();
        drawSnake();

        //check if snake eats the fruit - increase size of its tail, update score and find new fruit position
        if (snakeHeadX === fruitX && snakeHeadY === fruitY) {
            totalTail++;
            fruitPosition();
        }
        score.innerText = totalTail;

    }, 150);
}