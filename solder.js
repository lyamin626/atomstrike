
class Solder {
    constructor(position, team, canvas) {
        this.weight = 50;
        this.speed = 100 / this.weight;
        this.selected = false;
        this.pos = position;
        this.canvas = canvas;
        this.size = this.weight / 5;
        this.team = team;
        this.ks = [];
        this.bullets = [];
        //drift when run
        this.drift = { x: 0, y: 0 };

        this.react = this.size;
        this.SAttack = { x: canvas.width / 2, y: canvas.height / 2 };//atack vector - react dependence


        this.nearMe = []; // object for verfy iscollision at the moment;
        this.collisionCoint = 5; //only five object verfy for collision;

    }
    Hit() {
        this.team = 'black';
    }
    fire(pos) {

        let length = Helper.SegmentLength(this.pos, pos);

        ///BulletSpeedAtMoment =9; 

        //random velosuty * [+ 0.5, - 0.5]
        let rx = (0.5 - Math.random()) * 100;
        let ry = (0.5 - Math.random()) * 100;
        let vel = { x: (rx + Math.round((pos.x - this.pos.x) * 900 / length)) / 100, y: (ry + Math.round((pos.y - this.pos.y) * 900 / length)) / 100 };
        this.SAttack = { x: pos.x, y: pos.y };
        let gun = Helper.PointAtLine(50, this.pos, this.SAttack);
        let bullet = new Bullet({ x: gun.x, y: gun.y }, vel, timer);

        this.bullets.push(bullet);
        return bullet;
    }

    draw(ctx, barriers, ks) {
        if (this.selected) { //movment
            if (ks[87]) { /* up - [w]*/
                if (this.pos.y - this.speed > 0) {
                    this.pos.y -= this.speed;
                    //this.drift.y -= this.react;
                }
            }
            if (ks[83]) { /* up - [w]*/
                if (this.pos.y + this.speed < (this.canvas.height - this.size)) {
                    this.pos.y += this.speed;
                    //  this.drift.y += this.react;
                }
            }
            if (ks[65]) { /* up - [w]*/
                if (this.pos.x - this.speed > 0) {
                    this.pos.x -= this.speed;
                    //    this.drift.x -= this.react;
                }
            }
            if (ks[68]) { /* up - [w]*/
                if (this.pos.x + this.speed < (this.canvas.width - this.size)) {
                    this.pos.x += this.speed;
                    // this.drift.x += this.react;
                }
            }
        }

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
        }

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
    control(keys) {
        this.ks = keys;
    }
}