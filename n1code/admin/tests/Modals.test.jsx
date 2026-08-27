import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import AnalyticsDashboard from '../src/components/AnalyticsDashboard';
import IconPickerModal from '../src/components/IconPickerModal';
import ImageManagerModal from '../src/components/ImageManagerModal';

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false))
}));

describe('Modals and AnalyticsDashboard', () => {
  it('renders AnalyticsDashboard', () => {
    const { container } = render(<AnalyticsDashboard stats={{}} />);
    expect(container).toBeInTheDocument();
  });
  
  it('renders IconPickerModal', () => {
    const { container } = render(<IconPickerModal isOpen={true} onClose={() => {}} onSelect={() => {}} />);
    expect(container).toBeInTheDocument();
  });

  it('renders ImageManagerModal', () => {
    const { container } = render(<ImageManagerModal isOpen={true} onClose={() => {}} onSelect={() => {}} />);
    expect(container).toBeInTheDocument();
  });
});
