document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const successScreen = document.getElementById('success-screen');

    const startButton = document.getElementById('start-button');
    const playAgainButton = document.getElementById('play-again-button');

    const balls = document.querySelectorAll('.ball');
    const targets = document.querySelectorAll('.target-box');

    const introSound = document.getElementById('intro-sound');
    const clapSound = document.getElementById('clap-sound');

    let draggedItem = null;
    let correctMatches = 0;
    const totalMatches = 4;

    // Play intro sound
    introSound.play().catch(() => {
        console.log("Autoplay blocked. Will play on button click.");
    });

    document.body.addEventListener('click', () => {
        introSound.play();
    }, { once: true });


    startButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    });

    playAgainButton.addEventListener('click', () => {
        resetGame();
        successScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        introSound.play();
    });

    // Drag and Drop
    balls.forEach(ball => {
        ball.addEventListener('dragstart', (e) => {
            draggedItem = ball;
            e.dataTransfer.setData('text/plain', ball.dataset.color);
            setTimeout(() => ball.classList.add('dragging'), 0);
        });

        ball.addEventListener('dragend', () => {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
        });
    });

    targets.forEach(target => {
        target.addEventListener('dragover', e => e.preventDefault());
        target.addEventListener('dragenter', e => {
            e.preventDefault();
            target.classList.add('bg-gray-100');
        });
        target.addEventListener('dragleave', () => target.classList.remove('bg-gray-100'));
        target.addEventListener('drop', e => {
            e.preventDefault();
            target.classList.remove('bg-gray-100');

            const draggedColor = e.dataTransfer.getData('text/plain');
            const targetColor = target.dataset.color;

            if (draggedColor === targetColor && !target.classList.contains('matched')) {
                target.classList.add('matched');
                const originalBall = document.querySelector(`.ball[data-color="${draggedColor}"]`);
                if (originalBall) originalBall.classList.add('dropped');

                correctMatches++;

                // Play clapping sound
                clapSound.currentTime = 0;
                clapSound.play();

                checkWin();
            }
        });
    });

    function checkWin() {
        if (correctMatches === totalMatches) {
            setTimeout(() => {
                gameScreen.classList.add('hidden');
                successScreen.classList.remove('hidden');
            }, 500);
        }
    }

    function resetGame() {
        correctMatches = 0;
        balls.forEach(ball => ball.classList.remove('dropped'));
        targets.forEach(target => target.classList.remove('matched'));
    }
});

