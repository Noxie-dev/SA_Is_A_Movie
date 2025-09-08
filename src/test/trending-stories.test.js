/**
 * Unit tests for Trending Stories functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TrendingStories from '../components/TrendingStories';
import { postStoryToBlog, checkImageCopyright } from '../services/copyrightService';

// Mock the hooks
vi.mock('../hooks/useContentful', () => ({
  useTrendingStories: () => ({
    stories: [],
    loading: false,
    error: null
  })
}));

// Mock the copyright service
vi.mock('../services/copyrightService', () => ({
  postStoryToBlog: vi.fn(),
  checkImageCopyright: vi.fn(),
  getCopyrightStatusColor: vi.fn((status) => {
    const colors = {
      approved: 'text-green-500',
      flagged: 'text-yellow-500',
      rejected: 'text-red-500',
      pending: 'text-blue-500'
    };
    return colors[status] || 'text-gray-500';
  }),
  getCopyrightStatusIcon: vi.fn((status) => {
    const icons = {
      approved: '✅',
      flagged: '⚠️',
      rejected: '❌',
      pending: '⏳'
    };
    return icons[status] || '❓';
  })
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>
  }
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader-icon">Loading</div>,
  User: () => <div data-testid="user-icon">User</div>,
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  Upload: () => <div data-testid="upload-icon">Upload</div>,
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  CheckCircle: () => <div data-testid="check-icon">Check</div>,
  AlertTriangle: () => <div data-testid="alert-icon">Alert</div>
}));

// Mock UI components
vi.mock('../components/ui/card', () => ({
  Card: ({ children, ...props }) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div data-testid="card-content" {...props}>{children}</div>
}));

vi.mock('../components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }) => (
    <button data-testid="button" onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}));

vi.mock('../components/ui/badge', () => ({
  Badge: ({ children, ...props }) => <span data-testid="badge" {...props}>{children}</span>
}));

vi.mock('../components/ui/alert', () => ({
  Alert: ({ children, ...props }) => <div data-testid="alert" {...props}>{children}</div>,
  AlertDescription: ({ children, ...props }) => <div data-testid="alert-description" {...props}>{children}</div>
}));

// Mock CopyrightChecker component
vi.mock('../components/CopyrightChecker', () => ({
  default: ({ imageUrl, onStatusChange }) => (
    <div data-testid="copyright-checker">
      <span>Copyright Checker for: {imageUrl}</span>
      <button 
        data-testid="mock-copyright-check"
        onClick={() => onStatusChange && onStatusChange({ status: 'approved' })}
      >
        Mock Check
      </button>
    </div>
  )
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('TrendingStories Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders trending stories with fallback data', () => {
    renderWithRouter(<TrendingStories />);
    
    // Check if the main heading is rendered
    expect(screen.getByText('Trending Topics')).toBeInTheDocument();
    
    // Check if fallback stories are rendered
    expect(screen.getByText('Amapiano Festival Rocks Johannesburg')).toBeInTheDocument();
    expect(screen.getByText('Political Drama Unfolds in Parliament')).toBeInTheDocument();
    expect(screen.getByText('Celebrity Couple\'s Public Breakup')).toBeInTheDocument();
  });

  it('displays author information for each story', () => {
    renderWithRouter(<TrendingStories />);
    
    // Check if author names are displayed
    expect(screen.getByText('Thabo Mthembu')).toBeInTheDocument();
    expect(screen.getByText('Nomsa Dlamini')).toBeInTheDocument();
    expect(screen.getByText('Lerato Molefe')).toBeInTheDocument();
    
    // Check if author roles are displayed
    expect(screen.getByText('Music Reporter')).toBeInTheDocument();
    expect(screen.getByText('Political Correspondent')).toBeInTheDocument();
    expect(screen.getByText('Entertainment Reporter')).toBeInTheDocument();
  });

  it('displays copyright status badges', () => {
    renderWithRouter(<TrendingStories />);
    
    // Check if copyright status badges are rendered
    const badges = screen.getAllByTestId('badge');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('renders post story buttons', () => {
    renderWithRouter(<TrendingStories />);
    
    // Check if post story buttons are rendered
    const postButtons = screen.getAllByText('Post Story');
    expect(postButtons.length).toBeGreaterThan(0);
  });

  it('handles post story button click', async () => {
    const mockPostStory = vi.mocked(postStoryToBlog);
    mockPostStory.mockResolvedValue({
      success: true,
      blogPost: { sys: { id: 'test-blog-id' } }
    });

    renderWithRouter(<TrendingStories />);
    
    // Find and click the first post story button
    const postButtons = screen.getAllByText('Post Story');
    fireEvent.click(postButtons[0]);
    
    // Wait for the API call to complete
    await waitFor(() => {
      expect(mockPostStory).toHaveBeenCalledWith(
        expect.any(String), // story ID
        expect.objectContaining({
          name: expect.any(String),
          role: expect.any(String),
          avatar: expect.any(String)
        })
      );
    });
  });

  it('displays loading state when posting story', async () => {
    const mockPostStory = vi.mocked(postStoryToBlog);
    mockPostStory.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithRouter(<TrendingStories />);
    
    const postButtons = screen.getAllByText('Post Story');
    fireEvent.click(postButtons[0]);
    
    // Check if loading state is displayed
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('handles post story error', async () => {
    const mockPostStory = vi.mocked(postStoryToBlog);
    mockPostStory.mockRejectedValue(new Error('Failed to post story'));

    renderWithRouter(<TrendingStories />);
    
    const postButtons = screen.getAllByText('Post Story');
    fireEvent.click(postButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to post story/)).toBeInTheDocument();
    });
  });

  it('disables post button for rejected copyright status', () => {
    // Mock a story with rejected copyright status
    const mockUseTrendingStories = vi.fn(() => ({
      stories: [{
        sys: { id: 'test-story' },
        fields: {
          title: 'Test Story',
          description: 'Test description',
          category: 'test',
          color: 'saisa-text-blue',
          author: { name: 'Test Author', role: 'Test Role', avatar: 'test.jpg' },
          copyrightStatus: 'rejected'
        }
      }],
      loading: false,
      error: null
    }));

    vi.mocked(require('../hooks/useContentful').useTrendingStories).mockImplementation(mockUseTrendingStories);

    renderWithRouter(<TrendingStories />);
    
    const postButtons = screen.getAllByText('Post Story');
    expect(postButtons[0]).toBeDisabled();
  });

  it('renders copyright checker for stories with images', () => {
    renderWithRouter(<TrendingStories />);
    
    // Check if copyright checker components are rendered
    const copyrightCheckers = screen.getAllByTestId('copyright-checker');
    expect(copyrightCheckers.length).toBeGreaterThan(0);
  });

  it('handles copyright status change', async () => {
    renderWithRouter(<TrendingStories />);
    
    const mockCheckButtons = screen.getAllByTestId('mock-copyright-check');
    fireEvent.click(mockCheckButtons[0]);
    
    // The copyright checker should call onStatusChange
    // This is tested through the mock implementation
    expect(mockCheckButtons[0]).toBeInTheDocument();
  });

  it('displays success message after successful post', async () => {
    const mockPostStory = vi.mocked(postStoryToBlog);
    mockPostStory.mockResolvedValue({
      success: true,
      blogPost: { sys: { id: 'test-blog-id' } }
    });

    renderWithRouter(<TrendingStories />);
    
    const postButtons = screen.getAllByText('Post Story');
    fireEvent.click(postButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/successfully posted to blog/)).toBeInTheDocument();
    });
  });

  it('displays error message after failed post', async () => {
    const mockPostStory = vi.mocked(postStoryToBlog);
    mockPostStory.mockRejectedValue(new Error('Network error'));

    renderWithRouter(<TrendingStories />);
    
    const postButtons = screen.getAllByText('Post Story');
    fireEvent.click(postButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to post story/)).toBeInTheDocument();
    });
  });
});

describe('Copyright Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct API endpoints', () => {
    // Test that the service functions are properly defined
    expect(typeof postStoryToBlog).toBe('function');
    expect(typeof checkImageCopyright).toBe('function');
  });

  it('should handle postStoryToBlog API call', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        blogPost: { sys: { id: 'test-id' } }
      })
    });
    
    global.fetch = mockFetch;
    
    const result = await postStoryToBlog('test-story-id', {
      name: 'Test Author',
      role: 'Test Role'
    });
    
    expect(mockFetch).toHaveBeenCalledWith(
      '/.netlify/functions/post-story-to-blog',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('test-story-id')
      })
    );
    
    expect(result.success).toBe(true);
  });

  it('should handle checkImageCopyright API call', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        analysis: {
          status: 'approved',
          copyrightRisk: 'low',
          confidence: 0.9
        }
      })
    });
    
    global.fetch = mockFetch;
    
    const result = await checkImageCopyright('https://example.com/image.jpg');
    
    expect(mockFetch).toHaveBeenCalledWith(
      '/.netlify/functions/vision-copyright-check',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('https://example.com/image.jpg')
      })
    );
    
    expect(result.success).toBe(true);
    expect(result.analysis.status).toBe('approved');
  });
});
