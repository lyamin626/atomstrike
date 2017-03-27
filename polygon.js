class Polygon {
    constructor(border, name) {
        this.border = border || [];
        this.name = name;
        this.strokeStyle = 'gray';
        this.center = null;
        this.breakSegment = null;
    }
    Center() {
        if (this.center == null) {
            let minmax = this.getMinMax();
            this.center = { x: (minmax.xmin + minmax.xmax) / 2, y: (minmax.ymin + minmax.ymax) / 2 };
        }
        return this.center;
    }
    SetAngles() {
        let c = this.Center();
        for (let i = 0; i < this.border.length; i++) {
            let p = this.border[i];
            if (p.angle == null) {
                p.angle = Math.atan2((p.y - c.y), (p.x - c.x));
            }
        }
    }
    Hit(bullet, near) {

        let point = []
        let result = Helper.getIntersectionPoint(this, bullet.getRay(), point);
        console.log(result, point, bullet.point);

        this.border.push({ x: point[0].x + bullet.vel.x, y: point[0].y + bullet.vel.y });
        let center = this.Center();
        this.SetAngles();
        this.border = this.border.sort(this.Sort);

        for (let i = 2; i < this.border.length; i++) {
            let length = Helper.SegmentLength(this.border[i - 2], this.border[i]);

            if (length < 10) {
                console.log(length);
                    this.border[i ] = {
                        x: (this.border[i - 2].x + this.border[i].x)/2,
                        y: (this.border[i -2].y + this.border[i ].y)/2
                    }
                    this.border.splice(i-2, 2);
            }
        }

    }
    Sort(a, b) {
        if (a.angle > b.angle) return 1;
        else if (a.angle < b.angle) return -1;
        return 0;
    }

    getMinMax() {
        let xmin = 99999, xmax = 0, ymin = 99999, ymax = 0;
        for (var i = 0; i < this.border.length; i++) {
            let item = this.border[i];
            if (xmin > item.x) xmin = item.x;
            if (xmax < item.x) xmax = item.x;
            if (ymin > item.y) ymin = item.y;
            if (ymax < item.y) ymax = item.y;
        }
        return {
            xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax
        };

    }
    getName() { return this.name; }
    getLine() {
        let lines = [];
        for (let i = 1; i < this.border.length; i++) {
            if (i == 1) {
                lines.push({ a: this.border[0], b: this.border[1] });
            }
            else {
                lines.push({ a: this.border[i - 1], b: this.border[i] });
            }
        }
        lines.push({ a: this.border[this.border.length - 1], b: this.border[0] });
        return lines;
    }

    draw(ctx, segments) {
        ctx.beginPath();
        ctx.strokeStyle = this.strokeStyle;
        let center = this.Center();

        for (let a = 0; a < this.border.length; a++) {
            let b = this.border[a];
            if (a == 0) {

                ctx.moveTo(b.x, b.y)
                //ctx.font = "10px Arial";
                //ctx.fillText(b.angle, b.x, b.y);
            } else {
                ctx.lineTo(b.x, b.y);
                //ctx.font = "10px Arial";
                //ctx.fillText(b.angle, b.x, b.y);
            }

        }

        ctx.font = "10px Arial";
        ctx.fillText('c', center.x, center.y);



        ctx.closePath();
        ctx.stroke();
        if (this.breakSegment != null) {
            segments.push(this.breakSegment);
            this.breakSegment = null;
        }
    }
    iskey(name) {
        return name == 'polygon';
    }

}