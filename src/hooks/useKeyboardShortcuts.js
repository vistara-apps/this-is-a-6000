import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only trigger shortcuts when not in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return
      }

      // Cmd/Ctrl + K for search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        // Focus search input if available
        const searchInput = document.querySelector('input[placeholder*="search" i], input[placeholder*="Search" i]')
        if (searchInput) {
          searchInput.focus()
        }
      }

      // Navigation shortcuts
      if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
        switch (event.key) {
          case 'H':
            event.preventDefault()
            navigate('/')
            break
          case 'A':
            event.preventDefault()
            navigate('/architecture-finder')
            break
          case 'B':
            event.preventDefault()
            navigate('/benchmarking')
            break
          case 'C':
            event.preventDefault()
            navigate('/collections')
            break
          case 'F':
            event.preventDefault()
            navigate('/changelog')
            break
          case 'P':
            event.preventDefault()
            navigate('/pricing')
            break
        }
      }

      // Escape to close modals
      if (event.key === 'Escape') {
        const closeButtons = document.querySelectorAll('[data-close-modal]')
        if (closeButtons.length > 0) {
          closeButtons[closeButtons.length - 1].click()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate])
}

export default useKeyboardShortcuts