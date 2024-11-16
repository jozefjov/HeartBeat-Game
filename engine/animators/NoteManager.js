import { quat, vec3, mat4} from 'glm';
import { getGlobalModelMatrix } from 'engine/core/SceneUtils.js';

export class NoteManager {
    constructor(loader) {
        this.loader = loader;
        this.notes = [];
        this.startNodes = [];
        this.endNodes = [];
        this.startPositions = [];
        this.notesData = [];
    }

    loadNotes() {
        this.notes = [
            this.loader.loadNode('Quarter_Note'),
            this.loader.loadNode('Quarter_Note.001'),
            this.loader.loadNode('Quarter_Note.002'),
            this.loader.loadNode('Eight_Note'),
            this.loader.loadNode('Eight_Note.001'),
            this.loader.loadNode('Eight_Note.002'),
        ];

        this.startNodes = [
            this.loader.loadNode('String0_start'),
            this.loader.loadNode('String1_start'),
            this.loader.loadNode('String2_start'),
            this.loader.loadNode('String3_start'),
            this.loader.loadNode('String4_start')
        ];

        this.endNodes = [
            this.loader.loadNode('String0_end'),
            this.loader.loadNode('String1_end'),
            this.loader.loadNode('String2_end'),
            this.loader.loadNode('String3_end'),
            this.loader.loadNode('String4_end')
        ];

        if (this.notes.includes(undefined) || this.startNodes.includes(undefined) || this.endNodes.includes(undefined)) {
            throw new Error('All notes, start, and end nodes must be loaded');
        }

    }

    calculatePositions() {
        this.startPositions = this.startNodes.map(node => mat4.getTranslation(vec3.create(), getGlobalModelMatrix(node)));
        this.endPositions = this.endNodes.map(node => mat4.getTranslation(vec3.create(), getGlobalModelMatrix(node)));
    }

    setupNotesData() {
        this.notesData = [
            { note: this.notes[0], startTime: 1, startPosition: this.startPositions[0], endPosition: this.endPositions[0], loop: false },
            { note: this.notes[1], startTime: 2, startPosition: this.startPositions[1], endPosition: this.endPositions[1], loop: false },
            { note: this.notes[2], startTime: 3, startPosition: this.startPositions[4], endPosition: this.endPositions[4], loop: false },
            { note: this.notes[3], startTime: 4, startPosition: this.startPositions[3], endPosition: this.endPositions[3], loop: false },
            { note: this.notes[4], startTime: 5, startPosition: this.startPositions[4], endPosition: this.endPositions[4], loop: false },
            { note: this.notes[5], startTime: 6, startPosition: this.startPositions[1], endPosition: this.endPositions[1], loop: false },

            // Add more notes as needed
        ];
    }

    // initialize everything
    initialize() {
        this.loadNotes();
        this.calculatePositions();
        this.setupNotesData();
    }

    getNotesData() {
        return this.notesData;
    }

}