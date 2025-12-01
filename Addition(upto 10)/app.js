// app1.js - corrected & polished game logic

// DOM references
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const feedbackScreen = document.getElementById("feedback-screen");

const startBtn = document.getElementById("start-btn");
const homeBtn = document.getElementById("home-btn");
const nextBtn = document.getElementById("next-btn");
const retryBtn = document.getElementById("retry-btn");

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
let awaitingNext = false; // prevents double clicks

// Option color set (light palettes)
const optionColors = [
  "bg-yellow-300 hover:bg-yellow-400",
  "bg-purple-300 hover:bg-purple-400",
  "bg-pink-300 hover:bg-pink-400",
  "bg-blue-300 hover:bg-blue-400",
];

// Create star SVG element (reusable)
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

// Initialize stars display
function initStars() {
  starsContainer.innerHTML = "";
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    starsContainer.appendChild(createStarSVG());
  }
}

// Update star filling
function updateStars(filledCount) {
  const children = starsContainer.children;
  for (let i = 0; i < children.length; i++) {
    if (i < filledCount) children[i].classList.add("filled");
    else children[i].classList.remove("filled");
  }
}

// Generate random questions (sane, no duplicates often)
function generateQuestions() {
  const newQuestions = [];
  const seen = new Set();
  while (newQuestions.length < TOTAL_QUESTIONS) {
    const a = Math.floor(Math.random() * 9) + 1; // 1..9
    const b = Math.floor(Math.random() * 9) + 1;
    const answer = a + b;
    const key = `${Math.min(a,b)}+${Math.max(a,b)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // build distinct options
    const options = new Set([answer]);
    while (options.size < 4) {
      // generate nearby distractors with variety
      const delta = Math.floor(Math.random() * 5) - 2; // -2..+2
      let wrong = answer + delta;
      if (Math.random() > 0.8) wrong = answer + (Math.random() > 0.5 ? 3 : -3);
      if (wrong <= 0) wrong = Math.abs(wrong) + 1;
      if (wrong !== answer) options.add(wrong);
    }

    newQuestions.push({
      num1: a,
      num2: b,
      answer,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    });
  }
  return newQuestions;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch (e) {
    // ignore TTS errors silently
  }
}

// Display a question and options
function displayQuestion() {
  awaitingNext = false;
  const q = questions[currentQuestionIndex];
  num1El.textContent = q.num1;
  num2El.textContent = q.num2;

  // Speak the question: "Three plus four equals ?"
  speak(`${q.num1} plus ${q.num2} equals`);

  // Render options
  optionsContainer.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = `option-button w-20 h-20 md:w-24 md:h-24 rounded-full text-2xl md:text-3xl font-bold text-gray-800 shadow-md focus:outline-none`;
    btn.setAttribute("data-value", opt);
    btn.setAttribute("role", "button");
    btn.setAttribute("aria-label", `Answer ${opt}`);
    btn.style.background = ["#fde68a", "#ede9fe", "#fbcfe8", "#bfdbfe"][idx % 4];
    btn.textContent = opt;

    // click handler
    btn.addEventListener("click", () => {
      if (awaitingNext) return;
      checkAnswer(opt, btn);
    });

    // keyboard support
    btn.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !awaitingNext) {
        e.preventDefault();
        checkAnswer(opt, btn);
      }
    });

    optionsContainer.appendChild(btn);
  });
}

// Play short tones using WebAudio for feedback
function playTone(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    if (type === "correct") {
      o.type = "sine";
      o.frequency.setValueAtTime(700, ctx.currentTime);
      g.gain.setValueAtTime(0.05, ctx.currentTime);
      o.start();
      o.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      o.stop(ctx.currentTime + 0.25);
    } else {
      o.type = "sawtooth";
      o.frequency.setValueAtTime(300, ctx.currentTime);
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      o.start();
      o.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      o.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {
    // ignore if WebAudio blocked
  }
}

function checkAnswer(selected, btn) {
  const q = questions[currentQuestionIndex];
  const correct = q.answer === selected;

  // disable all options visually to prevent double clicks
  document.querySelectorAll(".option-button").forEach((b) => (b.classList.add("disabled")));

  awaitingNext = true;

  // Show feedback screen
  feedbackText.textContent = correct ? "Good!" : "Sorry, try again.";
  feedbackText.className = correct ? "text-4xl md:text-5xl font-bold text-green-500" : "text-4xl md:text-5xl font-bold text-red-500";
  feedbackScreen.classList.remove("hidden");
  feedbackScreen.setAttribute("aria-hidden", "false");

  if (correct) {
    score++;
    updateStars(score);
    playTone("correct");
    speak("Good");
    // next button shows to proceed
    nextBtn.disabled = false;
    retryBtn.disabled = false;
    // next handler
    nextBtn.onclick = () => {
      feedbackScreen.classList.add("hidden");
      feedbackScreen.setAttribute("aria-hidden", "true");
      currentQuestionIndex++;
      if (currentQuestionIndex < TOTAL_QUESTIONS) {
        displayQuestion();
      } else {
        endGame();
      }
    };
    // hide retry (we still keep it but clicking retry just closes feedback so user can see answers)
    retryBtn.classList.add("hidden");
  } else {
    // wrong answer: allow retry (hide next)
    playTone("wrong");
    speak("Try again");
    nextBtn.disabled = true;
    retryBtn.disabled = false;
    retryBtn.classList.remove("hidden");
    retryBtn.onclick = () => {
      // Re-enable options for retry on the same question
      document.querySelectorAll(".option-button").forEach((b) => b.classList.remove("disabled"));
      feedbackScreen.classList.add("hidden");
      feedbackScreen.setAttribute("aria-hidden", "true");
      awaitingNext = false;
    };
  }
}

// End game: show final stars and return to start after 3s
function endGame() {
  gameScreen.classList.add("hidden");
  feedbackScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  finalStarsContainer.innerHTML = "";
  for (let i = 0; i < score; i++) {
    const s = createStarSVG();
    s.classList.add("filled");
    finalStarsContainer.appendChild(s);
  }

  // After short delay, go back to menu and reset
  setTimeout(() => {
    endScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  }, 3000);
}

function goHome() {
  // Cancel any speech
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  // reset
  gameScreen.classList.add("hidden");
  feedbackScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

// Start game handler
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

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
  // space to advance when feedback is visible and next enabled
  if (e.key === " " && !startScreen.classList.contains("hidden")) {
    e.preventDefault();
    startBtn.click();
  }
});

// Wire up UI controls
startBtn.addEventListener("click", startGame);
homeBtn.addEventListener("click", goHome);

// Expose createStarSVG to the rest of the file
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
