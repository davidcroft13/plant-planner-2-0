import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createClient } from '@supabase/supabase-js'
import { Plus, Search, Edit, Trash2, X, Upload, Calendar, Clock } from 'lucide-react'
import ToggleSwitch from './ToggleSwitch'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface CourseDay {
  id: string
  day_number: number
  title: string
  description?: string
  items: CourseItem[]
}

interface CourseItem {
  id: string
  title: string
  type: 'workout' | 'exercise' | 'meal' | 'article' | 'video' | 'recipe'
  content_id?: string
  duration?: number
  description?: string
  image_url?: string
  video_url?: string
  completed?: boolean
  order?: number
}

interface Course {
  id: string
  title: string
  description: string
  image_url?: string
  duration?: number
  difficulty: string
  category?: string
  days?: CourseDay[]
  is_published: boolean
  created_at: string
  updated_at: string
}

const CourseManagementNew: React.FC = () => {
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

  const [days, setDays] = useState<CourseDay[]>([])

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
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
    setDays([])
    setImageFile(null)
    setImagePreview(null)
    setShowForm(true)
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description || '',
      duration: course.duration?.toString() || '',
      difficulty: course.difficulty || 'beginner',
      category: course.category || '',
      image_url: course.image_url || '',
      is_published: course.is_published
    })
    setDays(course.days || [])
    setImageFile(null)
    setImagePreview(null)
    setShowForm(true)
  }

  const addDay = () => {
    const newDay: CourseDay = {
      id: `day-${Date.now()}`,
      day_number: days.length + 1,
      title: `Day ${days.length + 1}`,
      description: '',
      items: []
    }
    setDays([...days, newDay])
  }

  const updateDay = (dayId: string, updates: Partial<CourseDay>) => {
    setDays(days.map(day => 
      day.id === dayId ? { ...day, ...updates } : day
    ))
  }

  const removeDay = (dayId: string) => {
    setDays(days.filter(day => day.id !== dayId))
  }

  const addItemToDay = (dayId: string) => {
    const newItem: CourseItem = {
      id: `item-${Date.now()}`,
      title: '',
      type: 'workout',
      duration: 0,
      description: '',
      order: 0
    }
    
    setDays(days.map(day => 
      day.id === dayId 
        ? { ...day, items: [...day.items, newItem] }
        : day
    ))
  }

  const updateItem = (dayId: string, itemId: string, updates: Partial<CourseItem>) => {
    setDays(days.map(day => 
      day.id === dayId 
        ? { 
            ...day, 
            items: day.items.map(item => 
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : day
    ))
  }

  const removeItem = (dayId: string, itemId: string) => {
    setDays(days.map(day => 
      day.id === dayId 
        ? { ...day, items: day.items.filter(item => item.id !== itemId) }
        : day
    ))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      // Handle image upload
      let imageUrl = formData.image_url
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `course-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('course-images')
          .upload(filePath, imageFile)

        if (!uploadError) {
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
        category: formData.category,
        image_url: imageUrl,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
        created_by: user.id,
        days: days
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
          .insert([courseData])
        if (error) throw error
      }

      await fetchCourses()
      setShowForm(false)
    } catch (error) {
      console.error('Error saving course:', error)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const { error } = await supabase
          .from('courses')
          .delete()
          .eq('id', id)
        if (error) throw error
        await fetchCourses()
      } catch (error) {
        console.error('Error deleting course:', error)
      }
    }
  }

  const handleTogglePublish = async (course: Course) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ 
          is_published: !course.is_published,
          published_at: !course.is_published ? new Date().toISOString() : null
        })
        .eq('id', course.id)
      if (error) throw error
      await fetchCourses()
    } catch (error) {
      console.error('Error updating course:', error)
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading courses...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Courses</h2>
          <p className="text-gray-600">Create structured courses with multiple days and activities</p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Course</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {course.image_url && (
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {course.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {course.days?.length || 0} days
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration || 0} min
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.is_published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <ToggleSwitch
                  checked={course.is_published}
                  onChange={() => handleTogglePublish(course)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Course Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Category</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Lifestyle">Lifestyle</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Course Days */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Course Days</h4>
                    <button
                      type="button"
                      onClick={addDay}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Day</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {days.map((day) => (
                      <div key={day.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => updateDay(day.id, { title: e.target.value })}
                              placeholder="Day title (e.g., 'Upper Body Strength')"
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                              type="text"
                              value={day.description || ''}
                              onChange={(e) => updateDay(day.id, { description: e.target.value })}
                              placeholder="Day description"
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDay(day.id)}
                            className="ml-3 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Day Items */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium text-gray-700">Activities</h5>
                            <button
                              type="button"
                              onClick={() => addItemToDay(day.id)}
                              className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Activity</span>
                            </button>
                          </div>

                          {day.items.map((item) => (
                            <div key={item.id} className="flex space-x-2 items-center bg-gray-50 p-2 rounded">
                              <select
                                value={item.type}
                                onChange={(e) => updateItem(day.id, item.id, { type: e.target.value as any })}
                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                              >
                                <option value="workout">Workout</option>
                                <option value="exercise">Exercise</option>
                                <option value="meal">Meal</option>
                                <option value="recipe">Recipe</option>
                                <option value="article">Article</option>
                                <option value="video">Video</option>
                              </select>
                              
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItem(day.id, item.id, { title: e.target.value })}
                                placeholder="Activity title"
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                              />
                              
                              <input
                                type="number"
                                value={item.duration || ''}
                                onChange={(e) => updateItem(day.id, item.id, { duration: parseInt(e.target.value) || 0 })}
                                placeholder="Min"
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                              />
                              
                              <button
                                type="button"
                                onClick={() => removeItem(day.id, item.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Image (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null)
                              setImagePreview(null)
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                            >
                              <span>Upload image</span>
                              <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <ToggleSwitch
                  checked={formData.is_published}
                  onChange={(checked) => setFormData({...formData, is_published: checked})}
                  label="Publish this course"
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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

export default CourseManagementNew
