class Polygon {
    constructor(border) {
        this.border = border||[];
		}
    explosion() {
        console.log('notworking');
    }
	getLine(){
		let lines =[];
		for (let i=1;i<this.border.length;i++){
			if(i==1){
				lines.push({a:this.border[0],b:this.border[1]});
			}
			else{
				lines.push({a:this.border[i-1],b:this.border[i]});
			}
		}
		lines.push({a:this.border[this.border.length-1],b:this.border[0]});
		return lines;
	}
	draw(ctx){
		ctx.beginPath();
		for(let a=0;a<this.border.length;a++){
			let b =this.border[a];
			if(a==0){
				ctx.moveTo(b.x,b.y)
			}else{
				ctx.lineTo(b.x,b.y);
			}
		}
		ctx.strokeStyle='gray';
		ctx.closePath();	
		ctx.stroke();	
		
	}
	iskey(name){
		return name == 'polygon';
	}
	
}
class SelectRect{
	constructor(point){
		this.x = point.pageX;
		this.y = point.pageY;
		this.w=0;
		this.h=0;
	}
	mousemove(e){
		
		this.w = e.pageX-this.x;
		this.h = e.pageY-this.y;
	}
	dontMove(){
		return this.w==this.h && this.h==0;
	}
	getZone(){
		return {x:this.x,y:this.y,x1:this.x+this.h,y1: this.y+this.w};
	}
	selectSolder(unit){				
		let zone = this.getZone();
		unit.forEach(function(d){
			d.setSelect(d.pos.x>=zone.x && d.pos.x<=zone.x1 && d.pos.y >=zone.y && d.pos.y<= zone.y1)
		});
	}
	draw(сtx){
		 ctx.beginPath();
		ctx.strokeStyle ='back';
		 
		 ctx.rect(this.x,this.y,this.w,this.h);
		 ctx.closePath();
		 ctx.stroke()
		 
	}
	iskey(name){
		return name == 'selectRect';
	}
}
class Solder{
	constructor(position,param){
		this.weight = 50;
		this.selected=false;
		this.pos = position;
	}
	draw(ctx){
	  ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.weight/5, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.lineWidth =1;
      ctx.strokeStyle = this.selected?'#FF0000':'#003300';
      ctx.stroke();
	}
	setSelect(select){
		this.selected=select;
	}
	iskey(name){
		return name == 'solder';
	}
	hasSelect(){ return this.selected;}
	getPos(){
		return this.pos;
	}
	// control(evt){
		  // switch (evt.keyCode) {
			// case 87:  /* Up - [w]*/
				// if (y - dy > 0){ 
				// y -= dy;
				// }
			  // break;
			// case 83:  /* Down [s] */
				// if (y + dy < HEIGHT){ 
				// y += dy;
				// }
			  // break;
			// case 65:  /* Left [a] */
				// if (x - dx > 0){ 
				// x -= dx;
				// }
			  // break;
			// case 68:  /* Right -[d] */
				// if (x + dx < WIDTH){ 
				// x += dx;
				// }
			// break;
		// }
	// }
}