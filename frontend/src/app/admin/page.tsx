'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard by default
    router.replace('/admin/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-amber-800 font-medium">جارٍ التحويل إلى لوحة الإدارة...</p>
      </div>
    </div>
  )
}