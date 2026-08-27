import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import InterestsManager from '../src/components/InterestsManager';
import { getDoc, setDoc } from 'firebase/firestore';

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false))
}));

vi.mock('../src/lib/firebase', () => ({
  db: {}
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  getFirestore: vi.fn()
}));

// Mock ImageManagerModal since it has its own logic that we don't want to test deeply here
vi.mock('../src/components/ImageManagerModal', () => {
  return {
    default: ({ isOpen, onClose, onSelect }) => (
      isOpen ? (
        <div data-testid="mock-image-manager">
          <button onClick={() => onSelect('https://mock.com/image.jpg')} data-testid="mock-select-btn">Select Image</button>
          <button onClick={onClose} data-testid="mock-close-btn">Close</button>
        </div>
      ) : null
    )
  };
});

describe('InterestsManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially and then fetches interests', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        anilistUsername: 'testuser',
        games: [{ id: '1', title: 'Test Game', bannerUrl: '' }],
        anime: []
      })
    });

    render(<InterestsManager />);
    expect(screen.getByText(/Loading interests/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Game')).toBeInTheDocument();
    });
  });

  it('handles add and save', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        games: [],
        anime: []
      })
    });

    render(<InterestsManager />);
    await waitFor(() => {
      expect(screen.getByText('Gaming Showcase')).toBeInTheDocument();
    });

    const addBtn = screen.getByText('Add Game');
    fireEvent.click(addBtn);

    expect(screen.getByDisplayValue('New Game')).toBeInTheDocument();

    setDoc.mockResolvedValueOnce();

    const saveBtn = screen.getByText('Save Changes');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled();
    });
  });
});
