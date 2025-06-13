'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapComponentProps {
  center: {
    lat: number;
    lng: number;
  };
  markerPosition: {
    lat: number;
    lng: number;
  };
}

export default function MapComponent({ center, markerPosition }: MapComponentProps) {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={12}
      >
        {markerPosition.lat !== 0 && markerPosition.lng !== 0 && (
          <Marker position={markerPosition} />
        )}
      </GoogleMap>
    </LoadScript>
  );
} 