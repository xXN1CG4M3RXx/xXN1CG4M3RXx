import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SkillsManager from '../src/components/SkillsManager';
import { getDoc, setDoc } from 'firebase/firestore';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('../src/lib/firebase', () => ({
  db: {}
}));

vi.mock('../src/components/IconPickerModal', () => ({
  default: ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="icon-modal">
        <button onClick={() => onSelect('react')}>Select React Icon</button>
        <button onClick={onClose}>Close Icon Modal</button>
      </div>
    );
  }
}));

describe('SkillsManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially and then loads skills', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        list: [
          { id: '1', name: 'JavaScript', icon: 'js', category: 'Language', proficiency: 'Expert' }
        ]
      })
    });

    render(<SkillsManager />);
    expect(screen.getByText('Loading skills...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading skills...')).not.toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument();
  });

  it('can add a new skill', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ list: [] })
    });

    render(<SkillsManager />);

    await waitFor(() => {
      expect(screen.getByText('+ Add Skill')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('+ Add Skill'));
    
    expect(screen.getByDisplayValue('New Skill')).toBeInTheDocument();
  });

  it('can delete a skill', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        list: [
          { id: '1', name: 'JavaScript', icon: 'js', category: 'Language', proficiency: 'Expert' }
        ]
      })
    });

    render(<SkillsManager />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTitle('Delete skill');
    fireEvent.click(deleteButton);

    expect(screen.queryByDisplayValue('JavaScript')).not.toBeInTheDocument();
  });

  it('saves skills', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        list: [
          { id: '1', name: 'JavaScript', icon: 'js', category: 'Language', proficiency: 'Expert' }
        ]
      })
    });
    setDoc.mockResolvedValueOnce();

    render(<SkillsManager />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue('JavaScript'), { target: { value: 'TypeScript' } });
    
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled();
    });
    expect(screen.getByText('Changes saved successfully!')).toBeInTheDocument();
  });
  
  it('handles save error', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ list: [] })
    });
    setDoc.mockRejectedValueOnce(new Error('Save failed'));

    render(<SkillsManager />);

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.getByText('Failed to save skills. Check console.')).toBeInTheDocument();
    });
  });
});
