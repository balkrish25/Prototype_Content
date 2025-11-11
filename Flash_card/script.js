let num1, num2, operator;
let score = 0;
let questionCount = 0;
let currentLevel = 0;

const num1El = document.getElementById('num1');
const num2El = document.getElementById('num2');
const operatorEl = document.getElementById('operator');
const tensEl = document.getElementById('tens');
const onesEl = document.getElementById('ones');
const carryEl = document.getElementById('carry');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const confetti = document.getElementById('confetti');
const levelSelect = document.getElementById('level-select');
const gameArea = document.getElementById('game-area');
const restartBtn = document.getElementById('restartBtn');
const homeBtn = document.getElementById('home-btn');

function startLevel(level) {
  currentLevel = level;
  score = 0;
  questionCount = 0;
  scoreEl.textContent = "Score: 0/7";
  feedbackEl.textContent = "";

  levelSelect.style.display = 'none';
  gameArea.style.display = 'block';
  confetti.style.display = 'none';
  restartBtn.style.display = 'none';
  homeBtn.style.display = 'block';

  newQuestion();
}

function newQuestion() {
  num1 = Math.floor(Math.random() * 90) + 10;
  num2 = Math.floor(Math.random() * 9) + 1;

  if (currentLevel === 2 && num1 < num2) [num1, num2] = [num2, num1];

  operator = currentLevel === 1 ? '+' : '-';
  num1El.textContent = num1;
  num2El.textContent = num2;
  operatorEl.textContent = operator;
  tensEl.value = '';
  onesEl.value = '';
  carryEl.value = '';
  feedbackEl.textContent = '';
}

function checkAnswer() {
  const tens = tensEl.value;
  const ones = onesEl.value;
  if (tens === '' || ones === '') {
    feedbackEl.textContent = 'Enter both digits!';
    return;
  }

  const ans = parseInt(tens + ones);
  const correct = operator === '+' ? num1 + num2 : num1 - num2;

  if (ans === correct) {
    score++;
    feedbackEl.textContent = 'Correct!';
    new Audio('../assets/Sounds/correct.mp3').play();
  } else {
    feedbackEl.textContent = `Incorrect! Correct: ${correct}`;
    new Audio('../assets/Sounds/wrong.mp3').play();
  }

  questionCount++;
  scoreEl.textContent = `Score: ${score}/7`;

  if (questionCount < 7) {
    setTimeout(newQuestion, 1000);
  } else {
    endGame();
  }
}

function endGame() {
  feedbackEl.textContent = `You scored ${score}/7! Great job!`;
  new Audio('../assets/Sounds/cheer.mp3').play();
  confetti.style.display = 'block';
  restartBtn.style.display = 'inline-block';
}

function restartGame() {
  gameArea.style.display = 'none';
  levelSelect.style.display = 'block';
  homeBtn.style.display = 'none';
}

function goHome() {
  gameArea.style.display = 'none';
  levelSelect.style.display = 'block';
  homeBtn.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('checkBtn').addEventListener('click', checkAnswer);
});
