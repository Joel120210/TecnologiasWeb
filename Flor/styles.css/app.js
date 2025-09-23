const canvas = document.getElementById("florCanvas");
const ctx = canvas.getContext("2d");

function drawFlower(x, y, petals, radius, petalSize) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🌱 tallo
  ctx.strokeStyle = "green";
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(x, y + 30);
  ctx.lineTo(x, y + 250);
  ctx.stroke();

  // 🍃 hojas
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.ellipse(x - 40, y + 120, 40, 20, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 40, y + 180, 40, 20, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // 🌼 pétalos
  ctx.fillStyle = "yellow";
  for (let i = 0; i < petals; i++) {
    let angle = (i * 2 * Math.PI) / petals;
    let px = x + Math.cos(angle) * radius;
    let py = y + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.arc(px, py, petalSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🌻 centro café
  ctx.fillStyle = "brown";
  ctx.beginPath();
  ctx.arc(x, y, petalSize * 1.2, 0, Math.PI * 2);
  ctx.fill();
}

// 🎬 Animación (flotando)
let t = 0;
function animate() {
  let moveY = Math.sin(t) * 5;
  drawFlower(250, 200 + moveY, 12, 80, 30);
  t += 0.05;
  requestAnimationFrame(animate);
}

animate();
