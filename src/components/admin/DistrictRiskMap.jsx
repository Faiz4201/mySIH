import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, MapPin, CheckCircle, Navigation, Eye } from 'lucide-react';

// Custom SVG map icons for Red (Critical), Yellow (Moderate), Green (Safe)
const createCustomIcon = (colorHex) => {
  return L.divIcon({
    className: 'custom-map-pin-container',
    html: `
      <div style="
        background-color: ${colorHex};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 11px;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        📍
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const redIcon = createCustomIcon('#EF4444');
const yellowIcon = createCustomIcon('#F59E0B');
const greenIcon = createCustomIcon('#10B981');

// Helper to auto-recenter Leaflet map when district changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);
  return null;
}

export default function DistrictRiskMap({ farmers, selectedDistrict, onSelectFarmer, selectedFarmerId }) {
  const mapCenter = [selectedDistrict.lat, selectedDistrict.lng];

  return (
    <div className="district-map-card">
      <div className="map-card-header">
        <div className="map-title-group">
          <Navigation size={18} className="map-title-icon" />
          <h3>Interactive District Distress Heatmap</h3>
          <span className="map-location-tag">
            <MapPin size={12} /> {selectedDistrict.name}
          </span>
        </div>

        <div className="map-legend">
          <span className="legend-item red">
            <span className="legend-dot red"></span> Critical Distress (80-100)
          </span>
          <span className="legend-item yellow">
            <span className="legend-dot yellow"></span> Moderate Risk (55-79)
          </span>
          <span className="legend-item green">
            <span className="legend-dot green"></span> Safe Zone (&lt;55)
          </span>
        </div>
      </div>

      <div className="leaflet-map-wrapper">
        <MapContainer 
          center={mapCenter} 
          zoom={10} 
          scrollWheelZoom={false}
          className="admin-leaflet-container"
        >
          <MapRecenter center={mapCenter} />
          
          {/* Dark-themed OpenStreetMap tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {farmers.map(farmer => {
            let iconToUse = greenIcon;
            if (farmer.riskLevel === 'CRITICAL') iconToUse = redIcon;
            else if (farmer.riskLevel === 'MODERATE') iconToUse = yellowIcon;

            const isSelected = selectedFarmerId === farmer.id;

            return (
              <Marker 
                key={farmer.id}
                position={[farmer.lat, farmer.lng]}
                icon={iconToUse}
                eventHandlers={{
                  click: () => onSelectFarmer(farmer)
                }}
              >
                <Popup className="farmer-map-popup">
                  <div className="popup-content">
                    <div className="popup-header">
                      <strong>{farmer.name}</strong>
                      <span className={`risk-badge-mini ${farmer.riskLevel.toLowerCase()}`}>
                        {farmer.riskLevel} ({farmer.riskScore})
                      </span>
                    </div>

                    <p className="popup-village">📍 Village: {farmer.village}</p>
                    <p className="popup-crop">🌾 Crop: {farmer.crop} ({farmer.landAcres} acres)</p>
                    <p className="popup-trigger">⚡ {farmer.primaryTrigger}</p>

                    <button 
                      className="popup-select-btn"
                      onClick={() => onSelectFarmer(farmer)}
                    >
                      <Eye size={14} /> View Details & Dispatch
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
