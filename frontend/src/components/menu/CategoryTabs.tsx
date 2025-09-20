'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { useMenuStore } from '../../store'
import { useLanguageStore } from '../../store/language'
import { cn } from '../../lib/utils'

export function CategoryTabs() {
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    isLoading 
  } = useMenuStore()
  
  const { locale, isRTL } = useLanguageStore()
  const t = useTranslations('menu')

  if (isLoading || categories.length === 0) {
    return (
      <div className="px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
          {/* Loading skeleton */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-10 w-24 bg-primary-100 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`sticky top-[88px] z-30 bg-white/95 backdrop-blur-sm border-b border-primary-100 px-4 py-3 ${isRTL ? 'font-arabic' : ''}`}>
      <div className={`flex overflow-x-auto hide-scrollbar ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
        {/* All Categories Tab */}
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-manipulation',
            selectedCategory === null
              ? 'bg-primary-800 text-white shadow-wood'
              : 'bg-primary-50 text-primary-700 hover:bg-primary-100 active:scale-95'
          )}
        >
          {t('allCategories')}
        </button>

        {/* Category Tabs */}
        {categories.map((category) => {
          const categoryName = locale === 'ar' && category.nameAr 
            ? category.nameAr 
            : category.nameEn || category.name
            
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-manipulation',
                `flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`,
                selectedCategory === category.id
                  ? 'bg-primary-800 text-white shadow-wood'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100 active:scale-95'
              )}
            >
              {/* Category Emoji/Icon */}
              {(category as any).icon && (
                <span className="text-base">{(category as any).icon}</span>
              )}
              
              {/* Category Name */}
              <span>{categoryName}</span>
              
              {/* Product Count Badge */}
              {(category as any).productCount && (category as any).productCount > 0 && (
                <span 
                  className={cn(
                    `${isRTL ? 'mr-1' : 'ml-1'} px-1.5 py-0.5 text-xs rounded-full font-medium`,
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-primary-200 text-primary-800'
                  )}
                >
                  {(category as any).productCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Category Description */}
      {selectedCategory && (
        <div className="mt-3 px-1">
          {(() => {
            const category = categories.find(c => c.id === selectedCategory)
            const categoryDescription = locale === 'ar' && category?.descriptionAr 
              ? category.descriptionAr 
              : category?.descriptionEn || (category as any)?.description
              
            return categoryDescription && (
              <p className="text-sm text-text-secondary text-center">
                {categoryDescription}
              </p>
            )
          })()}
        </div>
      )}
    </div>
  )
}

// Individual Category Tab Component
interface CategoryTabProps {
  category: {
    id: string
    name?: string
    nameEn?: string
    nameAr?: string
    icon?: string
    description?: string
    descriptionEn?: string
    descriptionAr?: string
    productCount?: number
  }
  isSelected: boolean
  onClick: () => void
  className?: string
}

export function CategoryTab({ 
  category, 
  isSelected, 
  onClick, 
  className 
}: CategoryTabProps) {
  const { locale, isRTL } = useLanguageStore()
  
  const categoryName = locale === 'ar' && category.nameAr 
    ? category.nameAr 
    : category.nameEn || category.name
    
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
        `flex items-center touch-manipulation ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`,
        isSelected
          ? 'bg-primary-800 text-white shadow-wood transform scale-105'
          : 'bg-primary-50 text-primary-700 hover:bg-primary-100 active:scale-95',
        className
      )}
    >
      {(category as any).icon && (
        <span className="text-base">{(category as any).icon}</span>
      )}
      <span>{categoryName}</span>
      {(category as any).productCount && (category as any).productCount > 0 && (
        <span 
          className={cn(
            `${isRTL ? 'mr-1' : 'ml-1'} px-1.5 py-0.5 text-xs rounded-full font-medium`,
            isSelected
              ? 'bg-white/20 text-white'
              : 'bg-primary-200 text-primary-800'
          )}
        >
          {(category as any).productCount}
        </span>
      )}
    </button>
  )
}