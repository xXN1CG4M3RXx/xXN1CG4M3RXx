import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

describe('App (Admin)', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
