import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusMessage from '../src/components/StatusMessage';

describe('StatusMessage', () => {
  it('renders nothing when status is null', () => {
    const { container } = render(<StatusMessage status={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders error message correctly', () => {
    render(<StatusMessage status={{ type: 'error', message: 'Test error message' }} />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders success message correctly', () => {
    render(<StatusMessage status={{ type: 'success', message: 'Test success message' }} />);
    expect(screen.getByText('Test success message')).toBeInTheDocument();
  });
});
