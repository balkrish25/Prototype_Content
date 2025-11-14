document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const screens = {
    mainMenu: document.getElementById("main-menu"),
    preLevel: document.getElementById("pre-level-screen"),
    level1: document.getElementById("level-1"),
    game: document.getElementById("game-screen"),
  };

  const levelBtns = document.querySelectorAll(".level-btn");
  const startLevelBtn = document.getElementById("start-level-btn");
  const backMain = document.getElementById("back-main");
  const homeBtn = document.getElementById("homeBtn");
  const homeIcons = document.querySelectorAll(".home-icon");

  const uppercaseDisplay = document.getElementById("uppercase-display");
  const lowercaseDisplay = document.getElementById("lowercase-display");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  const questionBox1 = document.getElementById("question-box-1");
  const questionBox2 = document.getElementById("question-box-2");
  const wrapperBox1 = document.getElementById("wrapper-box-1");
  const wrapperBox2 = document.getElementById("wrapper-box-2");
  const optionsContainer = document.getElementById("options-container");
  const gameTitle = document.getElementById("game-title");
  const starContainer = document.getElementById("star-container");

  const successSound = document.getElementById("success-sound");
  const failSound = document.getElementById("fail-sound");
  const tutorialBtn = document.getElementById("tutorialBtn");
  const tutorialModal = new bootstrap.Modal(
    document.getElementById("tutorialModal")
  );

  // State
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let currentAlphabetIndex = 0;
  let currentLevel = 0;
  let correctAnswer = "";
  let score = 0;
  const TOTAL_QUESTIONS = 10;

  const preLevelTitles = {
    2: "Match the Uppercase Letters",
    3: "Match the Lowercase Letters",
    4: "Match the Missing Letters",
  };

  // Helpers
  const showScreen = (screenElement) => {
    document
      .querySelectorAll(".screen")
      .forEach((s) => s.classList.add("d-none"));
    screenElement.classList.remove("d-none");
  };

  // Main menu level clicks
  levelBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      currentLevel = parseInt(btn.dataset.level);
      if (currentLevel === 1) {
        startLevel1();
      } else {
        document.getElementById("pre-level-title").textContent =
          preLevelTitles[currentLevel];
        showScreen(document.getElementById("pre-level-screen"));
      }
    });
  });

  // Start from pre-level
  startLevelBtn.addEventListener("click", () => {
    startGame(currentLevel);
  });
  backMain.addEventListener("click", () =>
    showScreen(document.getElementById("main-menu"))
  );
  homeBtn.addEventListener("click", () =>
    showScreen(document.getElementById("main-menu"))
  );
  homeIcons.forEach((icon) =>
    icon.addEventListener("click", () =>
      showScreen(document.getElementById("main-menu"))
    )
  );

  // Level 1
  const startLevel1 = () => {
    currentAlphabetIndex = 0;
    updateLevel1Display();
    showScreen(document.getElementById("level-1"));
  };

  const updateLevel1Display = () => {
    uppercaseDisplay.textContent = alphabet[currentAlphabetIndex];
    lowercaseDisplay.textContent = alphabet[currentAlphabetIndex].toLowerCase();
  };

  nextBtn.addEventListener("click", () => {
    currentAlphabetIndex = (currentAlphabetIndex + 1) % alphabet.length;
    updateLevel1Display();
  });

  prevBtn.addEventListener("click", () => {
    currentAlphabetIndex =
      (currentAlphabetIndex - 1 + alphabet.length) % alphabet.length;
    updateLevel1Display();
  });

  // Game logic
  const startGame = (level) => {
    score = 0;
    updateStars();
    generateQuestion(level);
    showScreen(document.getElementById("game-screen"));
  };

  const updateStars = () => {
    starContainer.innerHTML = "";
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const star = document.createElement("span");
      star.innerHTML = i < score ? "★" : '<span class="empty-star">☆</span>';
      starContainer.appendChild(star);
    }
  };

  const getRandomLetter = (exclude = []) => {
    let letter;
    do {
      letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    } while (exclude.includes(letter));
    return letter;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateQuestion = (level) => {
    if (score >= TOTAL_QUESTIONS) {
      setTimeout(() => {
        alert("Congratulations! You completed the level.");
        showScreen(document.getElementById("main-menu"));
      }, 500);
      return;
    }

    const targetLetter = getRandomLetter();
    let options = [];
    questionBox1.textContent = "";
    questionBox2.textContent = "";
    questionBox1.classList.add("empty");
    questionBox2.classList.add("empty");
    wrapperBox1.style.display = "flex";
    wrapperBox2.style.display = "flex";

    if (level === 2) {
      gameTitle.textContent = "Match the Uppercase Letter";
      wrapperBox2.style.display = "none";
      questionBox1.textContent = targetLetter;
      questionBox1.className = "letter-box large-box uppercase-color";
      correctAnswer = targetLetter;
      options = [
        targetLetter,
        getRandomLetter([targetLetter]),
        getRandomLetter([targetLetter, options[1]]),
        getRandomLetter([targetLetter, options[1], options[2]]),
      ];
    } else if (level === 3) {
      gameTitle.textContent = "Match the Lowercase Letter";
      wrapperBox2.style.display = "none";
      questionBox1.textContent = targetLetter.toLowerCase();
      questionBox1.className = "letter-box large-box lowercase-color";
      correctAnswer = targetLetter.toLowerCase();
      options = [
        targetLetter.toLowerCase(),
        getRandomLetter([targetLetter]).toLowerCase(),
        getRandomLetter([targetLetter, options[1]]).toLowerCase(),
        getRandomLetter([targetLetter, options[1], options[2]]).toLowerCase(),
      ];
    } else if (level === 4) {
      gameTitle.textContent = "Match the Missing Letter";
      if (Math.random() > 0.5) {
        questionBox1.textContent = targetLetter;
        questionBox1.className = "letter-box large-box uppercase-color";
        correctAnswer = targetLetter.toLowerCase();
        options = [
          correctAnswer,
          getRandomLetter([targetLetter]).toLowerCase(),
          getRandomLetter([targetLetter, options[1]]).toLowerCase(),
          getRandomLetter([targetLetter, options[1], options[2]]).toLowerCase(),
        ];
      } else {
        questionBox2.textContent = targetLetter.toLowerCase();
        questionBox2.className = "letter-box large-box lowercase-color";
        correctAnswer = targetLetter.toUpperCase();
        options = [
          correctAnswer,
          getRandomLetter([targetLetter]).toUpperCase(),
          getRandomLetter([targetLetter, options[1]]).toUpperCase(),
          getRandomLetter([targetLetter, options[1], options[2]]).toUpperCase(),
        ];
      }
    }

    options = shuffleArray(options);
    optionsContainer.innerHTML = "";
    options.forEach((opt) => {
      const optionEl = document.createElement("div");
      optionEl.textContent = opt;
      optionEl.classList.add(
        "option-letter",
        "btn",
        "btn-outline-success",
        "m-1"
      );
      optionEl.addEventListener("click", () => checkAnswer(opt, level));
      optionsContainer.appendChild(optionEl);
    });
  };

  const checkAnswer = (selected, level) => {
    if (selected === correctAnswer) {
      try {
        successSound.play();
      } catch (e) {}
      score++;
      updateStars();

      if (questionBox1.classList.contains("empty")) {
        questionBox1.textContent = correctAnswer;
        questionBox1.className =
          "letter-box large-box " +
          (correctAnswer === correctAnswer.toUpperCase()
            ? "uppercase-color"
            : "lowercase-color");
      } else {
        questionBox2.textContent = correctAnswer;
        questionBox2.className =
          "letter-box large-box " +
          (correctAnswer === correctAnswer.toLowerCase()
            ? "lowercase-color"
            : "uppercase-color");
      }

      setTimeout(() => generateQuestion(level), 1200);
    } else {
      try {
        failSound.play();
      } catch (e) {}
    }
  };

  // Tutorial modal
  tutorialBtn.addEventListener("click", () => {
    const modalEl = document.getElementById("tutorialModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  });

  // Init
  showScreen(document.getElementById("main-menu"));
});
