import React from 'react';
import { Users, AlertOctagon, CloudRain, TrendingDown, ArrowUpRight } from 'lucide-react';

export default function KpiSummaryCards({ farmers }) {
  const totalCount = farmers.length * 1750; // Scaled up total for realism
  const criticalCount = farmers.filter(f => f.riskLevel === 'CRITICAL').length;
  const moderateCount = farmers.filter(f => f.riskLevel === 'MODERATE').length;
  const priceCrashCount = farmers.filter(f => f.priceCrash >= 25).length;
  const weatherDeficitCount = farmers.filter(f => f.rainfallDeficit >= 30).length;

  return (
    <div className="kpi-cards-grid">
      {/* KPI 1: Total Farmers */}
      <div className="kpi-card">
        <div className="kpi-icon-box blue">
          <Users size={22} />
        </div>
        <div className="kpi-details">
          <span className="kpi-label">Total Monitored Farmers</span>
          <div className="kpi-value-row">
            <span className="kpi-number">{totalCount.toLocaleString()}</span>
            <span className="kpi-trend positive">
              <ArrowUpRight size={14} /> +4.2%
            </span>
          </div>
          <span className="kpi-subtext">Active regional profiles</span>
        </div>
      </div>

      {/* KPI 2: High Distress Flags */}
      <div className="kpi-card critical">
        <div className="kpi-icon-box red">
          <AlertOctagon size={22} className="pulse-icon" />
        </div>
        <div className="kpi-details">
          <span className="kpi-label">Urgent Distress Flags</span>
          <div className="kpi-value-row">
            <span className="kpi-number critical">{criticalCount * 85}</span>
            <span className="kpi-badge-alert red">Requires Intervention</span>
          </div>
          <span className="kpi-subtext">{criticalCount} active cases in district table</span>
        </div>
      </div>

      {/* KPI 3: Weather Deficit Zones */}
      <div className="kpi-card">
        <div className="kpi-icon-box orange">
          <CloudRain size={22} />
        </div>
        <div className="kpi-details">
          <span className="kpi-label">Rainfall Deficit Zones</span>
          <div className="kpi-value-row">
            <span className="kpi-number">{weatherDeficitCount} Blocks</span>
            <span className="kpi-badge-alert orange">&gt;30% Deficit</span>
          </div>
          <span className="kpi-subtext">Drought warning advisory issued</span>
        </div>
      </div>

      {/* KPI 4: Mandi Price Crash Alerts */}
      <div className="kpi-card">
        <div className="kpi-icon-box yellow">
          <TrendingDown size={22} />
        </div>
        <div className="kpi-details">
          <span className="kpi-label">Mandi Price Crash Alerts</span>
          <div className="kpi-value-row">
            <span className="kpi-number">{priceCrashCount} Commodities</span>
            <span className="kpi-trend negative">Below MSP</span>
          </div>
          <span className="kpi-subtext">Tomato & Cotton prices dropped &gt;25%</span>
        </div>
      </div>
    </div>
  );
}
