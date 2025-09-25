'use client'

import { useEffect, useState } from 'react'
import MenuContent from './MenuContent'

interface ClientOnlyMenuContentProps {
  locale: string
}

export default function ClientOnlyMenuContent({ locale }: ClientOnlyMenuContentProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-wood">
        <div className="text-center">
          <div className="spinner mx-auto mb-6 h-12 w-12"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary-800">
              الســـرايــا للمشروبات
            </h2>
            <p className="text-primary-600">
              Loading menu...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <MenuContent locale={locale} />
}