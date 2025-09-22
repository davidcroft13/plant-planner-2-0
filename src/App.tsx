import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { StripeProvider } from './contexts/StripeContext'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import HomePage from './pages/HomePage'
import RecipesPage from './pages/RecipesPage'
import MealPlanPage from './pages/MealPlanPage'
import CoursesPage from './pages/CoursesPage'
import WorkoutsPage from './pages/WorkoutsPage'
import AccountPage from './pages/AccountPage'
import AdminPortal from './pages/AdminPortal'
import CreatorPortal from './pages/CreatorPortal'
import CheckoutPage from './pages/CheckoutPage'

function App() {
  return (
    <StripeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/app" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="recipes" element={<RecipesPage />} />
                <Route path="plans" element={<MealPlanPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="workouts" element={<WorkoutsPage />} />
                <Route path="account" element={<AccountPage />} />
              </Route>
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/creator" element={<CreatorPortal />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </StripeProvider>
  )
}

export default App