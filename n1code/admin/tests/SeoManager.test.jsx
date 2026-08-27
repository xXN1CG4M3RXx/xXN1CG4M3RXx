import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import SeoManager from '../src/components/SeoManager';
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
        <button onClick={() => onSelect('https://test.com/image.png')}>Select Image</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }
}));

describe('SeoManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('renders loading state initially and then loads seo data', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        title: "My Portfolio",
        description: "Test description",
        ogImage: "https://test.com/og.png",
        themeColor: "#ffffff",
        buildHookUrl: ""
      })
    });

    render(<SeoManager />);
    expect(screen.getByText('Loading SEO settings...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading SEO settings...')).not.toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('My Portfolio')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('saves seo data successfully', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false
    });
    setDoc.mockResolvedValueOnce();

    render(<SeoManager />);

    await waitFor(() => {
      expect(screen.getByText('Save & Publish')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('e.g. Nico\'s Portfolio'), { target: { value: 'New Title' } });
    
    fireEvent.click(screen.getByText('Save & Publish'));

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled();
    });
    expect(screen.getByText('SEO settings saved successfully!')).toBeInTheDocument();
  });

  it('saves seo data and calls build hook if provided', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        title: "Title",
        buildHookUrl: "https://api.netlify.com/build_hooks/123"
      })
    });
    setDoc.mockResolvedValueOnce();
    
    global.fetch.mockResolvedValueOnce({ ok: true });

    render(<SeoManager />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://api.netlify.com/build_hooks/123')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save & Publish'));

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith('https://api.netlify.com/build_hooks/123', { method: 'POST' });
    });
    expect(screen.getByText('SEO settings saved successfully! Site rebuild triggered successfully.')).toBeInTheDocument();
  });

  it('handles build hook failure', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        title: "Title",
        buildHookUrl: "https://api.netlify.com/build_hooks/123"
      })
    });
    setDoc.mockResolvedValueOnce();
    
    global.fetch.mockResolvedValueOnce({ ok: false });

    render(<SeoManager />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://api.netlify.com/build_hooks/123')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save & Publish'));

    await waitFor(() => {
      expect(screen.getByText('SEO settings saved successfully! However, the build hook failed to trigger.')).toBeInTheDocument();
    });
  });

  it('handles image selection from modal', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false
    });

    render(<SeoManager />);

    await waitFor(() => {
      expect(screen.getByText('Browse Library')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Browse Library'));
    
    expect(screen.getByTestId('image-modal')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Select Image'));

    expect(screen.getByDisplayValue('https://test.com/image.png')).toBeInTheDocument();
  });
});
