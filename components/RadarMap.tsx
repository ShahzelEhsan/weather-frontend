// components/RadarMap.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet default icon path in Next.js / Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface RadarMapProps {
  lat: number;
  lon: number;
  cityName: string;
}

interface Alert {
  id: string;
  event: string;
  headline: string;
  severity: string;
  description: string;
}

const RadarMap: React.FC<RadarMapProps> = ({ lat, lon, cityName }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();

        const alertsData: Alert[] = (data.features ?? []).map((f: any) => ({
          id: f.id,
          event: f.properties.event,
          headline: f.properties.headline,
          severity: f.properties.severity,
          description: f.properties.description,
        }));

        setAlerts(alertsData);
      } catch (err) {
        console.error('Error fetching alerts', err);
        setError('Failed to load weather alerts.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [lat, lon]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Radar & Alerts for {cityName || 'Selected Location'}</h2>

      <MapContainer
        center={[lat, lon]}
        zoom={7}
        scrollWheelZoom={false}
        className="w-full h-[400px] rounded shadow border"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>{cityName}</Popup>
        </Marker>
      </MapContainer>

      {loading && <p className="mt-4 text-gray-500">Loading alerts...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {!loading && !error && (
        alerts.length > 0 ? (
          <div className="mt-4 p-4 border border-yellow-400 bg-yellow-100 rounded">
            <h3 className="text-lg font-semibold">⚠️ Weather Alerts</h3>
            <ul className="mt-2 space-y-2">
              {alerts.map(alert => (
                <li key={alert.id} className="border p-2 rounded bg-white shadow">
                  <p className="font-bold">
                    {alert.event} — <span className="text-red-500">{alert.severity}</span>
                  </p>
                  <p className="text-sm text-gray-600">{alert.headline}</p>
                  <p className="text-xs mt-1">{alert.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No active alerts for this area.</p>
        )
      )}
    </div>
  );
};

export default RadarMap;
