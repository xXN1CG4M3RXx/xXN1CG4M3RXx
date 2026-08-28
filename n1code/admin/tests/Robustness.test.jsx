import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Dashboard from '../src/pages/Dashboard';
import InterestsManager from '../src/components/InterestsManager';
import ProjectManager from '../src/components/ProjectManager';
import InboxManager from '../src/components/InboxManager';
import LinktreeManager from '../src/components/LinktreeManager';
import SeoManager from '../src/components/SeoManager';
import SetupManager from '../src/components/SetupManager';
import SkillsManager from '../src/components/SkillsManager';
import { act } from 'react';

// Mock Firebase
vi.mock('../src/lib/firebase', () => ({
  db: {},
  app: {},
  auth: { currentUser: { uid: '123' }, onAuthStateChanged: vi.fn((cb) => { cb({ uid: '123' }); return () => {}; }) }
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => true, data: () => ({}) })),
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn()
}));
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false))
}));
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn()
}));

global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

const components = [
  { name: 'Dashboard', Component: Dashboard },
  { name: 'InterestsManager', Component: InterestsManager },
  { name: 'ProjectManager', Component: ProjectManager },
  { name: 'InboxManager', Component: InboxManager },
  { name: 'LinktreeManager', Component: LinktreeManager },
  { name: 'SeoManager', Component: SeoManager },
  { name: 'SetupManager', Component: SetupManager },
  { name: 'SkillsManager', Component: SkillsManager }
];

describe('Robustness Empty Data Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  components.forEach(({ name, Component }) => {
    it(`renders ${name} without crashing on empty data`, async () => {
      await act(async () => {
        render(<MemoryRouter><Component /></MemoryRouter>);
      });
      expect(document.body.innerHTML).not.toBe('');
    });
  });
});
