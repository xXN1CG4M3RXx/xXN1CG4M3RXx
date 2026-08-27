import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import SetupManager from '../src/components/SetupManager';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({
    exists: () => true,
    data: () => ({ gamingPc: [{ id: '1', name: 'Setup PC', spec: 'test' }] })
  })),
  setDoc: vi.fn(),
  getFirestore: vi.fn()
}));
vi.mock('../src/lib/firebase', () => ({
  db: {}
}));

describe('SetupManager', () => {
  it('renders correctly', async () => {
    render(<SetupManager />);
    expect(await screen.findByDisplayValue(/Setup PC/i)).toBeInTheDocument();
  });
});
