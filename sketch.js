let rope;
let food = [];
let score = 0;
let faders = [];
let bkg_color;
let pallete;
let emitters = [];

let TIMER_AMT = 60;
let gameTimer;

let MAX_FOOD = 20;

function setup() {
    createCanvas(1200, 800);

    pallete = new Pallete();
    pallete.init();

    bkg_color = Pallete.brighten(pallete.colors.GREY, 0.5);

    gameTimer = new Timer(TIMER_AMT);

    rope = new Rope(width / 2, height / 2, 5);
    rope.build();

    addFood();
}

function draw() {
    background(bkg_color);

    // UPDATES

    gameTimer.update();

    if (!rope.knots.length)
        gameTimer.active = false;

    if (gameTimer.active) {

        rope.handleKeyboard();
        rope.adjust();

        eat();

        food = food.filter(f => f.active);
        if (!food.length)
            addFood();

        for (let f of food) {
            if (f.state === Food.state.MOBILE)
                f.move();
            if (f.state === Food.state.DECAY)
                f.decay();
        }

        for (let fader of faders) {
            fader.update();
        }

        faders = faders.filter((f) => f.active);
    }

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

    rope.draw();

    for (let f of food) {
        f.draw();
    }

    drawScore();

    drawOffscreenArrow();

    drawTimeText();
}

function mouseDragged(event) {
    if (!gameTimer.active || !rope.knots.length)
        return false;
    let m = createVector(mouseX, mouseY);
    if (rope.head.hovered(m)) {
        rope.head.update(m.x, m.y);
    }
    return false;
}

function keyPressed() {
    if (keyIsDown(SHIFT) && keyIsDown(ENTER))
        resetGame();
    else if (keyIsDown(ENTER) && !gameTimer.active)
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
    push();
    textSize(28);
    let timeText = !gameTimer.active ? "Game Over!" : `${gameTimer.amt} seconds`;
    let tw = textWidth(timeText);
    let tx = width / 2 - tw / 2;
    fill(pallete.colors.BLACK);
    text(timeText, tx + 2, 32);
    fill(pallete.colors.PURPLE);
    text(timeText, tx + 1, 31);
    fill(pallete.colors.CYAN);
    text(timeText, tx, 30);
    pop();
}

function directionVelocity(negDirection, posDirection, velocity) {
    let dir = (keyIsDown(negDirection) || keyIsDown(posDirection));
    let isNeg = (keyIsDown(negDirection) ? -1 : 1);
    return (dir * velocity * isNeg);
}

function resetGame() {
    gameTimer.reset();
    score = 0;
    emitters = [];
    food = [];
    rope.update(width / 2, height / 2);
    rope.build();
    addFood();
}

function addFood() {
    if (food.length === MAX_FOOD)
        return;
    let count = random(2);
    for (let i = 0; i < count; i++) {
        food.push(Food.getRandomFood(random(width), random(height)));
    }
}

function eat() {
    let collision = knotFoodCollision();

    if (!collision.collision)
        return null;

    let f = collision.f;
    let k = collision.k;

    score += f.calcPoints(k.label);

    switch (f.state) {
        case Food.state.DESTROY: rope.destroyKnot(collision.index); break;
        case Food.state.CREATE: rope.createKnot(k); break;
        case Food.state.SHUFFLE: rope.shuffleKnots(); break;
    }

    faders.push(new Fader(f.pos.x, f.pos.y, k.label, 100));
    f.active = false;


    let e = new Emitter(f.pos.x, f.pos.y, f.color);
    e.init();
    emitters.push(e);

    addFood();
}

function knotFoodCollision() {
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