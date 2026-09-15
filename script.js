const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherCard = document.getElementById("weatherCard");
const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("weatherIcon");

// Convert weather codes into descriptions and icons.
function getWeatherInfo(code) {
    const weather = {
        0: ["Clear sky", "☀️"],
        1: ["Mainly clear", "🌤️"],
        2: ["Partly cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Foggy", "🌫️"],
        51: ["Light drizzle", "🌦️"],
        53: ["Drizzle", "🌦️"],
        55: ["Heavy drizzle", "🌧️"],
        61: ["Light rain", "🌦️"],
        63: ["Rain", "🌧️"],
        65: ["Heavy rain", "🌧️"],
        71: ["Light snow", "🌨️"],
        73: ["Snow", "❄️"],
        75: ["Heavy snow", "❄️"],
        80: ["Rain showers", "🌦️"],
        81: ["Rain showers", "🌧️"],
        82: ["Heavy rain showers", "🌧️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with hail", "⛈️"],
        99: ["Thunderstorm with hail", "⛈️"]
    };

    return weather[code] || ["Unknown weather", "🌡️"];
}

// Fetch weather data using asynchronous programming.
async function getWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    if (!/^[a-zA-ZÀ-ÿ\s.'-]+$/.test(city)) {
        showError("Please enter a valid city name.");
        return;
    }

    errorMessage.textContent = "";
    weatherCard.classList.add("hidden");
    loading.classList.remove("hidden");
    searchBtn.disabled = true;

    try {
        // Step 1: Get city coordinates.
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to connect to the location service.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found. Please try another city.");
        }

        const location = locationData.results[0];

        // Step 2: Get current weather.
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const data = await weatherResponse.json();
        const current = data.current;

        // Step 3: Display the weather.
        const [weatherDescription, icon] =
            getWeatherInfo(current.weather_code);

        cityName.textContent = `${location.name}, ${location.country}`;
        temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
        description.textContent = weatherDescription;
        humidity.textContent = `${current.relative_humidity_2m}%`;
        windSpeed.textContent = `${current.wind_speed_10m} km/h`;
        weatherIcon.textContent = icon;

        weatherCard.classList.remove("hidden");

    } catch (error) {
        showError(error.message);
    } finally {
        loading.classList.add("hidden");
        searchBtn.disabled = false;
    }
}

function showError(message) {
    errorMessage.textContent = message;
    weatherCard.classList.add("hidden");
    loading.classList.add("hidden");
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});