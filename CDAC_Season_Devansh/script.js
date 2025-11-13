const startBtn = document.getElementById("startBtn");
const homeBtn = document.getElementById("homeBtn");
const startPage = document.getElementById("startPage");
const gamePage = document.getElementById("gamePage");
const resultPage = document.getElementById("resultPage");

const clapSound = document.getElementById("clapSound");
const errorSound = document.getElementById("errorSound");

startBtn.addEventListener("click", () => {
  startPage.classList.remove("active");
  startPage.classList.add("hidden");
  gamePage.classList.add("active");
});

homeBtn.addEventListener("click", () => {
  gamePage.classList.remove("active");
  resultPage.classList.add("hidden");
  startPage.classList.remove("hidden");
  startPage.classList.add("active");
  resetGame();
});

// Drag and Drop Logic
const draggables = document.querySelectorAll(".draggable");
const dropzones = document.querySelectorAll(".dropzone");
let correctCount = 0;

draggables.forEach(drag => {
  drag.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text", e.target.textContent);
  });
});

dropzones.forEach(zone => {
  zone.addEventListener("dragover", e => e.preventDefault());

  zone.addEventListener("drop", e => {
    e.preventDefault();
    const droppedText = e.dataTransfer.getData("text");
    if (droppedText === zone.dataset.answer) {
      zone.textContent = droppedText;
      zone.classList.add("correct");
      clapSound.play();
      correctCount++;
      if (correctCount === dropzones.length) {
        setTimeout(showResult, 1000);
      }
    } else {
      zone.classList.add("wrong");
      errorSound.play();
      setTimeout(() => zone.classList.remove("wrong"), 800);
    }
  });
});

function showResult() {
  gamePage.classList.remove("active");
  resultPage.classList.remove("hidden");
  resultPage.classList.add("active");
}

function resetGame() {
  correctCount = 0;
  dropzones.forEach(zone => {
    zone.textContent = "";
    zone.classList.remove("correct", "wrong");
  });
}