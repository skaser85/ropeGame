class Pallete {
    constructor() {
        this.colors = null;
    }

    init() {
        this.colors = {
            RED: color(255, 0, 0, 255),
            GREEN: color(0, 255, 0, 255),
            BLUE: color(0, 0, 255, 255),
            WHITE: color(255, 255, 255, 255),
            BLACK: color(0, 0, 0, 255),
            GREY: color(128, 128, 128, 255),
            PURPLE: color(255, 0, 255, 255),
            YELLOW: color(255, 255, 0, 255),
            CYAN: color(0, 255, 255, 255),
            ORANGE: color(255, 138, 5, 255),
            BLUE2: color(48, 97, 201, 255),
            GOLD: color(240, 205, 53, 255)
        }
    }
}