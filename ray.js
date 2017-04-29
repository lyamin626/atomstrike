class Ray {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
    }
    draw(ctx, barriers) {
        ctx.beginPath();
       // ctx.moveTo(this.point1.x, this.point1.y);
        ctx.lineTo(this.point2.x, this.point2.y);
        ctx.stroke();
    }
    iskey(name) {
        return name == 'ray';
    }
    getMinMax() {
        return this.point1;
    }
}