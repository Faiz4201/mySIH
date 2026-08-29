import React from 'react';
import { Cpu, CloudRain, TrendingDown, Calendar, AlertOctagon, PhoneCall, UserCheck } from 'lucide-react';

export default function DistressInspector({ selectedFarmer, onOpenDispatchModal }) {
  if (!selectedFarmer) {
    return (
      <div className="inspector-card empty">
        <Cpu size={36} className="empty-inspector-icon" />
        <p>Select a farmer from the heatmap table or map pin to inspect their prediction score breakdown.</p>
      </div>
    );
  }

  const {
    name, village, crop, landAcres, phone,
    riskScore, riskLevel, rainfallDeficit, priceCrash,
    loanDueDays, loanAmount, primaryTrigger, assignedOfficer
  } = selectedFarmer;

  // Calculate percentage progress for factor bars
  const rainPct = Math.min(100, Math.round((rainfallDeficit / 50) * 100));
  const pricePct = Math.min(100, Math.round((priceCrash / 40) * 100));
  const loanPct = loanDueDays <= 30 ? Math.round(((30 - loanDueDays) / 29) * 100) : 10;

  return (
    <div className="inspector-card">
      <div className="inspector-header">
        <div className="inspector-title">
          <Cpu size={22} className="cpu-icon" />
          <div>
            <h3>Distress Prediction Inspector</h3>
            <span className="farmer-target">Analyzing {name} ({village} • {crop})</span>
          </div>
        </div>
        <span className={`inspector-score-pill ${riskLevel.toLowerCase()}`}>
          Score: {riskScore} / 100 ({riskLevel})
        </span>
      </div>

      <div className="inspector-body-grid">
        {/* Left Column: Radial Score Gauge */}
        <div className="gauge-display-container">
          <div className={`radial-gauge ${riskLevel.toLowerCase()}`}>
            <div className="radial-inner">
              <span className="score-big">{riskScore}</span>
              <span className="score-denom">/ 100</span>
              <span className="risk-level-tag">{riskLevel} DISTRESS</span>
            </div>
          </div>
        </div>

        {/* Center Column: Signal Breakdown Factor Bars */}
        <div className="factors-list">
          <h4>Predictive Signal Factor Breakdown</h4>

          {/* Factor 1: Rainfall Deficit */}
          <div className="factor-item">
            <div className="factor-header">
              <span className="factor-label">
                <CloudRain size={16} className="factor-icon blue" />
                Rainfall Shortfall (Weight 40%)
              </span>
              <span className="factor-value red">-{rainfallDeficit}% Deficit</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill red" 
                style={{ width: `${rainPct}%` }}
              ></div>
            </div>
          </div>

          {/* Factor 2: Mandi Price Crash */}
          <div className="factor-item">
            <div className="factor-header">
              <span className="factor-label">
                <TrendingDown size={16} className="factor-icon orange" />
                Mandi Price Collapse (Weight 35%)
              </span>
              <span className="factor-value orange">-{priceCrash}% Below MSP</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill orange" 
                style={{ width: `${pricePct}%` }}
              ></div>
            </div>
          </div>

          {/* Factor 3: Loan Due Proximity */}
          <div className="factor-item">
            <div className="factor-header">
              <span className="factor-label">
                <Calendar size={16} className="factor-icon yellow" />
                KCC Loan Due Date (Weight 25%)
              </span>
              <span className="factor-value yellow">Due in {loanDueDays} Days (₹{loanAmount.toLocaleString()})</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill yellow" 
                style={{ width: `${loanPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right Column: Trigger Note & Action Footer */}
        <div className="inspector-right-col">
          <div className="trigger-box">
            <AlertOctagon size={18} className="trigger-icon" />
            <div>
              <strong>Primary Warning Trigger:</strong>
              <p>{primaryTrigger}</p>
            </div>
          </div>

          <div className="inspector-actions">
            <button 
              className="btn btn-dispatch-primary"
              onClick={() => onOpenDispatchModal(selectedFarmer)}
            >
              <UserCheck size={16} />
              <span>Dispatch Agri-Officer</span>
            </button>

            <a href={`tel:${phone}`} className="btn btn-call-farmer">
              <PhoneCall size={16} />
              <span>Call</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
