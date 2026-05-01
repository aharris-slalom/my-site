// ===========================
// Back to Top Button
// ===========================

function initBackToTopButton() {
  const backToTopButton = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===========================
// Weather Display
// ===========================

function initWeatherDisplay() {
  const weatherDisplay = document.getElementById('weatherDisplay');
  const weatherLoading = document.getElementById('weatherLoading');
  const weatherError = document.getElementById('weatherError');
  const weatherContent = document.getElementById('weatherContent');
  const weatherIcon = document.getElementById('weatherIcon');
  const weatherTemp = document.getElementById('weatherTemp');

  // Check if geolocation is supported
  if (!navigator.geolocation) {
    showWeatherError();
    return;
  }

  // Request location and fetch weather
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude);
    },
    error => {
      showWeatherError();
    }
  );

  function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const current = data.current;
        const temp = Math.round(current.temperature_2m);
        const weatherCode = current.weather_code;
        
        const emoji = getWeatherEmoji(weatherCode);
        
        weatherIcon.textContent = emoji;
        weatherTemp.textContent = `${temp}°F`;
        
        weatherLoading.style.display = 'none';
        weatherError.style.display = 'none';
        weatherContent.style.display = 'flex';
      })
      .catch(error => {
        showWeatherError();
      });
  }

  function getWeatherEmoji(code) {
    if (code === 0 || code === 1) return '☀️'; // Clear
    if (code === 2) return '⛅'; // Partly Cloudy
    if (code === 3) return '☁️'; // Overcast
    if (code === 45 || code === 48) return '🌫️'; // Foggy
    if (code >= 51 && code <= 67) return '🌧️'; // Drizzle
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 80 && code <= 82) return '🌧️'; // Rain
    if (code >= 85 && code <= 86) return '🌨️'; // Snow Showers
    if (code === 95 || code === 96 || code === 99) return '⛈️'; // Thunderstorm
    return '🌐'; // Default
  }

  function showWeatherError() {
    weatherLoading.style.display = 'none';
    weatherContent.style.display = 'none';
    weatherError.style.display = 'flex';
  }
}

// ===========================
// Initialize on DOM Ready
// ===========================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initWeatherDisplay();
    initBackToTopButton();
  });
} else {
  initWeatherDisplay();
  initBackToTopButton();
}
