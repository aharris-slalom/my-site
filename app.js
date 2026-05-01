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
  const weatherLoading = document.getElementById('weatherLoading');
  const weatherError = document.getElementById('weatherError');
  const weatherContent = document.getElementById('weatherContent');
  const weatherIcon = document.getElementById('weatherIcon');
  const weatherTemp = document.getElementById('weatherTemp');

  const cachedCoords = getCachedCoords();
  if (cachedCoords) {
    fetchWeather(cachedCoords.lat, cachedCoords.lon);
  }

  getCoordinates()
    .then(({ lat, lon }) => {
      cacheCoords(lat, lon);
      if (!cachedCoords) {
        fetchWeather(lat, lon);
      }
    })
    .catch(() => {
      if (!cachedCoords) {
        showWeatherError();
      }
    });

  function getCachedCoords() {
    try {
      const raw = sessionStorage.getItem('weatherCoords');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.lat === 'number' && typeof parsed.lon === 'number') {
        return parsed;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  function cacheCoords(lat, lon) {
    try {
      sessionStorage.setItem('weatherCoords', JSON.stringify({ lat, lon, ts: Date.now() }));
    } catch (error) {
      // Ignore storage errors
    }
  }

  function getCoordinates() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation unsupported'));
      }

      let settled = false;
      const cleanup = () => {
        settled = true;
      };

      const geoSuccess = position => {
        if (settled) return;
        cleanup();
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      };

      const geoError = () => {
        if (settled) return;
        cleanup();
        fallbackIpLocation().then(resolve).catch(reject);
      };

      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      });

      const fallbackTimer = setTimeout(() => {
        if (settled) return;
        fallbackIpLocation()
          .then(location => {
            if (settled) return;
            cleanup();
            resolve(location);
          })
          .catch(error => {
            if (settled) return;
            cleanup();
            reject(error);
          });
      }, 2000);

      function fallbackIpLocation() {
        clearTimeout(fallbackTimer);
        return fetch('https://ipapi.co/json/')
          .then(response => response.json())
          .then(data => {
            if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
              return { lat: data.latitude, lon: data.longitude };
            }
            throw new Error('IP location failed');
          });
      }
    });
  }

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
      .catch(() => {
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
