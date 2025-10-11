// --- ELEMENTOS DEL DOM ---
const canvas = document.getElementById('plot-canvas');
const ctx = canvas.getContext('2d');
const functionInput = document.getElementById('function-input');
const xMinInput = document.getElementById('x-min');
const xMaxInput = document.getElementById('x-max');
const yMinInput = document.getElementById('y-min');
const yMaxInput = document.getElementById('y-max');
const errorMessage = document.getElementById('error-message');

// --- FUNCIÓN PRINCIPAL DE DIBUJO ---
function drawPlot() {
    // Obtener los valores de los rangos
    const xMin = parseFloat(xMinInput.value);
    const xMax = parseFloat(xMaxInput.value);
    const yMin = parseFloat(yMinInput.value);
    const yMax = parseFloat(yMaxInput.value);
    
    // Validar que los rangos sean números válidos
    if (isNaN(xMin) || isNaN(xMax) || isNaN(yMin) || isNaN(yMax) || xMin >= xMax || yMin >= yMax) {
        errorMessage.textContent = "Los rangos de los ejes no son válidos.";
        return;
    }

    // Ajustar el tamaño del canvas para que sea nítido en pantallas de alta densidad
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.width * 0.6 * dpr; // Mantener una proporción de aspecto
    ctx.scale(dpr, dpr);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Limpiar el canvas
    ctx.clearRect(0, 0, width, height);
    
    // Función para transformar coordenadas matemáticas a píxeles del canvas
    const toPixelX = (x) => ((x - xMin) / (xMax - xMin)) * width;
    const toPixelY = (y) => height - ((y - yMin) / (yMax - yMin)) * height;

    // --- DIBUJAR EJES Y CUADRÍCULA ---
    ctx.strokeStyle = '#e0e0e0'; // Color de la cuadrícula
    ctx.lineWidth = 1;
    ctx.font = `${10}px Arial`;
    ctx.fillStyle = '#666';

    // Dibujar cuadrícula vertical y etiquetas del eje X
    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i++) {
        const px = toPixelX(i);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();
        if (i !== 0) ctx.fillText(i, px + 4, toPixelY(0) - 4);
    }

    // Dibujar cuadrícula horizontal y etiquetas del eje Y
    for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i++) {
        const py = toPixelY(i);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
         if (i !== 0) ctx.fillText(i, toPixelX(0) + 4, py - 4);
    }

    // Dibujar ejes principales (X y Y)
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1.5;
    // Eje X
    ctx.beginPath();
    ctx.moveTo(0, toPixelY(0));
    ctx.lineTo(width, toPixelY(0));
    ctx.stroke();
    // Eje Y
    ctx.beginPath();
    ctx.moveTo(toPixelX(0), 0);
    ctx.lineTo(toPixelX(0), height);
    ctx.stroke();
    
    // --- DIBUJAR LA FUNCIÓN ---
    ctx.strokeStyle = '#3b82f6'; // Color azul para la función
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let firstPoint = true;
    errorMessage.textContent = ''; // Limpiar mensaje de error
    
    try {
        // Iterar a través de cada píxel en el eje X para un dibujo suave
        for (let px = 0; px < width; px++) {
            const x = (px / width) * (xMax - xMin) + xMin;
            
            // Usar 'eval' para calcular 'y'. NOTA: 'eval' puede ser inseguro.
            // Para este caso de uso controlado, es una solución simple.
            const y = eval(functionInput.value.replace(/x/g, `(${x})`));
            
            if (isFinite(y)) {
                const py = toPixelY(y);
                if (firstPoint) {
                    ctx.moveTo(px, py);
                    firstPoint = false;
                } else {
                    ctx.lineTo(px, py);
                }
            } else {
                // Si el punto no es finito (división por cero, etc.), reiniciamos el trazo
                firstPoint = true;
            }
        }
    } catch (error) {
        errorMessage.textContent = 'Error en la sintaxis de la función.';
        console.error("Error al evaluar la función:", error);
    }

    ctx.stroke(); // Dibuja la línea en el canvas
}

// --- EVENT LISTENERS ---
// Dibujar cuando la página carga por primera vez
window.addEventListener('load', drawPlot);
// Volver a dibujar si la ventana cambia de tamaño
window.addEventListener('resize', drawPlot);
// Volver a dibujar cuando se modifica cualquier campo de entrada
[functionInput, xMinInput, xMaxInput, yMinInput, yMaxInput].forEach(input => {
    input.addEventListener('input', drawPlot);
});