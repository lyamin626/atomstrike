// DRAWING
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
function draw(timer){
	// Clear canvas  this part next for refactoring, all redraw is bad idea.  need change only changeable element
	ctx.clearRect(0,0,canvas.width,canvas.height);
		
	// Draw battlefield
	ctx.lineWidth =1;
	//ctx.strokeStyle = "#999";
    let removeitems = [];
    for (let i = 0; i < battlefield.length; i++){
        let result = battlefield[i].draw(ctx, battlefield);
        if (result =='remove') {
            battlefield.splice(i, 1);
            i--;
        }
    }
		
	// for(let intersect of points.sort( (a,b)=>a.param-b.param))
	// {			
	// // Draw red laser
	// ctx.strokeStyle = "#dd3838";
	// ctx.beginPath();
	// ctx.moveTo(320,180);
	// ctx.lineTo(intersect.x,intersect.y);
	// ctx.stroke();
	
	// // Draw red dot
	// ctx.fillStyle = "#dd3838";
	// ctx.beginPath();
    // ctx.arc(intersect.x, intersect.y, 4, 0, 2*Math.PI, false);
    // ctx.fill(); 
	// }
	if(selectRect!=null) 
	 {selectRect.draw();}
}

// Battlefield parts
let battlefield = [
    // polygon #1
    new Polygon([{ x: 100, y: 150 }, { x: 200, y: 80 }, { x: 140, y: 210 }], 'polygon #1')
    ,// polygon #2
    new Polygon([{ x: 100, y: 200 }, { x: 120, y: 250 }, { x: 60, y: 300 }], 'polygon #2')
    ,// polygon #3
    new Polygon([{ x: 200, y: 260 }, { x: 220, y: 150 }, { x: 300, y: 200 }, { x: 350, y: 320 }], 'polygon #3')
    ,// polygon #4
    new Polygon([{ x: 340, y: 60 }, { x: 360, y: 40 }, { x: 370, y: 70 }], 'polygon #4')
    ,// polygon #5
    new Polygon([{ x: 450, y: 190 }, { x: 560, y: 170 }, { x: 540, y: 270 }, { x: 430, y: 290 }], 'polygon #5')
    ,// polygon #6*/
    new Polygon([{ x: 400, y: 95 }, { x: 580, y: 50 }, { x: 480, y: 150 }], 'polygon #5')

    , new Solder({ x: canvas.width - 50, y: canvas.height / 5 }, 'red', canvas)
    , new Solder({ x: canvas.width - 50, y: canvas.height *2/ 5 }, 'red', canvas)
    , new Solder({ x: canvas.width - 50, y: canvas.height *3/ 5 }, 'red', canvas)
    , new Solder({ x: canvas.width - 50, y: canvas.height *4/ 5 }, 'red', canvas)

    , new Solder({ x: 50, y: canvas.height / 5 }, 'green', canvas)
    , new Solder({ x: 50, y: canvas.height * 2 / 5 }, 'green', canvas)
    , new Solder({ x: 50, y: canvas.height * 3 / 5 }, 'green', canvas)
    , new Solder({ x: 50, y: canvas.height * 4 / 5 }, 'green',canvas)
];


// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
let updateCanvas = true;
let lastRender = new Date();
let timer = 0;
function drawLoop(){
	try{
        if (updateCanvas) {
            timer = new Date() - lastRender;
            draw();
            requestAnimationFrame(drawLoop);
            //updateCanvas = false;
        }
	}
	catch(e)
	{
		console.log(e);
		updateCanvas=false;
	}
}
window.onload = function(){
	drawLoop();
};

// MOUSE	
 let Mouse = {
	 x:canvas.width/2,
	 y:0
 };
 // canvas.onmousedown = function(event){	
	 // Mouse.x = event.clientX;
	 // Mouse.y = event.clientY;
 // };
//canvas.onmousedown = function(event){ updateCanvas = true;drawLoop();}
let selectRect = null;

mouseDownListener = function(e){
	if(event.button==0)		{
		selectRect = new SelectRect(e);
	}
	return false;
}

leftclickListener = function(e){

    let units = battlefield.filter((d) => d.iskey('solder') && d.hasSelect());
			for(let unit of units)
            {	
                let bullet = unit.fire({ x: event.clientX, y: event.clientY });
                if (bullet != null) {
                    battlefield.push(bullet);
                }
			}
			
}
mouseUpListener = function(e){
	if(selectRect!==null){
	    selectRect.selectSolder(battlefield.filter(function(d){return d.iskey('solder')}));			
		selectRect=null;
	}
	
	
}

mouseMoveListener = function(e){
	if(selectRect!==null){
		selectRect.mouseMove(e);
	}
}

keyDownListener = function(e){
    let units = battlefield.filter((d) =>d.iskey('solder') && d.hasSelect());
    units.forEach((d) => d.control(e, battlefield));
}

window.addEventListener('keydown',keyDownListener,true);

canvas.addEventListener("mousedown", mouseDownListener, false);
canvas.addEventListener("mouseup", mouseUpListener, false);
canvas.addEventListener("mousemove", mouseMoveListener, false);
canvas.addEventListener("contextmenu", leftclickListener, false);

//ignore standart context menu
 canvas.oncontextmenu = function() {   
    return false;
 }
