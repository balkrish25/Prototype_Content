const draggables = document.querySelectorAll(".draggable");
const boxes = document.querySelectorAll(".drop-box");

draggables.forEach(coin => {
  coin.addEventListener("dragstart", e => {
    e.dataTransfer.setData("id", coin.id);
  });
});

boxes.forEach(box => {
  box.addEventListener("dragover", e => {
    e.preventDefault();
    box.classList.add("dragover");
  });

  box.addEventListener("dragleave", () => {
    box.classList.remove("dragover");
  });

  box.addEventListener("drop", e => {
    e.preventDefault();
    box.classList.remove("dragover");
    const id = e.dataTransfer.getData("id");
    const coin = document.getElementById(id);

    if (coin.alt.includes("1 Rupee")) {
      const clone = coin.cloneNode(true);
      clone.style.width = "70%";
      clone.style.height = "70%";
      clone.draggable = false;
      box.innerHTML = "";
      box.appendChild(clone);
      checkCompletion();
    }
  });
});

function checkCompletion() {
  const filled = Array.from(boxes).every(box => box.children.length > 0);
  if (filled) {
    setTimeout(() => {
      window.location.href = "/files/page3.html";
    }, 800);
  }
}
