class Polygon {
    constructor(border, name) {
        this.border = border || [];
        this.name = name;
        this.strokeStyle = 'gray';
    }
    Center() {

        let centerx = 0; let centery = 0;
        for (let border of this.border) {
            centerx += border.x;
            centery += border.y;
        }
        let x = (centerx / this.border.length);
        let y = (centery / this.border.length);
        return { x:x , y:y  };
    }
    Hit(bullet, near) {
        this.border.push(bullet.point);
        let center = this.Center();
        this.border = this.border.sort(function (a, b) {
            if (a.x - center.x >= 0 && b.x - center.x < 0)
                return true;
            if (a.x - center.x < 0 && b.x - center.x >= 0)
                return false;
            if (a.x - center.x == 0 && b.x - center.x == 0) {
                if (a.y - center.y >= 0 || b.y - center.y >= 0)
                    return a.y > b.y;
                return b.y > a.y;
            }
            let det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
            if (det < 0)
                return true;
            if (det > 0)
                return false;
            let d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
            let d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
            return d1 > d2;
        });


        //let minIndex = 0;
        //let minLength = 99999;


        //for (let i = 1; i < this.border.length; i++) {
        //    let length = Helper.SegmentLength(bullet.point, this.border[i]);
        //    if (minLength > length) {
        //        minLength = length;
        //        minIndex = i;
        //    }
        //}
        ////tut zakonshil
        //let firstpoint = {};
        //let secondpoint = {};
        //if (((minIndex + 1) == this.border.length)) {
        //    firstpoint = this.border[minIndex];
        //    secondpoint = this.border[0];
        //}
        //else {
        //    firstpoint = this.border[minIndex];
        //    secondpoint = this.border[minIndex+1];
        //}
        //let holeLength = 2 * bullet.str * bullet.radius;
        //let length = Helper.SegmentLength(bullet.point, firstpoint);
        //let pointA = Helper.PointAtLine(length - holeLength, firstpoint, secondpoint );
        //let pointB = {
        //    x: pointA.x + ((bullet.vel.x * bullet.str)/2),
        //    y: pointA.y + ((bullet.vel.y * bullet.str)/2),
        //};


        //let pointD = Helper.PointAtLine(length + holeLength, firstpoint, secondpoint)

        //let pointC = {
        //    x: pointD.x + (bullet.vel.x * bullet.radius),
        //    y: pointD.y + (bullet.vel.y * bullet.radius),
        //};

        //this.border.splice(minIndex+1, 0, pointA, pointB, pointC, pointD);
    }
    Sort ( a,  b){
    if (a.x - center.x >= 0 && b.x - center.x < 0)
        return true;
    if (a.x - center.x < 0 && b.x - center.x >= 0)
        return false;
    if (a.x - center.x == 0 && b.x - center.x == 0) {
        if (a.y - center.y >= 0 || b.y - center.y >= 0)
            return a.y > b.y;
        return b.y > a.y;
    }
    let det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
    if (det < 0)
        return true;
    if (det > 0)
        return false;
    let d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
    let d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
    return d1 > d2;
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

draw(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.strokeStyle;
    for (let a = 0; a < this.border.length; a++) {
        let b = this.border[a];
        if (a == 0) {
            ctx.moveTo(b.x, b.y)
            ctx.font = "10px Arial";
            ctx.fillText(b.x + ':'+ b.y, b.x, b.y);
        } else {
            ctx.lineTo(b.x, b.y);
            ctx.font = "10px Arial";
            ctx.fillText(b.x + ':' + b.y, b.x, b.y);
        }
    }

    ctx.closePath();
    ctx.stroke();

}
iskey(name) {
    return name == 'polygon';
}

}
class SelectRect {
    constructor(point) {
        this.x = point.pageX;
        this.y = point.pageY;
        this.w = 0;
        this.h = 0;
    }
    mouseMove(e) {
        this.w = e.pageX - this.x;
        this.h = e.pageY - this.y;
    }
    hasMove() {
        return (this.w == this.h && this.h == 0);
    }
    getZone() {
        return { x: this.x, y: this.y, x1: this.x + this.h, y1: this.y + this.w };
    }
    selectSolder(unit) {
        let zone = this.getZone();
        unit.forEach(function (d) {
            if (Math.abs(zone.x - zone.x1) < d.size && Math.abs(zone.y - zone.y1) < d.size) {
                d.setSelect((d.pos.x - zone.x) * (d.pos.x - zone.x) + (d.pos.y - zone.y) * (d.pos.y - zone.y) < 50 * 50);
            }
            else {
                d.setSelect((d.pos.x >= zone.x && d.pos.y >= zone.y) && (d.pos.x <= zone.x1 && d.pos.y <= zone.y1));
            }

            //(a-x)^2 + (b-y)^2 < R^2
        });
    }
    draw(сtx) {
        ctx.strokeStyle = 'back';
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.stroke()

    }
    iskey(name) {
        return name == 'selectRect';
    }
}
class Solder {
    constructor(position, team, canvas) {
        this.weight = 50;
        this.speed = 100 / this.width;
        this.selected = false;
        this.pos = position;
        this.canvas = canvas;
        this.size = this.weight / 5;
        this.team = team;
        this.bullets = [];
        //drift when run
        this.drift = { x: 0, y: 0 };

        this.react = this.size;
        this.SAttack = { x: canvas.width / 2, y: canvas.height / 2 };//atack vector - react dependence



        this.nearMe = []; // object for verfy iscollision at the moment;
        this.collisionCoint = 5; //only five object verfy for collision;

    }
    fire(pos) {

        let length = Helper.SegmentLength(this.pos, pos);

        ///BulletSpeedAtMoment =4;
        let vel = { x: (pos.x - this.pos.x) * 4 / length, y: (pos.y - this.pos.y) * 4 / length };

        let bullet = new Bullet({ x: this.pos.x, y: this.pos.y }, vel);

        this.bullets.push(bullet);
        return bullet;
    }

