var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, sun;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("v.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  sunImage = loadImage("369.png")
  
  
  
 
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  
  ground = createSprite(windowWidth,height-30,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  sun = createSprite(width-100, height-640)
  sun.addImage(sunImage)
  sun.scale = 0.4
  
  trex = createSprite(50,height-25,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.6;
  
  
   gameOver = createSprite(width/2, height/2.5);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.6;
  restart.scale = 0.6;
  
  invisibleGround = createSprite(200,height-25,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  trex.setCollider("circle",0,0,40);
  
  score = 0;
  
}

function draw() {
  
 background("lightblue");
  //displaying score
 textSize(25)
  textFont("Algerian")
  fill("yellow")
  stroke("red")
  strokeWeight(5)
  text("Score: "+ score, width-1520,height-750);
  
 
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
   ground.velocityX = -6
    //scoring
    score = score + Math.round(getFrameRate()/60)
    
    //jump when the space key is pressed
    if(touches.lenght > 0 || keyDown("space")&& trex.y >= 600) {
        trex.velocityY = -13;
      jumpSound.play();
      touches = []
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play();
    }
    trex.changeAnimation("running", trex_running)
    
  if(ground.x < width/2){
    ground.x = ground.width/2
  }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true
     ground.velocityX = 0
      trex.velocityY = 0
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     if(touches.lenght > 0 || mousePressedOver(restart)) {
       gameState = PLAY
       score = 0
       restart.visible = false
       gameOver.visible = false
       obstaclesGroup.destroyEach()
       cloudsGroup.destroyEach()
       touches = []
     }
   }
  if(score % 100 == 0 && score>0) {
    checkPointSound.play();
  }
  

  //stop trex from falling down
  trex.collide(invisibleGround);
  

  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 80  === 0){
   var obstacle = createSprite(windowWidth,height-45,10,40);
   obstacle.velocityX = -6;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.6;
    obstacle.lifetime = 900;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 70 === 0) {
     cloud = createSprite(windowWidth,100,40,10);
    cloud.y = Math.round(random(200, 600));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 900;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

