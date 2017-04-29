class Ricochet {
    constructor(point, vector) {
        this.point = point;
        this.vector = new Victor(vector.x, vector.y);
        this.times = 5;
    }
    draw(ctx, barriers) {
        ctx.beginPath();
        ctx.moveTo(this.point.x, this.point.y);
        this.point = Helper.SumPoints(this.point, this.vector);
        ctx.lineTo(this.point.x, this.point.y);
        ctx.stroke();

        this.vector = this.vector.multiply(new Victor(1.1,1.1));
        if (--this.times < 0)
        {
            return { command: 'remove' };
        }
    }
    iskey(name) {
        return name == 'ricochet';
    }
    getMinMax() {
        return this.point;
    }
}