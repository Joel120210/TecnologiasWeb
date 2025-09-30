const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const exprInput = document.getElementById("expr");
const plotBtn = document.getElementById("plot");
const clearBtn = document.getElementById("clear");
const keyboard = document.getElementById("keyboard");
const toggleKeyboard = document.getElementById("toggleKeyboard");

// Mostrar/ocultar teclado
toggleKeyboard.addEventListener("click", () => {
  keyboard.classList.toggle("show");
});

// Insertar teclas en el input
keyboard.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    let key = e.target.textContent;
    if (key === "←") {
      exprInput.value = exprInput.value.slice(0, -1);
    } else if (key === "C") {
      exprInput.value = "";
    } else if (key === "=") {
      plot();
    } else if (key === "x²") {
      exprInput.value += "^2";
    } else if (key === "|x|") {
      exprInput.value += "abs(x)";
    } else if (key === "%") {
      exprInput.value += "/100";
    } else {
      exprInput.value += key;
    }
    exprInput.focus();
  }
});

function parseExpression(expr) {
  return expr
    .replace(/\^/g, "**")
    .replace(/π/g, "Math.PI")
    .replace(/e/g, "Math.E")
    .replace(/√/g, "Math.sqrt")
    .replace(/sin/g, "Math.sin")
    .replace(/cos/g, "Math.cos")
    .replace(/tan/g, "Math.tan")
    .replace(/log/g, "Math.log10")
    .replace(/ln/g, "Math.log")
    .replace(/abs/g, "Math.abs")
    .replace(/exp/g, "Math.exp")
    .replace(/asin/g, "Math.asin")
    .replace(/acos/g, "Math.acos")
    .replace(/atan/g, "Math.atan");
}

function plot() {
  const expr = exprInput.value;
  if (!expr) return;

  const parsed = parseExpression(expr);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Configuración
  const width = canvas.width;
  const height = canvas.height;
  const xmin = -10, xmax = 10;
  const ymin = -10, ymax = 10;

  const scaleX = width / (xmax - xmin);
  const scaleY = height / (ymax - ymin);

    // Dibuja el plano cartesiano mejorado
    drawAxes(ctx, width, height, xmin, xmax, ymin, ymax, scaleX, scaleY);
function drawAxes(ctx, width, height, xmin, xmax, ymin, ymax, scaleX, scaleY) {
  // Fondo degradado
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f7fbff");
  gradient.addColorStop(1, "#e0eafc");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  // Líneas secundarias (cuadricula)
  ctx.strokeStyle = "#b2bec3";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  // Verticales
  for (let x = Math.ceil(xmin); x <= xmax; x++) {
    const px = (x - xmin) * scaleX;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, height);
    ctx.stroke();
  }
  // Horizontales
  for (let y = Math.ceil(ymin); y <= ymax; y++) {
    const py = height - ((y - ymin) * scaleY);
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(width, py);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Ejes principales
  ctx.strokeStyle = "#2980b9";
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Eje X
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  // Eje Y
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  // Flechas estilizadas en los extremos
  function drawArrow(x, y, dx, dy, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.atan2(dy, dx));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-8, -5);
    ctx.lineTo(-8, 5);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }
  // Flecha eje X derecha
  drawArrow(width, height / 2, 1, 0, "#2980b9");
  // Flecha eje X izquierda
  drawArrow(0, height / 2, -1, 0, "#2980b9");
  // Flecha eje Y arriba
  drawArrow(width / 2, 0, 0, -1, "#2980b9");
  // Flecha eje Y abajo
  drawArrow(width / 2, height, 0, 1, "#2980b9");

  // Marcas y etiquetas con fondo
  ctx.font = "14px Segoe UI";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let x = Math.ceil(xmin); x <= xmax; x++) {
    if (x === 0) continue;
    const px = (x - xmin) * scaleX;
    // Marca
    ctx.beginPath();
    ctx.moveTo(px, height / 2 - 8);
    ctx.lineTo(px, height / 2 + 8);
    ctx.strokeStyle = "#2980b9";
    ctx.lineWidth = 2;
    ctx.stroke();
    // Etiqueta con fondo
    ctx.save();
    ctx.fillStyle = "#eaf6fb";
    ctx.fillRect(px - 14, height / 2 + 10, 28, 20);
    ctx.fillStyle = "#34495e";
    ctx.fillText(x, px, height / 2 + 14);
    ctx.restore();
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let y = Math.ceil(ymin); y <= ymax; y++) {
    if (y === 0) continue;
    const py = height - ((y - ymin) * scaleY);
    // Marca
    ctx.beginPath();
    ctx.moveTo(width / 2 - 8, py);
    ctx.lineTo(width / 2 + 8, py);
    ctx.strokeStyle = "#2980b9";
    ctx.lineWidth = 2;
    ctx.stroke();
    // Etiqueta con fondo
    ctx.save();
    ctx.fillStyle = "#eaf6fb";
    ctx.fillRect(width / 2 - 52, py - 10, 32, 20);
    ctx.fillStyle = "#34495e";
    ctx.fillText(y, width / 2 - 20, py);
    ctx.restore();
  }
  // Origen destacado
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "#1abc9c";
  ctx.fill();
  ctx.restore();
}

  // Graficar función
  ctx.strokeStyle = "#e74c3c";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  let first = true;
  for (let px = 0; px < width; px++) {
    const x = xmin + (px / scaleX);
    let y;
    try {
      y = eval(parsed.replace(/x/g, `(${x})`));
    } catch {
      continue;
    }
    const py = height - ((y - ymin) * scaleY);

    if (first) {
      ctx.moveTo(px, py);
      first = false;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
}

plotBtn.addEventListener("click", plot);
clearBtn.addEventListener("click", () => {
  exprInput.value = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});