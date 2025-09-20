'use client'

import React, { useEffect } from 'react'
import { useMenuStore } from '../store'
import { useLanguageStore } from '../store/language'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { ErrorMessage } from './ui/ErrorMessage'

interface MenuProviderProps {
  children: React.ReactNode
  locale?: string
}

export function MenuProvider({ children, locale = 'ar' }: MenuProviderProps) {
  const { 
    fetchCategories, 
    fetchProducts, 
    fetchMenuConfig,
    isLoading, 
    error,
    clearError 
  } = useMenuStore()
  
  const { setLocale } = useLanguageStore()

  useEffect(() => {
    // Set the locale from props
    if (locale) {
      setLocale(locale as 'ar' | 'en')
    }
    
    // Initialize menu data on component mount
    const initializeMenu = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchProducts(),
          fetchMenuConfig(),
        ])
      } catch (error) {
        console.error('Failed to initialize menu:', error)
      }
    }

    initializeMenu()
  }, [locale, setLocale, fetchCategories, fetchProducts, fetchMenuConfig])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-wood flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-text-secondary font-medium">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-wood flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage 
            message={error}
            onRetry={() => {
              clearError()
              // Retry initialization
              Promise.all([
                fetchCategories(),
                fetchProducts(),
                fetchMenuConfig(),
              ])
            }}
          />
        </div>
      </div>
    )
  }

  return <>{children}</>
}