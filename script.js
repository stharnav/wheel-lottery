const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin");
const result = document.getElementById("result");

const popup = document.getElementById("resultPopup");
const popupText = document.getElementById("popupText");
const closePopup = document.getElementById("closePopup");

const prizes = ["💰 10", "💵 50", "🎁 100", "😢 Try Again", "🎉 Jackpot!", "🎫 Free Spin", "Loose", "Win"];
// const colors = ["#fd1513", "#ffceb3", "#fd1513", "#ffceb3", "#fd1513", "#ffceb3"];
const sliceCount = prizes.length;
const sliceDeg = 360 / sliceCount;

let deg = 0;

function drawWheel() {
  const radius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

for (let i = 0; i < sliceCount; i++) {
  const startAngle = (sliceDeg * i - 90) * Math.PI / 180;
  const endAngle = (sliceDeg * (i + 1) - 90) * Math.PI / 180;

  ctx.beginPath();
  ctx.moveTo(radius, radius);
  ctx.arc(radius, radius, radius, startAngle, endAngle);

  const gradient = ctx.createRadialGradient(radius, radius, radius * 0.1, radius, radius, radius);
  
    if (i % 2 === 0) {
        gradient.addColorStop(0, "#ff4b2b");  
        gradient.addColorStop(1, "#920101ff");  
    } else {
        gradient.addColorStop(0, "#fff0e0"); 
        gradient.addColorStop(1, "#a77a4eff"); 
    }

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = "#FFD700"; 
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate((startAngle + endAngle) / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 22px Poppins";
    ctx.fillText(prizes[i], radius - 20, 10);
    ctx.restore();
    }

}
drawWheel();

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  result.textContent = "";

  const randomDeg = 2000 + Math.random() * 500;
  const startDeg = deg % 360;
  const targetDeg = startDeg + randomDeg;
  const duration = 7000;
  const start = performance.now();

  function animateWheel(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);

    const currentDeg = startDeg + randomDeg * easeOut;
    canvas.style.transform = `rotate(${currentDeg}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animateWheel);
    } else {
      deg = currentDeg % 360;

      const correctedDeg = (360 - (deg - 90)) % 360;
      const index = Math.floor(correctedDeg / sliceDeg) % sliceCount;

      popupText.textContent = `🎯 You Win: ${prizes[index]}!`;
      popup.classList.add("active");

      spinBtn.disabled = false;
    }
  }

  requestAnimationFrame(animateWheel);
});

closePopup.addEventListener("click", () => {
  popup.classList.remove("active");
});
