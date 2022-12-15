class Timer {
    constructor(amtInSeconds) {
      this.initialAmt = amtInSeconds;
      this.amt = amtInSeconds;
      this.active = true;
    }
    
    reset() {
      this.amt = this.initialAmt;
      this.active = true;
    }
    
    changeAmt(amt) {
      this.initialAmt = amt;
      this.amt = amt;
    }
    
    update() {
      if (frameCount % 60 == 0 && this.amt > 0) {
        this.amt--;
        if (this.amt === 0)
          this.active = false;
      }
    }
  }