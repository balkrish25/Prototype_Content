
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GAME DATA ---

    const level1Data = [
        { num: 1, word: 'One' }, { num: 2, word: 'Two' }, { num: 3, word: 'Three' },
        { num: 4, word: 'Four' }, { num: 5, word: 'Five' }, { num: 6, word: 'Six' },
        { num: 7, word: 'Seven' }, { num: 8, word: 'Eight' }, { num: 9, word: 'Nine' },
        { num: 10, word: 'Ten' }
    ];

    const level2Questions = [
        { word: 'One', options: [3, 1, 5, 2], answer: 1 },
        { word: 'Two', options: [2, 4, 6, 8], answer: 2 },
        { word: 'Three', options: [4, 5, 3, 1], answer: 3 },
        { word: 'Four', options: [1, 7, 4, 9], answer: 4 },
        { word: 'Five', options: [5, 2, 8, 3], answer: 5 },
        { word: 'Six', options: [7, 6, 1, 10], answer: 6 },
        { word: 'Seven', options: [3, 5, 9, 7], answer: 7 },
        { word: 'Eight', options: [8, 1, 6, 2], answer: 8 },
        { word: 'Nine', options: [5, 9, 3, 7], answer: 9 },
        { word: 'Ten', options: [2, 10, 4, 6], answer: 10 }
    ];

    const level3Data = [
        { num: 10, word: 'Ten' }, { num: 20, word: 'Twenty' }, { num: 30, word: 'Thirty' },
        { num: 40, word: 'Forty' }, { num: 50, word: 'Fifty' }, { num: 60, word: 'Sixty' },
        { num: 70, word: 'Seventy' }, { num: 80, word: 'Eighty' }, { num: 90, word: 'Ninety' },
        { num: 100, word: 'Hundred' }
    ];

    const level4Questions = [
        { word: 'Ten', answer: 10 },
        { word: 'Twenty', answer: 20 },
        { word: 'Thirty', answer: 30 },
        { word: 'Forty', answer: 40 },
        { word: 'Fifty', answer: 50 },
        { word: 'Sixty', answer: 60 },
        { word: 'Seventy', answer: 70 },
        { word: 'Eighty', answer: 80 },
        { word: 'Ninety', answer: 90 },
        { word: 'Hundred', answer: 100 }
    ];

    const level4OptionPool = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const optionColors = ['yellow', 'brown', 'purple', 'white'];

    // --- 2. STATE VARIABLES ---
    let currentL1Index = 0;
    let currentL2Question = 0;
    let currentL3Index = 0;
    let currentL4Question = 0;
    let l2Score = 0;
    let l4Score = 0;

    let quizContext = {
        level: 0,
        onCorrect: null,
        onWrong: null
    };

    // --- 3. DOM ELEMENTS & SOUNDS ---
    const pages = {
        mainMenu: document.getElementById('main-menu-page'),
        level1: document.getElementById('level-1-page'),
        level2Intro: document.getElementById('level-2-intro-page'),
        level2Game: document.getElementById('level-2-game-page'),
        level3Intro: document.getElementById('level-3-intro-page'),
        level3: document.getElementById('level-3-page'),
        level4Intro: document.getElementById('level-4-intro-page'),
        level4Game: document.getElementById('level-4-game-page'),
        correct: document.getElementById('correct-page'),
        wrong: document.getElementById('wrong-page'),
        endGame: document.getElementById('end-game-page')
    };

    const sounds = {
        welcome: document.getElementById('sound-welcome'),
        readLearn: document.getElementById('sound-read-learn'),
        selectNumber: document.getElementById('sound-select-number'),
        good: document.getElementById('sound-good'),
        wrong: document.getElementById('sound-wrong'),
        youAreGood: document.getElementById('sound-you-are-good')
    };

    // --- 4. HELPER FUNCTIONS ---

    function showPage(pageId) {
        Object.values(pages).forEach(page => page.classList.remove('active'));
        pages[pageId].classList.add('active');
    }

    function playSound(sound) {
        if (sound && sound.src) {
            sound.currentTime = 0;
            sound.play().catch(e => console.error("Audio play failed:", e));
        }
    }

    function goHome() {
        // Reset all game progress
        currentL1Index = 0;
        currentL2Question = 0;
        currentL3Index = 0;
        currentL4Question = 0;
        l2Score = 0;
        l4Score = 0;
        showPage('mainMenu');
    }

    function updateStars(containerId, score, total) {
        const starContainer = document.getElementById(containerId);
        if (!starContainer) return;

        starContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const starImg = document.createElement('img');
            if (i < score) {
                starImg.src = './numberImages/filled_star.webp';
                starImg.alt = 'Filled Star';
            } else {
                starImg.src = './numberImages/blank_star.webp';
                starImg.alt = 'Empty Star';
            }
            starContainer.appendChild(starImg);
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function generateLevel4Options(correctAnswer) {
        let options = level4OptionPool.filter(opt => opt !== correctAnswer);
        shuffleArray(options);
        let finalOptions = options.slice(0, 3);
        finalOptions.push(correctAnswer);
        return shuffleArray(finalOptions);
    }

    // --- 5. PAGE LOAD/NAVIGATION LOGIC ---

    // Main Menu Handlers
    document.getElementById('start-level-1-btn').addEventListener('click', () => {
        loadLevel1(0);
        showPage('level1');
        playSound(sounds.readLearn);
    });
    document.getElementById('start-level-2-btn').addEventListener('click', () => {
        showPage('level2Intro');
        playSound(sounds.selectNumber);
    });
    document.getElementById('start-level-3-btn').addEventListener('click', () => {
        loadLevel3(0);
        showPage('level3');
        playSound(sounds.readLearn);
    });
    document.getElementById('start-level-4-btn').addEventListener('click', () => {
        showPage('level4Intro');
        playSound(sounds.selectNumber);
    });

    // Global Home Button Handlers
    document.querySelectorAll('.home-button').forEach(btn => btn.addEventListener('click', goHome));

    // Level 1: Read (1-10) Logic
    function loadLevel1(index) {
        currentL1Index = index;
        const data = level1Data[index];
        document.getElementById('level-1-display').innerHTML = `<span>${data.num}</span> = <span>${data.word}</span>`;
        document.getElementById('level-1-back').style.visibility = (index === 0) ? 'hidden' : 'visible';
        const nextBtnText = document.querySelector('#level-1-next span');
        if (nextBtnText) nextBtnText.textContent = (index === level1Data.length - 1) ? 'Finish' : 'Next';
    }
    document.getElementById('level-1-next').addEventListener('click', () => {
        if (currentL1Index < level1Data.length - 1) {
            loadLevel1(currentL1Index + 1);
        } else {
            showPage('level2Intro');
            playSound(sounds.selectNumber);
        }
    });
    document.getElementById('level-1-back').addEventListener('click', () => {
        if (currentL1Index > 0) {
            loadLevel1(currentL1Index - 1);
        }
    });

    // Level 2: Intro/Game Handlers
    document.getElementById('start-level-2-game-btn').addEventListener('click', () => {
        l2Score = 0;
        loadLevel2(0);
        showPage('level2Game');
    });

    function loadLevel2(index) {
        currentL2Question = index;
        const q = level2Questions[index];

        updateStars('level-2-stars', l2Score, level2Questions.length);
        document.getElementById('level-2-word').textContent = q.word;

        const optionsContainer = document.getElementById('level-2-options');
        optionsContainer.innerHTML = '';

        q.options.forEach((option, i) => {
            const button = document.createElement('div');
            button.className = `option-button ${optionColors[i % optionColors.length]}`;
            button.textContent = option;
            button.addEventListener('click', () => checkAnswerLevel2(option, q.answer));
            optionsContainer.appendChild(button);
        });

        quizContext.level = 2;
        quizContext.onCorrect = () => {
            l2Score++;
            if (currentL2Question < level2Questions.length - 1) {
                loadLevel2(currentL2Question + 1);
                showPage('level2Game');
            } else {
                showPage('level3Intro');
                playSound(sounds.readLearn);
            }
        };
        quizContext.onWrong = () => {
            showPage('level2Game');
        };
    }
    function checkAnswerLevel2(selected, correct) {
        if (selected === correct) {
            updateStars('correct-stars', l2Score + 1, level2Questions.length);
            showPage('correct');
            playSound(sounds.good);
        } else {
            updateStars('wrong-stars', l2Score, level2Questions.length);
            showPage('wrong');
            playSound(sounds.wrong);
        }
    }

    // Level 3: Read (Tens) Logic
    document.getElementById('start-level-3-game-btn').addEventListener('click', () => {
        loadLevel3(0);
        showPage('level3');
    });

    function loadLevel3(index) {
        currentL3Index = index;
        const data = level3Data[index];
        document.getElementById('level-3-display').innerHTML = `<span>${data.num}</span> = <span>${data.word}</span>`;
        document.getElementById('level-3-back').style.visibility = (index === 0) ? 'hidden' : 'visible';
        const nextBtnText = document.querySelector('#level-3-next span');
        if (nextBtnText) nextBtnText.textContent = (index === level3Data.length - 1) ? 'Finish' : 'Next';
    }
    document.getElementById('level-3-next').addEventListener('click', () => {
        if (currentL3Index < level3Data.length - 1) {
            loadLevel3(currentL3Index + 1);
        } else {
            showPage('level4Intro');
            playSound(sounds.selectNumber);
        }
    });
    document.getElementById('level-3-back').addEventListener('click', () => {
        if (currentL3Index > 0) {
            loadLevel3(currentL3Index - 1);
        }
    });

    // Level 4: Intro/Game Handlers
    document.getElementById('start-level-4-game-btn').addEventListener('click', () => {
        l4Score = 0;
        loadLevel4(0);
        showPage('level4Game');
        playSound(sounds.selectNumber);
    });

    function loadLevel4(index) {
        currentL4Question = index;
        const q = level4Questions[index];

        const randomOptions = generateLevel4Options(q.answer);

        updateStars('level-4-stars', l4Score, level4Questions.length);
        document.getElementById('level-4-word').textContent = q.word;

        const optionsContainer = document.getElementById('level-4-options');
        optionsContainer.innerHTML = '';

        randomOptions.forEach((option, i) => {
            const button = document.createElement('div');
            button.className = `option-button ${optionColors[i % optionColors.length]}`;
            button.textContent = option;
            button.addEventListener('click', () => checkAnswerLevel4(option, q.answer));
            optionsContainer.appendChild(button);
        });

        quizContext.level = 4;
        quizContext.onCorrect = () => {
            l4Score++;
            if (currentL4Question < level4Questions.length - 1) {
                loadLevel4(currentL4Question + 1);
                showPage('level4Game');
            } else {
                loadEndScreen();
                showPage('endGame');
                playSound(sounds.youAreGood);
            }
        };
        quizContext.onWrong = () => {
            showPage('level4Game');
        };
    }
    function checkAnswerLevel4(selected, correct) {
        if (selected === correct) {
            updateStars('correct-stars', l4Score + 1, level4Questions.length);
            showPage('correct');
            playSound(sounds.good);
        } else {
            updateStars('wrong-stars', l4Score, level4Questions.length);
            showPage('wrong');
            playSound(sounds.wrong);
        }
    }

    // Correct/Wrong Screen Buttons
    document.getElementById('correct-next-btn').addEventListener('click', () => {
        if (quizContext.onCorrect) quizContext.onCorrect();
    });
    document.getElementById('wrong-back-btn').addEventListener('click', () => {
        if (quizContext.onWrong) quizContext.onWrong();
    });

    // End Screen Logic
    function loadEndScreen() {
        // Assuming success on completion, show 10 filled stars
        updateStars('end-stars', 10, 10);
    }

    // --- 6. INITIALIZE GAME ---
    showPage('mainMenu');
    playSound(sounds.welcome);
});

