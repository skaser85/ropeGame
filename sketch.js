let rope;
let food;
let score = 0;
let faders = [];
let bkg_color;
let pallete;

let TIMER_AMT = 60;
let gameTimer;

function setup() {
    createCanvas(1600, 1200);

    pallete = new Pallete();
    pallete.init();

    bkg_color = Pallete.brighten(pallete.colors.GREY, 0.5);

    gameTimer = new Timer(TIMER_AMT);

    rope = new Rope(width / 2, height / 2, 5);
    rope.build();

    createFood(random(width), random(height), Food.state.NORMAL);
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
        rope.checkFood();

        for (let fader of faders) {
            fader.update();
        }

        faders = faders.filter((f) => f.active);

        if (food.state === Food.state.MOBILE)
            food.move();
        if (food.state === Food.state.DECAY)
            food.decay();
    }

    food.pulse();

    // DRAW
    for (let fader of faders) {
        fader.draw();
    }

    rope.draw();

    food.draw();

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

function createFood(x, y, foodState) {
    food = new Food(x, y, foodState);
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
    return (
        (keyIsDown(negDirection) || keyIsDown(posDirection)) *
        velocity *
        (keyIsDown(negDirection) ? -1 : 1)
    );
}

function resetGame() {
    gameTimer.reset();
    score = 0;
    rope.update(width / 2, height / 2);
    rope.build();
    createFood(random(width), random(height), Food.state.NORMAL);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}