/* script.js - separated logic from HTML */

const CAR_IMAGES = [
  "https://placehold.co/400x200/png?text=Good+Job!",
  "https://placehold.co/400x200/6ee7b7/054f3f/png?text=Nice+Work",
  "https://placehold.co/400x200/fccb6b/442800/png?text=Well+Done"
];

const NUM_WORDS = {
  20: "Twenty", 30: "Thirty", 40: "Forty", 50: "Fifty",
  1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five",
  6: "Six", 7: "Seven", 8: "Eight", 9: "Nine"
};

function getNumberText(num) {
  if (NUM_WORDS[num]) return NUM_WORDS[num];
  const tens = Math.floor(num / 10) * 10;
  const units = num % 10;
  return `${NUM_WORDS[tens]}-${NUM_WORDS[units]}`;
}

function getEquationText(num) {
  const tens = Math.floor(num / 10) * 10;
  const units = num % 10;
  return `${NUM_WORDS[tens]} and ${NUM_WORDS[units]} = ${getNumberText(num)}`;
}

let currentLevel = 1;
let currentSlide = 0;
let quizScore = 0;
let quizCurrentQ = 0;
const QUIZ_LENGTH = 10;
let quizQuestions = [];

const screens = {
  menu: document.getElementById('menu-screen'),
  interstitial: document.getElementById('interstitial-screen'),
  read: document.getElementById('read-screen'),
  quiz: document.getElementById('quiz-screen')
};

function switchScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  screens[screenName].classList.remove('hidden');

  // stop speech when back to menu
  if (screenName === 'menu') stopSpeech();
}

function goHome() {
  switchScreen('menu');
  stopSpeech();
}

/* --- Speech & Audio --- */
const synth = window.speechSynthesis;
let utterance = null;

function speak(text) {
  stopSpeech();
  if (!text) return;
  // Create utterance with safe defaults
  utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  // Some browsers need a user gesture before speak works; handle silently if blocked
  try { synth.speak(utterance); } catch (e) { /* fail silently */ }
}

function stopSpeech() {
  if (synth && synth.speaking) synth.cancel();
}

/* small beep sounds using WebAudio */
function playSound(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) { /* WebAudio not supported or blocked; ignore */ }
}

/* --- Level Flow --- */
function startLevelFlow(level) {
  currentLevel = level;
  const isReadMode = (level % 2 !== 0);

  const title = document.getElementById('interstitial-title');
  const btn = document.getElementById('interstitial-btn');
  const img = document.getElementById('intro-image');

  img.classList.add('hidden');

  if (isReadMode) {
    title.textContent = "Read and Learn the Number";
    btn.textContent = `Start ${getLevelSuffix(level)} Level`;
  } else {
    title.textContent = "Select the Right Number";
    btn.textContent = `Start ${getLevelSuffix(level)} Level`;
  }

  // ensure btn handler points to runCurrentLevel
  btn.onclick = runCurrentLevel;

  switchScreen('interstitial');
}

function getLevelSuffix(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return n + "th";
}

function runCurrentLevel() {
  const isReadMode = (currentLevel % 2 !== 0);
  if (isReadMode) initReadMode();
  else initQuizMode();
}

/* --- Read Mode --- */
function initReadMode() {
  currentSlide = 1;
  switchScreen('read');
  updateReadSlide();
}

function updateReadSlide() {
  let base = 20;
  if (currentLevel === 3) base = 30;
  if (currentLevel === 5) base = 40;

  const add = currentSlide;
  const sum = base + add;

  document.getElementById('read-base').textContent = base;
  document.getElementById('read-add').textContent = add;
  document.getElementById('read-sum').textContent = sum;

  const text = getEquationText(sum);
  document.getElementById('read-text').textContent = text;

  // Speak (replace "=" with "equals")
  speak(text.replace('=', 'equals'));
}

function nextReadSlide() {
  if (currentSlide < 9) {
    currentSlide++;
    updateReadSlide();
  } else {
    showCompletionScreen();
  }
}

function prevReadSlide() {
  if (currentSlide > 1) {
    currentSlide--;
    updateReadSlide();
  }
}

/* --- Quiz Mode --- */
function initQuizMode() {
  quizCurrentQ = 0;
  quizScore = 0;

  // determine base for the level
  let base = 20;
  if (currentLevel === 4) base = 30;
  if (currentLevel === 6) base = 40;

  // Prepare answers base+1 ... base+9 then shuffle
  let answers = [];
  for (let i = 1; i <= 9; i++) answers.push(base + i);
  answers.sort(() => Math.random() - 0.5);

  quizQuestions = answers.map(ans => {
    let opts = new Set([ans]);
    while (opts.size < 4) {
      // create distractors within a reasonable range
      let r = base + Math.floor(Math.random() * 9) + 1;
      if (Math.random() > 0.8) r = r + (Math.random() > 0.5 ? 10 : -10);
      if (r > 0 && r < 100) opts.add(r);
    }
    return { target: ans, options: Array.from(opts).sort(() => Math.random() - 0.5) };
  });

  // Render stars
  const stars = document.getElementById('stars-container');
  stars.innerHTML = '';
  for (let i = 0; i < QUIZ_LENGTH; i++) {
    stars.innerHTML += `<div class="star w-6 h-6" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" stroke-width="2"/></svg></div>`;
  }

  switchScreen('quiz');
  loadQuizQuestion();
}

