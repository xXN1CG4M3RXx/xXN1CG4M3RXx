import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LinktreeManager from '../src/components/LinktreeManager';
import { getDoc, setDoc } from 'firebase/firestore';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('../src/lib/firebase', () => ({
  db: {}
}));

vi.mock('../src/components/ImageManagerModal', () => ({
  default: ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="image-modal">
        <button onClick={() => onSelect('https://test.com/new-image.png')}>Confirm Mock Image</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }
}));

vi.mock('../src/components/IconPickerModal', () => ({
  default: ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="icon-modal">
        <button onClick={() => onSelect('twitter')}>Select Twitter Icon</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }
}));

vi.mock('../src/lib/IconRegistry', () => ({
  getIconComponent: () => () => <svg data-testid="mock-icon" />
}));

describe('LinkTreeManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading initially and then loads profile data', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        username: "testuser",
        bio: "Test bio",
        avatarUrl: "",
        accentColor: "#00ccff",
        textColor: "#00ccff",
        glowEnabled: true,
        background: { type: "solid", color1: "#000", opacity: 100 },
        pageBackground: { type: "color", color1: "#111" },
        links: []
      })
    });

    render(<LinktreeManager />);
    expect(screen.getByText('Loading profile data...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading profile data...')).not.toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
  });

  it('handles image selection for avatar', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false
    });

    render(<LinktreeManager />);

    await waitFor(() => {
      expect(screen.getByText('Linktree Settings')).toBeInTheDocument();
    });

    const selectButtons = screen.getAllByText('Select Image');
    fireEvent.click(selectButtons[0]); // First one is avatar

    expect(screen.getByTestId('image-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Confirm Mock Image', { selector: 'button' }));

    expect(screen.getByDisplayValue('https://test.com/new-image.png')).toBeInTheDocument();
  });

  it('can add and remove links', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        username: "test",
        background: { type: "solid" },
        pageBackground: { type: "color" },
        links: []
      })
    });

    render(<LinktreeManager />);

    await waitFor(() => {
      expect(screen.getByText('Linktree Settings')).toBeInTheDocument();
    });

    expect(screen.getByText('No social icons added yet.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('+ Add Icon'));
    
    expect(screen.queryByText('No social icons added yet.')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('New Link')).toBeInTheDocument();

    const deleteButton = screen.getByText('✕');
    fireEvent.click(deleteButton);

    expect(screen.getByText('No social icons added yet.')).toBeInTheDocument();
  });

  it('saves profile successfully', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false
    });
    setDoc.mockResolvedValueOnce();

    render(<LinktreeManager />);

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled();
    });
    expect(screen.getByText('Changes saved successfully!')).toBeInTheDocument();
  });
});
