"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { differenceInDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Leaf } from "lucide-react";
import Link from 'next/link';

// Координаты по умолчанию (Ангрен)
const ANGREN_COORDS: [number, number] = [41.0167, 70.1439];

// Фикс иконок Leaflet для Next.js
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

function LocationFinder({ setUserLocation }: { setUserLocation: (coords: [number, number]) => void }) {
  const map = useMap();
  useEffect(() => {
    fixLeafletIcon();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        map.flyTo([latitude, longitude], 13);
      });
    }
  }, [map, setUserLocation]);
  return null;
}

export default function MapComponent({ products }: { products: any[] }) {
  const [userLocation, setUserLocation] = useState<[number, number]>(ANGREN_COORDS);

  const getMarkerColor = (urgencyScore: number) => {
    if (urgencyScore >= 50) return '#ef4444';
    if (urgencyScore >= 30) return '#f59e0b';
    return '#10b981';
  };

  return (
    <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationFinder setUserLocation={setUserLocation} />
      
      {products.map((product) => {
        const discount = Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100);
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background: ${getMarkerColor(product.urgencyScore)}; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; display: flex; align-items: center; justify-content: center;"><span style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 10px;">${discount}%</span></div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });

        return (
          <Marker key={product.id} position={product.coordinates} icon={icon}>
            <Popup>
              <Card className="w-64 border-0 shadow-none">
                <CardContent className="p-2">
                  <h3 className="font-bold">{product.title}</h3>
                  <p className="text-sm text-[#4A7C59] font-bold">${product.discounted_price}</p>
                  <Link href={`/product/${product.id}`}>
                    <Button size="sm" className="w-full mt-2 bg-[#4A7C59]">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}