var Helper = {
	//Длина отрезка из двух точек
	SegmentLength : function(pointA,pointB){
		let x= pointA.x-pointB.x;
		let y = pointA.y-pointB.y;
		return Math.sqrt((x*x)+(y*y));
	},
	//Точка, длинной xlength, на отрезке описанной точками - тупое описание.. Todo: правильно описать.
	PointAtLine: function(xlength,pointA,pointB){
		let length = this.SegmentLength(pointA,pointB);
		let pointX= (pointB.x-pointA.x)*xlength/length;
		let pointY= (pointB.y - pointA.y)*xlength/length;
	    return {x:pointX+pointA.x,y:pointY+pointA.y};
	}
	
		
	
	
}

Array.prototype.minmax = function () {

let xmin,xmax,ymin,ymax =0;
for (var i=0; i<this.length; i++) {
	let item = this[i];
    if (xmin < item.x) lowest = item.x;
    if (xmax > item.x) xmax = item.x;
    if (ymin < item.y) ymin = item.y;
    if (ymax > item.y) ymax = item.y;
}

}





	