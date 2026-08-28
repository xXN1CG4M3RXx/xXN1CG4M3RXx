import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import App from '../src/App';
import { act } from 'react';

// Mock Firebase
vi.mock('../src/lib/firebase', () => ({
  db: {},
  app: {},
  auth: { currentUser: { uid: '123' }, onAuthStateChanged: vi.fn((cb) => cb({ uid: '123' })) }
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => true, data: () => ({}) })),
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] }))
}));
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false))
}));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, cb) => { cb({uid: "123"}); return () => {}; }), signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn()
}));

// Mock fetch
global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

const pages = ['/', '/login'];

describe('Admin E2E Page Renders', () => {
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
      
      expect(document.body.innerHTML).not.toBe('');
      const errorBoundaryText = screen.queryByText(/Something went wrong/i);
      expect(errorBoundaryText).not.toBeInTheDocument();
    });
  });
});
