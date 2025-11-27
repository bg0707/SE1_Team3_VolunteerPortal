import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Auth.css';

const SKILLS_OPTIONS = [
  'Event Planning',
  'Teaching/Tutoring',
  'Administrative',
  'Healthcare',
  'Technology',
  'Construction',
  'Cooking/Food Service',
  'Driving/Transportation',
  'Fundraising',
  'Marketing/Communications',
  'Legal',
  'Counseling',
  'Languages',
  'Arts & Crafts',
  'Music',
  'Sports & Fitness',
];

const AVAILABILITY_OPTIONS = [
  'Weekday Mornings',
  'Weekday Afternoons',
  'Weekday Evenings',
  'Weekend Mornings',
  'Weekend Afternoons',
  'Weekend Evenings',
  'Flexible',
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Account Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    // Step 2: Profile Info (Volunteer)
    skills: [],
    availability: [],
    // Step 2: Profile Info (Organization)
    organizationName: '',
    description: '',
    address: '',
    phone: '',
    // Step 3: Agreement
    agreeToTerms: false,
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!formData.password) {
        errors.password = 'Password is required';
      } else {
        // Password strength validation
        const passwordErrors = [];
        if (formData.password.length < 8) {
          passwordErrors.push('at least 8 characters');
        }
        if (!/[A-Z]/.test(formData.password)) {
          passwordErrors.push('one uppercase letter');
        }
        if (!/[a-z]/.test(formData.password)) {
          passwordErrors.push('one lowercase letter');
        }
        if (!/[0-9]/.test(formData.password)) {
          passwordErrors.push('one number');
        }
        if (passwordErrors.length > 0) {
          errors.password = `Password must contain ${passwordErrors.join(', ')}`;
        }
      }
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.role) {
        errors.role = 'Please select a role';
      }
    }

    if (step === 2) {
      if (formData.role === 'volunteer') {
        if (formData.skills.length === 0) {
          errors.skills = 'Please select at least one skill';
        }
        if (formData.availability.length === 0) {
          errors.availability = 'Please select your availability';
        }
      } else if (formData.role === 'organization') {
        if (!formData.organizationName.trim()) {
          errors.organizationName = 'Organization name is required';
        }
        if (!formData.description.trim()) {
          errors.description = 'Description is required';
        }
        if (!formData.address.trim()) {
          errors.address = 'Address is required';
        }
        if (!formData.phone.trim()) {
          errors.phone = 'Phone number is required';
        } else if (!/^[0-9+\-() ]{10,}$/.test(formData.phone)) {
          errors.phone = 'Please enter a valid phone number';
        }
      }
    }

    if (step === 3) {
      if (!formData.agreeToTerms) {
        errors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
    
    if (error) {
      clearError();
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
    if (validationErrors.skills) {
      setValidationErrors((prev) => ({ ...prev, skills: '' }));
    }
  };

  const handleAvailabilityToggle = (availability) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter((a) => a !== availability)
        : [...prev.availability, availability],
    }));
    if (validationErrors.availability) {
      setValidationErrors((prev) => ({ ...prev, availability: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      navigate('/verification-pending');
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator" aria-label="Registration progress">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
        >
          <div className="step-number">
            {currentStep > step ? (
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              step
            )}
          </div>
          <span className="step-label">
            {step === 1 ? 'Account' : step === 2 ? 'Profile' : 'Review'}
          </span>
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <>
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`form-input ${validationErrors.firstName ? 'input-error' : ''}`}
            placeholder="First name"
            autoComplete="given-name"
          />
          {validationErrors.firstName && (
            <p className="field-error">{validationErrors.firstName}</p>
          )}
        </div>
        <div className="form-group half">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`form-input ${validationErrors.lastName ? 'input-error' : ''}`}
            placeholder="Last name"
            autoComplete="family-name"
          />
          {validationErrors.lastName && (
            <p className="field-error">{validationErrors.lastName}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
          placeholder="Enter your email"
          autoComplete="email"
        />
        {validationErrors.email && (
          <p className="field-error">{validationErrors.email}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`form-input ${validationErrors.password ? 'input-error' : ''}`}
          placeholder="Create a password"
          autoComplete="new-password"
        />
        <p className="field-hint">
          Must be at least 8 characters with uppercase, lowercase, and number
        </p>
        {validationErrors.password && (
          <p className="field-error">{validationErrors.password}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`form-input ${validationErrors.confirmPassword ? 'input-error' : ''}`}
          placeholder="Confirm your password"
          autoComplete="new-password"
        />
        {validationErrors.confirmPassword && (
          <p className="field-error">{validationErrors.confirmPassword}</p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">I want to register as</label>
        <div className="role-selector">
          <button
            type="button"
            className={`role-card ${formData.role === 'volunteer' ? 'selected' : ''}`}
            onClick={() => handleChange({ target: { name: 'role', value: 'volunteer' } })}
          >
            <div className="role-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3>Volunteer</h3>
            <p>Find and join volunteer opportunities</p>
          </button>
          <button
            type="button"
            className={`role-card ${formData.role === 'organization' ? 'selected' : ''}`}
            onClick={() => handleChange({ target: { name: 'role', value: 'organization' } })}
          >
            <div className="role-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
              </svg>
            </div>
            <h3>Organization</h3>
            <p>Post opportunities and find volunteers</p>
          </button>
        </div>
        {validationErrors.role && (
          <p className="field-error">{validationErrors.role}</p>
        )}
      </div>
    </>
  );

  const renderStep2Volunteer = () => (
    <>
      <div className="form-group">
        <label className="form-label">Skills & Interests</label>
        <p className="field-hint">Select all that apply</p>
        <div className="tags-container">
          {SKILLS_OPTIONS.map((skill) => (
            <button
              key={skill}
              type="button"
              className={`tag ${formData.skills.includes(skill) ? 'selected' : ''}`}
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
        {validationErrors.skills && (
          <p className="field-error">{validationErrors.skills}</p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Availability</label>
        <p className="field-hint">When are you typically available?</p>
        <div className="tags-container">
          {AVAILABILITY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`tag ${formData.availability.includes(option) ? 'selected' : ''}`}
              onClick={() => handleAvailabilityToggle(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {validationErrors.availability && (
          <p className="field-error">{validationErrors.availability}</p>
        )}
      </div>
    </>
  );

  const renderStep2Organization = () => (
    <>
      <div className="form-group">
        <label htmlFor="organizationName" className="form-label">Organization Name</label>
        <input
          type="text"
          id="organizationName"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          className={`form-input ${validationErrors.organizationName ? 'input-error' : ''}`}
          placeholder="Enter your organization's name"
        />
        {validationErrors.organizationName && (
          <p className="field-error">{validationErrors.organizationName}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`form-input form-textarea ${validationErrors.description ? 'input-error' : ''}`}
          placeholder="Describe your organization's mission and activities"
          rows="4"
        />
        {validationErrors.description && (
          <p className="field-error">{validationErrors.description}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="address" className="form-label">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`form-input ${validationErrors.address ? 'input-error' : ''}`}
          placeholder="Enter your organization's address"
        />
        {validationErrors.address && (
          <p className="field-error">{validationErrors.address}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`form-input ${validationErrors.phone ? 'input-error' : ''}`}
          placeholder="(123) 456-7890"
          autoComplete="tel"
        />
        {validationErrors.phone && (
          <p className="field-error">{validationErrors.phone}</p>
        )}
      </div>
    </>
  );

  const renderStep3 = () => (
    <div className="review-section">
      <h3 className="review-title">Review Your Information</h3>
      
      <div className="review-group">
        <h4>Account Details</h4>
        <div className="review-item">
          <span className="review-label">Name:</span>
          <span className="review-value">{formData.firstName} {formData.lastName}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Email:</span>
          <span className="review-value">{formData.email}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Role:</span>
          <span className="review-value capitalize">{formData.role}</span>
        </div>
      </div>

      {formData.role === 'volunteer' && (
        <div className="review-group">
          <h4>Profile Details</h4>
          <div className="review-item">
            <span className="review-label">Skills:</span>
            <span className="review-value">{formData.skills.join(', ')}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Availability:</span>
            <span className="review-value">{formData.availability.join(', ')}</span>
          </div>
        </div>
      )}

      {formData.role === 'organization' && (
        <div className="review-group">
          <h4>Organization Details</h4>
          <div className="review-item">
            <span className="review-label">Organization:</span>
            <span className="review-value">{formData.organizationName}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Description:</span>
            <span className="review-value">{formData.description}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Address:</span>
            <span className="review-value">{formData.address}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Phone:</span>
            <span className="review-value">{formData.phone}</span>
          </div>
        </div>
      )}

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="checkbox-input"
          />
          <span className="checkbox-text">
            I agree to the{' '}
            <a href="/terms" className="auth-link" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="auth-link" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </span>
        </label>
        {validationErrors.agreeToTerms && (
          <p className="field-error">{validationErrors.agreeToTerms}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the Volunteer Portal community</p>
        </div>

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error" role="alert">
              <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && formData.role === 'volunteer' && renderStep2Volunteer()}
          {currentStep === 2 && formData.role === 'organization' && renderStep2Organization()}
          {currentStep === 3 && renderStep3()}

          <div className="button-group">
            {currentStep > 1 && (
              <button
                type="button"
                className="auth-button secondary"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                className="auth-button"
                onClick={handleNext}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            )}
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
