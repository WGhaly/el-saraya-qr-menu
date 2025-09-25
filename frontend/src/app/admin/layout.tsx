'use client'

import { useEffect, ReactNode, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '../../store'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading, token } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  // Handle hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // Don't redirect if already on login page
    if (pathname === '/admin/login') return

    // Enhanced authentication check - redirect if no valid token OR not authenticated
    if (!isLoading && (!token || !isAuthenticated)) {
      console.log('Admin redirect - no valid authentication:', { token: !!token, isAuthenticated, pathname })
      router.replace('/admin/login')
    }
  }, [isAuthenticated, isLoading, token, router, pathname, isMounted])

  // Show loading during hydration to prevent mismatch
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-amber-800 font-medium">جارٍ التحميل...</p>
        </div>
      </div>
    )
  }

  // Don't show anything while redirecting OR if not properly authenticated (except for login page)
  if (!isAuthenticated || !token) {
    if (pathname !== '/admin/login') {
      return null
    }
  }

  return <>{children}</>
}