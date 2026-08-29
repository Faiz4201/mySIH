import React, { useState } from 'react';
import { X, ShieldCheck, Send, CheckCircle2, UserCheck, PhoneCall } from 'lucide-react';
import { AGRI_OFFICERS } from '../../data/mockData';

export default function AlertDispatchModal({ farmer, isOpen, onClose, onUpdateFarmer }) {
  if (!isOpen || !farmer) return null;

  const [selectedOfficer, setSelectedOfficer] = useState(
    farmer.assignedOfficer !== 'Unassigned' ? farmer.assignedOfficer : AGRI_OFFICERS[0].name
  );
  const [broadcastMessage, setBroadcastMessage] = useState(
    `Emergency Agri Advisory for ${farmer.name}: Relief officer ${selectedOfficer} has been dispatched to ${farmer.village} for crop distress evaluation.`
  );
  const [successAlert, setSuccessAlert] = useState('');

  const handleAssignOfficer = () => {
    onUpdateFarmer(farmer.id, {
      status: 'OFFICER_ASSIGNED',
      assignedOfficer: selectedOfficer
    });
    setSuccessAlert(`Agri-Officer ${selectedOfficer} successfully assigned to ${farmer.name}!`);
    setTimeout(() => {
      setSuccessAlert('');
      onClose();
    }, 1500);
  };

  const handleSendBroadcast = () => {
    setSuccessAlert(`Voice & SMS Broadcast dispatched to ${farmer.phone}!`);
    setTimeout(() => {
      setSuccessAlert('');
      onClose();
    }, 1500);
  };

  const handleMarkResolved = () => {
    onUpdateFarmer(farmer.id, {
      status: 'RESOLVED',
      riskScore: 25,
      riskLevel: 'SAFE',
      assignedOfficer: selectedOfficer
    });
    setSuccessAlert(`Case marked as RESOLVED for ${farmer.name}. Risk status updated to SAFE.`);
    setTimeout(() => {
      setSuccessAlert('');
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="dispatch-modal-card">
        <div className="dispatch-modal-header">
          <div className="title-group">
            <ShieldCheck size={24} className="shield-icon" />
            <div>
              <h2>Agri-Officer Dispatch & Relief Action</h2>
              <p className="subtitle">Initiate immediate intervention for high-risk farmer</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {successAlert && (
          <div className="modal-success-banner">
            <CheckCircle2 size={18} />
            <span>{successAlert}</span>
          </div>
        )}

        <div className="farmer-summary-box">
          <div className="summary-col">
            <span className="label">Farmer Name</span>
            <strong className="val">{farmer.name}</strong>
          </div>
          <div className="summary-col">
            <span className="label">Village / District</span>
            <strong className="val">{farmer.village}, {farmer.district}</strong>
          </div>
          <div className="summary-col">
            <span className="label">Distress Risk Score</span>
            <span className={`risk-badge-mini ${farmer.riskLevel.toLowerCase()}`}>
              {farmer.riskScore} / 100 ({farmer.riskLevel})
            </span>
          </div>
        </div>

        {/* Form 1: Assign Officer */}
        <div className="dispatch-form-group">
          <label className="form-label">Assign Field Agriculture Extension Officer:</label>
          <div className="select-with-icon">
            <UserCheck size={18} className="icon" />
            <select 
              className="form-select"
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
            >
              {AGRI_OFFICERS.map(officer => (
                <option key={officer.id} value={officer.name}>
                  {officer.name} ({officer.designation})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Form 2: Broadcast Message */}
        <div className="dispatch-form-group">
          <label className="form-label">Regional Voice & SMS Broadcast Message:</label>
          <textarea 
            className="form-textarea"
            rows="3"
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
          ></textarea>
        </div>

        {/* Modal Actions */}
        <div className="dispatch-modal-footer">
          <button className="btn btn-assign" onClick={handleAssignOfficer}>
            <UserCheck size={16} />
            <span>Assign Officer & Dispatch Aid</span>
          </button>

          <button className="btn btn-broadcast" onClick={handleSendBroadcast}>
            <Send size={16} />
            <span>Send Voice/SMS Broadcast</span>
          </button>

          <button className="btn btn-resolve" onClick={handleMarkResolved}>
            <CheckCircle2 size={16} />
            <span>Mark Case Resolved</span>
          </button>
        </div>
      </div>
    </div>
  );
}
