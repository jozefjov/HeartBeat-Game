import { quat, vec3, mat4} from 'glm';
import { getGlobalModelMatrix } from 'engine/core/SceneUtils.js';
import { notesData } from './notesData.js';

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

    async setupNotesData() {
        let i = 0;
        this.notesData = notesData.map((data) => ({
            note: this.notes[i++],
            startTime: data.startTime,
            startPosition: this.startPositions[data.stringIndex],
            endPosition: this.endPositions[data.stringIndex],
        }));
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