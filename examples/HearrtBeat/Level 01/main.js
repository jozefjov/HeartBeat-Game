import { quat, vec3, mat4} from 'glm';
import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';
import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { UnlitRenderer } from 'engine/renderers/UnlitRenderer.js';
import { Camera, Transform, Node } from 'engine/core.js';
import { getGlobalModelMatrix } from 'engine/core/SceneUtils.js';
import { LinearAnimator } from 'engine/animators/LinearAnimator.js';
import { ModelMovement } from '../../../engine/controllers/ModelMovement.js';
import * as EasingFunctions from 'engine/animators/EasingFunctions.js';
import { NoteManager } from '../../../engine/animators/NoteManager.js';
import { NoteCollisionSystem } from '../../../engine/systems/NoteCollisionSystem.js';

const canvas = document.querySelector('canvas');
const renderer = new UnlitRenderer(canvas);
await renderer.initialize();

const loader = new GLTFLoader();
await loader.load('../../../models/scene/scene.gltf');

const scene = loader.loadScene(loader.defaultScene);
if (!scene) {
    throw new Error('A default scene is required to run this!');
}

const camera = loader.loadNode('Camera');
if (!camera) {
    throw new Error('A camera is required to run this!');
}

const girlModel = loader.loadNode('Girl');
if (!girlModel) {
    throw new Error('A girlModel in this scene is required to run this!');
}
girlModel.addComponent(new ModelMovement(girlModel, canvas));
girlModel.isDynamic = true;
girlModel.aabb = {
    min: [-0.2, -0.2, -0.2],
    max: [0.2, 0.2, 0.2],
};

const transform = girlModel.getComponentOfType(Transform);
if (transform) {
    transform.translation = [0, 0, -18];
}

const noteManager = new NoteManager(loader);
noteManager.initialize();
const notesData = noteManager.getNotesData();

// Track collided notes to prevent multiple collisions
const collidedNotes = new Set();

const collisionSystem = new NoteCollisionSystem(scene, girlModel);

collisionSystem.onCollision((girl, note) => {
    // Check if we've already handled this note
    if (collidedNotes.has(note)) {
        return;
    }
    
    console.log('Collision detected with note!');
    collidedNotes.add(note);
    
    // Remove the note after collision
    note.remove();
});

const baseStartTime = performance.now() / 1000;

const noteAnimators = notesData.map(({ note, startTime, startPosition, endPosition, loop}) => {
    note.isNote = true;
    
    const animator = new LinearAnimator(note, {
        startPosition: startPosition,
        endPosition: endPosition,
        startTime: baseStartTime + startTime,
        duration: 5,
        loop: loop,
    });

    note.addComponent({
        update(t, dt) {
            animator.update(t, dt);
        }
    });
});

function update(t, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(t, dt);
        }
    });
    
    collisionSystem.update(t, dt);
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();