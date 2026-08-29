import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  MapPin, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  FileBadge
} from 'lucide-react';
import { DISTRICTS } from '../../data/mockData';
import './AdminAuth.css';

export default function AdminAuth({ onLoginSuccess, onBackToHome }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('District Agriculture Collector');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpOfficerId, setSignUpOfficerId] = useState('');
  const [signUpDistrict, setSignUpDistrict] = useState(DISTRICTS[0]?.id || 'ludhiana');
  const [signUpRole, setSignUpRole] = useState('District Agriculture Collector');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Form Submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess();
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (signUpPassword !== signUpConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreedTerms) {
      alert("Please acknowledge government security clearance terms.");
      return;
    }
    onLoginSuccess();
  };

  // Quick Demo Fill
  const fillDemoLogin = () => {
    setLoginEmail('dr.rsharma@krishirakshak.gov.in');
    setLoginPassword('AdminPass2026!');
    setLoginRole('District Agriculture Collector');
  };

  const fillDemoSignUp = () => {
    setSignUpName('Dr. Ramesh Sharma');
    setSignUpEmail('dr.rsharma@krishirakshak.gov.in');
    setSignUpOfficerId('AGRI-OFF-8842');
    setSignUpDistrict('ludhiana');
    setSignUpRole('District Agriculture Collector');
    setSignUpPassword('AdminPass2026!');
    setSignUpConfirmPassword('AdminPass2026!');
    setAgreedTerms(true);
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        {/* Return to Landing Page */}
        <button className="auth-back-btn" onClick={onBackToHome} title="Return to Landing Page">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        {/* Header Badge */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <ShieldCheck size={16} />
            <span>OFFICIAL ADMIN PORTAL</span>
          </div>
          <h1>KrishiRakshak Command</h1>
          <p>Early-Warning & Distress Action Router Authorization</p>
        </div>

        {/* Auth Toggle Tabs */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
          <button 
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            New Registration
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Official Email / Officer ID</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email"
                  className="auth-input"
                  placeholder="officer@krishirakshak.gov.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Role / Designation</label>
              <div className="input-wrapper">
                <Building2 size={18} className="input-icon" />
                <select 
                  className="auth-select"
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                >
                  <option value="District Agriculture Collector">District Agriculture Collector</option>
                  <option value="Chief Extension Officer">Chief Extension Officer</option>
                  <option value="Nodal Distress Specialist">Nodal Distress Specialist</option>
                  <option value="Emergency Action Dispatcher">Emergency Action Dispatcher</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Authorization Key / Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password"
                  className="auth-input"
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-options">
              <label className="remember-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember session</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please contact District Nodal Admin to reset official security credentials."); }} className="forgot-link">
                Forgot Access Key?
              </a>
            </div>

            <button type="submit" className="auth-submit-btn">
              <span>Log In to Dashboard</span>
              <ArrowRight size={18} />
            </button>

            <div className="demo-fill-divider">
              <span>OR</span>
            </div>

            <button type="button" className="demo-fill-btn" onClick={fillDemoLogin}>
              <Sparkles size={16} />
              <span>Auto-Fill Demo Admin Credentials</span>
            </button>

            <p className="auth-footer-text">
              Don't have an officer profile?{' '}
              <span onClick={() => setActiveTab('signup')}>Register Admin Account</span>
            </p>
          </form>
        )}

        {/* SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form className="auth-form" onSubmit={handleSignUpSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Officer Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text"
                    className="auth-input"
                    placeholder="Dr. R. Sharma"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Officer ID / Badge</label>
                <div className="input-wrapper">
                  <FileBadge size={18} className="input-icon" />
                  <input 
                    type="text"
                    className="auth-input"
                    placeholder="AGRI-OFF-8842"
                    value={signUpOfficerId}
                    onChange={(e) => setSignUpOfficerId(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Official Govt Email</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email"
                  className="auth-input"
                  placeholder="name@gov.in or name@krishirakshak.gov.in"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Assigned Jurisdiction</label>
                <div className="input-wrapper">
                  <MapPin size={18} className="input-icon" />
                  <select 
                    className="auth-select"
                    value={signUpDistrict}
                    onChange={(e) => setSignUpDistrict(e.target.value)}
                  >
                    {DISTRICTS.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Designation Role</label>
                <div className="input-wrapper">
                  <Building2 size={18} className="input-icon" />
                  <select 
                    className="auth-select"
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value)}
                  >
                    <option value="District Agriculture Collector">District Collector</option>
                    <option value="Chief Extension Officer">Chief Officer</option>
                    <option value="Nodal Distress Specialist">Nodal Specialist</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type="password"
                    className="auth-input"
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type="password"
                    className="auth-input"
                    placeholder="••••••••"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                required
              />
              <span>I confirm official credentials & security clearance protocols</span>
            </label>

            <button type="submit" className="auth-submit-btn">
              <CheckCircle2 size={18} />
              <span>Create Admin Account</span>
            </button>

            <div className="demo-fill-divider">
              <span>OR</span>
            </div>

            <button type="button" className="demo-fill-btn" onClick={fillDemoSignUp}>
              <Sparkles size={16} />
              <span>Auto-Fill Demo Registration</span>
            </button>

            <p className="auth-footer-text">
              Already have an account?{' '}
              <span onClick={() => setActiveTab('login')}>Log In here</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
