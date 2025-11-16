document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const successScreen = document.getElementById('success-screen');

    const startButton = document.getElementById('start-button');
    const playAgainButton = document.getElementById('play-again-button');

    const shapes = document.querySelectorAll('.shape');
    const targets = document.querySelectorAll('.target-box');

    let draggedItem = null;
    let correctMatches = 0;
    const totalMatches = 3;

    // 🎵 Load audio files
    const voiceIntro = new Audio('introBasicShapes.mp3');
    const clapSound = new Audio('applause.mp3');
    const successSound = new Audio('good.mp3');

    // 🗣️ Play intro sound when game loads
    // 🎮 Navigation
    startButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        // 🎤 Play intro voice when user clicks Start
        voiceIntro.currentTime = 0;
        voiceIntro.play();
    });


    playAgainButton.addEventListener('click', () => {
        resetGame();
        successScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    });

    // 🧩 Drag and Drop logic
    shapes.forEach(shape => {
        shape.addEventListener('dragstart', (e) => {
            draggedItem = shape;
            e.dataTransfer.setData('text/plain', shape.dataset.shape);
            setTimeout(() => shape.classList.add('dragging'), 0);
        });

        shape.addEventListener('dragend', () => {
            shape.classList.remove('dragging');
            draggedItem = null;
        });
    });

    targets.forEach(target => {
        target.addEventListener('dragover', (e) => e.preventDefault());
        target.addEventListener('dragenter', (e) => {
            e.preventDefault();
            target.classList.add('bg-gray-100');
        });
        target.addEventListener('dragleave', () => target.classList.remove('bg-gray-100'));

        target.addEventListener('drop', (e) => {
            e.preventDefault();
            target.classList.remove('bg-gray-100');
            const draggedShape = e.dataTransfer.getData('text/plain');
            const targetShape = target.dataset.shape;

            if (draggedShape === targetShape && !target.classList.contains('matched')) {
                target.classList.add('matched');
                const originalShape = document.querySelector(`.shape[data-shape="${draggedShape}"]`);
                if (originalShape) originalShape.classList.add('dropped');

                // 👏 Play clap sound when matched correctly
                clapSound.currentTime = 0;
                clapSound.play();

                correctMatches++;
                checkWin();
            }
        });
    });

    // ✅ Check if all shapes matched
    function checkWin() {
        if (correctMatches === totalMatches) {
            setTimeout(() => {
                gameScreen.classList.add('hidden');
                successScreen.classList.remove('hidden');

                // 🎶 Play success sound when all matched
                successSound.currentTime = 0;
                successSound.play();
            }, 500);
        }
    }

    // 🔁 Reset Game
    function resetGame() {
        correctMatches = 0;
        shapes.forEach(shape => shape.classList.remove('dropped'));
        targets.forEach(target => target.classList.remove('matched'));
    }
});

