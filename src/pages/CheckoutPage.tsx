import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      setStatus('error')
      setMessage('No checkout session found')
      return
    }

    // In a real implementation, you would verify the session with Stripe
    // For now, we'll simulate a successful checkout
    setTimeout(() => {
      setStatus('success')
      setMessage('Payment successful! Redirecting to your dashboard...')
      
      // Redirect to app after 3 seconds
      setTimeout(() => {
        navigate('/app')
      }, 3000)
    }, 2000)
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="mx-auto h-12 w-12 text-primary-600 animate-spin mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Processing Payment
                </h2>
                <p className="text-gray-600">
                  Please wait while we process your payment...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">
                    You now have full access to all Plant Planner features!
                  </p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Payment Failed
                </h2>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                <button
                  onClick={() => navigate('/app')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back to App
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
