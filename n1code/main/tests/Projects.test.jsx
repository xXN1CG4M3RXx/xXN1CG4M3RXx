import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Projects from '../src/pages/Projects';
import { BrowserRouter } from 'react-router';

vi.mock('../src/lib/cache', () => ({
  fetchCachedData: vi.fn((key, cb) => {
    const data = {
      list: [{
        id: '1',
        title: 'Awesome Project',
        githubUrl: 'https://github.com/test',
        status: 'Completed',
        description: 'A great project'
      }]
    };
    cb(data);
    return Promise.resolve(data);
  })
}));

describe('Projects Page', () => {
  it('renders the projects header', async () => {
    render(
      <BrowserRouter>
        <Projects />
      </BrowserRouter>
    );
    expect(await screen.findByText(/Awesome Project/i)).toBeInTheDocument();
  });
});
