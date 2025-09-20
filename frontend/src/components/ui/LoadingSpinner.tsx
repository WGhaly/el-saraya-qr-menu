'use client'

import React from 'react'
import { cn } from '../../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-primary-200 border-t-primary-800',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Inline loading spinner for buttons
export function InlineSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white',
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Loading overlay component
interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export function LoadingOverlay({ isVisible, message = 'Loading...' }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 shadow-wood-lg flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-text-primary font-medium">{message}</p>
      </div>
    </div>
  )
}