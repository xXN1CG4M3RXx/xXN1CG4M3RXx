import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import InboxManager from '../src/components/InboxManager';
import { getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false))
}));

vi.mock('../src/lib/firebase', () => ({
  db: {}
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn(),
  deleteDoc: vi.fn(),
  getFirestore: vi.fn()
}));

global.fetch = vi.fn();

describe('InboxManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and displays messages', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: '1',
          data: () => ({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Hello!',
            read: false,
            createdAt: { toDate: () => new Date('2023-01-01') }
          })
        }
      ]
    });

    render(<InboxManager />);

    expect(screen.getByText(/Loading messages/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Hello!')).toBeInTheDocument();
    });
  });

  it('marks message as read when clicked', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: '1',
          data: () => ({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Hello!',
            read: false,
            createdAt: { toDate: () => new Date('2023-01-01') }
          })
        }
      ]
    });

    updateDoc.mockResolvedValueOnce();

    render(<InboxManager />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('John Doe'));

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalled();
      expect(screen.getByDisplayValue('')).toBeInTheDocument(); // Reply textarea
    });
  });

  it('replies to message', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: '1',
          data: () => ({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Hello!',
            read: true,
            createdAt: { toDate: () => new Date('2023-01-01') }
          })
        }
      ]
    });

    fetch.mockResolvedValueOnce({ ok: true });
    updateDoc.mockResolvedValueOnce();

    render(<InboxManager />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('John Doe'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your reply here...')).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText('Type your reply here...');
    fireEvent.change(textarea, { target: { value: 'Reply content' } });

    const sendBtn = screen.getByText('Send Reply');
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalled();
      expect(screen.getByText('Reply sent successfully!')).toBeInTheDocument();
    });
  });
});
