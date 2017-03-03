var Helper = {
    //Длина отрезка из двух точек
    SegmentLength: function (pointA, pointB) {
        let x = pointA.x - pointB.x;
        let y = pointA.y - pointB.y;
        return Math.sqrt((x * x) + (y * y));
    },
    //Точка на прямой, длинной xlength от pointA, на отрезке.
    PointAtLine: function (xlength, pointA, pointB) {
        let length = this.SegmentLength(pointA, pointB);
        let pointX = (pointB.x - pointA.x) * xlength / length;
        let pointY = (pointB.y - pointA.y) * xlength / length;
        return { x: pointX + pointA.x, y: pointY + pointA.y };
    },
    MinLength: function (point, segment) { //bug method
        let first = ((segment.b.x - segment.a.x) * (point.y - segment.a.y)) - ((segment.b.y - segment.a.y) * (point.x - segment.a.x));
        let segX = (segment.b.x - segment.a.x);
        let segY = (segment.b.y - segment.a.y);
        return first / second;
    },
    pointIsInPoly: function (p, polygon) { //good method
        let isInside = false;
        let minX = polygon[0].x, maxX = polygon[0].x;
        let minY = polygon[0].y, maxY = polygon[0].y;
        for (var n = 1; n < polygon.length; n++) {
            var q = polygon[n];
            minX = Math.min(q.x, minX);
            maxX = Math.max(q.x, maxX);
            minY = Math.min(q.y, minY);
            maxY = Math.max(q.y, maxY);
        }

        if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
            return {hit:false};
        }
            let i = 0, j = polygon.length - 1;
        for (i, j; i < polygon.length; j = i++) {
            if ((polygon[i].y > p.y) != (polygon[j].y > p.y) &&
                p.x < (polygon[j].x - polygon[i].x) * (p.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
                isInside = !isInside;
            }
        }
        if (isInside)
            console.log(minX, minY, maxY, minX);

        return {
            hit: isInside, near: { x: minX, y: minY }
        };
    },
}

