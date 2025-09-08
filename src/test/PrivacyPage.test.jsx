import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PrivacyPage from '../pages/PrivacyPage'

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('PrivacyPage Component', () => {
  test('renders privacy policy title', () => {
    renderWithRouter(<PrivacyPage />)
    
    expect(screen.getAllByText(/Privacy.*Policy/)).toHaveLength(2)
  })

  test('renders last updated date', () => {
    renderWithRouter(<PrivacyPage />)
    
    expect(screen.getByText('Last Updated: 6 September 2025')).toBeInTheDocument()
  })

  test('renders contact email', () => {
    renderWithRouter(<PrivacyPage />)
    
    expect(screen.getAllByText('privacy@sa_isamovie.co.za')).toHaveLength(4)
  })

  test('renders all main sections', () => {
    renderWithRouter(<PrivacyPage />)
    
    // Check for main section headings
    expect(screen.getByText('1. Who we are')).toBeInTheDocument()
    expect(screen.getByText('2. What data we collect')).toBeInTheDocument()
    expect(screen.getByText('3. Legal basis for processing')).toBeInTheDocument()
    expect(screen.getByText('4. How we use your data')).toBeInTheDocument()
    expect(screen.getByText('5. Cookies & Tracking')).toBeInTheDocument()
  })

  test('renders tech stack information', () => {
    renderWithRouter(<PrivacyPage />)
    
    expect(screen.getByText(/React \+ Vite \+ TailwindCSS/)).toBeInTheDocument()
    expect(screen.getAllByText(/Node\/Express/)).toHaveLength(2)
    expect(screen.getByText(/PostgreSQL/)).toBeInTheDocument()
  })

  test('renders data collection categories', () => {
    renderWithRouter(<PrivacyPage />)
    
    expect(screen.getByText('a) Automatically collected technical & engagement data')).toBeInTheDocument()
    expect(screen.getByText('b) Ad and decision data')).toBeInTheDocument()
    expect(screen.getByText('c) Voluntarily provided information')).toBeInTheDocument()
    expect(screen.getByText('d) Cookies and similar technologies')).toBeInTheDocument()
  })
})
