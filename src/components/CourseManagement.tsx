import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createClient } from '@supabase/supabase-js'
import { Plus, Search, Filter, Edit, Trash2, X, Upload } from 'lucide-react'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface Course {
  id: string
  title: string
  description: string
  image_url?: string
  duration?: number
  difficulty: string
  category?: string
  is_published: boolean
  created_at: string
  updated_at: string
}

const CourseManagement: React.FC = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    difficulty: 'beginner',
    category: '',
    image_url: '',
    is_published: false
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching courses:', error)
      } else {
        setCourses(data || [])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateCourse = () => {
    setEditingCourse(null)
    setFormData({
      title: '',
      description: '',
      duration: '',
      difficulty: 'beginner',
      category: '',
      image_url: '',
      is_published: false
    })
    setImageFile(null)
    setImagePreview(null)
    setShowForm(true)
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration?.toString() || '',
      difficulty: course.difficulty,
      category: course.category || '',
      image_url: course.image_url || '',
      is_published: course.is_published
    })
    setImageFile(null)
    setImagePreview(course.image_url || null)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      let imageUrl = formData.image_url

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const filePath = `course-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('course-images')
          .upload(filePath, imageFile)

        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          imageUrl = imagePreview || ''
        } else {
          const { data } = supabase.storage
            .from('course-images')
            .getPublicUrl(filePath)
          imageUrl = data.publicUrl
        }
      }

      const courseData = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration ? parseInt(formData.duration) : null,
        difficulty: formData.difficulty,
        category: formData.category || null,
        image_url: imageUrl,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
        created_by: user.id
      }

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('courses')
          .insert(courseData)
        if (error) throw error
      }

      setShowForm(false)
      fetchCourses()
    } catch (error) {
      console.error('Error saving course:', error)
    }
  }

  const handleTogglePublish = async (course: Course) => {
    try {
      const newStatus = !course.is_published
      const { error } = await supabase
        .from('courses')
        .update({ 
          is_published: newStatus,
          published_at: newStatus ? new Date().toISOString() : null
        })
        .eq('id', course.id)
      
      if (error) throw error
      fetchCourses()
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
        <button
          onClick={handleCreateCourse}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Course</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-600">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-600">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first course to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateCourse}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Course
              </button>
            )}
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="relative h-48">
                {course.image_url ? (
                  <img 
                    src={course.image_url} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                
                {/* Publish Toggle */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleTogglePublish(course)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      course.is_published ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    title={course.is_published ? 'Unpublish' : 'Publish'}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      course.is_published ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {/* Course Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{course.category || 'General'}</span>
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs">
                        {course.difficulty}
                      </span>
                      {course.duration && (
                        <span className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs">
                          {course.duration} min
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit course"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Course Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Fitness, Nutrition, Wellness"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="course-image-upload"
                    />
                    <label
                      htmlFor="course-image-upload"
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </label>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
                    Publish immediately
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseManagement
