// ===========================
// Weather Widget
// ===========================

function initWeatherWidget() {
  const weatherWidget = document.getElementById('weatherWidget');
  const weatherIcon = document.getElementById('weatherIcon');
  const weatherTemp = document.getElementById('weatherTemp');
  const weatherFallback = document.getElementById('weatherFallback');
  const weatherContent = weatherWidget.querySelector('.weather-content');

  if (!navigator.geolocation) {
    showWeatherFallback();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude);
    },
    error => {
      showWeatherFallback();
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
        
        const { emoji, description } = getWeatherEmoji(weatherCode);
        
        weatherIcon.textContent = emoji;
        weatherTemp.textContent = `${temp}°F`;
        weatherContent.style.display = 'flex';
        weatherFallback.style.display = 'none';
      })
      .catch(error => {
        showWeatherFallback();
      });
  }

  function getWeatherEmoji(code) {
    if (code === 0 || code === 1) {
      return { emoji: '☀️', description: 'Clear' };
    } else if (code === 2) {
      return { emoji: '⛅', description: 'Partly Cloudy' };
    } else if (code === 3) {
      return { emoji: '☁️', description: 'Overcast' };
    } else if (code === 45 || code === 48) {
      return { emoji: '🌫️', description: 'Foggy' };
    } else if (code >= 51 && code <= 67) {
      return { emoji: '🌧️', description: 'Drizzle' };
    } else if (code >= 71 && code <= 77) {
      return { emoji: '❄️', description: 'Snow' };
    } else if (code >= 80 && code <= 82) {
      return { emoji: '🌧️', description: 'Rain' };
    } else if (code >= 85 && code <= 86) {
      return { emoji: '🌨️', description: 'Snow Showers' };
    } else if (code === 95 || code === 96 || code === 99) {
      return { emoji: '⛈️', description: 'Thunderstorm' };
    }
    return { emoji: '🌐', description: 'Weather' };
  }

  function showWeatherFallback() {
    weatherContent.style.display = 'none';
    weatherFallback.style.display = 'block';
  }
}

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
// Initialize on DOM Ready
// ===========================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initWeatherWidget();
    initBackToTopButton();
  });
} else {
  initWeatherWidget();
  initBackToTopButton();
}
