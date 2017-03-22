class Bullet {
    constructor(start, vel) {
        this.point = start;
        this.vel = vel;
        this.radius = 1;
        this.color = '#111';
        this.str = 1.3;
    }
    draw(ctx, barriers) {

        ctx.beginPath();
        ctx.fill();
        ctx.arc(this.point.x, this.point.y, this.radius, 0, Math.PI * 2, true);
        ctx.stroke();


        ///Todo:oh god, bullet speed depend on fps (redraw speed) >_<
        this.point.x += this.vel.x;
        this.point.y += this.vel.y;

        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.arc(this.point.x, this.point.y, this.radius, 0, Math.PI * 2, true);
        ctx.stroke();

        let tpoint = this.getMinMax();
        let size = this.radius;
        let self = this;

        let realbarriears = barriers.filter(function (d) {
            if (d != self) {
                let point = d.getMinMax();
                if (d.iskey('polygon')) {
                    return point.xmin < tpoint.xmin && point.xmax > tpoint.xmax
                        && point.ymin < tpoint.ymin && point.ymax > tpoint.ymax;
                }
                if (d.iskey('solder')) {
                    var dx = self.point.x - d.pos.x;
                    var dy = self.point.y - d.pos.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    return (distance < (size + d.size))
                }
            }
        });


        //have collision or not
        if (realbarriears.length > 0) {
            let iscolision = false;
            let lineCollision = null;
            let result = {};
            //check collision
            realbarriears.forEach(function (d) {
                if (d.iskey('solder')) {
                    // iscolision = true;
                    d.Hit();
                    return;
                }
                if (d.iskey('polygon')) {
                    result = Helper.pointIsInPoly(self.point, d.border);
                }
                if (result.hit) {
                    try {
                        d.Hit(self, result.near);
                    } catch (e) {
                        console.log('need release hit');
                    }

                }
            });
            if (result.hit) return 'remove';
        }



    };
    getRay() { 
        return {
            a: { x: this.point.x, y: this.point.y },
            b: { x: this.point.x-this.vel.x, y: this.point.y-this.vel.y }
        };
    }
    getMinMax() {
        return { xmin: this.point.x - this.radius, xmax: this.point.x - this.radius, ymin: this.point.y - this.radius, ymax: this.point.y - this.radius };
    };
    iskey(name) {
        return name == 'bullet';
    };
}