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
        ctx.stroke();

    }
    iskey(name) {
        return name == 'selectRect';
    }
}