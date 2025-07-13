import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import api from '@/lib/api';

interface WeatherData {
  location: {
    name: string;
  };
  current: {
    condition: {
      text: string;
    };
    temp_c: number;
  };
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeather = async (city: string) => {
    try {
      const res = await api.get<WeatherData>(`/weather?city=${city}`);
      setWeather(res.data);
    } catch (err) {
      console.error('Error fetching weather', err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Real-Time Weather Dashboard</h1>
      <SearchBar onSearch={fetchWeather} />
      {weather && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold">{weather.location.name}</h2>
          <p>{weather.current.condition.text}</p>
          <p>Temp: {weather.current.temp_c}°C</p>
        </div>
      )}
    </div>
  );
}
