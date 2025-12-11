import React, { useState, useEffect } from "react";
import "./App.css";
import { create, all } from "mathjs";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const math = create(all);

function App() {
  const [funcion, setFuncion] = useState("sin(x)");
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [error, setError] = useState("");
  const [data, setData] = useState({ labels: [], datasets: [] });

  // Actualizar gráfica cada vez que cambie algo
  useEffect(() => {
    try {
      const f = math.parse(funcion).compile();
      const step = (xMax - xMin) / 1000;
      const xs = [];
      const ys = [];

      for (let x = xMin; x <= xMax; x += step) {
        const y = f.evaluate({ x });
        if (typeof y === "number" && isFinite(y)) {
          xs.push(x);
          ys.push(y);
        }
      }

      setData({
        labels: xs,
        datasets: [
          {
            label: `f(x) = ${funcion}`,
            data: ys,
            borderColor: "#38bdf8",
            borderWidth: 2,
            tension: 0.2,
            pointRadius: 0,
          },
        ],
      });
      setError("");
    } catch (err) {
      setError("⚠️ Error en la función ingresada. Revisa la sintaxis.");
      setData({ labels: [], datasets: [] });
    }
  }, [funcion, xMin, xMax]);

  return (
    <div>
      <header>
        <h1>📊 Graficador de Funciones Matemáticas</h1>
        <p className="subtitle">
          Visualiza funciones matemáticas de forma interactiva
        </p>
      </header>

      <main>
        <section className="panel">
          <h2>Configuración de Gráfica</h2>

          <div className="input-group">
            <label>Función:</label>
            <input
              type="text"
              value={funcion}
              onChange={(e) => setFuncion(e.target.value)}
              placeholder="Ejemplo: sin(x), x^2 - 3*x + 2"
            />
          </div>

          <div className="range-group">
            <div className="range">
              <label>X min:</label>
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(Number(e.target.value))}
              />
            </div>
            <div className="range">
              <label>X max:</label>
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(Number(e.target.value))}
              />
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </section>

        <section className="canvas-container">
          <div style={{ width: "900px", height: "550px" }}>
            <Line
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { title: { display: true, text: "Eje X" } },
                  y: { title: { display: true, text: "Eje Y" } },
                },
              }}
            />
          </div>
        </section>
      </main>

      <footer>
        <p> <b></b></p>
      </footer>
    </div>
  );
}

export default App;
