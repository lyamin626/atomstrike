class splinter {
    constructor(point, segment,length,timer) {
            this.startPoint = point;
            this.segment = segment;
            this.length = length;
            this.timer = timer;
    }

    draw(ctx, segment) { 
        let delta = timer - this.timer;
        var c = 0;
        for (var i = 0; i <= 4; i++) {
            ctx.moveTo(this.startPoint.x, this.startPoint.y);
            let posAtack = Helper.PointAtLine(this.length, this.startPoint, this.SAttack);
            ctx.lineTo(posAtack.x, posAtack.y);
            ctx.stroke();
        }
        //cosA  = : угол скалярное произведение векторов ./  длины векторов
        //
        


    }



}
