class QTree {
    constructor(x, y, w, h, depth) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.depth = depth;

        this.contains = false;

        this.q1 = null;
        this.q2 = null;
        this.q3 = null;
        this.q4 = null;

        this.body = null;
        this.center_of_mass = new Body(0, 0, R, 0);
    } 
    insert(new_body) {
        this.check_containment(new_body);
        if (this.contains) {
            if (this.q1) {
                this.q1.insert(new_body);
                this.q2.insert(new_body);
                this.q3.insert(new_body);
                this.q4.insert(new_body);
            } else {
                if (this.body) {
                    if (this.depth < MAX_DEPTH) {
                        this.split();
                        this.insert(this.body);
                        this.insert(new_body);
                        this.body = null;
                    }
                } else {
                    this.body = new_body;
                    this.center_of_mass.x = this.body.x;
                    this.center_of_mass.y = this.body.y;
                    this.center_of_mass.m = this.body.m
                }
            }
        }
    }
    update_values() {
        if (this.q1) {
            this.q1.update_values();
            this.q2.update_values();
            this.q3.update_values();
            this.q4.update_values();

            let new_net_mass = (this.q1.center_of_mass.m+
                                this.q2.center_of_mass.m+
                                this.q3.center_of_mass.m+
                                this.q4.center_of_mass.m);
            
            let avg_x = this.q1.center_of_mass.m*this.q1.center_of_mass.x+
                        this.q2.center_of_mass.m*this.q2.center_of_mass.x+
                        this.q3.center_of_mass.m*this.q3.center_of_mass.x+
                        this.q4.center_of_mass.m*this.q4.center_of_mass.x;
            
            let avg_y = this.q1.center_of_mass.m*this.q1.center_of_mass.y+
                        this.q2.center_of_mass.m*this.q2.center_of_mass.y+
                        this.q3.center_of_mass.m*this.q3.center_of_mass.y+
                        this.q4.center_of_mass.m*this.q4.center_of_mass.y;
            
            avg_x = avg_x / new_net_mass;
            avg_y = avg_y / new_net_mass;

            this.center_of_mass.x = avg_x;
            this.center_of_mass.y = avg_y;
            this.center_of_mass.m = new_net_mass;
        }
    }
    calculate_forces(body) {
        let r; let ratio;
        r = dist(body.x, body.y, this.center_of_mass.x, this.center_of_mass.y);
        ratio = this.w / r;
        
        if (this.q1) {
            if (ratio <= THRESHOLD) {
                this.set_force(body, r);
            } else {
                this.q1.calculate_forces(body);
                this.q2.calculate_forces(body);
                this.q3.calculate_forces(body);
                this.q4.calculate_forces(body);
            }
        } else {
                this.set_force(body, r);
        }
    }
    set_force(body, r) {
        if (body.x != this.center_of_mass.x && body.y != this.center_of_mass.y) {
            let x; let y; let f; let v;
            f = (G*body.m*this.center_of_mass.m) / Math.pow(r, 2);
            x = this.center_of_mass.x-body.x;
            y = this.center_of_mass.y-body.y;
            v = createVector(x, y);
            v.setMag(f);
            body.net_f[0] += v.x;
            body.net_f[1] += v.y;
        } else {
            body.net_f[0] += 0;
            body.net_f[1] += 0;
        }
    }
    check_containment(new_body) {
        if (this.x <= new_body.x && new_body.x < this.x+this.w) {
            if (this.y <= new_body.y && new_body.y < this.y+this.h) {
                this.contains = true;
            } else {
                this.contains = false;
            }
        } else {
            this.contains = false;
        }
    }
    split() {
        this.q1 = new QTree(this.x+this.w/2, this.y, this.w/2, this.h/2, this.depth+1);
        this.q2 = new QTree(this.x, this.y, this.w/2, this.h/2, this.depth+1);
        this.q3 = new QTree(this.x, this.y+this.h/2, this.w/2, this.h/2, this.depth+1);
        this.q4 = new QTree(this.x+this.w/2, this.y+this.h/2, this.w/2, this.h/2, this.depth+1);
    }
    show() {
        if (SHOW_TREE) {
            stroke(this.depth/MAX_DEPTH, 1, 1);
            fill(0);
            rect(this.x, this.y, this.w, this.h);
            if (this.q1) {
                this.q1.show();
                this.q2.show();
                this.q3.show();
                this.q4.show();
            }
        }
        if (SHOW_COM) {
            if (this.depth === 0) {
                fill(0.5, 1, 1);
                ellipse(this.center_of_mass.x, this.center_of_mass.y, 5);
            }
        }
    }
}