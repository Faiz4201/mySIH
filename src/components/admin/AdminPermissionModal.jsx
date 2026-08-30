import React, { useState } from 'react';
import { MapPin, ShieldAlert, CheckCircle2, Globe, Lock } from 'lucide-react';

export default function AdminPermissionModal({ isOpen, onClose, onPermissionGranted }) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleGrantLocation = () => {
    setLoading(true);
    setStatusMessage('Detecting official GPS coordinates & jurisdiction...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          onPermissionGranted({
            granted: true,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            district: 'Rourkela (Auto-Detected)'
          });
          onClose();
        },
        (error) => {
          setLoading(false);
          setStatusMessage('Location permission denied or unavailable. Switching to default district jurisdiction.');
          setTimeout(() => {
            onPermissionGranted({ granted: false, district: 'Rourkela (Default)' });
            onClose();
          }, 1200);
        }
      );
    } else {
      setLoading(false);
      onPermissionGranted({ granted: false, district: 'Rourkela' });
      onClose();
    }
  };

  const handleUseDemo = () => {
    onPermissionGranted({ granted: true, isDemo: true, district: 'Rourkela' });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="permission-modal-card">
        <div className="modal-badge">
          <Lock size={18} className="badge-icon" />
          <span>Official Portal Access</span>
        </div>

        <div className="modal-icon-header">
          <MapPin size={48} className="map-pin-pulse" />
        </div>

        <h2>Location & Jurisdiction Access Required</h2>
        <p className="modal-description">
          <strong>KrishiRakshak Admin Portal</strong> requires your location access to detect your official district jurisdiction and load real-time farmer distress heatmaps for your region.
        </p>

        {statusMessage && (
          <div className="modal-status-box">
            <span className="spinner"></span> {statusMessage}
          </div>
        )}

        <div className="modal-actions">
          <button
            className="btn btn-grant-location"
            onClick={handleGrantLocation}
            disabled={loading}
          >
            <MapPin size={18} />
            {loading ? 'Detecting Location...' : '📍 Grant Location & Jurisdiction Access'}
          </button>

          <button
            className="btn btn-demo-mode"
            onClick={handleUseDemo}
            disabled={loading}
          >
            <Globe size={18} />
            🌐 Use Demo Jurisdiction (Rourkela)
          </button>
        </div>

        <div className="modal-footer-note">
          <ShieldAlert size={14} />
          <span>Encrypted Official Access • Government Agri-Officer Portal</span>
        </div>
      </div>
    </div>
  );
}
