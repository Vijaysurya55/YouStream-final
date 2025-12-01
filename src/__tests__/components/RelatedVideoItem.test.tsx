import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import RelatedVideoItem from '../../Components/RelatedVideoItem';

jest.mock('moment', () => {
  const m = () => ({ fromNow: () => 'a few seconds ago' });
  (m as any).default = m;
  return m as any;
});

const sampleVideo = {
  id: 'abc123',
  snippet: {
    title: 'Test video',
    channelTitle: 'Channel A',
    publishedAt: new Date().toISOString(),
    thumbnails: {
      medium: { url: 'https://example.com/thumb.jpg' }
    }
  },
  statistics: {
    viewCount: '1500'
  }
};

describe('RelatedVideoItem', () => {
  test('renders title, channel and formatted views, and handles click', () => {
    const onClick = jest.fn();
    render(<RelatedVideoItem video={sampleVideo} onClick={onClick} />);

    expect(screen.getByText(/Test video/i)).toBeInTheDocument();
    expect(screen.getByText(/Channel A/i)).toBeInTheDocument();

    expect(screen.getByText(/1.5K views/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Test video/i));
    expect(onClick).toHaveBeenCalledWith('abc123');
  });
});
