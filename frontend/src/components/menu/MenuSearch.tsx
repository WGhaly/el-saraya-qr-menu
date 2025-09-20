'use client'

import React, { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useMenuStore } from '../../store'
import { useLanguageStore } from '../../store/language'
import { debounce } from '../../lib/utils'

export function MenuSearch() {
  const { searchQuery, setSearchQuery } = useMenuStore()
  const [inputValue, setInputValue] = useState(searchQuery)
  
  const { locale, isRTL } = useLanguageStore()
  const t = useTranslations('menu')

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query)
    }, 300),
    [setSearchQuery]
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setInputValue(value)
    debouncedSearch(value)
  }

  const clearSearch = () => {
    setInputValue('')
    setSearchQuery('')
  }

  return (
    <div className={`relative max-w-md mx-auto ${isRTL ? 'font-arabic' : ''}`}>
      {/* Search Input */}
      <div className="relative">
        <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
          <svg 
            className="h-5 w-5 text-text-light" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={inputValue}
          onChange={handleInputChange}
          className={`w-full py-3 border border-primary-200 rounded-xl
                   bg-white/80 backdrop-blur-sm
                   focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                   placeholder-text-light text-text-primary
                   transition-all duration-200
                   text-sm ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10 text-left'}`}
        />
        
        {/* Clear Button */}
        {inputValue && (
          <button
            onClick={clearSearch}
            className={`absolute inset-y-0 flex items-center
                     text-text-light hover:text-text-secondary
                     transition-colors duration-200 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'}`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Count */}
      {searchQuery && (
        <SearchResultsInfo />
      )}

      {/* Quick Search Suggestions */}
      {!inputValue && (
        <QuickSearchTags />
      )}
    </div>
  )
}

// Component to show search results count
function SearchResultsInfo() {
  const { filteredProducts, searchQuery } = useMenuStore()
  const { locale } = useLanguageStore()
  
  return (
    <div className="mt-2 text-center">
      <p className="text-sm text-text-secondary">
        {filteredProducts.length === 0 
          ? locale === 'ar' 
            ? `لا توجد نتائج لـ "${searchQuery}"`
            : `No results found for "${searchQuery}"`
          : locale === 'ar'
            ? `تم العثور على ${filteredProducts.length} ${filteredProducts.length === 1 ? 'عنصر' : 'عنصر'} لـ "${searchQuery}"`
            : `Found ${filteredProducts.length} ${filteredProducts.length === 1 ? 'item' : 'items'} for "${searchQuery}"`
        }
      </p>
    </div>
  )
}

// Quick search suggestions
function QuickSearchTags() {
  const { setSearchQuery } = useMenuStore()
  const { locale } = useLanguageStore()
  
  const quickSearches = locale === 'ar' 
    ? [
        '☕ قهوة',
        '🫖 شاي', 
        '🧊 مثلج',
        '🥤 بارد',
        '🫐 سموثي',
        '🍊 عصير'
      ]
    : [
        '☕ Coffee',
        '🫖 Tea', 
        '🧊 Iced',
        '🥤 Cold',
        '🫐 Smoothie',
        '🍊 Juice'
      ]

  return (
    <div className="mt-3">
      <p className="text-xs text-text-light text-center mb-2">
        {locale === 'ar' ? 'بحث سريع:' : 'Quick search:'}
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {quickSearches.map((search) => (
          <button
            key={search}
            onClick={() => {
              const query = search.split(' ')[1] // Extract text after emoji
              setSearchQuery(query)
            }}
            className="px-3 py-1 text-xs rounded-full 
                     bg-primary-50 text-primary-700
                     hover:bg-primary-100 active:scale-95
                     transition-all duration-200 touch-manipulation"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  )
}

// Advanced search modal (for future enhancement)
export function AdvancedSearch() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-display font-semibold text-text-primary">
        Advanced Search
      </h3>
      
      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Price Range
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            className="flex-1 px-3 py-2 border border-primary-200 rounded-lg
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     text-sm"
          />
          <span className="text-text-light">to</span>
          <input
            type="number"
            placeholder="Max"
            className="flex-1 px-3 py-2 border border-primary-200 rounded-lg
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     text-sm"
          />
        </div>
      </div>

      {/* Dietary Filters */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Dietary Options
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['Vegan', 'Sugar-Free', 'Dairy-Free', 'Organic'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-primary-300 text-primary-600 
                         focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-text-primary">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}