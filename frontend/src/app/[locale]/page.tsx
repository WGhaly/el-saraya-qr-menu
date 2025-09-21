'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// Dynamically import the MenuContent component with no SSR to prevent hydration errors
const MenuContent = dynamic(() => import('../../components/MenuContent'), {
  ssr: false,
  loading: () => (
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
})

export default function MenuPage({ params: { locale } }: { params: { locale: string } }) {
  return <MenuContent locale={locale} />
}