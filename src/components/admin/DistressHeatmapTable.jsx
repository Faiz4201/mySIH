import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, ShieldCheck, ChevronRight, UserPlus } from 'lucide-react';

export default function DistressHeatmapTable({ 
  farmers, 
  onSelectFarmer, 
  selectedFarmerId,
  onOpenDispatchModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');

  const filteredFarmers = farmers.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.crop.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterRisk === 'ALL') return matchesSearch;
    return matchesSearch && f.riskLevel === filterRisk;
  });

  return (
    <div className="table-card">
      <div className="table-card-header">
        <div>
          <h3>Farmer Distress Risk Matrix</h3>
          <p className="table-subtitle">District-wide live risk scoring & alert dispatch registry</p>
        </div>

        <div className="table-controls">
          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text"
              placeholder="Search farmer, village, or crop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="table-search-input"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="filter-dropdown-wrapper">
            <Filter size={16} className="filter-icon" />
            <select 
              value={filterRisk} 
              onChange={(e) => setFilterRisk(e.target.value)}
              className="table-filter-select"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">🔴 Critical Distress (≥80)</option>
              <option value="MODERATE">🟡 Moderate Risk (55-79)</option>
              <option value="SAFE">🟢 Safe (&lt;55)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="admin-heatmap-table">
          <thead>
            <tr>
              <th>Farmer Details</th>
              <th>Village</th>
              <th>Crop & Land</th>
              <th>Distress Score</th>
              <th>Primary Trigger Factor</th>
              <th>Officer Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-table-cell">
                  No farmer records found matching the filter criteria.
                </td>
              </tr>
            ) : (
              filteredFarmers.map(farmer => {
                const isSelected = selectedFarmerId === farmer.id;

                return (
                  <tr 
                    key={farmer.id} 
                    className={`table-row ${isSelected ? 'row-selected' : ''}`}
                    onClick={() => onSelectFarmer(farmer)}
                  >
                    {/* Farmer Details */}
                    <td>
                      <div className="farmer-name-cell">
                        <strong>{farmer.name}</strong>
                        <span className="farmer-id-tag">{farmer.id}</span>
                      </div>
                    </td>

                    {/* Village */}
                    <td>{farmer.village}</td>

                    {/* Crop & Land */}
                    <td>
                      <div>
                        <strong>{farmer.crop}</strong>
                        <div className="sub-text">{farmer.landAcres} Acres</div>
                      </div>
                    </td>

                    {/* Distress Score */}
                    <td>
                      <div className="score-cell-group">
                        <span className={`score-badge ${farmer.riskLevel.toLowerCase()}`}>
                          {farmer.riskScore} / 100
                        </span>
                        <span className="risk-level-name">{farmer.riskLevel}</span>
                      </div>
                    </td>

                    {/* Primary Trigger */}
                    <td>
                      <span className="trigger-pill">
                        {farmer.primaryTrigger}
                      </span>
                    </td>

                    {/* Officer Status */}
                    <td>
                      {farmer.assignedOfficer === 'Unassigned' ? (
                        <span className="status-tag unassigned">⚠️ Unassigned</span>
                      ) : (
                        <span className="status-tag assigned">
                          <ShieldCheck size={14} /> {farmer.assignedOfficer}
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td>
                      <button 
                        className="btn btn-table-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFarmer(farmer);
                          onOpenDispatchModal(farmer);
                        }}
                      >
                        <UserPlus size={14} />
                        <span>Dispatch Aid</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
