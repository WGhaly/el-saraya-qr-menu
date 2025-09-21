'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { useMenuStore } from '../../store'
import { useLanguageStore } from '../../store/language'

export function MenuFooter() {
  const { menuConfig } = useMenuStore()
  const { locale, isRTL } = useLanguageStore()
  const t = useTranslations('common')

  // Get localized address
  const address = locale === 'ar' && (menuConfig as any)?.addressAr 
    ? (menuConfig as any).addressAr 
    : (menuConfig as any)?.addressEn || (menuConfig as any)?.address

  return (
    <footer className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-primary-100 safe-area-inset z-20 ${isRTL ? 'font-arabic' : ''}`}>
      <div className="px-4 py-3">
        {/* Business Info */}
        <div className="text-center space-y-2">
          {/* Contact Info */}
          {((menuConfig as any)?.contactPhone || (menuConfig as any)?.contactEmail || menuConfig?.contactInfo?.phone || menuConfig?.contactInfo?.email) && (
            <div className={`flex items-center justify-center text-sm ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              {((menuConfig as any).contactPhone || menuConfig?.contactInfo?.phone) && (
                <a 
                  href={`tel:${(menuConfig as any).contactPhone || menuConfig?.contactInfo?.phone}`}
                  className={`flex items-center text-text-secondary hover:text-primary-600 transition-colors ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{(menuConfig as any).contactPhone || menuConfig?.contactInfo?.phone}</span>
                </a>
              )}
              
              {((menuConfig as any).contactEmail || menuConfig?.contactInfo?.email) && (
                <a 
                  href={`mailto:${(menuConfig as any).contactEmail || menuConfig?.contactInfo?.email}`}
                  className={`flex items-center text-text-secondary hover:text-primary-600 transition-colors ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{(menuConfig as any).contactEmail || menuConfig?.contactInfo?.email}</span>
                </a>
              )}
            </div>
          )}

          {/* Address */}
          {address && (
            <div className={`flex items-center justify-center text-sm text-text-secondary ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-center">{address}</span>
            </div>
          )}

          {/* Powered by */}
          <div className="pt-2 border-t border-primary-100">
            <div className={`flex items-center justify-center text-xs text-text-light ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <span>{locale === 'ar' ? 'مدعوم بواسطة' : 'Powered by'}</span>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="font-medium text-primary-600">
                  {locale === 'ar' ? 'قائمة الســـرايــا الرقمية' : 'EL Saraya Digital Menu'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Floating action buttons (for future features)
export function FloatingActions() {
  return (
    <div className="fixed bottom-20 right-4 z-30 space-y-3">
      {/* WhatsApp Order Button */}
      <button
        onClick={() => {
          const message = encodeURIComponent('Hello! I would like to place an order from your menu.')
          const whatsappUrl = `https://wa.me/201234567890?text=${message}`
          window.open(whatsappUrl, '_blank')
        }}
        className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg
                 flex items-center justify-center
                 hover:bg-green-600 active:scale-95
                 transition-all duration-200"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.486" />
        </svg>
      </button>

      {/* Call Button */}
      <button
        onClick={() => {
          window.location.href = 'tel:+201234567890'
        }}
        className="w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg
                 flex items-center justify-center
                 hover:bg-primary-700 active:scale-95
                 transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </button>

      {/* Back to Top Button */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full shadow-lg
                 flex items-center justify-center
                 hover:bg-primary-200 active:scale-95
                 transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  )
}

// Social media links component
export function SocialLinks() {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/elsaraya',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.197-1.559-.148-.187-.29-.384-.414-.594-.31-.527-.189-.678.274-.678.302 0 .55.147.734.4.478.658 1.251 1.087 2.126 1.087.875 0 1.648-.429 2.126-1.087.184-.253.432-.4.734-.4.463 0 .584.151.274.678-.124.21-.266.407-.414.594-.749.948-1.9 1.559-3.197 1.559h-.046zm7.265-1.559c-.749.948-1.9 1.559-3.197 1.559s-2.448-.611-3.197-1.559c-.148-.187-.29-.384-.414-.594-.31-.527-.189-.678.274-.678.302 0 .55.147.734.4.478.658 1.251 1.087 2.126 1.087.875 0 1.648-.429 2.126-1.087.184-.253.432-.4.734-.4.463 0 .584.151.274.678-.124.21-.266.407-.414.594z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/elsaraya',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
  ]

  return (
    <div className="flex items-center justify-center space-x-4 pt-3">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-text-light hover:text-primary-600 transition-colors"
          aria-label={`Follow us on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}