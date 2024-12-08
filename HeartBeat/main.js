import { quat, vec3, mat4 } from 'glm';
import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';
import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { UnlitRenderer } from 'engine/renderers/UnlitRenderer.js';
import { Camera, Node, Transform } from 'engine/core.js';
import { LinearAnimator } from 'engine/animators/LinearAnimator.js';
import { Light } from '../engine/core.js';
import { ModelMovement } from '../engine/controllers/ModelMovement.js';
import { NoteManager } from '../engine/animators/NoteManager.js';
import { NoteCollisionSystem } from '../engine/systems/NoteCollisionSystem.js';
import { UIManager } from './UIManager.js';
import { GameManager } from './GameManager.js';

// Initialize game systems
const canvas = document.querySelector('canvas');
const renderer = new UnlitRenderer(canvas);
await renderer.initialize();

const loader = new GLTFLoader();
await loader.load('../models/scene/scene.gltf');

const scene = loader.loadScene(loader.defaultScene);
const camera = loader.loadNode('Camera');
const girlModel = loader.loadNode('Girl');

const light = new Node();
light.addComponent(new Light());
scene.addChild(light);

if (!scene || !camera || !girlModel) {
    throw new Error('Required scene elements are missing!');
}

// Setup music
let audioContext;
let audioBuffer;
let audioSource;
let MusicTimer;
let isPaused = false;
let pausedAt = 0;  // Track where we paused

// Loading Music
async function loadAudio(fileUrl) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

// Playing Music
function playAudio() {
    if (!audioContext || !audioBuffer) return;
    
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start();

    MusicTimer = audioContext.currentTime;
}

// Pause Music
function pauseAudio() {
    if (audioSource) {
        pausedAt = audioContext.currentTime - MusicTimer; // Store current position
        audioSource.stop();
    }
}

// Resume Music
function resumeAudio() {
    if (audioContext && audioBuffer) {
        audioSource = audioContext.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.connect(audioContext.destination);
        
        // Start from where we paused
        audioSource.start(0, pausedAt);
        MusicTimer = audioContext.currentTime - pausedAt;
    }
}

await loadAudio('../dreams-song.mp3');
playAudio();

// Setup player
girlModel.addComponent(new ModelMovement(girlModel, canvas));
girlModel.isDynamic = true;
girlModel.getComponentOfType(Transform).translation = [0, 0, -18];

// Initialize managers
const uiManager = new UIManager();
const noteManager = new NoteManager(loader);
const collisionSystem = new NoteCollisionSystem(scene, girlModel, camera);
const gameManager = new GameManager(scene, girlModel);

noteManager.initialize();
gameManager.initialize(noteManager, collisionSystem, uiManager);

// Setup UI callbacks
uiManager.setCallbacks({
    onPause: () => {
        isPaused = true;
        gameManager.pauseGame();
        pauseAudio();
    },
    onResume: () => {
        isPaused = false;
        gameManager.resumeGame();
        resumeAudio();
    }
});

// Setup notes
const notesData = noteManager.getNotesData();

const noteAnimators = notesData.map(({ note, startTime, startPosition, endPosition, type}) => {
    if (type === "cloud") note.isNote = false;
    else {
        note.isNote = true;
    }
    const animator = new LinearAnimator(note, {
        startPosition,
        endPosition,
        startTime: MusicTimer + startTime,
        type,
        duration: 5,
        loop: false
    });

    note.addComponent({
        update(t, dt) {
            if (!isPaused) {
                animator.update(t, dt);
                const transform = note.getComponentOfType(Transform);
                if (transform && transform.translation[2] <= endPosition[2]) {
                    gameManager.noteCompleted(note);
                }
            }
        }
    });

    return animator;
});

gameManager.setTotalNotes(noteAnimators.length);

// Game loop
function update(t, dt) {
    if (!isPaused) {
        scene.traverse(node => {
            for (const component of node.components) {
                component.update?.(t, dt);
            }
        });
        collisionSystem.update(t, dt);
    }
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

// Start game systems
new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();