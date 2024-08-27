import { useEffect, useRef, useState } from 'react';
import './SkyCast.css';
import search_icon from '../assets/search.png';
import clear from '../assets/clear.png';
import cloud from '../assets/cloud.png';
import drizzle from '../assets/drizzle.png';
import humidity from '../assets/humidity.png';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';
import wind from '../assets/wind.png';

const Notification = ({ message, type }) => {
  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
    </div>
  );
};

const SkyCast = () => {
  const inputRef = useRef();
  const [skycastData, setSkycastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  const search = async (city) => {
    if (city === "") {
      showNotification("Enter City Name", "error");
      return;
    }
    setLoading(true);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        showNotification(data.message, "error");
        setLoading(false);
        return;
      }
      const iconCode = data.weather[0].icon;
      const icon = allIcons[iconCode] || clear;
      setSkycastData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
      showNotification("Weather data fetched successfully", "success");
    } catch (error) {
      setSkycastData(null);
      showNotification("Error in fetching the data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search("visakhapatnam");
  }, []);

  return (
    <div className='SkyCast'>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <div className='search-bar'>
        <input ref={inputRef} type="text" placeholder='Search for a city' />
        <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
      </div>
      {loading ? (
        <div className='loader'>Loading...</div>
      ) : skycastData ? (
        <div className='weather-card'>
          <img src={skycastData.icon} alt="" className='skycast-icon' />
          <p className='temperature'>{skycastData.temperature}&deg;c</p>
          <p className='location'>{skycastData.location}</p>
          <div className="skycast-data">
            <div className='col'>
              <img src={humidity} alt="" />
              <div>
                <p>{skycastData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className='col'>
              <img src={wind} alt="" />
              <div>
                <p>{skycastData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SkyCast;
