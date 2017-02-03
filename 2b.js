
function getIntersection(ray,segment){
	let r_px = ray.a.x;
	let r_py = ray.a.y;
	let r_dx = ray.b.x-ray.a.x;
	let r_dy = ray.b.y-ray.a.y;

	let s_px = segment.a.x;
	let s_py = segment.a.y;
	let s_dx = segment.b.x-segment.a.x;
	let s_dy = segment.b.y-segment.a.y;

	let r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
	let s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
	if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag || r_dx==0){
		return null;
	}
	let T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
	let T1 = (s_px+s_dx*T2-r_px)/r_dx;

	if(T1<0)	{		return null;}
	if(T2<0 || T2>1) {  return null;}
	
	let result = {
		x: r_px+r_dx*T1,
		y: r_py+r_dy*T1,
		param: T1
	};
      
	return result;

}

function expansion(a,b){
	//random expansion
	let rnd= Math.random()*10%10;
	let dx = a.x - b.x;
	let dy = a.y - b.y;
	if(dx<0) dx=0;
	if(dy<0) dx=0;
	let length = Math.sqrt(dx*dx+dy*dy);
	if(length==0)
	{
		console.log('errpr');
		 return {x:0,y:0};
	}
	console.log()
	let shiftx=rnd*dx/length;
	let shifty=rnd*dy/length;
	console.log({x:b.x+shiftx,y:b.y+shifty});
    return {x:b.x+shiftx,y:b.y+shifty};
}

function getIntersectionPoint(segment,ray,points){
	let counter = 0;
	let border = segment.getLine();
	let breaking = false;
	let end =false;
	segment.breaking =[]
	let closestIntersect = null;
		for(let i=0;i<border.length;i++){
			
		let intersect = getIntersection(ray,border[i]);
		
		if(!intersect) continue;
			
			counter++;
		segment.border.splice([i+counter],0,{x:intersect.x,y:intersect.y,breaking:border[i],isnew:true});
		
		points.push(intersect);
		
		// if(!closestIntersect || intersect.param<closestIntersect.param){
			// closestIntersect =  intersect;
			// // end=true;
			// segment.fillcolor=true;
		// }
		breaking=true;
	}
	return {end:end,counter:counter,breaking:breaking};
}


///////////////////////////////////////////////////////

// DRAWING
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
function draw(){
	
	// Clear canvas  this part next for refactoring, all redraw is bad idea.
	ctx.clearRect(0,0,canvas.width,canvas.height);
 
	
		
	// Draw segments
	ctx.lineWidth =1;
	ctx.strokeStyle = "#999";
	for(let i=0;i<segments.length;i++){
		segments[i].draw(ctx);		
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

// LINE SEGMENTS
let segments = [
	// polygon #1
	new Polygon([{x:100,y:150},{x:200,y:80},{x:140,y:210}],'polygon #1')
	,// polygon #2
	new Polygon([{x:100,y:200},{x:120,y:250},{x:60,y:300}],'polygon #2')
	,// polygon #3
	new Polygon([{x:200,y:260},{x:220,y:150},{x:300,y:200},{x:350,y:320}],'polygon #3')
	,// polygon #4
	new Polygon([{x:340,y:60},{x:360,y:40},{x:370,y:70}],'polygon #4')
	,// polygon #5
	new Polygon([{x:450,y:190},{x:560,y:170},{x:540,y:270}, {x:430,y:290}],'polygon #5')
	,// polygon #6*/
	new Polygon([{x:400,y:95}, {x:580,y:50},{x:480,y:150}],'polygon #5')
	
	,new Solder({x: canvas.width/2,y: canvas.height/2})
	,
];




// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
let updateCanvas = true;
function drawLoop(){
	try{
   
    if(updateCanvas){
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
	
	selectRect = new SelectRect(e);
	
}
mouseUpListener = function(e){
	if(selectRect!==null){
		if(selectRect.dontMove()){ 
			
			 
			 
			let units =segments.filter((d) =>d.iskey('solder') && d.hasSelect());
			for(let unit of units)
			{		
				let position =unit.getPos();
				let ray = {
					a:{x:position.x,y:position.y},
					b:{x: event.clientX,y:event.clientY}
				};

				// Find CLOSEST intersection
				let points = [];
				let newpolygons = [];
				for(let i=0;i<segments.length;i++){
					let polygon = segments[i];
					if(!polygon.iskey('polygon')){
					  continue;
					}
					polygon.fillcolor=false;
					let result = getIntersectionPoint(polygon,ray,points);		
					if(result.breaking) {

						let newborder=[];
						let newpolygon = new Polygon();
						let rubishStart = false;
						
						for(let z=0;z<polygon.border.length;z++){
							let point=polygon.border[z];
							if (!rubishStart){
								if (!point.isnew){
									newborder.push(point);
								}
								else{
									rubishStart=true;						
									newpolygon.border.push(expansion(point.breaking.b,{x:point.x,y:point.y}));
									newborder.push(expansion(point.breaking.a,{x:point.x,y:point.y}));
								
								}
							}
							else{
								if (!point.isnew){
									newpolygon.border.push(point);
								}
								else{
									rubishStart=false;
									newborder.push(expansion(point.breaking.b, {x:point.x,y:point.y}));
									newpolygon.border.push(expansion(point.breaking.a,{x:point.x,y:point.y}));
									
									point.isnew=null;
								}
							}					
						}

						polygon.border  = newborder;
						newpolygons.push(newpolygon);
					}
						
					
				}
				 // console.log('stop closestIntersect:' + newpolygons.length);
				
				for(var polygon of newpolygons){
					segments.push(polygon);
				}
			}
				
			 
			 
		}
		else{
			selectRect.selectSolder(segments.filter(function(d){return d.iskey('solder')}));
		}
		selectRect=null;
	}
	
	
}

mouseMoveListener = function(e){
	if(selectRect!==null){
		selectRect.mousemove(e);
	}
	
	
}

keyDownListener = function(e){
	let units =segments.filter((d) =>d.iskey('solder') && d.hasSelect());
	units.forEach((d)=>d.control(e));
}

window.addEventListener('keydown',keyDownListener,true);
canvas.addEventListener("mousedown", mouseDownListener, false);
canvas.addEventListener("mouseup", mouseUpListener, false);
canvas.addEventListener("mousemove", mouseMoveListener, false);