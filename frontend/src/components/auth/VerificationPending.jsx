import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Auth.css';

const VerificationPending = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isOrganization = user?.role === 'organization';

  return (
    <div className="auth-container">
      <div className="auth-card verification-card">
        <div className="auth-header">
          <div className="pending-icon-container">
            <svg className="pending-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h1 className="auth-title">Verification Pending</h1>
          <p className="auth-subtitle">
            {isOrganization
              ? 'Your organization registration is being reviewed'
              : 'Your account is pending verification'}
          </p>
        </div>

        <div className="verification-content">
          {isOrganization ? (
            <>
              <div className="info-box">
                <h3>What happens next?</h3>
                <ol className="steps-list">
                  <li>
                    <span className="step-marker">1</span>
                    <div>
                      <strong>Review Process</strong>
                      <p>Our team will review your organization's information and documentation.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-marker">2</span>
                    <div>
                      <strong>Verification</strong>
                      <p>We may contact you for additional information if needed.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-marker">3</span>
                    <div>
                      <strong>Approval</strong>
                      <p>Once approved, you'll receive an email notification and can start posting opportunities.</p>
                    </div>
                  </li>
                </ol>
              </div>
              <p className="timeline-note">
                This process typically takes 1-3 business days.
              </p>
            </>
          ) : (
            <>
              <div className="info-box">
                <h3>What happens next?</h3>
                <ol className="steps-list">
                  <li>
                    <span className="step-marker">1</span>
                    <div>
                      <strong>Email Verification</strong>
                      <p>Check your email for a verification link.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-marker">2</span>
                    <div>
                      <strong>Click the Link</strong>
                      <p>Click the verification link in the email to activate your account.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-marker">3</span>
                    <div>
                      <strong>Start Volunteering</strong>
                      <p>Once verified, you can browse and apply for volunteer opportunities.</p>
                    </div>
                  </li>
                </ol>
              </div>
              <p className="timeline-note">
                Didn't receive the email? Check your spam folder or contact support.
              </p>
            </>
          )}
        </div>

        <div className="verification-actions">
          <a
            href="mailto:support@volunteerportal.com"
            className="auth-button secondary"
          >
            Contact Support
          </a>
          <button
            type="button"
            className="auth-button outline"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
