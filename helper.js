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

	