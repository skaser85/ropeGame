class Pallete {
    static brighten(c, percent) {
        let defaultValue = 100;
        if (!percent)
            percent = 0.1;
        let r = red(c) === 0 ? defaultValue : Math.min(red(c) * (1.0 + percent), 255);
        let g = green(c) === 0 ? defaultValue : Math.min(green(c) * (1.0 + percent), 255);
        let b = blue(c) === 0 ? defaultValue : Math.min(blue(c) * (1.0 + percent), 255);
        return color(r, g, b, alpha(c));
    }

    static darken(c, percent) {
        let defaultValue = 100;
        if (!percent)
            percent = 0.1;
        let r = red(c) === 255 ? defaultValue : Math.min(red(c) * (1.0 - percent), 255);
        let g = green(c) === 255 ? defaultValue : Math.min(green(c) * (1.0 - percent), 255);
        let b = blue(c) === 255 ? defaultValue : Math.min(blue(c) * (1.0 - percent), 255);
        return color(r, g, b, alpha(c));
    }

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