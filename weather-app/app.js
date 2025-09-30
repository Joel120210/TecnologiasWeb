// Reemplaza con tu API Key de OpenWeatherMap
const apiKey = "25049b42bb5a21b36c7c62c507db7b8c";
const weatherInfo = document.getElementById("weather-info");
const forecastContainer = document.getElementById("forecast");

// Obtener clima actual
async function getWeather() {
  const city = document.getElementById("city-input").value;
  if (!city) {
    alert("Por favor escribe una ciudad");
    return;
  }

  try {
    // Clima actual
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=es&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      alert("Ciudad no encontrada");
      return;
    }

    document.getElementById("city-name").textContent = data.name;
    document.getElementById("temperature").textContent = `🌡️ Temp: ${data.main.temp}°C`;
    document.getElementById("description").textContent = `☁️ Clima: ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `💧 Humedad: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `💨 Viento: ${data.wind.speed} m/s`;

    // Pronóstico de 5 días
    getForecast(city);
  } catch (error) {
    alert("Error al obtener el clima");
    console.error(error);
  }
}

// Pronóstico
async function getForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=es&units=metric`
    );
    const data = await response.json();

    forecastContainer.innerHTML = "<h3>📅 Pronóstico:</h3>";

    // Muestra cada 8 intervalos (24 horas)
    for (let i = 0; i < data.list.length; i += 8) {
      const day = data.list[i];
      const div = document.createElement("div");
      div.classList.add("forecast-day");
      div.innerHTML = `
        <p><strong>${new Date(day.dt_txt).toLocaleDateString("es-MX")}</strong></p>
        <p>🌡️ ${day.main.temp}°C</p>
        <p>☁️ ${day.weather[0].description}</p>
      `;
      forecastContainer.appendChild(div);
    }
  } catch (error) {
    console.error("Error al obtener el pronóstico", error);
  }
}
