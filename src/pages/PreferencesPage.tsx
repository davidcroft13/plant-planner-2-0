import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface UserPreferences {
  goals: string[]
  allergies: string[]
  typical_portions: number
  include_breakfast: boolean
  include_snacks: boolean
  include_desserts: boolean
  include_leftovers: boolean
  use_metric: boolean
}

const PreferencesPage: React.FC = () => {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences>({
    goals: [],
    allergies: [],
    typical_portions: 4,
    include_breakfast: true,
    include_snacks: true,
    include_desserts: false,
    include_leftovers: true,
    use_metric: true
  })
  const [loading, setLoading] = useState(false)

  const goals = ['Be Healthier', 'Save Time', 'Lose Weight', 'Save Money']
  const allergies = ['Nuts', 'Soy', 'Hemp', 'Gluten', 'Dairy', 'Eggs']

  useEffect(() => {
    loadPreferences()
  }, [user])

  const loadPreferences = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error)
        return
      }

      if (data) {
        setPreferences({
          goals: data.goals || [],
          allergies: data.allergies || [],
          typical_portions: data.typical_portions || 4,
          include_breakfast: data.include_breakfast ?? true,
          include_snacks: data.include_snacks ?? true,
          include_desserts: data.include_desserts ?? false,
          include_leftovers: data.include_leftovers ?? true,
          use_metric: data.use_metric ?? true
        })
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }

  const savePreferences = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      alert('Preferences saved successfully!')
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert('Error saving preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item)
    } else {
      return [...array, item]
    }
  }

  const handleGoalToggle = (goal: string) => {
    setPreferences(prev => ({
      ...prev,
      goals: toggleArrayItem(prev.goals, goal)
    }))
  }

  const handleAllergyToggle = (allergy: string) => {
    setPreferences(prev => ({
      ...prev,
      allergies: toggleArrayItem(prev.allergies, allergy)
    }))
  }

  const handlePortionChange = (portions: number) => {
    setPreferences(prev => ({
      ...prev,
      typical_portions: portions
    }))
  }

  const handleBooleanToggle = (field: keyof UserPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div>
      {/* Preferences Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* Goals */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals</h3>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleGoalToggle(goal)}
                    className={`px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                      preferences.goals.includes(goal)
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergies / Intolerances */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies / Intolerances</h3>
              <div className="grid grid-cols-2 gap-3">
                {allergies.map((allergy) => (
                  <button
                    key={allergy}
                    onClick={() => handleAllergyToggle(allergy)}
                    className={`px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                      preferences.allergies.includes(allergy)
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>

            {/* Typical portions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Typical portions</h3>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {preferences.typical_portions}
                </div>
              </div>
              <div className="px-4">
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={preferences.typical_portions}
                  onChange={(e) => handlePortionChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                </div>
              </div>
            </div>

            {/* Breakfast in meal plans */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Do you want breakfast in your meal plans?
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleBooleanToggle('include_breakfast')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    preferences.include_breakfast
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleBooleanToggle('include_breakfast')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    !preferences.include_breakfast
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Snacks in meal plans */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Do you want Snacks in your meal plans?
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleBooleanToggle('include_snacks')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    preferences.include_snacks
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleBooleanToggle('include_snacks')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    !preferences.include_snacks
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Desserts in meal plans */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Do you want desserts in your meal plans?
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleBooleanToggle('include_desserts')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    preferences.include_desserts
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleBooleanToggle('include_desserts')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    !preferences.include_desserts
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Leftovers */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Do you want leftovers included in your meal plans?
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleBooleanToggle('include_leftovers')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    preferences.include_leftovers
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleBooleanToggle('include_leftovers')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    !preferences.include_leftovers
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Measurement units */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Do you prefer metric or imperial measurements?
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleBooleanToggle('use_metric')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    preferences.use_metric
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Metric
                </button>
                <button
                  onClick={() => handleBooleanToggle('use_metric')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    !preferences.use_metric
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Imperial
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={savePreferences}
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}

export default PreferencesPage
