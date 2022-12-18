class Food extends Dot {
  static state = {
    NORMAL: 0,
    SHUFFLE: 1,
    DECAY: 2,
    DESTROY: 3,
    MOBILE: 4,
    DOUBLE: 5,
    TRIPLE: 6,
    TINY: 7,
    CREATE: 8,
  }

  static getRandomFood(x, y) {
    let state = Math.round(random(Object.keys(Food.state).length - 1));
    switch (state) {
      case Food.state.NORMAL: return new FoodNormal(x, y);
      case Food.state.SHUFFLE: return new FoodShuffle(x, y);
      case Food.state.DECAY: return new FoodDecay(x, y);
      case Food.state.DESTROY: return new FoodDestroy(x, y);
      case Food.state.MOBILE: return new FoodMobile(x, y);
      case Food.state.DOUBLE: return new FoodDouble(x, y);
      case Food.state.TRIPLE: return new FoodTriple(x, y);
      case Food.state.TINY: return new FoodTiny(x, y);
      case Food.state.CREATE: return new FoodCreate(x, y);
    }
  }

  constructor(x, y, label, _color, state) {
    super(x, y, null, 0, '');
    this.state = state;
    this.pulseAmt = 500;
    this.pulseCounter = 500;
    this.pulseSpeed = 5;
    this.goingUp = false;
    this.radius = DEFAULT_KNOT_RADIUS;
    this.label = label;
    this.defaultColor = _color;
    this.color = null;
    this.textColor = pallete.colors.BLACK;
    this.textSize = 16;
    this.active = true;
  }

  pulse() {
    if (this.goingUp) {
      this.pulseCounter += this.pulseSpeed;
      this.goingUp = this.pulseCounter < this.pulseAmt;
    } else {
      this.pulseCounter -= this.pulseSpeed;
      this.goingUp = this.pulseCounter <= 0;
    }
    let t = this.pulseCounter / this.pulseAmt;
    this.color = lerpColor(this.defaultColor, bkg_color, t);
  }

  calcPoints(knotPoints) {
    return knotPoints;
  }

  draw() {
    push();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
    fill(this.textColor);
    textSize(this.textSize);
    textStyle(BOLD);
    let tw = textWidth(this.label);
    let tx = this.pos.x - tw / 2;
    let ty = this.pos.y + this.radius + this.textSize;
    text(this.label, tx, ty);
    pop();
  }
}

class FoodNormal extends Food {
  constructor(x, y) {
    super(x, y, "NORMAL", pallete.colors.BLUE, Food.state.NORMAL);
  }
}

class FoodShuffle extends Food {
  constructor(x, y) {
    super(x, y, "SHUFFLE", pallete.colors.GREEN, Food.state.SHUFFLE);
  }
}

class FoodDecay extends Food {
  constructor(x, y) {
    super(x, y, "DECAY", pallete.colors.YELLOW, Food.state.DECAY);
    this.decayCountdownAmt = 3;
    this.decayTimer = new Timer(this.decayCountdownAmt);
  }

  decay() {
    this.decayTimer.update();
    this.active = this.decayTimer.active;
  }

  draw() {
    super.draw();
    push();
    fill(this.textColor);
    let tw = textWidth(this.decayTimer.amt);
    let tx = this.pos.x - tw / 2;
    let ty = this.pos.y + this.textSize / 2 - 2;
    text(this.decayTimer.amt, tx, ty);
    pop();
  }
}

class FoodDestroy extends Food {
  constructor(x, y) {
    super(x, y, "DESTROY", pallete.colors.RED, Food.state.DESTROY);
  }
}

class FoodMobile extends Food {
  constructor(x, y) {
    super(x, y, "MOBILE", pallete.colors.CYAN, Food.state.MOBILE);
    this.xoff = 0.001;
    this.yoff = 0.001;
  }

  move() {
    this.xoff += 0.008;
    this.yoff += 0.005;
    let x = noise(this.xoff) * width;
    let y = noise(this.yoff) * height;
    this.pos.set(x, y);
  }
}

class FoodDouble extends Food {
  constructor(x, y) {
    super(x, y, "DOUBLE", pallete.colors.PURPLE, Food.state.DOUBLE);
  }

  calcPoints(knotPoints) {
    return knotPoints * 2;
  }
}

class FoodTriple extends Food {
  constructor(x, y) {
    super(x, y, "TRIPLE", pallete.colors.ORANGE, Food.state.TRIPLE);
  }

  calcPoints(knotPoints) {
    return knotPoints * 3;
  }
}

class FoodTiny extends Food {
  constructor(x, y) {
    super(x, y, "TINY", pallete.colors.GOLD, Food.state.TINY);
    this.radius = DEFAULT_KNOT_RADIUS / 10;
  }
}

class FoodCreate extends Food {
  constructor(x, y) {
    super(x, y, "CREATE", pallete.colors.BLUE2, Food.state.CREATE);
  }
}