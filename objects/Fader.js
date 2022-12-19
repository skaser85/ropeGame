class Fader {
    constructor(x, y, label) {
      this.x = x;
      this.y = y;
      this.label = label;
      this.cooldownAmt = 100;
      this.cooldownSpeed = 2;
      this.active = true;
    }
  
    update() {
      if (!this.active) return;
      this.cooldownAmt -= this.cooldownSpeed;
      this.active = this.cooldownAmt > 0;
    }
  
    draw() {
      if (!this.active)
        return;
  
      push();
      fill(pallete.colors.BLACK);
      textSize(28);
      text(this.label, this.x + 1, this.y + 1);
      fill(pallete.colors.GREEN);
      textSize(28);
      text(this.label, this.x, this.y);
      pop();
    }
  }