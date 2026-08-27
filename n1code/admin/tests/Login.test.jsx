import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import Login from '../src/pages/Login';

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false))
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn((auth, email, pw) => {
    if (email === 'fail@test.com') return Promise.reject(new Error('Invalid credentials'));
    return Promise.resolve({ user: { email } });
  })
}));

describe('Login Page', () => {
  it('renders login form', () => {
    const { container } = render(<BrowserRouter><Login /></BrowserRouter>);
    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
  });

  it('shows error on failed login', async () => {
    const { container } = render(<BrowserRouter><Login /></BrowserRouter>);
    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'fail@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Failed to sign in/i)).toBeInTheDocument();
    });
  });
});
