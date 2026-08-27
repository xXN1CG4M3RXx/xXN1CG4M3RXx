import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ProjectManager from '../src/components/ProjectManager';
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

describe('ProjectManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially and then fetches projects', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        list: [{ id: '1', title: 'Test Project', tags: ['React'] }]
      })
    });

    render(<ProjectManager />);
    expect(screen.getByText(/Loading projects/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
    });
  });

  it('handles add project and save', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        list: []
      })
    });

    render(<ProjectManager />);
    await waitFor(() => {
      expect(screen.getByText('Project Showcase')).toBeInTheDocument();
    });

    const addBtn = screen.getByText('Add Project');
    fireEvent.click(addBtn);

    expect(screen.getByDisplayValue('New Project')).toBeInTheDocument();

    setDoc.mockResolvedValueOnce();

    const saveBtn = screen.getByText('Save Changes');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled();
    });
  });
});
