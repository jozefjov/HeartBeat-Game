export class UIManager {
    constructor() {
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
        this.createUI();
    }

    createUI() {
        this.createGameUI();
        this.createEndScreen();
    }

    createGameUI() {
        this.gameUI = document.createElement('div');
        this.gameUI.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 15px 30px;
            background: radial-gradient(circle, #ffffff, #fce9b5);
            border-radius: 30px;
            box-shadow: 0px 0px 20px #f8fdea;
            font-family: sans-serif;
        `;

        this.scoreContainer = document.createElement('div');
        this.scoreContainer.style.cssText = `
            color: #947684;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
        `;

        this.scoreDisplay = document.createElement('div');
        this.scoreDisplay.textContent = `Score: 0`;

        this.highScoreDisplay = document.createElement('div');
        this.highScoreDisplay.style.marginTop = '10px';
        this.highScoreDisplay.textContent = `High Score: ${this.highScore}`;

        this.scoreContainer.appendChild(this.scoreDisplay);
        this.scoreContainer.appendChild(this.highScoreDisplay);
        this.gameUI.appendChild(this.scoreContainer);
        document.body.appendChild(this.gameUI);
    }

    createEndScreen() {
        this.endScreen = document.createElement('div');
        this.endScreen.style.cssText = `
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            justify-content: center;
            align-items: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            position: relative;
            padding: 20px 40px;
            width: 60%;
            max-width: 500px;
            background: radial-gradient(circle, #f8fdea, #faeabd);
            color: #a96161;
            border-radius: 30px;
            box-shadow: 0px 0px 30px #f8fdea;
            text-align: center;
            font-size: 16px;
        `;

        this.retryButton = document.createElement('button');
        this.retryButton.textContent = 'Try Again';
        this.retryButton.style.cssText = `
            margin-top: 20px;
            padding: 15px 40px;
            font-size: 16px;
            font-weight: bold;
            color: #947684;
            background: radial-gradient(circle, #ffffff, #fce9b5);
            border-radius: 30px;
            cursor: pointer;
            box-shadow: 0px 0px 20px #f8fdea;
            border: none;
            transition: all 0.3s ease;
        `;

        this.retryButton.onmouseover = () => {
            this.retryButton.style.boxShadow = '0px 0px 30px 10px #f8fdea';
            this.retryButton.style.transform = 'scale(1.1)';
        };

        this.retryButton.onmouseout = () => {
            this.retryButton.style.boxShadow = '0px 0px 20px #f8fdea';
            this.retryButton.style.transform = 'scale(1)';
        };

        this.retryButton.onclick = () => location.reload();

        content.appendChild(this.retryButton);
        this.endScreen.appendChild(content);
        document.body.appendChild(this.endScreen);
    }

    updateScore(score) {
        this.score = score;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
            this.highScoreDisplay.textContent = `High Score: ${this.highScore}`;
        }
        this.scoreDisplay.textContent = `Score: ${this.score}`;
    }

    showEndScreen(hitNotes, totalNotes) {
        const finalProgress = (hitNotes / totalNotes * 100).toFixed(1);
        const content = this.endScreen.firstChild;
        content.innerHTML = `
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 20px">Game Complete!</div>
            <div style="font-size: 20px; margin-bottom: 20px">
                Final Score: ${finalProgress}%<br>
                Notes Hit: ${hitNotes}/${totalNotes}
            </div>
        `;
        content.appendChild(this.retryButton);
        this.endScreen.style.display = 'flex';
    }
}