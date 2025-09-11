import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { StripeProvider } from './contexts/StripeContext'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import RecipesPage from './pages/RecipesPage'
import MealPlanPage from './pages/MealPlanPage'
import CoursesPage from './pages/CoursesPage'
import WorkoutsPage from './pages/WorkoutsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPortal from './pages/AdminPortal'

function App() {
  return (
    <StripeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="recipes" element={<RecipesPage />} />
                <Route path="plans" element={<MealPlanPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="workouts" element={<WorkoutsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              <Route path="/admin" element={<AdminPortal />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </StripeProvider>
  )
}

export default App