
// Find intersection of RAY & SEGMENT
function getIntersection(ray,segment){

	// RAY in parametric: Point + Direction*T1
	let r_px = ray.a.x;
	let r_py = ray.a.y;
	let r_dx = ray.b.x-ray.a.x;
	let r_dy = ray.b.y-ray.a.y;

	// SEGMENT in parametric: Point + Direction*T2
	let s_px = segment.a.x;
	let s_py = segment.a.y;
	let s_dx = segment.b.x-segment.a.x;
	let s_dy = segment.b.y-segment.a.y;

	// Are they parallel? If so, no intersect
	let r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
	let s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
	if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){ // Directions are the same.
		return null;
	}
	let T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
	let T1 = (s_px+s_dx*T2-r_px)/r_dx;

	// Must be within parametic whatevers for RAY/SEGMENT
	if(T1<0)	{		return null;}
	if(T2<0 || T2>1) {  return null;}
	
	let result = {
		x: r_px+r_dx*T1,
		y: r_py+r_dy*T1,
		param: T1
	};
      
	// Return the POINT OF INTERSECTION
	return result;

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
			console.log(i);
			counter++;
		segment.border.splice([i+counter],0,{x:intersect.x,y:intersect.y,breaking:border[i],isnew:true});
		console.log('with counter: '+(i+counter));
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
	
	// Clear canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);
 
	// Ray from center of screen to mouse
	let ray = {
		a:{x:320,y:180},
		b:{x:Mouse.x,y:Mouse.y}
	};

	// Find CLOSEST intersection
	let points = [];
	let newpolygons = [];
	for(let i=0;i<segments.length;i++){
		let polygon = segments[i];
		if(polygon.constructor.name!='Polygon'){
		  continue;
		}
		polygon.fillcolor=false;
		console.log(polygon.border);
		let result = getIntersectionPoint(polygon,ray,points);		
		if(result.breaking) {
			console.log(polygon.border);
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
						newpolygon.border.push({x:point.x,y:point.y});
						newborder.push({x:point.x,y:point.y});
						
					}
				}
				else{
					if (!point.isnew){
						newpolygon.border.push(point);
					}
					else{
						rubishStart=false;
						newborder.push({x:point.x,y:point.y});
						newpolygon.border.push({x:point.x,y:point.y});
						
						point.isnew=null;
					}
				}
					
			}
			console.log(newborder,newpolygon);
			polygon.border  = newborder;
			newpolygons.push(newpolygon);
		}
			
		
	}
	console.log('stop closestIntersect:' + newpolygons.length);
	
	for(var polygon of newpolygons){
		segments.push(polygon);
	}
		
		
	// Draw segments
	ctx.lineWidth =1;
	ctx.strokeStyle = "#999";
	for(let i=0;i<segments.length;i++){
		let segment = segments[i];
		let border = segment.border;
		
		ctx.beginPath();
			//ctx.moveTo(border[0].x,border[0].y);
			for(let a=0;a<border.length;a++){
				let b =border[a];
				if(a==0){
					ctx.moveTo(b.x,b.y)
				}else{
					ctx.lineTo(b.x,b.y);	
					
				}
			}
			 ctx.closePath();	
			 ctx.stroke();	
			if(segment.fillcolor && segment.key=='polygon' ){	
				 ctx.fillStyle = "green";
				 ctx.fill();		
			}
	}
		
		
	
	
	
	for(let intersect of points.sort( (a,b)=>a.param-b.param))
	{			
	// Draw red laser
	ctx.strokeStyle = "#dd3838";
	ctx.beginPath();
	ctx.moveTo(320,180);
	ctx.lineTo(intersect.x,intersect.y);
	ctx.stroke();
	
	// Draw red dot
	ctx.fillStyle = "#dd3838";
	ctx.beginPath();
    ctx.arc(intersect.x, intersect.y, 4, 0, 2*Math.PI, false);
    ctx.fill(); 
	}
}

// LINE SEGMENTS
let segments = [
	// polygon #1
	new Polygon([{x:100,y:150},{x:200,y:80},{x:140,y:210}])
	,// polygon #2
	new Polygon([{x:100,y:200},{x:120,y:250},{x:60,y:300}])
	,// polygon #3
	new Polygon([{x:200,y:260},{x:220,y:150},{x:300,y:200},{x:350,y:320}])
	,// polygon #4
	new Polygon([{x:340,y:60},{x:360,y:40},{x:370,y:70}])
	,// polygon #5
	new Polygon([{x:450,y:190},{x:560,y:170},{x:540,y:270}, {x:430,y:290}])
	,// polygon #6*/
	new Polygon([{x:400,y:95}, {x:580,y:50},{x:480,y:150}])
	,// Border
	{key:'field',border:[
	{a:{x:0,y:0}, b:{x:640,y:0}},
	{a:{x:640,y:0}, b:{x:640,y:360}},
	{a:{x:640,y:360}, b:{x:0,y:360}},
	{a:{x:0,y:360}, b:{x:0,y:0}}
	]},
];




// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
let updateCanvas = true;
function drawLoop(){
	try{
    requestAnimationFrame(drawLoop);
    if(updateCanvas){
    	draw();
    	updateCanvas = false;
    }
	}
	catch(e)
	{
		console.log(e);
		updateCanvas=false;
	}
}
window.onload = function(){
	
};

// MOUSE	
let Mouse = {
	x: canvas.width/2+10,
	y: canvas.height/2
};
canvas.onmousemove = function(event){	
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
	
};

canvas.onmousedown = function(event){ updateCanvas = true;drawLoop();}


