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

    static getRandomState() {
      return Math.round(random(Object.keys(Food.state).length-1))
    }

    constructor(x, y, state) {
      super(x, y, null, 0, '');
      this.state = state || Food.state.NORMAL;
      this.pulseAmt = 500;
      this.pulseCounter = 500;
      this.pulseSpeed = 5;
      this.goingUp = false;
      this.radius = this.getDiameter();
      this.label = this.getLabel();
      this.defaultColor = this.getColor();
      this.defaultTextColor = this.getTextColor();
      this.textColor = pallete.colors.BLACK;
      this.textSize = this.getTextSize();
      this.xoff = 0.001;
      this.yoff = 0.001;
      this.decayCountdownAmt = 3;
      this.decayTimer = null;
      this.active = true;

      this.setState();
    }
    
    getLabel() {
      switch (this.state) {
        case Food.state.NORMAL: return "NORMAL";
        case Food.state.SHUFFLE: return "SHUFFLE";
        case Food.state.DECAY: return "DECAY";
        case Food.state.DESTROY: return "DESTROY";
        case Food.state.MOBILE: return "MOBILE";
        case Food.state.DOUBLE: return "DOUBLE";
        case Food.state.TRIPLE: return "TRIPLE";
        case Food.state.TINY: return "TINY";
        case Food.state.CREATE: return "CREATE";
      }
    }
    
    getColor() {
      switch (this.state) {
        case Food.state.NORMAL: return pallete.colors.BLUE;
        case Food.state.SHUFFLE: return pallete.colors.GREEN;
        case Food.state.DECAY: return pallete.colors.YELLOW;
        case Food.state.DESTROY: return pallete.colors.RED;
        case Food.state.MOBILE: return pallete.colors.CYAN;
        case Food.state.DOUBLE: return pallete.colors.PURPLE;
        case Food.state.TRIPLE: return pallete.colors.ORANGE;
        case Food.state.TINY: return pallete.colors.GOLD;
        case Food.state.CREATE: return pallete.colors.BLUE2;
      }
    }
  
    getTextColor() {
      switch (this.state) {
        case Food.state.NORMAL: return color(255, 255, 255, 255);
        case Food.state.SHUFFLE: return color(255, 255, 255, 255);
        case Food.state.DECAY: return color(255, 255, 255, 255);
        case Food.state.DESTROY: return color(255, 255, 255, 255);
        case Food.state.MOBILE: return color(255, 255, 255, 255);
        case Food.state.DOUBLE: return color(255, 255, 255, 255);
        case Food.state.TRIPLE: return color(255, 255, 255, 255);
        case Food.state.TINY: return color(255, 255, 255, 255);
        case Food.state.CREATE: return color(255, 255, 255, 255);
      }
    }
    
    getDiameter() {
      switch (this.state) {
        case Food.state.TINY: return DEFAULT_KNOT_RADIUS / 10;
        default: return DEFAULT_KNOT_RADIUS;
      }
    }
    
    getTextSize() {
      switch (this.state) {
        // case Food.state.TINY: return 8;
        default: return 16;
      }
    }
    
    setState() {
      // this.state = 3;
      this.label = this.getLabel();
      this.defaultColor = this.getColor();
      this.radius = this.getDiameter();
      this.textSize = this.getTextSize();
      if (this.state === Food.state.DECAY) {
        this.decayTimer = new Timer(this.decayCountdownAmt);
      }
    }
  
    update(x, y) {
      this.pos.set(x, y);
      this.pulseCounter = this.pulseAmt;
      this.goingUp = false;
    }
  
    pulse() {
      if (this.goingUp) {
        this.pulseCounter += this.pulseSpeed;
        this.goingUp = this.pulseCounter < this.pulseAmt;
      } else {
        this.pulseCounter -= this.pulseSpeed;
        this.goingUp = this.pulseCounter <= 0;
      }
      this.color = lerpColor(
        this.defaultColor,
        bkg_color,
        this.pulseCounter / this.pulseAmt
      );
    }
    
    move() {
      this.xoff += 0.008;
      this.yoff += 0.005;
      let x = noise(this.xoff) * width;
      let y = noise(this.yoff) * height;
      this.pos.set(x, y);
    }
    
    decay() {
      this.decayTimer.update();
      this.active = this.decayTimer.active;
    }
  
    draw() {
      push();
      fill(this.color);
      ellipse(this.pos.x, this.pos.y, this.radius*2);
      fill(this.textColor);
      textSize(this.textSize);
      textStyle(BOLD);
      let tw = textWidth(this.label);
      let tx = this.pos.x - tw/2;
      let ty = this.pos.y + this.radius + this.textSize;
      text(this.label, tx, ty);
      if (this.state === Food.state.DECAY) {
        fill(pallete.colors.BLACK);
        let tw = textWidth(this.decayTimer.amt);
        let tx = this.pos.x - tw/2;
        let ty = this.pos.y + this.textSize/2-2;
        text(this.decayTimer.amt, tx, ty);
      }
      pop();
    }
  }