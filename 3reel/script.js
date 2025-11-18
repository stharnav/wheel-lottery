const reelImages = [
  [ // Reel 1
    ['images/ear.png', 10],
    ['images/power.png', 40],
    ['images/power.png', 40],
    ['images/power.png', 40],
    ['images/phone.png', 50] 
  ],
  [ // Reel 2
    ['images/ear.png', 50],
    ['images/power.png', 40],
    ['images/power.png', 40],
    ['images/power.png', 40],
    ['images/phone.png', 10] 
  ],
  [ // Reel 3
    ['images/ear.png', 10],
    ['images/power.png', 40],
    ['images/power.png', 40],
    ['images/power.png', 40],
    ['images/phone.png', 50] 
  ]
];
const reels = document.querySelectorAll('.reel .symbols');
const message = document.getElementById('message');
const buttons = [spin1, spin2, spin3];

function fillReel(reel, reelIndex) {
  reel.innerHTML = "";
  const symbolsList = reelImages[reelIndex];

  function pickWeightedSymbol() {
    const totalWeight = symbolsList.reduce((sum, item) => sum + item[1], 0);
    let rand = Math.random() * totalWeight;
    for (const [img, weight] of symbolsList) {
      if (rand < weight) return img;
      rand -= weight;
    }
    return symbolsList[0][0]; 
  }

  for (let i = 0; i < 40; i++) {
    const s = pickWeightedSymbol();
    const d = document.createElement("div");
    d.className = "symbol";

    const img = document.createElement("img");
    img.src = s;
    img.style.width = '150px';
    img.style.height = '150px';
    img.style.objectFit = 'contain';
    d.appendChild(img);

    reel.appendChild(d);
  }
}


reels.forEach((reel, index) => fillReel(reel, index));

reels.forEach(fillReel);

function spinReel(reel, reelIndex, duration = 4000) {
  const symbolHeight = 200; 
  const totalSymbols = reel.children.length;
  const fullHeight = symbolHeight * totalSymbols;
  

  const parent = reel.parentElement;
  const clone = reel.cloneNode(true);
  clone.style.top = `-${fullHeight}px`;
  parent.appendChild(clone);

  const extraRotations = 5; 
  const totalDistance = fullHeight * (3 + extraRotations);

  let start = null;

  return new Promise(resolve => {
    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); 
      const move = ease * totalDistance;

      reel.style.top = `${move % fullHeight}px`;
      clone.style.top = `${(move % fullHeight) - fullHeight}px`;

      parent.classList.add("glow");  


      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {

        const index = Math.floor((move % fullHeight) / symbolHeight);

        const bottomIndex = (index + 1) % totalSymbols; 

        const finalImgSrc = reel.children[bottomIndex].querySelector("img").src;

        reel.style.top = `-${index * symbolHeight}px`;

        clone.remove();
        parent.classList.remove("glow");

        resolve(finalImgSrc); 
      }
    }
    requestAnimationFrame(animate);
  });
}




async function spinNReels(n) {
  buttons.forEach(b => (b.disabled = true));
  message.textContent = "";

  const results = [];
  for (let i = 0; i < n; i++) {
    const duration = 5600 + i * 700;
    results[i] = await spinReel(reels[i], i, duration);
  }

  checkWin(results);
  buttons.forEach(b => (b.disabled = false));
}


function checkWin(r) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popupMessage");
  popupMessage.innerHTML = "";

  setTimeout(() => {
        r.forEach(imgSrc => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.style.width = "250px";
        img.style.height = "250px";
        img.style.margin = "0 10px";
        img.style.objectFit = "contain";
        popupMessage.appendChild(img);
    });

    popup.style.display = "flex";

    document.getElementById("celebrate").style.display = "block";
    document.getElementById('celebrate').play();

    document.getElementById("closePopup").onclick = () => {
        popup.style.display = "none";
    }

    popup.onclick = (e) => {
        if (e.target === popup) popup.style.display = "none";
        window.location.reload();
    }
  }, 500); 
}

let pendingSpin = null; 

document.addEventListener("keydown", (event) => {
  if (["1", "2", "3"].includes(event.key)) {
    pendingSpin = Number(event.key);
    console.log("Selected:", pendingSpin);
  }

  if (event.key === "Enter" && pendingSpin !== null) {
    spinNReels(pendingSpin);
    pendingSpin = null; 
  }
});


spin1.onclick = () => spinNReels(1);
spin2.onclick = () => spinNReels(2);
spin3.onclick = () => spinNReels(3);