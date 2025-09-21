'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../../store'
import { useRouter } from 'next/navigation'
import { LoadingSpinner, InlineSpinner } from '../../../components/ui/LoadingSpinner'
import { InlineError } from '../../../components/ui/ErrorMessage'

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isMounted, setIsMounted] = useState(false)

  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  const router = useRouter()

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isMounted && isAuthenticated) {
      router.replace('/admin/dashboard')
    }
  }, [isMounted, isAuthenticated, router])

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-wood flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!credentials.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!credentials.password.trim()) {
      errors.password = 'Password is required'
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      clearError()
      await login(credentials)
      router.push('/admin/dashboard')
    } catch (error) {
      // Error is handled by the auth store
      console.error('Login failed:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-wood flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-wood-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <img 
                src="/saraya-logo.jpeg" 
                alt="شعار الســـرايــا" 
                className="w-20 h-20 object-contain mx-auto rounded-lg shadow-md"
              />
            </div>
            <h1 className="text-2xl font-display font-bold text-text-primary">
              دخول المدير
            </h1>
            <p className="text-text-secondary mt-2">
              سجل دخولك لإدارة قائمة المشروبات
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Global Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input"
                placeholder="admin@saraya.com"
                disabled={isLoading}
              />
              <InlineError message={validationErrors.email} />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="input"
                placeholder="أدخل كلمة المرور"
                disabled={isLoading}
              />
              <InlineError message={validationErrors.password} />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <InlineSpinner />
                  <span>جارٍ تسجيل الدخول...</span>
                </>
              ) : (
                <span>دخول</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-center text-secondary-600 mt-4">
              نظام إدارة قائمة الســـرايــا للمشروبات
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}