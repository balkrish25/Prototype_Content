const coins = document.querySelectorAll('.coin');
const boxes = document.querySelectorAll('.drop-box');
const clapSound = document.getElementById('clapSound');
const hissSound = document.getElementById('hissSound');

coins.forEach(coin => {
  coin.addEventListener('dragstart', e => {
    e.dataTransfer.setData('id', e.target.id);
    coin.classList.add('dragging');
  });

  coin.addEventListener('dragend', () => {
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

    // ✅ Allow only 1 and 2 rupee coins
    const allowedCoins = ["2"];

    // make sure coin exists and box empty
    if (coin && allowedCoins.includes(coin.dataset.value) && !box.dataset.filled) {
      // clone coin to avoid removing original from other box
      const newCoin = coin.cloneNode(true);
      newCoin.style.width = "90px";
      newCoin.style.cursor = "default";
      newCoin.draggable = false;

      box.appendChild(newCoin);
      box.dataset.filled = true;
      clapSound.play();

      // ✅ Calculate total of dropped coins
      const totalValue = [...boxes]
        .map(b => b.firstChild ? Number(b.firstChild.dataset.value) : 0)
        .reduce((a, b) => a + b, 0);

      // ✅ Correct combination (1 + 2)
      if (totalValue === 4) {
        setTimeout(() => {
          window.location.href = "page7.html";
        }, 1200);
      }

    } else {
      // ❌ Wrong coin
      hissSound.play();
      if (navigator.vibrate) navigator.vibrate(200);
      if (coin) {
        coin.classList.add('shake');
        setTimeout(() => coin.classList.remove('shake'), 500);
      }
    }
  });
});
