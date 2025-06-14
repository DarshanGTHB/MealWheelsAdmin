import React, { useState } from 'react';
import { Shield, AlertCircle, X, Lock } from 'lucide-react';

export default function LoginWarn() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <div className="demo-container">
        <button 
          onClick={() => setIsVisible(true)}
          className="show-button"
        >
          Show Admin Warning
        </button>
        <style jsx>{`
          .demo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          }
          
          .show-button {
            padding: 12px 24px;
            background: #475569;
            color: white;
            border: none;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          
          .show-button:hover {
            background: #334155;
          }
        `}</style>
      </div>
    );
  }

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
            <button 
              onClick={() => setIsVisible(false)}
              className="close-button"
            >
              <X className="close-icon" />
            </button>
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
          <div className="action-section">
            <button 
              onClick={() => setIsVisible(false)}
              className="understand-button"
            >
              I Understand
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer">
          <p className="footer-text">
            All administrative actions are logged and monitored for security purposes
          </p>
        </div>
      </div>

      <style jsx>{`
        .warning-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .warning-card {
          position: relative;
          max-width: 520px;
          width: 100%;
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          padding: 24px;
          border-bottom: 3px solid #f97316;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .icon-container {
          background: #f97316;
          border-radius: 8px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shield-icon {
          width: 24px;
          height: 24px;
          color: white;
        }

        .title-section {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .main-title {
          color: white;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .subtitle {
          color: #cbd5e1;
          font-size: 14px;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.1);
        }

        .close-icon {
          width: 20px;
          height: 20px;
        }

        .card-content {
          padding: 24px;
        }

        .warning-section {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 24px;
        }

        .alert-icon-container {
          background: #fff7ed;
          border-radius: 8px;
          padding: 8px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .alert-icon {
          width: 20px;
          height: 20px;
          color: #ea580c;
        }

        .warning-text {
          flex: 1;
        }

        .warning-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .warning-description {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          margin: 0;
        }

        .security-features {
          background: #f8fafc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .features-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .lock-icon {
          width: 16px;
          height: 16px;
          color: #64748b;
        }

        .features-title {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 0 24px;
        }

        .features-list li {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .features-list li:last-child {
          margin-bottom: 0;
        }

        .action-section {
          display: flex;
          justify-content: center;
        }

        .understand-button {
          padding: 12px 32px;
          background: #f1f5f9;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .understand-button:hover {
          background: #e2e8f0;
          transform: scale(1.02);
        }

        .understand-button:active {
          transform: scale(0.98);
        }

        .card-footer {
          background: #f8fafc;
          padding: 12px 24px;
          border-top: 1px solid #e2e8f0;
        }

        .footer-text {
          font-size: 12px;
          color: #64748b;
          text-align: center;
          margin: 0;
        }

        @media (max-width: 640px) {
          .warning-container {
            padding: 16px;
          }
          
          .card-header {
            padding: 20px;
          }
          
          .card-content {
            padding: 20px;
          }
          
          .main-title {
            font-size: 16px;
          }
          
          .subtitle {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}