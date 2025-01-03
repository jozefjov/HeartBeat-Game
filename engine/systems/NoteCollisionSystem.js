import { vec3, mat4 } from 'glm';
import { getGlobalModelMatrix } from '../core/SceneUtils.js';
import { Transform } from '../core/Transform.js';

class NoteCollisionSystem {
    constructor(scene, girlModel, camera) {
        this.scene = scene;
        this.girlModel = girlModel;
        this.camera = camera;
        this.collisionCallbacks = new Set();
        this.trackWidth = 0.8;
        this.score = 0;
        
        // Define collision thresholds
        this.horizontalThreshold = 1.5; // Horizontal distance for collision
        this.verticalThreshold = 0.5; // Vertical distance for collision
        this.cloudHeight = 0.8; // Height of the cloud obstacle
    }

    shakeCamera(duration = 0.5, intensity = 0.1) {
        let elapsed = 0;
        const originalPosition = vec3.clone(this.camera.getComponentOfType(Transform).translation);
        const interval = 0.016;

        const shakeInterval = setInterval(() => {
            if (elapsed > duration) {
                clearInterval(shakeInterval);
                vec3.copy(this.camera.getComponentOfType(Transform).translation, originalPosition);
                return;
            }

            const randomOffset = vec3.random([], intensity);
            vec3.add(this.camera.getComponentOfType(Transform).translation, originalPosition, randomOffset);
            elapsed += interval;

        }, interval);
    }

    onCollision(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        this.collisionCallbacks.add(callback);
        return this;
    }

    removeCollisionCallback(callback) {
        this.collisionCallbacks.delete(callback);
    }

    checkCollision(girlPosition, notePosition, isCloud) {
        // Check horizontal track alignment
        const girlTrack = Math.round(girlPosition[0] / this.trackWidth);
        const noteTrack = Math.round(notePosition[0] / this.trackWidth);
        const isAlignedHorizontally = girlTrack === noteTrack;

        // Check Z-axis proximity
        const isCloseOnZ = Math.abs(notePosition[2] - girlPosition[2]) < this.horizontalThreshold;

        // Different vertical collision checks for clouds and notes
        if (isCloud) {
            // For clouds, check if the girl is jumping over it
            const girlHeight = girlPosition[1];
            const isJumpingOver = girlHeight > this.cloudHeight;
            
            // Only collide if NOT jumping over and within vertical threshold
            return isAlignedHorizontally && isCloseOnZ && !isJumpingOver;
        } else {
            // For notes, simple vertical threshold check
            const verticalDistance = Math.abs(notePosition[1] - girlPosition[1]);
            return isAlignedHorizontally && isCloseOnZ && verticalDistance < this.verticalThreshold;
        }
    }

    update(t, dt) {
        if (!this.girlModel || !this.girlModel.isDynamic) return;

        const girlPosition = this.girlModel.getComponentOfType(Transform).translation;

        this.scene.traverse(node => {
            if (node.isNote !== undefined && node.parent) {
                const noteTransform = node.getComponentOfType(Transform);
                if (!noteTransform) return;

                const notePosition = noteTransform.translation;
                
                // Check for collision using the new collision detection method
                if (this.checkCollision(girlPosition, notePosition, !node.isNote)) {
                    if (node.isNote) {
                        this.score++;
                        console.log('Note Hit! +1');
                    } else {
                        this.score = Math.max(0, this.score - 1);
                        this.shakeCamera();
                        console.log('Cloud Hit! -1');
                    }

                    const collisionData = {
                        node: node,
                        isNote: node.isNote,
                        score: this.score,
                        position: notePosition
                    };

                    this.collisionCallbacks.forEach(callback => {
                        callback(collisionData);
                    });

                    node.remove();
                }
            }
        });
    }

    reset() {
        this.score = 0;
    }
}

export { NoteCollisionSystem };