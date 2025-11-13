const coins = document.querySelectorAll('.coin');
const boxes = document.querySelectorAll('.drop-box');
const clapSound = document.getElementById('clapSound');
const hissSound = document.getElementById('hissSound');

let placed = 0;

coins.forEach(coin => {
  coin.addEventListener('dragstart', e => {
    e.dataTransfer.setData('id', e.target.id);
    coin.classList.add('dragging');
  });

  coin.addEventListener('dragend', e => {
    coin.classList.remove('dragging');
  });
});

boxes.forEach(box => {
  box.addEventListener('dragover', e => {
    e.preventDefault();
    box.classList.add('hover');
  });

  box.addEventListener('dragleave', () => {
    box.classList.remove('hover');
  });

  box.addEventListener('drop', e => {
    e.preventDefault();
    box.classList.remove('hover');
    const coinId = e.dataTransfer.getData('id');
    const coin = document.getElementById(coinId);

    // Allow only 1 Rupee coins
    if (coin && coin.dataset.value === "1" && !box.dataset.filled) {
      box.appendChild(coin);
      coin.style.width = "90px";
      coin.style.cursor = "default";
      box.dataset.filled = true;
      coin.draggable = false;
      clapSound.play();
      placed++;

      // when both boxes filled -> go to next page
      if (placed === 2) {
        setTimeout(() => {
          window.location.href = "page13.html";
        }, 1200);
      }

    } else {
      // Wrong coin -> hiss + shake + return
      hissSound.play();
      if (navigator.vibrate) navigator.vibrate(200);
      coin.classList.add('shake');
      setTimeout(() => coin.classList.remove('shake'), 500);
    }
  });
});