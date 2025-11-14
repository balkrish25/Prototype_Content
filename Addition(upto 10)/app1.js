const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const feedbackScreen = document.getElementById("feedback-screen");

const startBtn = document.getElementById("start-btn");
const homeBtn = document.getElementById("home-btn");
const nextBtn = document.getElementById("next-btn");

const num1El = document.getElementById("num1");
const num2El = document.getElementById("num2");
const optionsContainer = document.getElementById("options-container");
const starsContainer = document.getElementById("stars-container");
const finalStarsContainer = document.getElementById("final-stars-container");
const feedbackText = document.getElementById("feedback-text");

const TOTAL_QUESTIONS = 10;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const optionColors = [
  "bg-yellow-300 hover:bg-yellow-400",
  "bg-purple-300 hover:bg-purple-400",
  "bg-pink-300 hover:bg-pink-400",
  "bg-blue-300 hover:bg-blue-400",
];

// --- Game Logic ---

function generateQuestions() {
  const newQuestions = [];
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;

    const options = new Set([answer]);
    while (options.size < 4) {
      const wrongOption = answer + Math.floor(Math.random() * 5) - 2;
      if (wrongOption > 0 && wrongOption !== answer) {
        options.add(wrongOption);
      }
    }

    newQuestions.push({
      num1,
      num2,
      answer,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    });
  }
  return newQuestions;
}

function displayQuestion() {
  const question = questions[currentQuestionIndex];
  num1El.textContent = question.num1;
  num2El.textContent = question.num2;

  optionsContainer.innerHTML = "";
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.className = `option-button w-20 h-20 md:w-24 md:h-24 rounded-full text-2xl md:text-3xl font-bold text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
      optionColors[index % optionColors.length]
    }`;
    button.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(button);
  });
}

function checkAnswer(selectedOption) {
  const question = questions[currentQuestionIndex];
  const isCorrect = selectedOption === question.answer;

  feedbackScreen.classList.remove("hidden");

  if (isCorrect) {
    feedbackText.textContent = "Good!";
    feedbackText.className = "text-4xl md:text-5xl font-bold text-green-500";
    score++;
    updateStars(score);
    nextBtn.onclick = () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < TOTAL_QUESTIONS) {
        displayQuestion();
        feedbackScreen.classList.add("hidden");
      } else {
        endGame();
      }
    };
  } else {
    feedbackText.textContent = "Sorry, try again.";
    feedbackText.className = "text-4xl md:text-5xl font-bold text-red-500";
    nextBtn.onclick = () => {
      feedbackScreen.classList.add("hidden");
    };
  }
}

function updateStars(filledCount) {
  starsContainer.childNodes.forEach((star, index) => {
    if (index < filledCount) {
      star.classList.add("filled");
    } else {
      star.classList.remove("filled");
    }
  });
}

function createStarSVG() {
  const starSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  starSVG.setAttribute("class", "star h-6 w-6 sm:h-7 sm:w-7 text-gray-300");
  starSVG.setAttribute("viewBox", "0 0 20 20");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  );
  path.setAttribute("fill", "currentColor");
  path.setAttribute("stroke", "#a0aec0");
  path.setAttribute("stroke-width", "0.5");
  starSVG.appendChild(path);
  return starSVG;
}

function initStars() {
  starsContainer.innerHTML = "";
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    starsContainer.appendChild(createStarSVG());
  }
}

function startGame() {
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  questions = generateQuestions();
  currentQuestionIndex = 0;
  score = 0;

  initStars();
  updateStars(0);
  displayQuestion();
}

function endGame() {
  gameScreen.classList.add("hidden");
  feedbackScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  finalStarsContainer.innerHTML = "";
  for (let i = 0; i < score; i++) {
    const star = createStarSVG();
    star.classList.add("filled");
    finalStarsContainer.appendChild(star);
  }

  setTimeout(() => {
    endScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  }, 4000);
}

function goHome() {
  gameScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  feedbackScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

// --- Event Listeners ---
startBtn.addEventListener("click", startGame);
homeBtn.addEventListener("click", goHome);
