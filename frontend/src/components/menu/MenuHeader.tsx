'use client'

import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useMenuStore } from '../../store'
import { useLanguageStore } from '../../store/language'

export function MenuHeader() {
  const { menuConfig } = useMenuStore()
  const { locale, isRTL } = useLanguageStore()
  const t = useTranslations('menu')

  // Get localized content
  const restaurantName = menuConfig?.restaurantName || 'الســـرايــا'
  const restaurantTagline = t('tagline')
  const welcomeMessage = locale === 'ar' ? 'أهلاً وسهلاً بكم في الســـرايــا' : 'Welcome to EL Saraya'

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-primary-100 safe-area-inset ${isRTL ? 'font-arabic' : ''}`}>
      <div className="px-4 py-3">
        <div className={`flex items-center ${isRTL ? 'justify-between flex-row-reverse' : 'justify-between'}`}>
          {/* Logo and Brand Name */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-primary-100 p-1">
              <img
                src="/saraya-logo.jpeg"
                alt="Saraya Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-xl font-display font-bold text-text-primary">
                {restaurantName}
              </h1>
              <p className="text-sm text-text-secondary">
                {restaurantTagline}
              </p>
            </div>
          </div>

          {/* QR Code Info */}
          <div className={isRTL ? 'text-left' : 'text-right'}>
            <div className="text-xs text-text-light uppercase tracking-wide font-medium">
              {t('digitalMenu')}
            </div>
            <div className="text-sm text-text-secondary">
              {t('scanOrderEnjoy')}
            </div>
          </div>
        </div>

        {/* Restaurant Info Banner */}
        {welcomeMessage && (
          <div className="mt-3 p-3 bg-gradient-wood rounded-lg border border-primary-200">
            <p className="text-sm text-text-primary text-center font-medium">
              {welcomeMessage}
            </p>
          </div>
        )}

        {/* Opening Hours */}
        {menuConfig?.openingHours && (
          <div className="mt-2 flex flex-col space-y-1">
            <div className={`flex items-center justify-center text-xs text-text-secondary ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{locale === 'ar' ? 'مفتوح يومياً 9:00 - 23:00' : 'Open Daily 9:00 - 23:00'}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}