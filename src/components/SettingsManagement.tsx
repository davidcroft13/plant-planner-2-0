import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createClient } from '@supabase/supabase-js'
import { Settings, Save, Upload, Palette, Globe, Bell, Shield } from 'lucide-react'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface AppSettings {
  id?: string
  app_name: string
  app_description: string
  primary_color: string
  logo_url?: string
  favicon_url?: string
  contact_email: string
  social_links: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  features: {
    recipes_enabled: boolean
    workouts_enabled: boolean
    meal_plans_enabled: boolean
    courses_enabled: boolean
    community_enabled: boolean
    notifications_enabled: boolean
  }
  privacy: {
    terms_of_service: string
    privacy_policy: string
    cookie_policy: string
  }
  created_at?: string
  updated_at?: string
}

const SettingsManagement: React.FC = () => {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)

  const [settings, setSettings] = useState<AppSettings>({
    app_name: 'Plant Planner',
    app_description: 'Your comprehensive plant-based lifestyle companion',
    primary_color: '#10B981',
    contact_email: '',
    social_links: {},
    features: {
      recipes_enabled: true,
      workouts_enabled: true,
      meal_plans_enabled: true,
      courses_enabled: true,
      community_enabled: false,
      notifications_enabled: true
    },
    privacy: {
      terms_of_service: '',
      privacy_policy: '',
      cookie_policy: ''
    }
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('*')
        .single()

      if (data) {
        setSettings(data)
        if (data.logo_url) setLogoPreview(data.logo_url)
        if (data.favicon_url) setFaviconPreview(data.favicon_url)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFaviconFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setFaviconPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      let logoUrl = settings.logo_url
      let faviconUrl = settings.favicon_url

      // Upload logo if there's a file
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `logo-${Date.now()}.${fileExt}`
        const filePath = `app-assets/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('app-assets')
          .upload(filePath, logoFile)

        if (!uploadError) {
          const { data } = supabase.storage
            .from('app-assets')
            .getPublicUrl(filePath)
          logoUrl = data.publicUrl
        }
      }

      // Upload favicon if there's a file
      if (faviconFile) {
        const fileExt = faviconFile.name.split('.').pop()
        const fileName = `favicon-${Date.now()}.${fileExt}`
        const filePath = `app-assets/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('app-assets')
          .upload(filePath, faviconFile)

        if (!uploadError) {
          const { data } = supabase.storage
            .from('app-assets')
            .getPublicUrl(filePath)
          faviconUrl = data.publicUrl
        }
      }

      const settingsData = {
        ...settings,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('app_settings')
        .upsert(settingsData)

      if (error) throw error

      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            App Settings
          </h2>
          <p className="text-gray-600">Customize your app's appearance and functionality</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Basic Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
              <input
                type="text"
                value={settings.app_name}
                onChange={(e) => setSettings(prev => ({ ...prev, app_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">App Description</label>
              <textarea
                value={settings.app_description}
                onChange={(e) => setSettings(prev => ({ ...prev, app_description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Branding
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <div className="flex items-center space-x-4">
                {logoPreview && (
                  <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-contain border border-gray-200 rounded" />
                )}
                <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
              <div className="flex items-center space-x-4">
                {faviconPreview && (
                  <img src={faviconPreview} alt="Favicon preview" className="w-8 h-8 object-contain border border-gray-200 rounded" />
                )}
                <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Favicon</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Features
          </h3>
          
          <div className="space-y-3">
            {Object.entries(settings.features).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace('_', ' ')}
                </label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    features: { ...prev.features, [key]: e.target.checked }
                  }))}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
          
          <div className="space-y-4">
            {Object.entries(settings.social_links).map(([platform, url]) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {platform}
                </label>
                <input
                  type="url"
                  value={url || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    social_links: { ...prev.social_links, [platform]: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={`https://${platform}.com/yourusername`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Legal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy & Legal
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key.replace('_', ' ')}
                </label>
                <textarea
                  value={value}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, [key]: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={`Enter ${key.replace('_', ' ')} content...`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsManagement
