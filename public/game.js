var WIDTH = 1024;
var HEIGHT = 768;
var MIN = 0;
var MAX = 180;

var world = planck.World();

var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
var container = document.getElementById('game');
container.appendChild(renderer.view);

var stage = new PIXI.Container();

var PI = Math.PI;
var rotation = 0;

var background = new PIXI.Graphics();  
background.beginFill(0xffffff);  
background.drawRect(0, 0, WIDTH, HEIGHT);  
background.endFill();

var jumperTexture = PIXI.Texture.fromImage('/public/jumper.png');
var windTexture = PIXI.Texture.fromImage('/public/windArrow.png');

var jumper = new PIXI.Sprite(jumperTexture);
jumper.anchor.x = 0.5;  
jumper.anchor.y = 0;
jumper.position.x = 200;  
jumper.position.y = 300;

var windArrow = new PIXI.Sprite(windTexture);
windArrow.anchor.x = 0.5;  
windArrow.anchor.y = 0.5;
windArrow.position.x = 950;  
windArrow.position.y = 60;

var windPower = new PIXI.Text('', {fontFamily : 'Arial', fontSize: 24, fill : 0x000000});
windPower.position.x = 930;
windPower.position.y = 120;

stage.addChild(background);
stage.addChild(jumper);
stage.addChild(windArrow);
stage.addChild(windPower);

stage.interactive = true;

function getWindDirection() {
  var angle = Math.floor(Math.random() * (MAX - MIN)) + MIN;
  return angle * PI/180;
}

function getWindPower() {
  return (Math.random() * 4).toFixed(1);
}

function rotateToPoint(mx, my, px, py){  
  var dist_Y = my - py;
  var dist_X = mx - py;
  var angle = Math.atan2(dist_Y, dist_X) - PI/2;

  return angle;
}

function shouldRotate(rotation) {
  return rotation < 0 && rotation > -PI;
}

function animate() {  
  requestAnimationFrame(animate);
  
  world.step(1 / 60);

  rotation = rotateToPoint(
    renderer.plugins.interaction.mouse.global.x, 
    renderer.plugins.interaction.mouse.global.y, 
    jumper.position.x, 
    jumper.position.y
  );

  if (shouldRotate(rotation)) {
    jumper.rotation = rotation;
  }

  windArrow.rotation = getWindDirection();
  windPower.text = getWindPower();

  renderer.render(stage);
}

animate();