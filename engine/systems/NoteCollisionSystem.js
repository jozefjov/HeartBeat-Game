import { vec3, mat4 } from 'glm';
import { getGlobalModelMatrix } from '../core/SceneUtils.js';
import { Transform } from '../core/Transform.js';

class NoteCollisionSystem {
    constructor(scene, girlModel) {
        this.scene = scene;
        this.girlModel = girlModel;
        this.collisionCallbacks = new Set();
        this.trackWidth = 0.8;
        this.score = 0;
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

    update(t, dt) {
        if (!this.girlModel || !this.girlModel.isDynamic) return;

        const girlPosition = this.girlModel.getComponentOfType(Transform).translation;
        const girlTrack = Math.round(girlPosition[0] / this.trackWidth);

        this.scene.traverse(node => {
            if (node.isNote !== undefined && node.parent) {
                const noteTransform = node.getComponentOfType(Transform);
                if (!noteTransform) return;

                const notePosition = noteTransform.translation;
                const noteTrack = Math.round(notePosition[0] / this.trackWidth);
                
                // Check for collision
                if (noteTrack === girlTrack && Math.abs(notePosition[2] - girlPosition[2]) < 1) {
                    if (node.isNote) {
                        this.score++;
                        console.log('Note Hit! +1');
                    } else {
                        this.score = Math.max(0, this.score - 1);
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