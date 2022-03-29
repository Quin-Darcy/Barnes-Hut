// Display
let W = window.innerWidth;
let H = window.innerHeight;
// QTree
let QT;
let MAX_DEPTH = 6;
let THRESHOLD = 0.5;
// Bodys
let BODYS = [];
let R = 10;
let M = 10;
let G = 6.67 * Math.pow(10, -1);
let COR = 0.5;
let MU = -0.9;
// Toggle settings
let PAUSE = false;
let SHOW_COM = false;
let SHOW_TREE = false;
let SHOW_VECS = false;

function setup() {
    createCanvas(W, H);
    colorMode(HSB, 1, 1, 1);
    background(0);

    QT = new QTree(0, 0, W, H, 0);
}

function draw() {
    background(0);
    QT = new QTree(0, 0, W, H, 0);
    for (let i = 0; i < BODYS.length; i++) {
        QT.insert(BODYS[i]);
        QT.update_values();
        QT.calculate_forces(BODYS[i])
        BODYS[i].update();
    }
    QT.show();
    for (let i = 0; i < BODYS.length; i++) {
        BODYS[i].show();
    }
    if (BODYS.length > 0) {
        BODYS.push(BODYS[0]);
        BODYS.shift();
    }
}

function mouseClicked() {
    BODYS.push(new Body(mouseX, mouseY, R, M));
}

function keyPressed() {
    if (keyCode === 67) {
        if (SHOW_COM) {
            SHOW_COM = false;
        } else {
            SHOW_COM = true;
        }
    } 
    if (keyCode === 32) {
        if (PAUSE) {
            PAUSE = false;
            loop();
        } else {
            PAUSE = true;
            noLoop();
        }
    }
    if (keyCode === 84) {
        if (SHOW_TREE) {
            SHOW_TREE = false;
        } else {
            SHOW_TREE = true;
        }
    }
    if (keyCode === 86) {
        if (SHOW_VECS) {
            SHOW_VECS = false;
        } else {
            SHOW_VECS = true;
        }
    }
}