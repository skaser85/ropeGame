class Rope {
  constructor(x, y, knotsCount) {
    this.pos = createVector(x, y);
    this.knotsCount = knotsCount || 1;
    this.knots = [];
    this.head = null;
    this.headColor = color(255, 0, 0, 255);
    this.knotColor = color(255, 0, 255, 255);
    this.alive = true;

    this.knotSeparationDistance = 50;
    this.elasticity = 10;
    this.knotSpeed = 8;
  }

  build() {
    this.knots = [];
    this.knots[0] = new Dot(this.pos.x, this.pos.y, this.headColor, DEFAULT_KNOT_RADIUS, 1);
    this.head = this.knots[0];

    for (let i = 1; i < this.knotsCount; i++) {
      let x = this.head.pos.x + i * this.knotSeparationDistance;
      let y = this.head.pos.y;
      let radius =
        DEFAULT_KNOT_RADIUS - DEFAULT_KNOT_RADIUS * (i / this.knotsCount);
      let label = i + 1;
      this.knots[i] = new Dot(x, y, this.knotColor, radius, label);
    }
  }

  resetKnots() {
    this.head.update(this.pos.x, this.pos.y);
    for (let i = 1; i < this.knotsCount; i++) {
      let x = this.head.pos.x + i * this.knotSeparationDistance;
      let y = this.head.pos.y;
      this.knots[i].update(x, y);
    }
    this.recolorKnots();
  }

  recolorKnots() {
    this.head.color = this.headColor;
    for (let i = 1; i < this.knots.length; i++) {
      let knot = this.knots[i];
      knot.color = this.knotColor;
    }
  }

  handleKeyboard() {
    let xDir = directionVelocity(LEFT_ARROW, RIGHT_ARROW, this.knotSpeed);
    let yDir = directionVelocity(UP_ARROW, DOWN_ARROW, this.knotSpeed);
    let v = createVector(xDir, yDir)
    this.head.pos.add(v);
  }

  shuffleKnots() {
    for (let i = this.knots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const otherKnot = this.knots[j];
      const currentKnot = this.knots[i];
      const currPos = currentKnot.pos.copy();
      const otherPos = otherKnot.pos.copy();
      otherKnot.updatePos(currPos);
      currentKnot.updatePos(otherPos);
      this.knots[i] = otherKnot;
      this.knots[j] = currentKnot;
    }
    this.head = this.knots[0];
  }

  destroyKnot(idx) {
    this.knots.splice(idx, 1);
    if (!this.knots.length) {
      this.alive = false;
      return;
    }
    this.head = this.knots[0];
    this.recolorKnots();
  }

  createKnot(knot) {
    this.knots.push(Dot.copy(knot));
  }

  setSpeed(speed) {
    this.knotSpeed = speed;
  }

  adjust() {
    for (let i = 1; i < this.knots.length; i++) {
      let knot = this.knots[i];
      let other = this.knots[i-1];
      let distance = knot.pos.dist(other.pos);
      if (distance > this.knotSeparationDistance) {
        let delta = this.knotSeparationDistance - distance;
        let direction = p5.Vector.sub(knot.pos, other.pos);
        direction.normalize().mult(delta / this.elasticity);
        knot.pos.add(direction);
      }
    }
  }

  draw() {
    for (let i = 0; i < this.knots.length - 1; i++) {
      let d0 = this.knots[i];
      let d1 = this.knots[i + 1];
      push();
      stroke(pallete.colors.GREY);
      strokeWeight(3);
      line(d0.pos.x, d0.pos.y, d1.pos.x, d1.pos.y);
      pop();
    }

    for (let knot of this.knots) {
      knot.draw();
    }
  }
}

function directionVelocity(negDirection, posDirection, velocity) {
  let dir = (keyIsDown(negDirection) || keyIsDown(posDirection));
  let isNeg = (keyIsDown(negDirection) ? -1 : 1);
  return (dir * velocity * isNeg);
}