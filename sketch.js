const DEFAULT_KNOT_RADIUS = 25;
const KNOTS_COUNT = 5;
const NORMAL_SPEED = 8;
const FAST_SPEED = 16;
const SLOW_SPEED = 4;
const SPEED_AMT = 5;
const TIMER_AMT = 60;
const MAX_FOOD = 10;

let rope;
let food;
let score;
let faders;
let pallete;
let emitters;
let gameTimer;
let speedTimer;
let running = false;

let bkg_color;

function setup() {
    createCanvas(1200, 800);

    pallete = new Pallete();
    pallete.init();

    bkg_color = Pallete.brighten(pallete.colors.GREY, 0.5);

    gameTimer = new Timer(TIMER_AMT);
    speedTimer = new Timer(SPEED_AMT);

    resetGame();
}

function draw() {
    background(bkg_color);

    // UPDATES

    gameTimer.update();

    running = gameTimer.active && rope.alive;

    // update game play objects
    if (running) {

        if (speedTimer.active) {
            speedTimer.update();
            if (!speedTimer.active)
                rope.setSpeed(NORMAL_SPEED);
        }

        rope.handleKeyboard();

        eat();

        food = food.filter(f => f.active);
        if (!food.length)
            createFood();

        for (let f of food) {
            f.update();
        }
    }

    // update asthetic-only objects
    rope.adjust();

    for (let fader of faders) {
        fader.update();
    }

    faders = faders.filter((f) => f.active);

    for (let e of emitters) {
        e.update();
    }

    emitters = emitters.filter(e => e.active);

    for (let f of food) {
        f.pulse();
    }

    // DRAW
    for (let fader of faders) {
        fader.draw();
    }

    for (let e of emitters) {
        e.draw();
    }

    for (let f of food) {
        f.draw();
    }
    
    rope.draw();
    
    drawScore();
    drawTimeText();
    drawOffscreenArrow();
    if (speedTimer.active)
        drawSpeedTimer();
}

function mouseDragged() {
    if (!gameTimer.active || !rope.knots.length)
        return false;
    let m = createVector(mouseX, mouseY);
    if (rope.head.hovered(m)) {
        rope.head.updatePos(m);
    }
    return false;
}

function keyPressed() {
    if (keyIsDown(SHIFT) && keyIsDown(ENTER))
        resetGame();
    else if (keyIsDown(ENTER) && !running)
        resetGame();
}

function drawScore() {
    push();
    fill(pallete.colors.BLACK);
    textSize(28);
    text(`Score: ${score}`, 10, 30);
    pop();
}

function drawOffscreenArrow() {
    if (!gameTimer.active || !rope.knots.length)
        return;
    if (rope.head.offscreen()) {
        push();
        let screenCenter = createVector(width / 2, height / 2);
        let direction = p5.Vector.sub(rope.head.pos, screenCenter).normalize().mult(100);
        let arrowSize = 20;
        strokeWeight(5);
        fill(pallete.colors.BLACK);
        // draw arrow line
        translate(screenCenter.x, screenCenter.y);
        line(0, 0, direction.x, direction.y);
        // draw arrow head
        rotate(direction.heading());
        translate(direction.mag() - arrowSize, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
    }
}

function drawTimeText() {
    let timeText = !gameTimer.active ? "Game Over!" : `${gameTimer.amt} seconds`;
    let fontSize = 28;
    push();
    textSize(fontSize);
    let tw = textWidth(timeText);
    let tx = (width / 2) - (tw / 2);
    pop();
    drawGameText(timeText, 28, tx, 30);
}

function drawSpeedTimer() {
    let speedText = `Speed Countdown: ${speedTimer.amt}`;
    let fontSize = 16;
    push();
    textSize(fontSize);
    let tw = textWidth(speedText);
    let tx = width - tw - 10;
    pop();
    drawGameText(speedText, fontSize, tx, 20);
}

function drawGameText(txt, fontSize, tx, y) {
    push();
    textSize(fontSize);
    fill(pallete.colors.BLACK);
    text(txt, tx + 2, y + 2);
    fill(pallete.colors.PURPLE);
    text(txt, tx + 1, y + 1);
    fill(pallete.colors.CYAN);
    text(txt, tx, y);
    pop();
}

function resetGame() {
    gameTimer.reset();
    speedTimer.active = false;
    score = 0;
    emitters = [];
    food = [];
    faders = [];
    rope = new Rope(width / 2, height / 2, KNOTS_COUNT);
    rope.build();
    createFood();
    running = true;
}

function createFood() {
    if (food.length === MAX_FOOD)
        return;
    let count = random(2);
    for (let i = 0; i < count; i++) {
        food.push(Food.getRandomFood(random(width), random(height)));
    }
}

function eat() {
    let collision = calcCollisions();

    if (!collision.collision)
        return;

    let f = collision.f;
    let k = collision.k;
    let i = collision.index;

    score += f.calcPoints(k.label);

    switch (f.state) {
        case Food.state.DESTROY: rope.destroyKnot(i); break;
        case Food.state.CREATE: rope.createKnot(k); break;
        case Food.state.SHUFFLE: rope.shuffleKnots(); break;
        case Food.state.FAST: {
            rope.setSpeed(FAST_SPEED);
            speedTimer.reset();
            break;
        }
        case Food.state.SLOW: {
            rope.setSpeed(SLOW_SPEED);
            speedTimer.reset();
            break;
        }
    }

    destroyFood(f, k.label);

    createFood();
}

function destroyFood(f, label) {
    pushFader(f.pos, label);    
    pushEmitter(f.pos, f.color);    
    f.active = false;
}

function pushEmitter(pos, _color) {
    let e = new Emitter(pos.x, pos.y, _color);
    e.init();
    emitters.push(e);
}

function pushFader(pos, label) {
    faders.push(new Fader(pos.x, pos.y, label));
}

function calcCollisions() {
    let f = null;
    let k = null;
    let index = -1;
    let collision = false;
    for (let i = 0; i < rope.knots.length; i++) {
        let knot = rope.knots[i];
        for (let fd of food) {
            if (knot.collides(fd)) {
                f = fd;
                k = knot;
                collision = true;
                index = i;
                break;
            }
        }
        if (collision)
            break;
    }
    return { collision, f, k, index };
}