    draw(ctx, barriers) {

        let oldpos = { x: this.pos.x, y: this.pos.y };

        this.drift.x = this.drift.x / 1.1;
        if (Math.abs(this.drift.x) < 0.1) this.drift.x = 0;

        this.drift.y = this.drift.y / 1.1;
        if (Math.abs(this.drift.y) < 0.01) this.drift.y = 0;

        this.pos.x += this.drift.x / 2;
        this.pos.y += this.drift.y / 2;


        if (this.pos.x < this.size) {
            this.pos.x = this.size;
        }
        if (this.pos.y < this.size) {
            this.pos.y = this.size;
        }
        if (this.pos.y + this.size > this.canvas.height) {
            this.pos.y = this.canvas.height - this.size;
        }
        if (this.pos.x + this.size > this.canvas.width) {
            this.pos.x = this.canvas.width - this.size;
        }

        let tpoint = this.getMinMax();
        let size = this.size;
        let self = this;

        let realbarriears = barriers.filter(function (d) {
            if (d != self) {
                let point = d.getMinMax();
                if (d.iskey('polygon')) {
                    return point.xmin < tpoint.xmin && point.xmax > tpoint.xmax
                        && point.ymin < tpoint.ymin && point.ymax > tpoint.ymax;
                }
                if (d.iskey('solder')) {
                    var dx = self.pos.x - d.pos.x;
                    var dy = self.pos.y - d.pos.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    return (distance < (size + d.size))
                }
            }
        });


        //have collision or not
        if (realbarriears.length > 0) {
            let iscolision = false;
            //check collision
            //realbarriears.forEach(function (d) {
            //    if (d.iskey('solder')) {
            //        iscolision = true;
            //        return;
            //    }
            //    if (d.iskey('polygon')) {
            //        d.getLine().forEach(function (d) {
            //            let minlength = Math.abs(Helper.MinLength(self.pos, d));
            //            iscolision = size >= minlength;
            //            if (iscolision) {
            //                ctx.beginPath();
            //                ctx.lineWidth = 3;
            //                ctx.strokeStyle = 'red';
            //                ctx.moveTo(d.a.x, d.a.y);
            //                ctx.lineTo(d.b.x, d.b.y);
            //                ctx.stroke();
            //                ctx.closePath();
            //            }
            //            else {
            //                ctx.lineWidth = 1;
            //                ctx.strokeStyle = 'gray';
            //                ctx.moveTo(d.a.x, d.a.y);
            //                ctx.lineTo(d.b.x, d.b.y);
            //                ctx.stroke();
            //            }

            //        });



            //    }
            //});



            //if (iscolision) {
            //    this.pos = oldpos;
            //}
        }

        //
        ctx.beginPath();
        ctx.strokeStyle = 'grey';
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI, false);

