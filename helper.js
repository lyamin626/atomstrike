var Helper = {
    ///Длина отрезка из двух точек
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
    getIntersection: function (ray, segment) {
        let r_px = ray.a.x;
        let r_py = ray.a.y;
        let r_dx = ray.b.x - ray.a.x;
        let r_dy = ray.b.y - ray.a.y;

        let s_px = segment.a.x;
        let s_py = segment.a.y;
        let s_dx = segment.b.x - segment.a.x;
        let s_dy = segment.b.y - segment.a.y;

        let r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
        let s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
        if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag || r_dx == 0) {
            return null;
        }
        let T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        let T1 = (s_px + s_dx * T2 - r_px) / r_dx;

        if (T1 < 0) { return null; }
        if (T2 < 0 || T2 > 1) { return null; }

        let result = {
            x: r_px + r_dx * T1,
            y: r_py + r_dy * T1,
            param: T1
        };

        return result;
    },
    expansion: function (a, b) {
    //random expansion
    let rnd = Math.random() * 10 % 10;
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    if (dx < 0) dx = 0;
    if (dy < 0) dx = 0;
    let length = Math.sqrt(dx * dx + dy * dy);
    if (length == 0) {
        console.log('error');
        return { x: 0, y: 0 };
    }
    let shiftx = rnd * dx / length;
    let shifty = rnd * dy / length;
    return { x: b.x + shiftx, y: b.y + shifty };
    },

    getIntersectionPoint: function (segment, ray, points) {
        let counter = 0;
        let border = segment.getLine();
        let breaking = false;
        let end = false;
        segment.breaking = []
        let closestIntersect = null;
        for (let i = 0; i < border.length; i++) {

            let intersect = Helper.getIntersection(ray, border[i]);

            if (!intersect) continue;

            counter++;
            segment.border.splice([i + counter], 0, { x: intersect.x, y: intersect.y, breaking: border[i], isnew: true });

            points.push(intersect);

            // if(!closestIntersect || intersect.param<closestIntersect.param){
            // closestIntersect =  intersect;
            // // end=true;
            // segment.fillcolor=true;
            // }
            breaking = true;
        }
        return { end: end, counter: counter, breaking: breaking };
    },
    getArea(points) {
        let area = 0;         
        let length = points.length - 1;  

        for (i = 0; i < points.length; i++) {
            area = area + (points[i].x + points[length].x) * (points[i].y - points[length].y);
            length = i;
        }
        return area / 2;
    }
}

