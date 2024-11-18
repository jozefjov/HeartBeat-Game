import { vec3, mat4 } from '../../../lib/glm.js';
import { getGlobalModelMatrix } from '../core/SceneUtils.js';
import { Transform } from '../core/Transform.js';

class NoteCollisionSystem {
    constructor(scene, girlModel) {
        this.scene = scene;
        this.girlModel = girlModel;
        this.collisionCallbacks = new Set();
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
            if (node.isNote && node !== this.girlModel) {
                const noteAABB = this.getTransformedAABB(node);
                if (this.aabbIntersection(girlAABB, noteAABB)) {
                    this.collisionCallbacks.forEach(callback => {
                        callback(this.girlModel, node);
                    });
                }
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
                min: [-0.5, -0.5, -0.5],
                max: [0.5, 0.5, 0.5]
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
        const newmin = [Math.min(...xs), Math.min(...ys), Math.min(...zs)];
        const newmax = [Math.max(...xs), Math.max(...ys), Math.max(...zs)];

        return { min: newmin, max: newmax };
    }
}

export { NoteCollisionSystem };