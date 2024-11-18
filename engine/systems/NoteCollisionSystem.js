import { vec3, mat4 } from 'glm';
import { getGlobalModelMatrix } from '../core/SceneUtils.js';
import { Transform } from '../core/Transform.js';

class NoteCollisionSystem {
    constructor(scene, girlModel) {
        this.scene = scene;
        this.girlModel = girlModel;
        this.collisionCallbacks = new Set();
        this.collidedNotes = new Set(); // Track processed notes
    }

    onCollision(callback) {
        this.collisionCallbacks.add(callback);
    }

    removeCollisionCallback(callback) {
        this.collisionCallbacks.delete(callback);
    }

    update(t, dt) {
        if (!this.girlModel || !this.girlModel.isDynamic) return;

        const girlAABB = this.getTransformedAABB(this.girlModel);

        this.scene.traverse(node => {
            // Only check unprocessed notes
            if (node.isNote && !this.collidedNotes.has(node)) {
                const noteAABB = this.getTransformedAABB(node);
                
                // Add tolerance to AABB check
                const tolerance = 0.5;
                const expandedGirlAABB = {
                    min: vec3.subtract(vec3.create(), girlAABB.min, [tolerance, tolerance, tolerance]),
                    max: vec3.add(vec3.create(), girlAABB.max, [tolerance, tolerance, tolerance])
                };

                if (this.aabbIntersection(expandedGirlAABB, noteAABB)) {
                    this.collidedNotes.add(node);
                    this.collisionCallbacks.forEach(callback => {
                        callback(this.girlModel, node);
                    });
                }
            }
        });

        // Clean up removed notes from tracking set
        this.collidedNotes.forEach(note => {
            if (!note.parent) {
                this.collidedNotes.delete(note);
            }
        });
    }

    intervalIntersection(min1, max1, min2, max2) {
        return !(min1 > max2 || min2 > max1);
    }

    aabbIntersection(aabb1, aabb2) {
        return this.intervalIntersection(aabb1.min[0], aabb1.max[0], aabb2.min[0], aabb2.max[0])
            && this.intervalIntersection(aabb1.min[1], aabb1.max[1], aabb2.min[1], aabb2.max[1])
            && this.intervalIntersection(aabb1.min[2], aabb1.max[2], aabb2.min[2], aabb2.max[2]);
    }

    getTransformedAABB(node) {
        if (!node.aabb) {
            node.aabb = {
                min: [-0.2, -0.2, -0.2],
                max: [0.2, 0.2, 0.2]
            };
        }

        const matrix = getGlobalModelMatrix(node);
        const { min, max } = node.aabb;
        const vertices = [
            [min[0], min[1], min[2]],
            [min[0], min[1], max[2]],
            [min[0], max[1], min[2]],
            [min[0], max[1], max[2]],
            [max[0], min[1], min[2]],
            [max[0], min[1], max[2]],
            [max[0], max[1], min[2]],
            [max[0], max[1], max[2]],
        ].map(v => vec3.transformMat4(vec3.create(), v, matrix));

        const xs = vertices.map(v => v[0]);
        const ys = vertices.map(v => v[1]);
        const zs = vertices.map(v => v[2]);

        return {
            min: [Math.min(...xs), Math.min(...ys), Math.min(...zs)],
            max: [Math.max(...xs), Math.max(...ys), Math.max(...zs)]
        };
    }
}

export { NoteCollisionSystem };