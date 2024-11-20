export class GameManager {
    constructor(scene, girlModel) {
        this.scene = scene;
        this.girlModel = girlModel;
        this.score = 0;
        this.hitNotes = 0;
        this.completedNotes = 0;
        this.totalNotes = 0;
        this.allNotesFinished = false;
        this.collidedNotes = new Set();
    }

    initialize(noteManager, collisionSystem, uiManager) {
        this.noteManager = noteManager;
        this.collisionSystem = collisionSystem;
        this.uiManager = uiManager;
        this.setupCollisionSystem();
    }

    setupCollisionSystem() {
        this.collisionSystem.onCollision((girl, note) => {
            if (this.collidedNotes.has(note)) return;
            
            this.collidedNotes.add(note);
            note.remove();
            this.completedNotes++;
            this.hitNotes++;
            this.score++;
            
            this.uiManager.updateScore(this.score);
            this.checkGameCompletion();
        });
    }

    checkGameCompletion() {
        if (this.completedNotes === this.totalNotes && !this.allNotesFinished) {
            this.allNotesFinished = true;
            this.uiManager.showEndScreen(this.hitNotes, this.totalNotes);
        }
    }

    noteCompleted(note) {
        if (!this.collidedNotes.has(note)) {
            this.completedNotes++;
            this.collidedNotes.add(note);
            this.checkGameCompletion();
        }
    }

    setTotalNotes(total) {
        this.totalNotes = total;
    }
}