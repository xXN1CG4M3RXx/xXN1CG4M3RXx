import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router';
import App from '../src/App';
import { act } from 'react';

// Mock Firebase
vi.mock('../src/lib/firebase', () => ({
  db: {},
  app: {},
  analytics: {}
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => true, data: () => ({}) })),
  increment: vi.fn()
}));
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false))
}));

// Mock fetch
global.fetch = vi.fn((url) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  });
});

const pages = ['/', '/projects', '/skills', '/setup', '/interests', '/contact'];

describe('E2E Page Renders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  pages.forEach((page) => {
    it(`renders ${page} without crashing`, async () => {
      await act(async () => {
        render(
          <MemoryRouter initialEntries={[page]}>
            <App />
          </MemoryRouter>
        );
      });
      
      // Basic assertion to ensure the DOM is not empty
      expect(document.body.innerHTML).not.toBe('');
      
      // Ensure there are no Error boundaries triggered (if any were present)
      const errorBoundaryText = screen.queryByText(/Something went wrong/i);
      expect(errorBoundaryText).not.toBeInTheDocument();
    });
  });
});
