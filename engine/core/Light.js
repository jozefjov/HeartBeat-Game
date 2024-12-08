export class Light {

    constructor({
        color = [215, 81, 81],
        direction = [1, 0.3, 1],
    } = {}) {
        this.color = color;
        this.direction = direction;
    }

}
