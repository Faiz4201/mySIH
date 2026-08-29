import { useState } from 'react';
import './farmer.css';

export default function FarmerSignUp({ onLoginSuccess, onBackToHome }) {
  const [activeTab, setActiveTab] = useState('signup');
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: '',
    farmerPasscode: '',
    otp: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = () => {
    if (!formData.mobileNumber) {
      alert('Please enter a valid phone number.');
      return;
    }
    setOtpSent(true);
    alert('OTP sent to ' + formData.mobileNumber);
  };

  const handleAutoFillDemo = () => {
    setFormData({
      mobileNumber: '9876543210',
      farmerPasscode: 'Farmer123!',
      otp: '482910',
    });
    setOtpSent(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent && activeTab === 'signup') {
      alert('Please request an OTP first.');
      return;
    }
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      alert('Registration/Login complete!');
    }
  };

  return (
    <div className="farmer-auth-container">
      <div className="farmer-auth-card">
        {/* Top Navigation / Back Button */}
        <div className="auth-header-top">
          <button className="btn-back" type="button" onClick={onBackToHome}>← Back to Home</button>
        </div>

        {/* Header Badge & Title */}
        <div className="auth-brand-section">
          <div className="badge-official">🌾 OFFICIAL FARMER PORTAL</div>
          <h1 className="auth-title">KrishiRakshak Portal</h1>
          <p className="auth-subtitle">
            Farmer Advisory & Market Intelligence Registration
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            New Registration
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Phone Number Field */}
          <div className="form-group">
            <label className="form-label">PHONE NUMBER / मोबाइल नंबर</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">📱</span>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="9876543210"
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">PASSWORD / पासवर्ड</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="farmerPasscode"
                value={formData.farmerPasscode}
                onChange={handleChange}
                placeholder="••••••••••••"
                required
                className="form-input"
              />
            </div>
          </div>

          {/* OTP Field with Request/Resend Trigger */}
          <div className="form-group">
            <div className="label-row">
              <label className="form-label">ENTER OTP / ओटीपी दर्ज करें</label>
              <button
                type="button"
                className="btn-otp-action"
                onClick={handleSendOtp}
              >
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            </div>
            <div className="input-icon-wrapper">
              <span className="input-icon">🔑</span>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                required
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Verify OTP & Register →
          </button>
        </form>

        <div className="divider-or">
          <span>OR</span>
        </div>

        {/* Demo Auto-Fill Button */}
        <button
          type="button"
          className="btn-autofill"
          onClick={handleAutoFillDemo}
        >
          ✨ Auto-Fill Demo Credentials & OTP
        </button>

        <div className="auth-footer-text">
          Already registered?{' '}
          <span
            className="link-highlight"
            onClick={() => setActiveTab('login')}
          >
            Log In to Farmer Panel
          </span>
        </div>
      </div>
    </div>
  );
}