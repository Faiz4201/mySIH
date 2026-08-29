import React from 'react';
import { ShieldCheck, MapPin, RefreshCw, SlidersHorizontal, UserCheck, ArrowLeft } from 'lucide-react';
import { DISTRICTS } from '../../data/mockData';

export default function AdminHeader({ 
  selectedDistrict, 
  onDistrictChange, 
  onToggleSimulator, 
  isSimulatorOpen,
  onReopenPermissionModal,
  onBackToHome
}) {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button className="back-to-home-btn" onClick={onBackToHome} title="Return to Landing Page">
          <ArrowLeft size={18} />
          <span>Home</span>
        </button>
        
        <div className="brand-badge-group">
          <div className="brand-icon-box">
            <ShieldCheck size={22} className="brand-logo-icon" />
          </div>
          <div>
            <h1 className="admin-brand-title">KrishiRakshak Admin</h1>
            <p className="admin-brand-subtitle">Distress Early-Warning & Alert Router</p>
          </div>
        </div>

        <div className="system-status-pill">
          <span className="pulse-green-dot"></span>
          <span>Prediction Engine Active</span>
        </div>
      </div>

      <div className="admin-header-right">
        {/* District Selector */}
        <div className="district-select-box">
          <MapPin size={16} className="district-pin-icon" />
          <select 
            className="district-dropdown"
            value={selectedDistrict.id}
            onChange={(e) => {
              const found = DISTRICTS.find(d => d.id === e.target.value);
              if (found) onDistrictChange(found);
            }}
          >
            {DISTRICTS.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>
        </div>

        <button className="icon-action-btn" onClick={onReopenPermissionModal} title="Re-check Location Jurisdiction">
          <MapPin size={16} />
        </button>

        {/* Demo Simulator Toggle Button */}
        <button 
          className={`btn btn-simulator-toggle ${isSimulatorOpen ? 'active' : ''}`}
          onClick={onToggleSimulator}
        >
          <SlidersHorizontal size={16} />
          <span>Demo Simulator</span>
        </button>

        {/* Officer Profile */}
        <div className="officer-profile-badge">
          <div className="officer-avatar">
            <UserCheck size={18} />
          </div>
          <div className="officer-info">
            <span className="officer-name">Dr. R. Sharma</span>
            <span className="officer-role">District Agri Collector</span>
          </div>
        </div>
      </div>
    </header>
  );
}
