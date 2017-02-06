class Polygon {
    constructor(border,name) {
        this.border = border||[];
		this.name=name;
		}
    explosion() {
        console.log('notworking');
    }
	getName(){return this.name;}
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
	mouseMove(e){
		this.w = e.pageX-this.x;
		this.h = e.pageY-this.y;
	}
	hasMove(){
		return (this.w==this.h && this.h==0);
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
	constructor(position,canvas){
		this.weight = 50;
		this.speed=100/50;
		this.selected=false;
		this.pos = position;
		this.canvas = canvas;
		this.size = this.weight/5;
		this.react =this.size;
		this.drift={x:0,y:0};
	}
	draw(ctx){
		
	  this.drift.x =this.drift.x/1.1;
	  if(Math.abs(this.drift.x)<0.1) this.drift.x=0;
	  
	  this.drift.y =this.drift.y/1.1;
	  if(Math.abs(this.drift.y)<0.01) this.drift.y=0;
	  
	  this.pos.x += this.drift.x/2;
	  this.pos.y += this.drift.y/2;
	  
	  //  todo: suxx.. need go sleep
	  if(this.pos.x<this.size){
		  this.pos.x = this.size;
	  }
	  if(this.pos.y<this.size){
		  this.pos.y= this.size;
	  }
	  if(this.pos.y+this.size>this.canvas.height){
		  this.pos.y=this.canvas.height-this.size;
	  }
	  if(this.pos.x+this.size>this.canvas.width){
		  this.pos.x=this.canvas.width-this.size;
	  }
	  //
	  ctx.beginPath();
      ctx.arc(this.pos.x,this.pos.y,this.size , 0, 2 * Math.PI, false);
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
	control(evt){
		  switch (evt.keyCode) {
			case 87:  /* up - [w]*/
				if (this.pos.y - this.speed > 0){ 
				this.pos.y -= this.speed;
				this.drift.y-=this.react;
				}
			  break;
			case 83:  /* down [s] */
				if (this.pos.y + this.speed < (this.canvas.height-this.size)){ 
				this.pos.y += this.speed;
				this.drift.y+=this.react;
				}
			  break;
			case 65:  /* left [a] */
				if (this.pos.x - this.speed > 0){ 
				this.pos.x -= this.speed;
				this.drift.x-=this.react;
				}
			  break;
			case 68:  /* right -[d] */
				if (this.pos.x + this.speed < (this.canvas.width-this.size)){ 
				this.pos.x += this.speed;
				this.drift.x+=this.react;
				}
			break;
		}
	
	}
}