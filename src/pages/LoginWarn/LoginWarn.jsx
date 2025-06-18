import React, { useContext, useState } from 'react';
import { Shield, AlertCircle, X, Lock } from 'lucide-react';
import './LoginWarn.css'
import SignInPopup from '../../components/SignInPopup/SignInPopup';

export default function LoginWarn() {

  return (
    <div className="warning-container">
      <div className="warning-card">
        {/* Header */}
        <div className="card-header">
          <div className="header-content">
            <div className="header-left">
              <div className="icon-container">
                <Shield className="shield-icon" />
              </div>
              <div className="title-section">
                <h3 className="main-title">Admin Access Required</h3>
                <p className="subtitle">Authorized Personnel Only</p>
              </div>
            </div>

          </div>
        </div>

        {/* Warning Content */}
        <div className="card-content">
          <div className="warning-section">
            <div className="alert-icon-container">
              <AlertCircle className="alert-icon" />
            </div>
            <div className="warning-text">
              <h4 className="warning-title">Security Notice</h4>
              <p className="warning-description">
                You are attempting to access the administrative control panel. This area contains 
                sensitive system configurations and user data. Unauthorized access is strictly 
                prohibited and monitored.
              </p>
            </div>
          </div>

          {/* Security Features */}
          <div className="security-features">
            <div className="features-header">
              <Lock className="lock-icon" />
              <span className="features-title">Security Features Active</span>
            </div>
            <ul className="features-list">
              <li>• Session monitoring and logging</li>
              <li>• Multi-factor authentication required</li>
              <li>• Activity audit trail maintained</li>
              <li>• Automatic timeout after inactivity</li>
            </ul>
          </div>

          {/* Action Button */}
          {/* <div className="action-section">
            <button 
              onClick={() => setIsVisible(false)}
              className="understand-button"
            >
              I Understand
            </button>
          </div> */}
          <SignInPopup/>

        </div>

        {/* Footer */}
        <div className="card-footer">
          <p className="footer-text">
            All administrative actions are logged and monitored for security purposes
          </p>
        </div>
      </div>


    </div>
  );
}