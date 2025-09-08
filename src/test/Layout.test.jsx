import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'

// Mock the ParticleBackground component
vi.mock('../components/ParticleBackground', () => ({
  default: () => <div data-testid="particle-background">Particle Background</div>
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Layout Component', () => {
  test('renders without crashing', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  test('renders navigation', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    // Check if navigation elements are present
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('renders footer', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    // Check if footer is present
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
