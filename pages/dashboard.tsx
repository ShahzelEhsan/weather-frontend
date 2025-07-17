// pages/dashboard.tsx

import { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import dynamic from 'next/dynamic';

import SearchBar from '@/components/SearchBar';
const RadarMap = dynamic(() => import('@/components/RadarMap'), { ssr: false }); // Fix: dynamic import with SSR disabled
import { useWeather } from '@/context/WeatherContext';

interface SavedLocation {
  _id: string;
  name: string;
  lat: number;
  lon: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { state, dispatch } = useWeather();

  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch saved locations
  useEffect(() => {
    if (session?.user?.email) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/locations/${session.user.email}`)
        .then((res) => setSavedLocations(res.data))
        .catch((err) => console.error('Failed to load locations', err));
    }
  }, [session]);

  const handleSearch = async (city: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/weather/forecast?city=${city}`
      );
      dispatch({ type: 'SET_LOCATION', payload: city });
      dispatch({ type: 'SET_WEATHER', payload: res.data });
    } catch (err) {
      console.error('Weather fetch error:', err);
    }
  };

  const handleSaveLocation = async () => {
    if (!session?.user?.email || !state.weather) return;

    const { location } = state.weather;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/locations`, {
        userEmail: session.user.email,
        cityName: location.name,
        lat: location.lat,
        lon: location.lon,
      });
      alert('Location saved!');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/locations/${id}`);
      setSavedLocations((prev) => prev.filter((loc) => loc._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (status === 'loading') return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session?.user?.email}</h1>

      <SearchBar onSearch={handleSearch} />

      {state.weather && (
        <div className="mt-6">
          <div className="bg-white shadow rounded p-4 mb-4">
            <h2 className="text-xl font-semibold">{state.weather.location.name}</h2>
            <p className="text-gray-600">
              {state.weather.current.temp_c}°C – {state.weather.current.condition.text}
            </p>
            <button
              onClick={handleSaveLocation}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
            >
              Save Location
            </button>
          </div>

          <RadarMap
            lat={state.weather.location.lat}
            lon={state.weather.location.lon}
            cityName={state.weather.location.name}
          />
        </div>
      )}

      {savedLocations.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-bold mb-2">Your Saved Locations</h3>
          <ul className="space-y-2">
            {savedLocations.map((loc) => (
              <li key={loc._id} className="flex justify-between bg-gray-100 p-2 rounded">
                <span>{loc.name}</span>
                <button
                  onClick={() => handleDeleteLocation(loc._id)}
                  className="text-sm text-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Optional SSR protection (only runs server-side)
export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  return { props: { session } };
}
