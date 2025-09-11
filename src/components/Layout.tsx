import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNavigation from './BottomNavigation'
import IntercomWidget from './IntercomWidget'

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNavigation />
      <IntercomWidget />
    </div>
  )
}

export default Layout