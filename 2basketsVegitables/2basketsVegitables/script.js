document.addEventListener('DOMContentLoaded', () => {
    // Screen elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');

    // Button elements
    const startBtn = document.getElementById('start-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    // Game elements
    const vegetables = document.querySelectorAll('.vegetable');
    const dropzones = document.querySelectorAll('.plate-dropzone');
    const baskets = {
        left: document.getElementById('basket-left'),
        right: document.getElementById('basket-right'),
    };

    // Audio elements
    const successSound = document.getElementById('success-sound');
    const failureSound = document.getElementById('failure-sound');

    const TOTAL_VEGETABLES = vegetables.length;
    let correctlyPlacedCount = 0;
    
    // Store original parent of each vegetable
    const originalParents = new Map();
    vegetables.forEach(veg => {
        originalParents.set(veg, veg.parentElement);
    });


    // --- Event Listeners ---
    startBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', resetGame);

    // Drag and Drop listeners for vegetables
    vegetables.forEach(veg => {
        veg.addEventListener('dragstart', handleDragStart);
        veg.addEventListener('dragend', handleDragEnd);
    });

    // Drop listeners for plates
    dropzones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });


    // --- Functions ---
    function startGame() {
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
    }

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => {
            e.target.classList.add('dragging');
        }, 0);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault(); // This is necessary to allow a drop
    }

    function handleDragEnter(e) {
        e.preventDefault();
        if (e.target.classList.contains('plate-dropzone')) {
            e.target.classList.add('hovered');
        }
    }

    function handleDragLeave(e) {
        if (e.target.classList.contains('plate-dropzone')) {
            e.target.classList.remove('hovered');
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('hovered');

        const vegetableId = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(vegetableId);
        const dropZone = e.target;

        // Check if the dropzone is a valid plate and doesn't already have a vegetable
        if (dropZone.classList.contains('plate-dropzone') && dropZone.children.length === 0) {
            // Check if the vegetable matches the plate
            if (vegetableId === dropZone.dataset.vegetable) {
                // Correct Drop
                dropZone.appendChild(draggedElement);
                draggedElement.draggable = false; // Prevent it from being dragged again
                correctlyPlacedCount++;
                playSound(successSound);

                // Check for game completion
                if (correctlyPlacedCount === TOTAL_VEGETABLES) {
                    setTimeout(endGame, 1000);
                }
            } else {
                // Incorrect Drop
                playSound(failureSound);
            }
        }
    }
    
    function endGame() {
        gameScreen.classList.remove('active');
        endScreen.classList.add('active');
    }

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    function resetGame() {
        // Move vegetables back to their original baskets
        vegetables.forEach(veg => {
            const originalParent = originalParents.get(veg);
            originalParent.appendChild(veg);
            veg.draggable = true; // Make them draggable again
        });

        // Reset counter
        correctlyPlacedCount = 0;

        // Switch screens
        endScreen.classList.remove('active');
        startScreen.classList.add('active');
    }
});