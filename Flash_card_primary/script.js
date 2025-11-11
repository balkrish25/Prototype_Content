let num1, num2, operator;
let score = 0;
let questionCount = 0;
let currentLevel = 0;

const num1El = document.getElementById('num1');
const num2El = document.getElementById('num2');
const operatorEl = document.getElementById('operator');
const answerEl = document.getElementById('answer');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const questionBox = document.querySelector('.question-box');
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
  questionBox.style.display = 'block';
  confetti.style.display = 'none';
  restartBtn.style.display = 'none';
  homeBtn.style.display = 'block';

  newQuestion();
}

function newQuestion() {
  num1 = Math.floor(Math.random() * 10);
  num2 = Math.floor(Math.random() * 10);

  if (currentLevel === 2 && num1 < num2) {
    [num1, num2] = [num2, num1]; // avoid negatives
  }

  operator = currentLevel === 1 ? '+' : '-';
  num1El.textContent = num1;
  num2El.textContent = num2;
  operatorEl.textContent = operator;
  answerEl.value = '';
  feedbackEl.textContent = '';
}

function checkAnswer() {
  const ans = parseInt(answerEl.value);
  const correct = operator === '+' ? num1 + num2 : num1 - num2;

  if (isNaN(ans)) {
    feedbackEl.textContent = 'Please enter a number!';
    return;
  }

  if (ans === correct) {
    score++;
    feedbackEl.textContent = 'Correct!';
    new Audio('../assets/Sounds/correct.mp3').play();
  } else {
    feedbackEl.textContent = `Incorrect! Correct answer: ${correct}`;
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
  questionBox.style.display = 'none';
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

document.getElementById('checkBtn').addEventListener('click', checkAnswer);
