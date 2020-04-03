var canvas = document.getElementById("snakeCanvas");
var score = document.getElementById("score");
var startBtn = document.getElementById("startBtn");
var context = canvas.getContext("2d");
var fruit=document.getElementById("fruit");
//coordinates of snake head
var snakeHeadX; 
var snakeHeadY;
var speed=1;
var xSpeed;
var ySpeed;
const scale = 20;
var rows = canvas.height / scale;
var columns = canvas.width / scale;
var min = scale / 10; //for min coordinate of fruit
var max = rows - min; //for max 
var fruitX;
var fruitY;
var tail;
var totalTail;
var direction,
    previousDir;
var interval;

startBtn.addEventListener("click", startGame);

function startGame() {
    clearInterval(interval);
    init();
}

function init() {
    reset();
    main();
}

//EventListener to check which arrow key is pressed
window.addEventListener("keydown", (event) => {
    previousDir = direction;
    direction = event.key.replace("Arrow", "");
    changeDirection();
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
        boundaryCollision=true
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
        context.rect(snakeHeadX, snakeHeadY, scale, scale);
        context.fillStyle = "#e99100";
        context.fill();
        //draw snake's tail
        context.beginPath();
        context.fillStyle = "#ffaa1d";
        for (i = 0; i < tail.length; i++) {
            context.rect(tail[i].tailX, tail[i].tailY, scale, scale);
        }
        context.fill();
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
    //fruit position at starting
    fruitPosition();
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
        score.innerText = totalTail * 5;

    }, 200);
}