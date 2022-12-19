class Particle {
    constructor(x, y, radius, _color) {
        this.pos = createVector(x, y);
        this.radius = radius;
        this.color = _color;
        this.force = createVector(random(-50, 50), random(-50, 50));
        this.active = true;
    }

    update() {
        this.pos.add(this.force);
        this.active = ((this.pos.x > 0 && this.pos.x < width) && (this.pos.y > 0 && this.pos.y < height));
    }

    draw() {
        push();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius*2);
        pop();
    }
}

class Emitter {
    constructor(x, y, _color) {
        this.pos = createVector(x, y);
        this.color = _color;
        this.particles = [];
        this.particlesCount = 20;
        this.active = true;
    }

    init() {
        let r = random(2, 12);
        for (let i = 0; i < this.particlesCount; i++) {
            this.particles.push(new Particle(this.pos.x, this.pos.y, r, this.color));
        }
    }

    update() {
        for (let p of this.particles) {
            p.update();
        }
        
        this.particles = this.particles.filter(p => p.active);
        
        if (!this.particles.length)
            this.active = false;
    }

    draw() {
        for (let p of this.particles) {
            p.draw();
        }
    }
}