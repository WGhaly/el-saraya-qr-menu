'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useMenuStore } from '../../store'
import { useLanguageStore } from '../../store/language'
import { formatPrice, cn } from '../../lib/utils'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'

export function ProductGrid() {
  const { 
    filteredProducts, 
    isLoading, 
    error,
    clearError,
    fetchProducts 
  } = useMenuStore()
  
  const { locale, isRTL } = useLanguageStore()
  const t = useTranslations('menu')

  if (isLoading) {
    return <ProductGridSkeleton />
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage 
          message={error}
          onRetry={() => {
            clearError()
            fetchProducts()
          }}
        />
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className={`py-12 text-center ${isRTL ? 'font-arabic' : ''}`}>
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291.94-5.709 2.291" />
            </svg>
          </div>
          <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
            {t('noResults')}
          </h3>
          <p className="text-text-secondary">
            {t('noResultsDesc')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`py-4 ${isRTL ? 'font-arabic' : ''}`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

// Individual Product Card Component
interface ProductCardProps {
  product: any // Will be typed properly when shared types are available
}

function ProductCard({ product }: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState<any>(null)
  
  const { locale, isRTL } = useLanguageStore()
  const t = useTranslations('menu')

  // Get localized content
  const productName = locale === 'ar' && product.nameAr 
    ? product.nameAr 
    : product.nameEn || product.name
    
  const productDescription = locale === 'ar' && product.descriptionAr 
    ? product.descriptionAr 
    : product.descriptionEn || product.description

  // Get base price or variation price
  const displayPrice = selectedVariation?.price || product.basePrice || 0
  const formattedPrice = locale === 'ar' 
    ? `${displayPrice} ج.م` 
    : `${displayPrice} EGP`

  return (
    <div className="menu-item group">
      {/* Product Image */}
      <div className="relative aspect-menu-card overflow-hidden rounded-lg mb-3 bg-primary-50">
        {product.imageUrl ? (
          <>
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size="md" />
              </div>
            )}
            <Image
              src={product.imageUrl}
              alt={productName}
              fill
              className={cn(
                'object-cover transition-all duration-300',
                'group-hover:scale-105',
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setIsImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-wood">
            <svg className="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Featured Badge */}
        {product.isFeatured && (
          <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'}`}>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-600 text-white">
              ⭐ {locale === 'ar' ? 'مميز' : 'Featured'}
            </span>
          </div>
        )}

        {/* Available Badge */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <span className="px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700">
              {locale === 'ar' ? 'غير متاح حالياً' : 'Currently Unavailable'}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Name and Price */}
        <div className={`flex items-start ${isRTL ? 'justify-between flex-row-reverse' : 'justify-between'}`}>
          <h3 className={`font-medium text-text-primary text-lg leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
            {productName}
          </h3>
          <div className={`${isRTL ? 'text-left mr-2' : 'text-right ml-2'}`}>
            <div className="price-large">
              {formattedPrice}
            </div>
          </div>
        </div>

        {/* Description */}
        {productDescription && (
          <p className={`text-sm text-text-secondary leading-relaxed line-clamp-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {productDescription}
          </p>
        )}

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.ingredients.slice(0, 3).map((ingredient: string) => (
              <span 
                key={ingredient}
                className="inline-flex items-center px-2 py-1 text-xs rounded-full 
                         bg-primary-50 text-primary-700 border border-primary-100"
              >
                {ingredient}
              </span>
            ))}
            {product.ingredients.length > 3 && (
              <span className="text-xs text-text-light">
                +{product.ingredients.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Product Variations */}
        {product.variations && product.variations.length > 0 && (
          <ProductVariations 
            variations={product.variations}
            selectedVariation={selectedVariation}
            onSelectVariation={setSelectedVariation}
          />
        )}

        {/* Nutrition Info */}
        {product.nutritionInfo && (
          <NutritionBadges nutrition={product.nutritionInfo} />
        )}

        {/* Allergens Warning */}
        {product.allergens && product.allergens.length > 0 && (
          <div className={`flex items-center text-xs text-amber-600 ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>
              {locale === 'ar' ? 'يحتوي على: ' : 'Contains: '}
              {product.allergens.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Product variations selector
interface ProductVariationsProps {
  variations: any[]
  selectedVariation: any
  onSelectVariation: (variation: any) => void
}

function ProductVariations({ 
  variations, 
  selectedVariation, 
  onSelectVariation 
}: ProductVariationsProps) {
  const { locale, isRTL } = useLanguageStore()
  
  // Group variations by type
  const groupedVariations = variations.reduce((acc: any, variation: any) => {
    const type = variation.type
    if (!acc[type]) acc[type] = []
    acc[type].push(variation)
    return acc
  }, {})

  return (
    <div className="space-y-2">
      {Object.entries(groupedVariations).map(([type, typeVariations]: [string, any]) => (
        <div key={type}>
          <div className={`text-xs font-medium text-text-secondary mb-1 capitalize ${isRTL ? 'text-right' : 'text-left'}`}>
            {type}
          </div>
          <div className={`flex flex-wrap gap-1 ${isRTL ? 'justify-end' : 'justify-start'}`}>
            {typeVariations.map((variation: any) => {
              const variationName = locale === 'ar' && variation.nameAr 
                ? variation.nameAr 
                : variation.nameEn || variation.name
                
              const priceModifierText = locale === 'ar' 
                ? `${variation.priceModifier > 0 ? '+' : ''}${variation.priceModifier} ج.م`
                : `${variation.priceModifier > 0 ? '+' : ''}${variation.priceModifier} EGP`
                
              return (
                <button
                  key={variation.id}
                  onClick={() => onSelectVariation(variation)}
                  className={cn(
                    'px-2 py-1 text-xs rounded-md font-medium transition-all duration-200',
                    'border touch-manipulation',
                    selectedVariation?.id === variation.id
                      ? 'bg-primary-800 text-white border-primary-800'
                      : 'bg-white text-text-primary border-primary-200 hover:border-primary-300 active:scale-95'
                  )}
                >
                  <span>{variationName}</span>
                  {variation.priceModifier !== 0 && (
                    <span className={isRTL ? 'mr-1' : 'ml-1'}>
                      {priceModifierText}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// Nutrition badges
function NutritionBadges({ nutrition }: { nutrition: any }) {
  const { locale } = useLanguageStore()
  const badges = []
  
  if (nutrition.isVegan) badges.push({ 
    label: locale === 'ar' ? '🌱 نباتي' : '🌱 Vegan', 
    color: 'green' 
  })
  if (nutrition.isGlutenFree) badges.push({ 
    label: locale === 'ar' ? '🌾 خالي من الغلوتين' : '🌾 Gluten Free', 
    color: 'blue' 
  })
  if (nutrition.isLowCalorie) badges.push({ 
    label: locale === 'ar' ? '⚡ قليل السعرات' : '⚡ Low Cal', 
    color: 'purple' 
  })
  if (nutrition.isOrganic) badges.push({ 
    label: locale === 'ar' ? '🌿 عضوي' : '🌿 Organic', 
    color: 'green' 
  })

  if (badges.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((badge, index) => (
        <span 
          key={index}
          className="inline-flex items-center px-2 py-1 text-xs rounded-full 
                   bg-green-50 text-green-700 border border-green-200"
        >
          {badge.label}
        </span>
      ))}
    </div>
  )
}

// Loading skeleton for product grid
function ProductGridSkeleton() {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="aspect-menu-card bg-primary-100 rounded-lg mb-3" />
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="h-5 bg-primary-100 rounded w-2/3" />
                <div className="h-5 bg-primary-100 rounded w-16" />
              </div>
              <div className="h-4 bg-primary-100 rounded w-full" />
              <div className="h-4 bg-primary-100 rounded w-4/5" />
              <div className="flex gap-2">
                <div className="h-6 bg-primary-100 rounded-full w-16" />
                <div className="h-6 bg-primary-100 rounded-full w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}