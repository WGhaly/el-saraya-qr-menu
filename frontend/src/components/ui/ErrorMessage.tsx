'use client'

import React from 'react'
import { cn } from '../../lib/utils'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  className?: string
  variant?: 'default' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
  default: 'bg-red-50 border-red-200 text-red-800',
  destructive: 'bg-red-500 text-white',
}

const sizeClasses = {
  sm: 'p-3 text-sm',
  md: 'p-4 text-base',
  lg: 'p-6 text-lg',
}

export function ErrorMessage({ 
  message, 
  onRetry, 
  className,
  variant = 'default',
  size = 'md'
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg border flex flex-col space-y-3',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      role="alert"
    >
      {/* Error Icon */}
      <div className="flex items-center space-x-2">
        <svg
          className="h-5 w-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">Error</span>
      </div>
      
      {/* Error Message */}
      <p className="text-sm leading-relaxed">
        {message}
      </p>
      
      {/* Retry Button */}
      {onRetry && (
        <div className="flex justify-end">
          <button
            onClick={onRetry}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              variant === 'default' 
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' 
                : 'bg-white/20 text-white hover:bg-white/30 focus:ring-white/50',
              'focus:outline-none focus:ring-2 focus:ring-offset-2'
            )}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

// Inline error message for forms
interface InlineErrorProps {
  message: string
  className?: string
}

export function InlineError({ message, className }: InlineErrorProps) {
  if (!message) return null
  
  return (
    <p className={cn('text-sm text-red-600 mt-1', className)}>
      {message}
    </p>
  )
}

// Toast-style error notification
interface ErrorToastProps {
  message: string
  isVisible: boolean
  onDismiss: () => void
}

export function ErrorToast({ message, isVisible, onDismiss }: ErrorToastProps) {
  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-red-500 text-white rounded-lg shadow-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}