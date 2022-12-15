class Rope {
    constructor(x, y, knotsCount) {
      this.pos = createVector(x, y);
      this.knotsCount = knotsCount || 0;
      this.knots = [];
      this.head = null;
      this.headColor = color(255, 0, 0, 255);
      this.knotColor = color(255, 0, 255, 255);
    }
    
    update(x, y) {
      this.head.pos.set(x, y);
    }
    
    build() {
      this.knots = [];
      this.knots[0] = new Dot(this.pos.x, this.pos.y, this.headColor, DEFAULT_KNOT_RADIUS, 1);
      this.head = this.knots[0];
  
      for (let i = 1; i < this.knotsCount; i++) {
        let x = this.head.pos.x + i * KNOT_TARGET_DIST;
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
        let x = this.head.pos.x + i * KNOT_TARGET_DIST;
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
      this.head.pos.add(createVector(directionVelocity(LEFT_ARROW, RIGHT_ARROW, KNOT_SPEED),
                                     directionVelocity(UP_ARROW, DOWN_ARROW, KNOT_SPEED)));
    }
    
    checkFood() {
      for (let i = 0; i < this.knots.length; i++) {
        let knot = this.knots[i];
        if (knot.collides(food)) {
          score += this.getScoreAmt(knot.label, food.state);
          switch (food.state) {
            case Food.state.DESTROY: {
              this.knots.splice(i, 1);
              if (!this.knots.length)
                break;
              this.head = this.knots[0];
              this.recolorKnots();
              break;
            }
            case Food.state.CREATE: {
              let k = this.knots[this.knots.length-1];
              this.knots.push(new Dot(k.x, k.y, this.knotColor, k.radius, knot.label));
              break;
            }
            case Food.state.SHUFFLE: this.shuffleKnots(); break;
          }
              
          faders.push(new Fader(food.pos.x, food.pos.y, knot.label, 100));
          food.update(random(width), random(height));
          food.setRandomState();
          break;
        }
      }
    }
  
    shuffleKnots() {
      for (let i = this.knots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const otherKnot = this.knots[j];
        const currentKnot = this.knots[i];
        const currPos = currentKnot.pos.copy();
        const otherPos = otherKnot.pos.copy();
        otherKnot.update(currPos.x, currPos.y);
        currentKnot.update(otherPos.x, otherPos.y);
        this.knots[i] = otherKnot;
        this.knots[j] = currentKnot;
      }
      this.head = this.knots[0];
    }
    
    getScoreAmt(knotLabel, foodState) {
      switch (foodState) {
        case Food.state.DOUBLE: return knotLabel * 2;
        case Food.state.TRIPLE: return knotLabel * 3
        default: return knotLabel;
      }
    }
    
    adjust() {
      for (let i = 1; i < this.knots.length; i++) {
        this.knots[i].adjust(this.knots[i - 1]);
      }
    }
    
    draw() {
      for (let i = 0; i < this.knots.length - 1; i++) {
        let d0 = this.knots[i];
        let d1 = this.knots[i + 1];
        push();
        stroke(pallete.colors.GREY);
        strokeWeight(ROPE_WEIGHT);
        line(d0.pos.x, d0.pos.y, d1.pos.x, d1.pos.y);
        pop();
      }
  
      for (let knot of this.knots) {
        knot.draw();
      }
    }
  }