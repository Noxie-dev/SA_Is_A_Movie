import '@testing-library/jest-dom'

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SANITY_PROJECT_ID: 'test-project-id',
    VITE_SANITY_DATASET: 'test-dataset',
    VITE_CONTENTFUL_SPACE_ID: 'test-space-id',
    VITE_CONTENTFUL_ACCESS_TOKEN: 'test-access-token',
    VITE_CLERK_PUBLISHABLE_KEY: 'test-clerk-key',
  },
  writable: true,
})

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    span: 'span',
    button: 'button',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
    img: 'img',
    nav: 'nav',
    ul: 'ul',
    li: 'li',
    a: 'a',
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({
    user: null,
    isLoaded: true,
    isSignedIn: false,
  }),
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: false,
    userId: null,
  }),
  ClerkProvider: ({ children }) => children,
  SignInButton: ({ children }) => children,
  SignUpButton: ({ children }) => children,
  SignedOut: ({ children }) => children,
  SignedIn: ({ children }) => null,
  UserButton: () => null,
}))

// Mock Sanity client
vi.mock('@sanity/client', () => ({
  createClient: () => ({
    fetch: vi.fn().mockResolvedValue([]),
  }),
}))

// Mock Contentful client
vi.mock('contentful', () => ({
  createClient: () => ({
    getEntries: vi.fn().mockResolvedValue({ items: [] }),
    getEntry: vi.fn().mockResolvedValue({}),
  }),
}))
