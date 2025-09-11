import React, { useEffect } from 'react'

declare global {
  interface Window {
    Intercom: any
  }
}

const IntercomWidget: React.FC = () => {
  useEffect(() => {
    const intercomAppId = (import.meta as any).env.VITE_INTERCOM_APP_ID

    if (!intercomAppId || intercomAppId === 'your_intercom_app_id_here') {
      console.warn('Intercom app ID not found - using mock mode')
      return
    }

    // Load Intercom script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://widget.intercom.io/widget/${intercomAppId}`
    document.head.appendChild(script)

    // Initialize Intercom
    window.Intercom = window.Intercom || function(...args: any[]) {
      (window.Intercom.q = window.Intercom.q || []).push(args)
    }

    window.Intercom('boot', {
      app_id: intercomAppId,
    })

    return () => {
      // Cleanup
      if (window.Intercom) {
        window.Intercom('shutdown')
      }
    }
  }, [])

  return null
}

export default IntercomWidget
