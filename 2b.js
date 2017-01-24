
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

	// SOLVE FOR T1 & T2
	// r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
	// ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
	// ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
	// ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
	let T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
	let T1 = (s_px+s_dx*T2-r_px)/r_dx;

	// Must be within parametic whatevers for RAY/SEGMENT
	if(T1<0)	{ console.log('t1');		return null;}
	if(T2<0 || T2>1) { console.log('t2'); return null;}
	
	let result = {
		x: r_px+r_dx*T1,
		y: r_py+r_dy*T1,
		param: T1
	};
	
console.log(result);
	// Return the POINT OF INTERSECTION
	return result;

}


function getIntersectionPoint(segment,ray,points){
	let counter = 0;
	let border = segment.border.slice();
	let rabish = false;
	let end =false;
	let closestIntersect = null;
		for(let a=0;a<border.length;a++){
			counter++;
		let intersect = getIntersection(ray,border[a]);
		
		if(!intersect) continue;				
		
		
		
		segment.border.splice(a+1,0,{border:{a:border[a],b:intersect},isnew:true});
		points.push(intersect);
		// if(!closestIntersect || intersect.param<closestIntersect.param){
			// closestIntersect =  intersect;
			// // end=true;
			// segment.fillcolor=true;
		// }
		rabish=true;
	}
	return {end:end,counter:counter,rabish:rabish};
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
		polygon.fillcolor=false;
		let result = getIntersectionPoint(polygon,ray,points);		
		if(result.rabish) {
			console.log('rabish');
			let newborder=[];
			let newpolygon = new Polygon();
			let rubishStart = false;
			for(let border of polygon.border)
			{
				if (!rubishStart){
					if (!border.isnew){
						newborder.push(border);
					}
					else{
						rubishStart=true;
						newpolygon.border.push(border.border);
					}
				}
				else{
					if (border.isnew){
						newpolygon.border.push(border.border);
					}
					else{
						rubishStart=false;
						newborder.push(border);
					}
				}
					
			}
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
			ctx.moveTo(border[0].a.x,border[0].a.y);
			for(let a=0;a<border.length;a++){
				let seg =border[a];
				ctx.lineTo(seg.b.x,seg.b.y);	
				ctx.stroke();	
			}
			if(segment.fillcolor && segment.key=='polygon' ){	
				 ctx.fillStyle = "green";
				 ctx.fill();		
			}
		}
		 ctx.closePath();		
		
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
	// Polygon #1
	{key:'polygon',border:[
	{a:{x:100,y:150}, b:{x:120,y:50}},
	{a:{x:120,y:50}, b:{x:200,y:80}},
	{a:{x:200,y:80}, b:{x:140,y:210}},
	{a:{x:140,y:210}, b:{x:100,y:150}},
	]},
	// Polygon #2
	{key:'polygon',border:[
	{a:{x:100,y:200}, b:{x:120,y:250}},
	{a:{x:120,y:250}, b:{x:60,y:300}},
	{a:{x:60,y:300}, b:{x:100,y:200}},
	]},
	// Polygon #3
	{key:'polygon',border:[
	{a:{x:200,y:260}, b:{x:220,y:150}},
	{a:{x:220,y:150}, b:{x:300,y:200}},
	{a:{x:300,y:200}, b:{x:350,y:320}},
	{a:{x:350,y:320}, b:{x:200,y:260}},
	]},
	// Polygon #4
	{key:'polygon',border:[
	{a:{x:340,y:60}, b:{x:360,y:40}},
	{a:{x:360,y:40}, b:{x:370,y:70}},
	{a:{x:370,y:70}, b:{x:340,y:60}},
	]},
	// Polygon #5
	{key:'polygon',border:[
	{a:{x:450,y:190}, b:{x:560,y:170}},
	{a:{x:560,y:170}, b:{x:540,y:270}},
	{a:{x:540,y:270}, b:{x:430,y:290}},
	{a:{x:430,y:290}, b:{x:450,y:190}},
	]},
	// Polygon #6
	{key:'polygon',border:[
	{a:{x:400,y:95}, b:{x:580,y:50}},
	{a:{x:580,y:50}, b:{x:480,y:150}},
	{a:{x:480,y:150}, b:{x:400,y:95}}
	]},
	// Border
	{key:'field',border:[
	{a:{x:0,y:0}, b:{x:640,y:0}},
	{a:{x:640,y:0}, b:{x:640,y:360}},
	{a:{x:640,y:360}, b:{x:0,y:360}},
	{a:{x:0,y:360}, b:{x:0,y:0}}
	]},
];


class Polygon {
    constructor(border) {
        this.border = border||[];
		}
    explosion() {
        console.log('notworking');
    }
}

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


