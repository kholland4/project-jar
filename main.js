var engine;
var render;
//var mouseConstraint;

var canvas;
var ctx;

var vw = 640;
var vh = 800;

var boxW = 370;
var boxH = 500;
var padBottom = 50;
var wallSize = 10;
var bottomSize = 30;

var fountainX;
var fountainY;
var fountainOffset = 100;

var ballRadMin = 5;
var ballRadMax = 7;
var ballRadTyp = 6; //used for size of box calc

var mouseX = 0;
var mouseY = 0;
var mouseHasMoved = false;

function mouseMove(e) {
  var rect = e.target.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  
  mouseHasMoved = true;
}

var runLastTime;
var frameCount = 0;

var dropCount = 0;
var toDrop = 0;
var totalCount = 0;
var holdCount = 3000;

function init() {
  canvas = document.getElementById("main");
  ctx = canvas.getContext("2d");
  
  engine = Matter.Engine.create({
    enableSleeping: true
  });
  
  /*mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: Matter.Mouse.create(canvas)
  });*/
  
  canvas.onmousemove = mouseMove;
  canvas.onmousedown = function() { mouseHasMoved = false; }
  canvas.onmouseup = function() {
    //if(!mouseHasMoved && running) { dropBall(mouseX, mouseY); }
    if(currClassIndex !== null) { //FIXME patchy
      currClassAdd(1);
      toDrop--; //FIXME patchy
      dropBall(mouseX, mouseY);
      dropCount++;
      totalCount++;
    }
  };
  
  //Matter.Engine.run(engine);
  
  begin();
  
  runLastTime = performance.now();
  run();
}
document.addEventListener("DOMContentLoaded", init);

function begin() {
  //recalc box width
  boxW = Math.round((holdCount * ballRadTyp * 2 * ballRadTyp * 2 * 0.866) / boxH);
  
  dropCount = 0;
  toDrop = 0;
  totalCount = 0;
  
  Matter.World.clear(engine.world);
  
  frameCount = 0;
  
  vw = window.innerWidth;
  vh = window.innerHeight;
  
  canvas.width = vw;
  canvas.height = vh;
  
  //Matter.World.add(engine.world, mouseConstraint);
  
  var wallLeft = Matter.Bodies.rectangle(Math.round((vw - boxW - wallSize) / 2), vh - Math.round(boxH / 2) - padBottom, wallSize, boxH, {
    isStatic: true,
    render: { fillStyle: "black" }
  });
  var wallRight = Matter.Bodies.rectangle(Math.round((vw - boxW - wallSize) / 2) + boxW + wallSize, vh - Math.round(boxH / 2) - padBottom, wallSize, boxH, {
    isStatic: true,
    render: { fillStyle: "black" }
  });
  var wallBottom = Matter.Bodies.rectangle(Math.round(vw / 2), vh - padBottom + Math.round(bottomSize / 2), boxW + wallSize * 2, bottomSize, {
    isStatic: true,
    render: { fillStyle: "black" }
  });
  
  Matter.World.add(engine.world, [wallLeft, wallRight, wallBottom]);
  
  fountainX = Math.round(vw / 2);
  fountainY = vh - boxH - padBottom - wallSize - fountainOffset;
  
  runLastTime = performance.now();
}

function run() {
  window.requestAnimationFrame(run);
  
  var currentTime = performance.now();
  var frameTime = (currentTime - runLastTime);
  runLastTime = currentTime;
  if(frameTime > 2000) { frameTime = 1000 / 60; } /*FIXME*/
  
  //Matter.Engine.update(engine, frameTime);
  Matter.Engine.update(engine, 1000 / 60);
  
  
  
  if(frameCount % 3 == 0) {
    var bodies = Matter.Composite.allBodies(engine.world);
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, vw, vh);
    
    for(var i = 0; i < bodies.length; i++) {
      if(typeof bodies[i].circleRadius === "undefined") {
        ctx.beginPath();
        
        var vertices = bodies[i].vertices;
        
        ctx.moveTo(vertices[0].x, vertices[0].y);
        
        for (var n = 1; n < vertices.length; n++) {
          ctx.lineTo(vertices[n].x, vertices[n].y);
        }
        
        ctx.lineTo(vertices[0].x, vertices[0].y);
        
        //ctx.lineWidth = 4;
        ctx.fillStyle = bodies[i].render.fillStyle;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(bodies[i].position.x, bodies[i].position.y, bodies[i].circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = bodies[i].render.fillStyle;
        ctx.fill();
      }
    }
    
    ctx.fillStyle = "black";
    ctx.font = "100px sans-serif";
    ctx.fillText(totalCount.toString(), 50, 100);
  }
  
  if(dropCount < toDrop && frameCount % 4 == 0) {
    var shouldDrop = Math.max(Math.round(boxW / 50), 2);
    
    for(var i = 0; i < Math.min(shouldDrop, toDrop - dropCount); i++) {
      dropBall(Matter.Common.random(Math.min(fountainX - Math.round(boxW / 2) + ballRadTyp * 8, fountainX), Math.max(fountainX + Math.round(boxW / 2) - ballRadTyp * 8), fountainX), fountainY);
      dropCount++;
      totalCount++;
    }
  }
  
  frameCount++;
}

function dropBall(x, y) {
  var ball = Matter.Bodies.circle(x, y, Matter.Common.random(ballRadMin, ballRadMax), {
    restitution: 0,
    density: 0.00001,
    sleepThreshold: 10,
    friction: 0.7,
    render: {
      fillStyle: randomColor()
    }
  }, 7);
  
  Matter.Events.on(ball, "sleepStart", function() {
    Matter.Body.setStatic(this, true);
  });
  
  Matter.Body.setVelocity(ball, {
    //x: Matter.Common.random(-4, 4),
    x: 0,
    //y: Matter.Common.random(-4, 0)
    y: 0
  });
  Matter.Body.setAngularVelocity(ball, Matter.Common.random(-0.1, 0.1));
  
  Matter.World.add(engine.world, ball);
}

function randomColor() {
  return '#'+Math.random().toString(16).substr(2,6);
}
