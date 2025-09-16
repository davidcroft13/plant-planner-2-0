import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import BottomNavigation from './BottomNavigation'
import IntercomWidget from './IntercomWidget'
import TrialWarning from './TrialWarning'
import TrialExpiredModal from './TrialExpiredModal'

const Layout: React.FC = () => {
  const { isTrialExpired } = useAuth()
  const [showTrialExpiredModal, setShowTrialExpiredModal] = useState(false)

  // Show trial expired modal if trial is expired
  React.useEffect(() => {
    if (isTrialExpired) {
      setShowTrialExpiredModal(true)
    }
  }, [isTrialExpired])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20">
        <TrialWarning />
        <Outlet />
      </main>
      <BottomNavigation />
      <IntercomWidget />
      
      <TrialExpiredModal 
        isOpen={showTrialExpiredModal}
        onClose={() => setShowTrialExpiredModal(false)}
      />
    </div>
  )
}

export default Layout