        ctx.fillStyle = this.team;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.selected ? '#FF0000' : '#003300';
        ctx.stroke();



        let startLine = Helper.PointAtLine(this.size, this.pos, this.SAttack);
        ctx.moveTo(startLine.x, startLine.y);
        let posAtack = Helper.PointAtLine(50, this.pos, this.SAttack);
        //ctx.arc(this.pos.x,this.pos.y,50,Math.PI* this.Vatack/180,Math.PI* this.Vatack/180);
        ctx.lineTo(posAtack.x, posAtack.y);
        ctx.stroke();
    }

    getMinMax() {
        return { xmin: this.pos.x - this.size, xmax: this.pos.x - this.size, ymin: this.pos.y - this.size, ymax: this.pos.y - this.size };
    }

    setSelect(select) {
        this.selected = select;
    }
    iskey(name) {
        return name == 'solder';
    }
    hasSelect() { return this.selected; }
    getPos() {
        return this.pos;
    }
    control(evt) {
        //move

        switch (evt.keyCode) {
            case 87:  /* up - [w]*/
                if (this.pos.y - this.speed > 0) {
                    this.pos.y -= this.speed;
                    //this.drift.y -= this.react;
                }
                break;
            case 83:  /* down [s] */
                if (this.pos.y + this.speed < (this.canvas.height - this.size)) {
                    this.pos.y += this.speed;
                    //  this.drift.y += this.react;
                }
                break;
            case 65:  /* left [a] */
                if (this.pos.x - this.speed > 0) {
                    this.pos.x -= this.speed;
                    //    this.drift.x -= this.react;
                }
                break;
            case 68:  /* right -[d] */
                if (this.pos.x + this.speed < (this.canvas.width - this.size)) {
                    this.pos.x += this.speed;
                    // this.drift.x += this.react;
                }
                break;




        }


    }
}
class Bullet {
    constructor(start, vel) {
        this.point = start;
        this.vel = vel;
        this.radius = 3;
        this.color = 'red';
        this.str = 1.3;
    }
    draw(ctx, barriers) {

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
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
                    return;
                }
                if (d.iskey('polygon')) {
                    //let borders = d.getLine();
                    //for (let i = 0; i < borders.length; i++) {
                    //    let line = borders[i];

                    //    let minlength = Helper.MinLength(self.point, line);
                    //    if (minlength > 0) {
                    //        iscolision = size >= minlength;
                    //        if (iscolision) {
                    //            lineCollision = line;
                    //            ctx.beginPath();
                    //            ctx.lineWidth = 3;
                    //            ctx.strokeStyle = 'yellow';
                    //            ctx.moveTo(line.a.x, line.a.y);
                    //            ctx.lineTo(line.b.x, line.b.y);
                    //            ctx.stroke();
                    //            ctx.closePath();
                    //            break;
                    //        }
                    //        else {
                    //            ctx.lineWidth = 1;
                    //            ctx.strokeStyle = 'gray';
                    //            ctx.moveTo(line.a.x, line.a.y);
                    //            ctx.lineTo(line.b.x, line.b.y);
                    //            ctx.stroke();
                    //        }
                    //    }
                    //}
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
            //{
            //    this.pos = oldpos;


            //}
        }



    };
    getMinMax() {
        return { xmin: this.point.x - this.radius, xmax: this.point.x - this.radius, ymin: this.point.y - this.radius, ymax: this.point.y - this.radius };
    };
    iskey(name) {
        return name == 'bullet';
    };
}