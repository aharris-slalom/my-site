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
    const apiKey = '82a16e042eeaf5a79f47acfee9ba2df9'; // Get free key from https://openweathermap.org/api
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const temp = Math.round(data.main.temp);
        const weatherId = data.weather[0].id;
        
        const { emoji, description } = getWeatherEmoji(weatherId);
        
        weatherIcon.textContent = emoji;
        weatherTemp.textContent = `${temp}°F`;
        weatherContent.style.display = 'flex';
        weatherFallback.style.display = 'none';
      })
      .catch(error => {
        showWeatherFallback();
      });
  }

  function getWeatherEmoji(id) {
    if (id === 800) {
      return { emoji: '☀️', description: 'Clear' };
    } else if (id >= 801 && id <= 802) {
      return { emoji: '⛅', description: 'Partly Cloudy' };
    } else if (id === 803 || id === 804) {
      return { emoji: '☁️', description: 'Cloudy' };
    } else if (id >= 701 && id <= 781) {
      return { emoji: '🌫️', description: 'Foggy' };
    } else if (id >= 300 && id <= 321) {
      return { emoji: '🌧️', description: 'Drizzle' };
    } else if (id >= 500 && id <= 531) {
      return { emoji: '🌧️', description: 'Rain' };
    } else if (id >= 600 && id <= 622) {
      return { emoji: '❄️', description: 'Snow' };
    } else if (id >= 200 && id <= 232) {
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
