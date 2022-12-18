const DEFAULT_KNOT_RADIUS = 25;
const KNOT_TARGET_DIST = 50;
const ELASTICITY = 10;
const ROPE_WEIGHT = 3;
const KNOT_SPEED = 8;

class Dot {
  static copy(dot) {
    return new Dot(dot.pos.x, dot.pos.y, dot.color, dot.radius, dot.label);
  }

  constructor(x, y, _color, radius, label) {
    this.pos = createVector(x, y);
    this.color = _color || pallete.colors.BLACK;
    this.radius = radius ? Number(radius) : DEFAULT_KNOT_RADIUS;
    this.label = label || "";
  }

  hovered(m) {
    let d = this.pos.dist(m);
    return d < (this.radius * 2) + this.radius; // "+ this.radius" to give some padding for smaller dots
  }
  
  collides(otherDot) {
    let d = this.pos.dist(otherDot.pos);
    return d < (this.radius + otherDot.radius);
  }

  offscreen() {
    return (
      (this.pos.x + this.radius) > width ||
      (this.pos.x - this.radius) < 0 ||
      (this.pos.y + this.radius) > height ||
      (this.pos.y - this.radius) < 0
    );
  }

  adjust(prevDot) {
    let distance = this.pos.dist(prevDot.pos);
    if (distance > KNOT_TARGET_DIST) {
      let delta = KNOT_TARGET_DIST - distance;
      let direction = p5.Vector.sub(this.pos, prevDot.pos);
      direction.normalize().mult(delta / ELASTICITY);
      this.pos.add(direction);
    }
  }

  update(x, y) {
    this.pos.set(x, y);
  }

  draw() {
    push();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
    fill(pallete.colors.WHITE);
    textAlign(CENTER, CENTER);
    textSize(16);
    textStyle(BOLD);
    text(this.label, this.pos.x, this.pos.y);
    pop();
  }
}