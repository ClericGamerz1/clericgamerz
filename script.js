const cityInput = document.getElementById("cityInput");

const loading = document.getElementById("loading");

const error = document.getElementById("error");


// Weather code → icon

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if (
        code === 45 ||
        code === 48
    ) {
        return "🌫️";
    }

    if (
        code >= 51 &&
        code <= 67
    ) {
        return "🌧️";
    }

    if (
        code >= 71 &&
        code <= 77
    ) {
        return "❄️";
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return "🌦️";
    }

    if (
        code >= 95
    ) {
        return "⛈️";
    }

    return "🌤️";
}


// Weather code → description

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (code === 1) {
        return "Mainly Clear";
    }

    if (code === 2) {
        return "Partly Cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if (
        code === 45 ||
        code === 48
    ) {
        return "Foggy";
    }

    if (
        code >= 51 &&
        code <= 67
    ) {
        return "Rain";
    }

    if (
        code >= 71 &&
        code <= 77
    ) {
        return "Snow";
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return "Rain Showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown";
}


// Search weather

async function searchWeather() {

    const cityName = cityInput.value.trim();

    if (cityName === "") {
        return;
    }


    loading.style.display = "block";

    error.style.display = "none";


    try {

        // Find city coordinates

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

        const geoResponse =
            await fetch(geoURL);

        const geoData =
            await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            throw new Error("City not found");

        }


        const location =
            geoData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        // Get weather

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;


        const weatherResponse =
            await fetch(weatherURL);

        const weatherData =
            await weatherResponse.json();


        // Current weather

        document.getElementById("city").textContent =
            location.name;


        document.getElementById("country").textContent =
            location.country;


        document.getElementById("temperature").textContent =
            Math.round(
                weatherData.current.temperature_2m
            );


        document.getElementById("humidity").textContent =
            weatherData.current.relative_humidity_2m +
            "%";


        document.getElementById("wind").textContent =
            Math.round(
                weatherData.current.wind_speed_10m
            ) +
            " km/h";


        document.getElementById("rain").textContent =
            weatherData.daily.precipitation_probability_max[0] +
            "%";


        const currentCode =
            weatherData.current.weather_code;


        document.getElementById("weatherIcon").textContent =
            getWeatherIcon(currentCode);


        document.getElementById("condition").textContent =
            getWeatherDescription(currentCode);


        // 7-day forecast

        const forecastContainer =
            document.getElementById(
                "forecastContainer"
            );


        forecastContainer.innerHTML = "";


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const date =
                new Date(
                    weatherData.daily.time[i]
                );


            const day =
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                );


            const code =
                weatherData.daily.weather_code[i];


            const maxTemp =
                Math.round(
                    weatherData.daily.temperature_2m_max[i]
                );


            const minTemp =
                Math.round(
                    weatherData.daily.temperature_2m_min[i]
                );


            const rainChance =
                weatherData.daily.precipitation_probability_max[i];


            const card =
                document.createElement("div");


            card.className =
                "forecast-card";


            card.innerHTML = `

                <div class="day">
                    ${day}
                </div>

                <div class="icon">
                    ${getWeatherIcon(code)}
                </div>

                <div>
                    ${getWeatherDescription(code)}
                </div>

                <div class="temp">
                    ${maxTemp}° / ${minTemp}°
                </div>

                <div>
                    🌧️ ${rainChance}%
                </div>

            `;


            forecastContainer.appendChild(card);

        }

    }

    catch (err) {

        console.error(err);

        error.style.display = "block";

    }

    finally {

        loading.style.display = "none";

    }

}


// Allow Enter key

cityInput.addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {

            searchWeather();

        }

    }
);


// Load Kathmandu when website opens

cityInput.value = "Kathmandu";

searchWeather();