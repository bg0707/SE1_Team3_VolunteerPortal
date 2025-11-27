import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../components/auth/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPassword from '../components/auth/ForgotPassword';
import App from '../App';

// Helper function to render with providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });
});

describe('LoginForm Component', () => {
  test('renders login form with email and password fields', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows validation error when submitting empty form', async () => {
    renderWithProviders(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    renderWithProviders(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('has link to forgot password page', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
  });

  test('has link to register page', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByText(/create one here/i)).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    renderWithProviders(<LoginForm />);
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    fireEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});

describe('RegisterForm Component', () => {
  test('renders step 1 of registration form', () => {
    renderWithProviders(<RegisterForm />);
    
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  test('shows role selection options', () => {
    renderWithProviders(<RegisterForm />);
    
    // Check for role selector heading elements
    expect(screen.getByRole('heading', { name: /volunteer/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /organization/i })).toBeInTheDocument();
  });

  test('validates password strength requirements', async () => {
    renderWithProviders(<RegisterForm />);
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText(/password must contain/i)).toBeInTheDocument();
    });
  });

  test('validates password confirmation match', async () => {
    renderWithProviders(<RegisterForm />);
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(passwordInput, { target: { value: 'StrongPass1' } });
    fireEvent.change(confirmInput, { target: { value: 'DifferentPass1' } });
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('has link to login page', () => {
    renderWithProviders(<RegisterForm />);
    
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });
});

describe('ForgotPassword Component', () => {
  test('renders forgot password form', () => {
    renderWithProviders(<ForgotPassword />);
    
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  test('shows validation error for empty email', async () => {
    renderWithProviders(<ForgotPassword />);
    
    const submitButton = screen.getByRole('button', { name: /send reset link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    renderWithProviders(<ForgotPassword />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /send reset link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('has link back to login', () => {
    renderWithProviders(<ForgotPassword />);
    
    expect(screen.getByText(/back to sign in/i)).toBeInTheDocument();
  });
});
