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

  updatePos(v) {
    this.pos.set(v);
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