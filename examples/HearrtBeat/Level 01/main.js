// IMPORTS
import { quat, vec3, mat4 } from './gl-matrix-module.js';

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



// STANDARD S**T DO NOT TOUCH
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

// [[ DO NOT TOUCH ]]
// GirlModel movement along x-axis [-2, -1, 0, 1, 2] 
const girlModel = loader.loadNode('Girl');
if (!girlModel) {
    throw new Error('A girlModel in this scene is required to run this!');
}

// Adjust the initial position of the girl
const transform = girlModel.getComponentOfType(Transform);
if (transform) {
    transform.translation = [0, 0, -18]; // Move the girl further along the Z-axis
    /*const rotation = quat.create();
    quat.rotateY(rotation, rotation, Math.PI);
    transform.rotation = rotation;*/
}

girlModel.addComponent(new ModelMovement(girlModel, canvas));
girlModel.isDynamic = true;
girlModel.aabb = {
    min: [-0.2, -0.2, -0.2],
    max: [0.2, 0.2, 0.2],
};

// TESTING ZONE (Delete if it is not working)

// Note Animation

const noteManager = new NoteManager(loader);
noteManager.initialize();

const notesData = noteManager.getNotesData();

const baseStartTime = performance.now() / 1000;

const noteAnimators = notesData.map(({ note, startTime, startPosition, endPosition, loop}) => {
    const animator = new LinearAnimator(note, {
        startPosition: startPosition,
        endPosition: endPosition,
        startTime: baseStartTime + startTime,
        duration: 5,
        loop: loop,
    })

    note.addComponent({
        update(t, dt) {
            animator.update(t, dt);
        }
    });
});

// [[ DO NOT TOUCH ]]
// Update AND Render Functions
function update(t, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(t, dt);
        }
    });
    
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
