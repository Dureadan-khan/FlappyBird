//board
let board;
let boardWidth=360;
let boardHeight=640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird ={
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray=[];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityx = -2;
let velocityy = 0;
let gravity = 0.4;
let gameOver = false;
let score = 0;





window.onload=function(){
    board = document.getElementById("board");


    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw the bird
    //context.fillstyle = "green";
    //context.fillRect(bird.x,bird.y,bird.width,bird.height);

    ///load image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";
    
    requestAnimationFrame(update);

    setInterval(placePipes, 1500);
    document.addEventListener("keydown",moveBird);

}


function update(){

    requestAnimationFrame(update);

    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    
    //bird
    velocityy += gravity;
    //bird.y += velocityy;
    bird.y= Math.max(bird.y+velocityy,0); //apply gravitylimithtr jump so that it doestnot get out of the canvas

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height  );
 
    if(bird.y > board.height){
        gameOver = true;
    }

    //pipes 
    for(let i=0; i< pipeArray.length; i++){
        let pipe =pipeArray[i];

        pipe.x += velocityx; 


        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x+pipe.width){
            score += 0.5;//becayse there are two pipes
            pipe.passed = true;
        }
        if(detectCollision( bird,pipe)){
            gameOver = true;
        }
    }

    //score
    context.fillStyle = "white";
    context.font = "45px san-serif";
    context.fillText(score, 5 ,45);
        
}

function placePipes(){

    if(gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let toppipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed :  false
    }

    pipeArray.push(toppipe);

    let bottompipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false



    }
    pipeArray.push(bottompipe);

}

function moveBird(e){
    if(e.code == "space" || e.code == "ArrowUp" || e.code == "keyX"){
        velocityy = -6
    }

}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;  
}