function loadQuizQuestion() {
  if (quizCurrentQ >= quizQuestions.length) {
    showCompletionScreen();
    return;
  }

  // hide feedback, enable options
  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('quiz-options').classList.remove('pointer-events-none');

  const qData = quizQuestions[quizCurrentQ];
  const text = getNumberText(qData.target);

  document.getElementById('quiz-question-text').innerHTML = `<span class="text-teal-700">${text}</span> = `;
  speak("Find " + text);

  const optContainer = document.getElementById('quiz-options');
  optContainer.innerHTML = '';

  // soft tailwind-like bg classes mapped to lightweight inline styles
  const bgClasses = ['#fef3c7', '#ede9fe', '#fce7f3', '#dbeafe', '#d1fae5'];

  qData.options.forEach((opt, idx) => {
    const el = document.createElement('div');
    el.className = `option-circle`;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.style.background = bgClasses[idx % bgClasses.length];
    el.textContent = opt;
    el.onclick = () => checkAnswer(opt, qData.target);
    el.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') checkAnswer(opt, qData.target); };
    optContainer.appendChild(el);
  });
}

function checkAnswer(selected, correct) {
  const feedbackBox = document.getElementById('quiz-feedback');
  const feedbackText = document.getElementById('feedback-text');
  const nextBtn = document.getElementById('feedback-next-btn');
  const retryBtn = document.getElementById('feedback-retry-btn');

  feedbackBox.classList.remove('hidden');
  document.getElementById('quiz-options').classList.add('pointer-events-none');

  if (selected === correct) {
    feedbackText.textContent = "Good!";
    feedbackText.className = "text-4xl font-bold text-green-500 mb-2 pop-in";
    playSound('correct');
    speak("Good!");

    // Fill star
    const stars = document.getElementById('stars-container').children;
    if (quizCurrentQ < stars.length) stars[quizCurrentQ].classList.add('filled');

    nextBtn.classList.remove('hidden');
    retryBtn.classList.add('hidden');

  } else {
    feedbackText.textContent = "Sorry, try again.";
    feedbackText.className = "text-3xl font-bold text-red-500 mb-2 pop-in";
    playSound('wrong');
    speak("Sorry, try again.");

    nextBtn.classList.add('hidden');
    retryBtn.classList.remove('hidden');
  }
}

function retryQuizQuestion() {
  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('quiz-options').classList.remove('pointer-events-none');
}

function nextQuizQuestion() {
  quizCurrentQ++;
  if (quizCurrentQ >= 9) {
    showCompletionScreen();
  } else {
    loadQuizQuestion();
  }
}

/* --- Completion --- */
function showCompletionScreen() {
  const title = document.getElementById('interstitial-title');
  const btn = document.getElementById('interstitial-btn');
  const img = document.getElementById('intro-image');

  img.src = CAR_IMAGES[Math.floor(Math.random() * CAR_IMAGES.length)];
  img.classList.remove('hidden');

  title.innerHTML = `<span class="text-green-600">Good!</span> <br> <span class="text-base text-gray-500">${getLevelSuffix(currentLevel)} Level Completed</span>`;

  if (currentLevel < 6) {
    const nextLvl = currentLevel + 1;
    btn.textContent = `Start ${getLevelSuffix(nextLvl)} Level`;
    btn.onclick = () => {
      img.classList.add('hidden');
      startLevelFlow(nextLvl);
    };
  } else {
    title.innerHTML = `<span class="text-green-600">You are Good!</span>`;
    btn.textContent = "Back to Menu";
    btn.onclick = goHome;
  }

  speak("Level Completed. Good job!");
  switchScreen('interstitial');
}

/* --- Init: attach a shortcut for space to play/pause speak (makes UX a little better) --- */
window.addEventListener('keydown', (e) => {
  if (e.key === ' ' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    // On space we advance a read slide when on read-screen, or when quiz-feedback visible do next
    if (!screens.read.classList.contains('hidden')) {
      nextReadSlide();
    } else if (!screens.quiz.classList.contains('hidden')) {
      // if feedback visible -> next, else no-op
      if (!document.getElementById('quiz-feedback').classList.contains('hidden')) nextQuizQuestion();
    }
  }
});

/* Ensure menu visible on load */
switchScreen('menu');
