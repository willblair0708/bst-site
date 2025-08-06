import React from 'react'
import Link from 'next/link'
import { Home, Search } from 'lucide-react'

// Force dynamic rendering to prevent static optimization issues
export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go home
          </Link>
          
          <Link 
            href="/explore"
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            Explore trials
          </Link>
        </div>
      </div>
    </div>
  )
}