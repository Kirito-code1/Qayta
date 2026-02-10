"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

// Настройка иконки, чтобы она не пропадала
const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapPicker({ onChange }: { onChange: (coords: [number, number]) => void }) {
  const [position, setPosition] = useState<[number, number]>([41.3111, 69.2797]);

  // Обработчик клика по карте
  function ClickHandler() {
    useMapEvents({
      click(e) {
        const newCoords: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPosition(newCoords);
        onChange(newCoords);
      },
    });
    return null;
  }

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false} // Убираем лишние кнопки для чистоты дизайна
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler />
      <Marker position={position} icon={icon} />
    </MapContainer>
  );
}