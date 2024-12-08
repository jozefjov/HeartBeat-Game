import { vec3 } from 'glm';
import { Transform } from '../core/Transform.js';

export class LinearAnimator {
    constructor(node, {
        startPosition = [0, 0, 0],
        endPosition = [0, 0, 0],
        startTime = 0,
        duration = 1,
        loop = false,
    } = {}) {
        this.node = node;
        this.startPosition = vec3.clone(startPosition);  // Clone to prevent reference issues
        this.endPosition = vec3.clone(endPosition);
        this.initialStartTime = startTime;  // Store initial start time
        this.startTime = startTime;
        this.duration = duration;
        this.loop = loop;
        this.playing = true;
    }

    play() {
        this.playing = true;
    }

    pause() {
        this.playing = false;
    }

    reset() {
        // Reset position to start
        const transform = this.node.getComponentOfType(Transform);
        if (transform) {
            vec3.copy(transform.translation, this.startPosition);
        }
        // Reset timing
        this.startTime = this.initialStartTime;
        this.playing = true;
    }

    update(t, dt) {
        if (!this.playing) {
            return;
        }

        const linearInterpolation = (t - this.startTime) / this.duration;
        const clampedInterpolation = Math.min(Math.max(linearInterpolation, 0), 1);
        const loopedInterpolation = ((linearInterpolation % 1) + 1) % 1;
        this.updateNode(this.loop ? loopedInterpolation : clampedInterpolation);
    }

    updateNode(interpolation) {
        const transform = this.node.getComponentOfType(Transform);
        if (!transform) {
            return;
        }

        vec3.lerp(transform.translation, this.startPosition, this.endPosition, interpolation);
    }
}