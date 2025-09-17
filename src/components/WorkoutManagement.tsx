import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createClient } from '@supabase/supabase-js'
import { Plus, Search, Filter, Clock, Users, Edit, Trash2, X, Upload } from 'lucide-react'

// Get environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface Exercise {
  name: string
  sets?: number
  reps?: number
  duration?: number
  rest?: number
  notes?: string
  image_url?: string
  video_url?: string
}

interface Workout {
  id: string
  title: string
  description: string
  image_url?: string
  video_url?: string
  category: string
  duration: number
  difficulty: string
  exercises?: Exercise[]
  is_published: boolean
  created_at: string
  updated_at: string
}

const WorkoutManagement: React.FC = () => {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([{ name: '', sets: 0, reps: 0, duration: 0, rest: 0, notes: '' }])
  const [exerciseMediaFiles, setExerciseMediaFiles] = useState<{[key: number]: {image?: File, video?: File}}>({})
  const [exerciseMediaPreviews, setExerciseMediaPreviews] = useState<{[key: number]: {image?: string, video?: string}}>({})

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    difficulty: '',
    image_url: '',
    video_url: '',
    is_published: false
  })

  useEffect(() => {
    if (user) {
      fetchWorkouts()
    }
  }, [user])

  const fetchWorkouts = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching workouts:', error)
      } else {
        setWorkouts(data || [])
      }
    } catch (error) {
      console.error('Error fetching workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkout = () => {
    setEditingWorkout(null)
    setFormData({
      title: '',
      description: '',
      category: '',
      duration: '',
      difficulty: '',
      image_url: '',
      video_url: '',
      is_published: false
    })
    setImageFile(null)
    setImagePreview(null)
    setVideoFile(null)
    setVideoPreview(null)
    setExercises([{ name: '', sets: 0, reps: 0, duration: 0, rest: 0, notes: '' }])
    setExerciseMediaFiles({})
    setExerciseMediaPreviews({})
    setShowForm(true)
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

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setVideoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setVideoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0, duration: 0, rest: 0, notes: '' }])
  }

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index))
    }
  }

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setExercises(newExercises)
  }

  const handleExerciseImageUpload = (exerciseIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setExerciseMediaFiles(prev => ({
        ...prev,
        [exerciseIndex]: { ...prev[exerciseIndex], image: file }
      }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setExerciseMediaPreviews(prev => ({
          ...prev,
          [exerciseIndex]: { ...prev[exerciseIndex], image: e.target?.result as string }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleExerciseVideoUpload = (exerciseIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setExerciseMediaFiles(prev => ({
        ...prev,
        [exerciseIndex]: { ...prev[exerciseIndex], video: file }
      }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setExerciseMediaPreviews(prev => ({
          ...prev,
          [exerciseIndex]: { ...prev[exerciseIndex], video: e.target?.result as string }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout)
    setFormData({
      title: workout.title,
      description: workout.description || '',
      category: workout.category || '',
      duration: workout.duration?.toString() || '',
      difficulty: workout.difficulty || '',
      image_url: workout.image_url || '',
      video_url: workout.video_url || '',
      is_published: workout.is_published
    })
    setImageFile(null)
    setImagePreview(null)
    setVideoFile(null)
    setVideoPreview(null)
    setExercises(workout.exercises || [{ name: '', sets: 0, reps: 0, duration: 0, rest: 0, notes: '' }])
    setExerciseMediaFiles({})
    setExerciseMediaPreviews({})
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      console.error('No user found')
      return
    }

    console.log('Submitting workout form...', formData)
    console.log('Exercises:', exercises)
    console.log('Image file:', imageFile)
    console.log('Video file:', videoFile)

    try {
      // Handle image upload if there's a file
      let imageUrl = formData.image_url
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `workout-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('workout-images')
          .upload(filePath, imageFile)

        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          imageUrl = imagePreview || formData.image_url
        } else {
          const { data } = supabase.storage
            .from('workout-images')
            .getPublicUrl(filePath)
          imageUrl = data.publicUrl
        }
      }

      // Handle video upload if there's a file
      let videoUrl = formData.video_url
      if (videoFile) {
        const fileExt = videoFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `workout-videos/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('workout-videos')
          .upload(filePath, videoFile)

        if (uploadError) {
          console.error('Error uploading video:', uploadError)
          videoUrl = videoPreview || formData.video_url
        } else {
          const { data } = supabase.storage
            .from('workout-videos')
            .getPublicUrl(filePath)
          videoUrl = data.publicUrl
        }
      }

      // Process exercise media uploads
      const processedExercises = await Promise.all(
        exercises
          .filter(ex => ex.name.trim() !== '')
          .map(async (exercise, index) => {
            let exerciseImageUrl = exercise.image_url
            let exerciseVideoUrl = exercise.video_url

            // Upload exercise image if there's a file
            if (exerciseMediaFiles[index]?.image) {
              const fileExt = exerciseMediaFiles[index].image!.name.split('.').pop()
              const fileName = `${user.id}-exercise-${index}-${Date.now()}.${fileExt}`
              const filePath = `exercise-images/${fileName}`

              const { error: uploadError } = await supabase.storage
                .from('exercise-images')
                .upload(filePath, exerciseMediaFiles[index].image!)

              if (!uploadError) {
                const { data } = supabase.storage
                  .from('exercise-images')
                  .getPublicUrl(filePath)
                exerciseImageUrl = data.publicUrl
              }
            }

            // Upload exercise video if there's a file
            if (exerciseMediaFiles[index]?.video) {
              const fileExt = exerciseMediaFiles[index].video!.name.split('.').pop()
              const fileName = `${user.id}-exercise-${index}-${Date.now()}.${fileExt}`
              const filePath = `exercise-videos/${fileName}`

              const { error: uploadError } = await supabase.storage
                .from('exercise-videos')
                .upload(filePath, exerciseMediaFiles[index].video!)

              if (!uploadError) {
                const { data } = supabase.storage
                  .from('exercise-videos')
                  .getPublicUrl(filePath)
                exerciseVideoUrl = data.publicUrl
              }
            }

            return {
              ...exercise,
              image_url: exerciseImageUrl,
              video_url: exerciseVideoUrl
            }
          })
      )

      const workoutData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration: formData.duration ? parseInt(formData.duration) : null,
        difficulty: formData.difficulty,
        image_url: imageUrl,
        video_url: videoUrl,
        exercises: processedExercises,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
        created_by: user.id
      }

      if (editingWorkout) {
        const { error } = await supabase
          .from('workouts')
          .update(workoutData)
          .eq('id', editingWorkout.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('workouts')
          .insert(workoutData)
        if (error) throw error
      }

      await fetchWorkouts()
      setShowForm(false)
    } catch (error) {
      console.error('Error saving workout:', error)
    }
  }

  const handleDeleteWorkout = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        const { error } = await supabase
          .from('workouts')
          .delete()
          .eq('id', id)
        if (error) throw error
        await fetchWorkouts()
      } catch (error) {
        console.error('Error deleting workout:', error)
      }
    }
  }

  const handleTogglePublish = async (workout: Workout) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .update({ 
          is_published: !workout.is_published,
          published_at: !workout.is_published ? new Date().toISOString() : null
        })
        .eq('id', workout.id)
      if (error) throw error
      await fetchWorkouts()
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  const filteredWorkouts = workouts.filter(workout =>
    workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingWorkout ? 'Edit Workout' : 'Create New Workout'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Title
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Workout preview"
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
                            <span>Upload a file</span>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Pilates">Pilates</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Flexibility">Flexibility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (min)
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
                    <option value="">Select Difficulty</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Video (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {videoPreview ? (
                      <div className="relative">
                        <video
                          src={videoPreview}
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                          controls
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null)
                            setVideoPreview(null)
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
                            htmlFor="video-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                          >
                            <span>Upload video</span>
                            <input
                              id="video-upload"
                              name="video-upload"
                              type="file"
                              className="sr-only"
                              accept="video/*"
                              onChange={handleVideoUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">MP4, MOV, AVI up to 100MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Exercises Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exercises
                </label>
                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Exercise {index + 1}</h4>
                        {exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Exercise Name
                          </label>
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) => updateExercise(index, 'name', e.target.value)}
                            placeholder="e.g., Push-ups"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Sets
                          </label>
                          <input
                            type="number"
                            value={exercise.sets || ''}
                            onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                            placeholder="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Reps
                          </label>
                          <input
                            type="number"
                            value={exercise.reps || ''}
                            onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                            placeholder="12"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Duration (sec)
                          </label>
                          <input
                            type="number"
                            value={exercise.duration || ''}
                            onChange={(e) => updateExercise(index, 'duration', parseInt(e.target.value) || 0)}
                            placeholder="30"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Rest (sec)
                          </label>
                          <input
                            type="number"
                            value={exercise.rest || ''}
                            onChange={(e) => updateExercise(index, 'rest', parseInt(e.target.value) || 0)}
                            placeholder="60"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Notes
                          </label>
                          <input
                            type="text"
                            value={exercise.notes || ''}
                            onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                            placeholder="Form tips, modifications, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                        </div>
                      </div>

                      {/* Exercise Media Upload */}
                      <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                          Exercise Media (Optional)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Exercise Image Upload */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Exercise Image
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-gray-400 transition-colors">
                              {exerciseMediaPreviews[index]?.image ? (
                                <div className="relative">
                                  <img
                                    src={exerciseMediaPreviews[index].image}
                                    alt="Exercise preview"
                                    className="w-full h-24 object-cover rounded"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setExerciseMediaFiles(prev => ({
                                        ...prev,
                                        [index]: { ...prev[index], image: undefined }
                                      }))
                                      setExerciseMediaPreviews(prev => ({
                                        ...prev,
                                        [index]: { ...prev[index], image: undefined }
                                      }))
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                  <label className="cursor-pointer text-xs text-green-600 hover:text-green-500">
                                    Upload Image
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={(e) => handleExerciseImageUpload(index, e)}
                                    />
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Exercise Video Upload */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Exercise Video
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-gray-400 transition-colors">
                              {exerciseMediaPreviews[index]?.video ? (
                                <div className="relative">
                                  <video
                                    src={exerciseMediaPreviews[index].video}
                                    className="w-full h-24 object-cover rounded"
                                    controls
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setExerciseMediaFiles(prev => ({
                                        ...prev,
                                        [index]: { ...prev[index], video: undefined }
                                      }))
                                      setExerciseMediaPreviews(prev => ({
                                        ...prev,
                                        [index]: { ...prev[index], video: undefined }
                                      }))
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                  <label className="cursor-pointer text-xs text-green-600 hover:text-green-500">
                                    Upload Video
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept="video/*"
                                      onChange={(e) => handleExerciseVideoUpload(index, e)}
                                    />
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addExercise}
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Exercise</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="is_published" className="ml-2 text-sm text-gray-700">
                  Publish this workout
                </label>
              </div>

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
                  {editingWorkout ? 'Update Workout' : 'Create Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Explore Workouts</h2>
        <button
          onClick={handleCreateWorkout}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Workout +</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 appearance-none">
            <option value="all">All Categories</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="yoga">Yoga</option>
            <option value="pilates">Pilates</option>
            <option value="hiit">HIIT</option>
            <option value="flexibility">Flexibility</option>
          </select>
        </div>
      </div>

      {/* Workout Count */}
      <p className="text-gray-600 mb-6">{loading ? 'Loading...' : `${filteredWorkouts.length} workouts`}</p>

      {/* Workout Grid */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading workouts...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWorkouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img 
                  src={workout.image_url || 'https://via.placeholder.com/300x200'} 
                  alt={workout.title}
                  className="w-full h-48 object-cover"
                />
                
                {/* Publish Toggle */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleTogglePublish(workout)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      workout.is_published ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      workout.is_published ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {/* Workout Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{workout.category}</span>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{workout.duration || 0} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{workout.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workout Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {workout.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {workout.description}
                </p>
                
                {/* Action Buttons */}
                <div className="flex justify-end items-center space-x-2">
                  <button
                    onClick={() => handleEditWorkout(workout)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteWorkout(workout.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkoutManagement
