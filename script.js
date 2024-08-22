'use strict';

const SimonGame = (() => {
    let sequence = [], playerSequence = [], level = 0;
    let gameActive = false, highScore = localStorage.getItem('highScore') || 0, isMuted = false;

    const colors = ['green', 'red', 'yellow', 'blue'];

    const colorElements = colors.reduce((acc, color) => {
        acc[color] = document.getElementById(`color-${color}`);
        return acc;
    }, {});

    const soundCache = colors.reduce((acc, color) => {
        acc[color] = new Audio(`sounds/${color}.wav`);
        return acc;
    }, {});

    const playSound = (color) => {
        if (!isMuted) {
            soundCache[color].currentTime = 0;
            soundCache[color].play();
        }
    };

    const flashColor = (color) => {
        const element = colorElements[color];
        element.classList.add('active');
        playSound(color);
        setTimeout(() => {
            element.classList.remove('active');
        }, 500);
    };

    const nextSequence = () => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(randomColor);
        level++;
        playerSequence = [];
        displayMessage(`Level ${level}`);
        playSequence();
    };

    const playSequence = () => {
        sequence.forEach((color, index) => {
            setTimeout(() => flashColor(color), 950 * (index + 1));
        });
    };

    const playerTurn = (color) => {
        playerSequence.push(color);
        flashColor(color);

        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            gameOver();
            return;
        }

        if (playerSequence.length === sequence.length) {
            setTimeout(nextSequence, 1500);
        }
    };

    const gameOver = () => {
        displayMessage('Game Over! Press Start to try again.');
        sequence = [];
        if (level > highScore) {
            highScore = level;
            localStorage.setItem('highScore', highScore);
            document.getElementById('high-score').textContent = `High Score: ${highScore}`;
        }
        level = 0;
        gameActive = false;
        const startButton = document.getElementById('start-button');
        startButton.disabled = false;
        startButton.textContent = 'Start Game';
    };

    const displayMessage = (message) => {
        document.getElementById('message').textContent = message;
    };

    const startGame = () => {
        if (gameActive) return;

        const startButton = document.getElementById('start-button');
        startButton.textContent = 'Playing...';
        displayMessage('Get ready!');
        gameActive = true;
        startButton.disabled = true;
        setTimeout(nextSequence, 1000);
    };

    document.getElementById('sound').addEventListener('click', () => {
        isMuted = !isMuted;
        const muteControl = document.getElementById('sound');
        if (isMuted) {
            muteControl.classList.add('muted');
        } else {
            muteControl.classList.remove('muted');
        }
    });

    document.getElementById('high-score').textContent = `High Score: ${highScore}`;

    return {
        startGame,
        playerTurn,
    };
})();

document.getElementById('start-button').addEventListener('click', SimonGame.startGame);

document.querySelectorAll('.color').forEach(button => {
    button.addEventListener('click', (event) => {
        const color = event.target.id.replace('color-', '');
        if (SimonGame.playerTurn) {
            SimonGame.playerTurn(color);
        }
    });
});
