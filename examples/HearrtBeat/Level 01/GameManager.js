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
        this.actualTotalNotes = 0;
        this.gameActive = true;
    }

    initialize(noteManager, collisionSystem, uiManager) {
        this.noteManager = noteManager;
        this.collisionSystem = collisionSystem;
        this.uiManager = uiManager;

        if (!this.collisionSystem || typeof this.collisionSystem.onCollision !== 'function') {
            throw new Error('Invalid collision system provided');
        }

        this.setupCollisionSystem();
    }

    setupCollisionSystem() {
        this.collisionSystem.onCollision((collisionData) => {
            if (!this.gameActive || this.collidedNotes.has(collisionData.node)) return;
            
            this.collidedNotes.add(collisionData.node);
            this.completedNotes++;
            this.score = collisionData.score;

            if (collisionData.isNote) {
                this.hitNotes++;
                this.uiManager.showMessage('Perfect! +1', true);
            } else {
                this.uiManager.showMessage('Cloud Hit! -1', false);
            }
            
            this.uiManager.updateScore(this.score);
            this.checkGameCompletion();
        });
    }

    checkGameCompletion() {
        if (this.completedNotes === this.totalNotes && !this.allNotesFinished) {
            this.allNotesFinished = true;
            this.gameActive = false;
            
            const finalStats = {
                score: this.score,
                totalNotes: this.actualTotalNotes // Total number of actual notes (excluding clouds)
            };

            this.updateHighScore();
            this.uiManager.showEndScreen(finalStats);
        }
    }

    setTotalNotes(total) {
        this.totalNotes = total;
        // Make sure we're counting actual notes correctly
        this.actualTotalNotes = this.noteManager.getNotesData()
            .filter(note => note.isNote === true).length;  // Explicitly check for true
    }

    updateHighScore() {
        const currentHighScore = localStorage.getItem('highScore') 
            ? parseInt(localStorage.getItem('highScore')) 
            : 0;
        
        if (this.score > currentHighScore) {
            localStorage.setItem('highScore', this.score.toString());
            this.uiManager.updateHighScore(this.score);
        }
    }

    noteCompleted(note) {
        if (!this.gameActive || this.collidedNotes.has(note)) return;

        this.completedNotes++;
        this.collidedNotes.add(note);
        this.checkGameCompletion();
    }

    setTotalNotes(total) {
        this.totalNotes = total;
        this.actualTotalNotes = this.noteManager.getNotesData()
            .filter(note => note.type !== "cloud").length;
    }

    resetGame() {
        this.score = 0;
        this.hitNotes = 0;
        this.completedNotes = 0;
        this.allNotesFinished = false;
        this.collidedNotes.clear();
        this.gameActive = true;
        this.collisionSystem.reset();
        this.uiManager.updateScore(0);
    }

    pauseGame() {
        this.gameActive = false;
    }

    resumeGame() {
        this.gameActive = true;
    }

    getGameState() {
        return {
            score: this.score,
            hitNotes: this.hitNotes,
            totalNotes: this.actualTotalNotes,
            isActive: this.gameActive
        };
    }
}