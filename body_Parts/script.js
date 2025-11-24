// GAME LEVELS
const levels = [
    { id: "hands", name: "Hands" },
    { id: "feet", name: "Feet" },
    { id: "neck", name: "Neck" },
    { id: "torso", name: "Chest" },
    { id: "head", name: "Head" }
];

let currentLevel = 0;

// DOM ELEMENTS
const pages = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    correct: document.getElementById('correct-screen'),
    end: document.getElementById('end-screen')
};

const buttons = {
    start: document.getElementById('start-button'),
    homeGame: document.getElementById('home-button-game'),
    homeCorrect: document.getElementById('home-button-correct'),
    next: document.getElementById('next-button'),
    playAgain: document.getElementById('play-again-button')
};

const gameElements = {
    dropZone: document.getElementById('drop-zone'),
    boyImage: document.getElementById('boy-image'),
    draggables: document.querySelectorAll('.draggable'),
    gameStars: document.getElementById('game-stars'),
    correctStars: document.getElementById('correct-stars')
};

// AUDIO
const audio = {
    intro: document.getElementById('audio-intro'),
    clap: document.getElementById('audio-clap'),
    end: document.getElementById('audio-end')
};

function playAudio(audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.play().catch(err => console.log("Audio blocked:", err));
}

// PAGE NAVIGATION
function showPage(pageId) {
    Object.values(pages).forEach(p => p.classList.remove('active'));
    pages[pageId].classList.add('active');

    if (pageId === 'end') playAudio(audio.end);
}

function startGame() {
    playAudio(audio.intro);
    currentLevel = 0;
    loadLevel(currentLevel);

    setTimeout(() => showPage('game'), 500);
}

function goHome() {
    showPage('start');
}

function playAgain() {
    goHome();
}

function nextLevel() {
    currentLevel++;
    if (currentLevel < levels.length) {
        loadLevel(currentLevel);
        showPage('game');
    } else {
        showPage('end');
    }
}

function showCorrectScreen() {
    playAudio(audio.clap);
    updateStars(currentLevel + 1, gameElements.correctStars);
    showPage('correct');
}

function loadLevel(levelIndex) {
    const level = levels[levelIndex];

    gameElements.boyImage.innerHTML =
        `<img src="/Assets/Images/${level.id}_missing.jpg" class="boy-base">`;

    gameElements.dropZone.dataset.targetPart = level.id;

    updateStars(levelIndex, gameElements.gameStars);
}

function updateStars(count, container) {
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';

        star.textContent = i < count ? '⭐' : '☆';
        if (i < count) star.classList.add('filled');

        container.appendChild(star);
    }
}

// DRAG & DROP
let draggedPart = null;

gameElements.draggables.forEach(item => {
    item.addEventListener('dragstart', e => {
        draggedPart = e.target.dataset.part;
        e.target.style.opacity = 0.5;
    });

    item.addEventListener('dragend', e => {
        e.target.style.opacity = 1;
        draggedPart = null;
    });
});

gameElements.dropZone.addEventListener('dragover', e => e.preventDefault());

gameElements.dropZone.addEventListener('drop', e => {
    e.preventDefault();
    const targetPart = e.currentTarget.dataset.targetPart;

    const draggedElement = document.querySelector(`.draggable[data-part="${draggedPart}"]`);

    if (draggedPart === targetPart) {
        showCorrectScreen();
    } else {
        draggedElement.classList.add("shake");
        setTimeout(() => draggedElement.classList.remove("shake"), 400);
    }
});

// BUTTON EVENTS
buttons.start.addEventListener('click', startGame);
buttons.homeGame.addEventListener('click', goHome);
buttons.homeCorrect.addEventListener('click', goHome);
buttons.next.addEventListener('click', nextLevel);
buttons.playAgain.addEventListener('click', playAgain);

// Initial Page
showPage('start');

