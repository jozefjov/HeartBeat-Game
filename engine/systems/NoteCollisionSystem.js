import { vec3, mat4 } from 'glm';
import { getGlobalModelMatrix } from '../core/SceneUtils.js';
import { Transform } from '../core/Transform.js';

class NoteCollisionSystem {
    constructor(scene, girlModel) {
        this.scene = scene;
        this.girlModel = girlModel;
        this.collisionCallbacks = new Set();
        this.trackWidth = 0.8; // Width of each track
    }

    onCollision(callback) {
        this.collisionCallbacks.add(callback);
    }

    removeCollisionCallback(callback) {
        this.collisionCallbacks.delete(callback);
    }

    update(t, dt) {
        if (!this.girlModel || !this.girlModel.isDynamic) return;

        const girlPosition = this.girlModel.getComponentOfType(Transform).translation;
        const girlTrack = Math.round(girlPosition[0] / this.trackWidth);

        this.scene.traverse(node => {
            if (node.isNote) {
                const noteTransform = node.getComponentOfType(Transform);
                if (!noteTransform) return;

                const notePosition = noteTransform.translation;
                const noteTrack = Math.round(notePosition[0] / this.trackWidth);
                
                // Check if note is on same track and within collision range
                if (noteTrack === girlTrack && 
                    Math.abs(notePosition[2] - girlPosition[2]) < 1) {
                    console.log('Note collision detected!');
                    this.collisionCallbacks.forEach(callback => {
                        callback(this.girlModel, node);
                    });
                }
            }
        });
    }
}

export { NoteCollisionSystem };