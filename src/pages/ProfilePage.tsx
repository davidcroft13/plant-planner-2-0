import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createClient } from '@supabase/supabase-js'
import { MoreVertical, Trash2, AlertTriangle } from 'lucide-react'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const ProfilePage: React.FC = () => {
  const { user, userProfile, updateUserProfile } = useAuth()
  const [editingField, setEditingField] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.name || '',
        email: user?.email || ''
      }))
    }
  }, [userProfile, user])

  const handleEdit = (field: string) => {
    setEditingField(field)
  }

  const handleCancel = () => {
    setEditingField(null)
    setFormData(prev => ({
      ...prev,
      name: userProfile?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }))
  }

  const handleSave = async (field: string) => {
    setLoading(true)
    try {
      if (field === 'name') {
        const { error } = await supabase
          .from('users')
          .update({ name: formData.name })
          .eq('id', user?.id)

        if (error) throw error

        // Update local context
        if (updateUserProfile) {
          updateUserProfile({ ...userProfile, name: formData.name })
        }
      } else if (field === 'email') {
        const { error } = await supabase.auth.updateUser({
          email: formData.email
        })
        if (error) throw error
      } else if (field === 'password') {
        if (formData.newPassword !== formData.confirmPassword) {
          alert('New passwords do not match')
          return
        }

        const { error } = await supabase.auth.updateUser({
          password: formData.newPassword
        })
        if (error) throw error
      }

      setEditingField(null)
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm account deletion')
      return
    }

    setLoading(true)
    try {
      // Delete user data from users table
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', user?.id)

      if (userError) throw userError

      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user?.id || '')
      if (authError) throw authError

      // Sign out and redirect
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error deleting account. Please contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Profile Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* Photo */}
            <div className="flex items-center justify-between py-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">
                    {(userProfile?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Photo</h3>
                  <p className="text-sm text-gray-500">Your profile picture</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center justify-between py-6 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Name</h3>
                {editingField === 'name' ? (
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                    <button
                      onClick={() => handleSave('name')}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600">{userProfile?.name || 'Not set'}</p>
                )}
              </div>
              {editingField !== 'name' && (
                <button
                  onClick={() => handleEdit('name')}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-6 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                {editingField === 'email' ? (
                  <div className="flex items-center space-x-3">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                    <button
                      onClick={() => handleSave('email')}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600">{user?.email || 'Not set'}</p>
                )}
              </div>
              {editingField !== 'email' && (
                <button
                  onClick={() => handleEdit('email')}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Password */}
            <div className="flex items-center justify-between py-6 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Password</h3>
                {editingField === 'password' ? (
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Current password"
                    />
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="New password"
                    />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleSave('password')}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">••••••••</p>
                )}
              </div>
              {editingField !== 'password' && (
                <button
                  onClick={() => handleEdit('password')}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Delete Account */}
            <div className="py-6">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">I want to remove all my data</span>
              </button>
            </div>
          </div>
      {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">
                This will permanently delete your account and all associated data. 
                Type <strong>DELETE</strong> to confirm.
              </p>
              
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteConfirmText('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default ProfilePage