import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import AdminDashboard from '../src/components/AdminDashboard';
import IconPickerModal from '../src/components/IconPickerModal';
import ImageManagerModal from '../src/components/ImageManagerModal';

describe('Modals and AdminDashboard', () => {
  it('renders AdminDashboard', () => {
    const { container } = render(<AdminDashboard stats={{}} />);
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
