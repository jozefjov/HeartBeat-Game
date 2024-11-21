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
        this.notes = [];

        // Load Quarter_Note
        for (let i = 0; i <= 100; i++) {
            const name = i === 0 ? 'Quarter_Note' : `Quarter_Note.${i.toString().padStart(3, '0')}`;
            this.notes.push(this.loader.loadNode(name));
        }

        // Load Eigh_Note
        for (let i = 0; i <= 100; i++) {
            const name = i === 0 ? 'Eight_Note' : `Eight_Note.${i.toString().padStart(3, '0')}`;
            this.notes.push(this.loader.loadNode(name));
        }

        // Load start locations
        this.startNodes = [
            this.loader.loadNode('String0_start'),
            this.loader.loadNode('String1_start'),
            this.loader.loadNode('String2_start'),
            this.loader.loadNode('String3_start'),
            this.loader.loadNode('String4_start')
        ];

        // Load end loa
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
        let i = 0;
        this.notesData = [
            { note: this.notes[i++], startTime: 0, startPosition: this.startPositions[0], endPosition: this.endPositions[0] },
            { note: this.notes[i++], startTime: 2, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 3, startPosition: this.startPositions[4], endPosition: this.endPositions[4] },
            { note: this.notes[i++], startTime: 4, startPosition: this.startPositions[3], endPosition: this.endPositions[3] },
            { note: this.notes[i++], startTime: 5, startPosition: this.startPositions[4], endPosition: this.endPositions[4] },
            { note: this.notes[i++], startTime: 6, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 7, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 9, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 13, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 15, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 17, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 22, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 23, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 25, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 27, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 28, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 31, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 32, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 33, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 34, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 35, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 36, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 37, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 38, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 39, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 40, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 41, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 42, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 43, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 44, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 45, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 46, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 47, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 48, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 49, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },
            { note: this.notes[i++], startTime: 50, startPosition: this.startPositions[1], endPosition: this.endPositions[1] },


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