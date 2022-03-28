class Body {
    constructor(x, y, r, m) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.m = m;
        this.net_f = [0, 0];
    }
    update() {
        this.x += this.net_f[0];
        this.y += this.net_f[1];

        if (this.x + this.r > W) {
            this.x = W - this.r;
            this.net_f[0] = this.net_f[0]*COR*MU;
        } else if (this.x - this.r < 0) {
            this.x = this.r;
            this.net_f[0] = this.net_f[0]*COR*MU;
        }
        if (this.y + this.r >= H) {
            this.y = H - this.r;
            this.net_f[1] = this.net_f[1]*COR*MU;
        } else if (this.y - this.r < 0) {
            this.y = this.r;
            this.net_f[1] = this.net_f[1]*COR*MU;
        }
    }
    show() {
        if (SHOW_TREE) {
            noStroke();
            fill(1, 0, 1);
        } else {
            stroke(1, 0, 1);
            noFill();
        }
        if (SHOW_VECS) {
            line(this.x, this.y, this.x+10*this.net_f[0], this.y+10*this.net_f[1]) 
        }
        ellipse(this.x, this.y, 2*this.r);
    }
}