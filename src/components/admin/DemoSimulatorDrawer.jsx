import React from 'react';
import { SlidersHorizontal, Zap, RotateCcw, AlertTriangle, X } from 'lucide-react';

export default function DemoSimulatorDrawer({ 
  isOpen, 
  onClose, 
  simParams, 
  onParamChange, 
  onResetSim 
}) {
  if (!isOpen) return null;

  const { rainDeficit, priceCrash, loanDays } = simParams;

  return (
    <div className="simulator-drawer-overlay">
      <div className="simulator-drawer-card">
        <div className="drawer-header">
          <div className="drawer-title-group">
            <Zap size={22} className="zap-icon" />
            <div>
              <h3>Hackathon Demo Simulator</h3>
              <p className="subtitle">Real-time distress parameter manipulator for judge testing</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="sim-info-banner">
            <AlertTriangle size={18} />
            <span>Adjust sliders to simulate regional crisis events. Distress scores across all farmer profiles & map pins will recalculate in real-time!</span>
          </div>

          {/* Slider 1: Rainfall Shortfall */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span className="slider-title">🌧️ Rainfall Deficit (% Shortfall)</span>
              <span className="slider-value red">-{rainDeficit}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="60"
              value={rainDeficit}
              onChange={(e) => onParamChange('rainDeficit', parseInt(e.target.value))}
              className="sim-slider red"
            />
            <div className="slider-minmax">
              <span>0% (Normal)</span>
              <span>30% (Deficit)</span>
              <span>60% (Severe Drought)</span>
            </div>
          </div>

          {/* Slider 2: Mandi Price Crash */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span className="slider-title">📉 Mandi Crop Price Crash (% Drop)</span>
              <span className="slider-value orange">-{priceCrash}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="50"
              value={priceCrash}
              onChange={(e) => onParamChange('priceCrash', parseInt(e.target.value))}
              className="sim-slider orange"
            />
            <div className="slider-minmax">
              <span>0% (Normal)</span>
              <span>25% (Price Crash)</span>
              <span>50% (Market Collapse)</span>
            </div>
          </div>

          {/* Slider 3: Loan Due Proximity */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span className="slider-title">💳 KCC Loan Due Date Proximity</span>
              <span className="slider-value yellow">{loanDays} Days Remaining</span>
            </div>
            <input 
              type="range"
              min="1"
              max="30"
              value={loanDays}
              onChange={(e) => onParamChange('loanDays', parseInt(e.target.value))}
              className="sim-slider yellow"
            />
            <div className="slider-minmax">
              <span>1 Day (Urgent)</span>
              <span>15 Days</span>
              <span>30 Days</span>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-reset-sim" onClick={onResetSim}>
            <RotateCcw size={16} />
            <span>Reset Default Parameters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
