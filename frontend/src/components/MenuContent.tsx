'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface Category {
  id: string
  nameEn: string
  nameAr: string
  descriptionEn?: string
  descriptionAr?: string
  products: Product[]
}

interface Product {
  id: string
  nameEn: string
  nameAr: string
  descriptionEn?: string
  descriptionAr?: string
  basePrice: string
}

interface MenuContentProps {
  locale: string
}

export default function MenuContent({ locale }: MenuContentProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        // Ensure we're using the production API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://el-saraya-qr-menu-production.up.railway.app/api/v1'
        console.log('API URL being used:', apiUrl) // Debug log
        const response = await fetch(`${apiUrl}/categories/public?lang=${locale}`)
        const data = await response.json()
        
        if (data.success) {
          setCategories(data.data)
        } else {
          setError(data.message || 'Failed to load menu')
        }
      } catch (err) {
        console.error('API Error:', err) // Debug log
        setError('Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [locale])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-wood">
        <div className="text-center">
          <div className="spinner mx-auto mb-6 h-12 w-12"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary-800">
              {locale === 'ar' ? 'الســـرايــا للمشروبات' : 'Al-Saraya Drinks'}
            </h2>
            <p className="text-primary-600">
              {locale === 'ar' ? 'جاري تحميل القائمة...' : 'Loading menu...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-wood">
        <div className="card text-center max-w-md mx-4">
          <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            {locale === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-wood">
      {/* Header */}
      <header className="bg-gradient-wood shadow-warm border-b border-primary-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${locale === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <Image
                src="/saraya-logo.jpeg"
                alt="شعار الســـرايــا"
                width={48}
                height={48}
                className="rounded-lg shadow-accent"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary-800">
                  {locale === 'ar' ? 'الســـرايــا للمشروبات' : 'Al-Saraya Drinks'}
                </h1>
                <p className="text-primary-700 text-sm font-medium">
                  {locale === 'ar' ? 'قائمة المشروبات المميزة' : 'Premium Beverage Menu'}
                </p>
              </div>
            </div>
            <div className={`flex ${locale === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <a 
                href="/ar"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${locale === 'ar' ? 'btn-primary' : 'btn-outline'}`}
              >
                العربية
              </a>
              <a 
                href="/en"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${locale === 'en' ? 'btn-primary' : 'btn-outline'}`}
              >
                English
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {locale === 'ar' ? 'لا توجد فئات متاحة' : 'No categories available'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => {
              const isExpanded = expandedCategory === category.id
              return (
                <div key={category.id} className="animate-fade-in">
                  <button
                    className={`w-full text-left rounded-xl shadow-wood bg-white border border-primary-100 px-6 py-5 flex items-center justify-between focus:outline-none transition-all duration-200 ${isExpanded ? 'ring-2 ring-primary-600' : ''}`}
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    aria-expanded={isExpanded}
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-primary-800">
                        {locale === 'ar' ? category.nameAr : category.nameEn}
                      </h2>
                      <p className="text-primary-700 mt-1 font-medium text-sm">
                        {locale === 'ar' ? category.descriptionAr : category.descriptionEn}
                      </p>
                    </div>
                    <span className={`ml-4 text-primary-600 text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {isExpanded && (
                    <div className="pt-6 pb-2">
                      {category.products.length === 0 ? (
                        <div className="card text-center py-8">
                          <p className="text-primary-600 text-lg">
                            {locale === 'ar' ? 'لا توجد منتجات في هذه الفئة' : 'No products in this category'}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {category.products.map((product, index) => (
                            <div 
                              key={product.id} 
                              className="menu-item group"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-primary-800 group-hover:text-primary-600 transition-colors">
                                  {locale === 'ar' ? product.nameAr : product.nameEn}
                                </h3>
                                <div className="flex flex-col items-end">
                                  <span className="price-large">
                                    {product.basePrice}
                                  </span>
                                  <span className="text-xs text-primary-600 font-medium">
                                    {locale === 'ar' ? 'ج.م' : 'EGP'}
                                  </span>
                                </div>
                              </div>
                              {((locale === 'ar' ? product.descriptionAr : product.descriptionEn)) && (
                                <p className="text-primary-700 text-sm leading-relaxed line-clamp-3">
                                  {locale === 'ar' ? product.descriptionAr : product.descriptionEn}
                                </p>
                              )}
                              <div className="mt-4 pt-3 border-t border-primary-100">
                                <span className="category-badge">
                                  {locale === 'ar' ? 'متوفر' : 'Available'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-background-wood border-t border-primary-200 mt-16 wood-pattern">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-primary-800 mb-2">
                {locale === 'ar' ? 'الســـرايــا للمشروبات' : 'Al-Saraya Drinks'}
              </h3>
              <p className="text-primary-600 text-sm">
                {locale === 'ar' 
                  ? 'قائمة رقمية - تجربة مميزة للمشروبات' 
                  : 'Digital Menu - Premium Beverage Experience'
                }
              </p>
            </div>
            <div className="flex justify-center space-x-4 text-xs text-primary-500">
              <span>© 2024 الســـرايــا للمشروبات</span>
              <span>•</span>
              <span>
                {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}