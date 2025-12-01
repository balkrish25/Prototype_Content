document.addEventListener("DOMContentLoaded", () => {

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Screens
  const screens = {
    mainMenu: document.getElementById("main-menu"),
    preLevel: document.getElementById("pre-level-screen"),
    level1: document.getElementById("level-1"),
    game: document.getElementById("game-screen")
  };

  // Buttons
  const levelBtns = document.querySelectorAll(".level-btn");
  const headerHome = document.getElementById("headerHome");
  const homeIconLevel1 = document.getElementById("homeIconLevel1");
  const homeIconGame = document.getElementById("homeIconGame");
  const backMain = document.getElementById("back-main");

  const startLevelBtn = document.getElementById("start-level-btn");

  // Level 1
  const uppercaseDisplay = document.getElementById("uppercase-display");
  const lowercaseDisplay = document.getElementById("lowercase-display");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  // Game
  const gameTitle = document.getElementById("game-title");
  const questionBox1 = document.getElementById("question-box-1");
  const questionBox2 = document.getElementById("question-box-2");
  const wrapper1 = document.getElementById("wrapper-box-1");
  const wrapper2 = document.getElementById("wrapper-box-2");

  const optionsContainer = document.getElementById("options-container");
  const feedbackMsg = document.getElementById("feedback-msg");
  const starContainer = document.getElementById("star-container");

  const levelComplete = document.getElementById("level-complete");
  const levelCompleteText = document.getElementById("level-complete-text");
  const startNextBtn = document.getElementById("start-next-btn");
  const backToMenuBtn = document.getElementById("back-to-menu-btn");

  // Audio
  const successSound = document.getElementById("success-sound");
  const failSound = document.getElementById("fail-sound");

  let currentLevel = 0;
  let currentAlphabetIndex = 0;
  let correctAnswer = "";
  let score = 0;
  const TOTAL_QUESTIONS = 8;

  function showScreen(screen) {
    Object.values(screens).forEach(s => s.classList.add("d-none"));
    screen.classList.remove("d-none");
    levelComplete.classList.add("d-none");
  }

  // Home buttons
  [headerHome, homeIconLevel1, homeIconGame].forEach(btn => {
    if(btn){
      btn.onclick = () => showScreen(screens.mainMenu);
    }
  });

  backMain.onclick = () => showScreen(screens.mainMenu);

  levelBtns.forEach(btn => {
    btn.onclick = () => {
      currentLevel = parseInt(btn.dataset.level);

      if (currentLevel === 1) {
        startLevel1();
      } else {
        document.getElementById("pre-level-title").textContent =
          currentLevel === 2 ? "Match the Uppercase Letters" :
          currentLevel === 3 ? "Match the Lowercase Letters" :
                               "Match the Missing Letters";

        showScreen(screens.preLevel);
      }
    };
  });

  startLevelBtn.onclick = () => startGame(currentLevel);

  function startLevel1() {
    currentAlphabetIndex = 0;
    updateLevel1Display();
    showScreen(screens.level1);
  }

  function updateLevel1Display() {
    uppercaseDisplay.textContent = alphabet[currentAlphabetIndex];
    lowercaseDisplay.textContent = alphabet[currentAlphabetIndex].toLowerCase();
  }

  nextBtn.onclick = () => {
    currentAlphabetIndex = (currentAlphabetIndex + 1) % alphabet.length;
    updateLevel1Display();
  };

  prevBtn.onclick = () => {
    currentAlphabetIndex =
      (currentAlphabetIndex - 1 + alphabet.length) % alphabet.length;
    updateLevel1Display();
  };

  // GAME LOGIC

  function startGame(level) {
    currentLevel = level;
    score = 0;
    updateStars();
    generateQuestion(level);
    showScreen(screens.game);
  }

  function updateStars() {
    starContainer.innerHTML = "";
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const star = document.createElement("span");
      star.textContent = i < score ? "★" : "☆";
      starContainer.appendChild(star);
    }
  }

  function generateQuestion(level) {
    if (score >= TOTAL_QUESTIONS) {
      showLevelComplete();
      return;
    }

    questionBox1.textContent = "";
    questionBox2.textContent = "";
    questionBox1.className = "letter-box large-box empty";
    questionBox2.className = "letter-box large-box empty";
    wrapper1.style.display = "flex";
    wrapper2.style.display = "flex";
    feedbackMsg.classList.add("visually-hidden");

    const target = alphabet[Math.floor(Math.random() * alphabet.length)];
    let options = [];

    if (level === 2) {
      wrapper2.style.display = "none";
      gameTitle.textContent = "Match the Uppercase Letter";

      questionBox1.textContent = target;
      questionBox1.className = "letter-box large-box uppercase-color";
      correctAnswer = target;
      options = genOptions(target, false);

    } else if (level === 3) {
      wrapper2.style.display = "none";
      gameTitle.textContent = "Match the Lowercase Letter";

      questionBox1.textContent = target.toLowerCase();
      questionBox1.className = "letter-box large-box lowercase-color";
      correctAnswer = target.toLowerCase();
      options = genOptions(correctAnswer, true);

    } else {
      gameTitle.textContent = "Match the Missing Letter";

      if (Math.random() > 0.5) {
        questionBox1.textContent = target;
        questionBox1.className = "letter-box large-box uppercase-color";
        correctAnswer = target.toLowerCase();
        options = genOptions(correctAnswer, true);
      } else {
        questionBox2.textContent = target.toLowerCase();
        questionBox2.className = "letter-box large-box lowercase-color";
        correctAnswer = target.toUpperCase();
        options = genOptions(correctAnswer, false);
      }
    }

    shuffle(options);
    loadOptions(options);
  }

  function genOptions(correct, lower) {
    const set = new Set([correct]);
    while (set.size < 4) {
      let random = alphabet[Math.floor(Math.random() * alphabet.length)];
      random = lower ? random.toLowerCase() : random.toUpperCase();
      set.add(random);
    }
    return [...set];
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function loadOptions(options) {
    optionsContainer.innerHTML = "";

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "option-letter btn";
      btn.textContent = opt;

      btn.onclick = () => checkAnswer(opt, btn);

      optionsContainer.appendChild(btn);
    });
  }

  function checkAnswer(selected, btn) {
    if (selected === correctAnswer) {
      successSound.currentTime = 0;
      successSound.play();

      feedbackMsg.textContent = "Correct!";
      feedbackMsg.style.color = "green";
      feedbackMsg.classList.remove("visually-hidden");

      score++;
      updateStars();

      if (questionBox1.classList.contains("empty")) {
        questionBox1.textContent = correctAnswer;
        questionBox1.className =
          "letter-box large-box " + (isUpper(correctAnswer) ? "uppercase-color" : "lowercase-color");
      } else {
        questionBox2.textContent = correctAnswer;
        questionBox2.className =
          "letter-box large-box " + (isUpper(correctAnswer) ? "uppercase-color" : "lowercase-color");
      }

      setTimeout(() => generateQuestion(currentLevel), 800);

    } else {
      failSound.currentTime = 0;
      failSound.play();

      feedbackMsg.textContent = "Try Again!";
      feedbackMsg.style.color = "red";
      feedbackMsg.classList.remove("visually-hidden");

      btn.classList.add("border-danger");
      setTimeout(() => btn.classList.remove("border-danger"), 400);
    }
  }

  function isUpper(ch) {
    return ch === ch.toUpperCase();
  }

  function showLevelComplete() {
    levelComplete.classList.remove("d-none");
    levelCompleteText.textContent = `Level ${currentLevel} Completed!`;

    startNextBtn.textContent =
      currentLevel >= 4 ? "Back to Menu" : `Start Level ${currentLevel + 1}`;
  }

  startNextBtn.onclick = () => {
    if (currentLevel >= 4) {
      showScreen(screens.mainMenu);
    } else {
      startGame(++currentLevel);
    }
  };

  backToMenuBtn.onclick = () => showScreen(screens.mainMenu);

  showScreen(screens.mainMenu);
});
