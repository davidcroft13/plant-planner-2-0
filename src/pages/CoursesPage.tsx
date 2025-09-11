import React, { useState } from 'react'
import { Search, Plus, MoreVertical, Heart, Users } from 'lucide-react'

const CoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - in real app this would come from Supabase
  const courses = [
    {
      id: 1,
      title: '7 Day Plyo training',
      description: 'jump higher and be more explosive with these...',
      image: '/api/placeholder/300/200',
      participants: 3
    },
    {
      id: 2,
      title: 'Isometric Overload - a Beginner to expert Guide',
      description: 'Isometric Overload - a Beginner to expert Guide',
      image: '/api/placeholder/300/200',
      participants: 1
    },
    {
      id: 3,
      title: 'Javelin Training',
      description: 'The best course on how to hit 60 M in Men\'s Javelin',
      image: '/api/placeholder/300/200',
      participants: 3
    },
    {
      id: 4,
      title: 'Testing',
      description: 'Test',
      image: '/api/placeholder/300/200',
      participants: 1
    },
    {
      id: 5,
      title: 'Med Ball Madness',
      description: 'The only med ball workout you\'ll ever need',
      image: '/api/placeholder/300/200',
      participants: 1
    }
  ]

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
        <button className="btn btn-primary px-4 py-2">
          <Plus className="w-4 h-4 mr-2" />
          New Course
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Type here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card card-hover overflow-hidden">
            <div className="relative">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
              <button className="absolute top-3 right-3 p-1">
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{course.participants} Participant{course.participants !== 1 ? 's' : ''}</span>
                </div>
                <button className="p-1 text-gray-400 hover:text-red-500">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CoursesPage
