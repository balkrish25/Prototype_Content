const hissSound = new Audio("/assests/hiss.mp3");

const coins = document.querySelectorAll(".coin");
const dropZone = document.getElementById("dropZone");

coins.forEach((coin) => {
  coin.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("coinId", coin.id);
    setTimeout(() => {
      coin.style.visibility = "hidden";
    }, 50);
  });

  coin.addEventListener("dragend", () => {
    coin.style.visibility = "visible";
  });
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const coinId = e.dataTransfer.getData("coinId");
  const coin = document.getElementById(coinId);

  if (coinId === "coin10") {
    // Correct coin
    coin.style.visibility = "visible";
    coin.style.position = "absolute";
    coin.style.width = "100px";
    coin.style.height = "100px";
    coin.style.top = "50%";
    coin.style.left = "50%";
    coin.style.transform = "translate(-50%, -50%)";
    coin.style.transition = "all 0.3s ease";

    dropZone.innerHTML = "";
    dropZone.appendChild(coin);

    setTimeout(() => {
      window.location.href = "/html_files/page16.html";
    }, 1200);
  } else {
    // Wrong coin
    hissSound.play();
    coin.style.transition = "transform 0.3s";
    coin.style.transform = "translateY(-20px)";
    setTimeout(() => {
      coin.style.transform = "translateY(0)";
    }, 300);
    coin.style.visibility = "visible";
  }
});
