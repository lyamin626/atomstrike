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
	getZone(){
		return {x:this.x,y:this.y,w:this.w,h:this.h};
	}
	selectSolder(solders){
		console.log('x:'+this.x,'y:'+this.y,'w:'+this.w,'h:'+this.h);
		let lengthY = Math.sqrt((this.y -this.w)*(this.y -this.w));
		let lengthX = Math.sqrt((this.x- this.h)*(this.x- this.h));
		solders.forEach(d=>d.setSelect(false));
		let y= Math.min(this.y,this.w);
		let x = Math.min(this.x,this.h);
		let selectsolers = solders.filter(function(d)
		{
			let xx= d.getPos().x-x;
			let yy = d.getPos().y- y;
			return  xx >=0 && xx <=lengthX && yy >=0 && yy<= lengthX;
		}
			
		);
		if(selectsolers.length>0){
			selectsolers.forEach(d=>d.setSelect(true));
		}		
	}
	draw(сtx){
		 ctx.beginPath();
		
		 
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
      ctx.lineWidth =2;
      ctx.strokeStyle = this.selected?'#FF0000':'#003300';
      ctx.stroke();
	}
	setSelect(select){
		this.selected=select;
	}
	iskey(name){
		return name == 'solder';
	}
	getPos(){
		return this.pos;
	}
}