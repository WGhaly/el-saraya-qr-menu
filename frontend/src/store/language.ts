import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Locale = 'ar' | 'en'

interface LanguageState {
  locale: Locale
  direction: 'ltr' | 'rtl'
  
  // Actions
  setLocale: (locale: Locale) => void
  toggleLanguage: () => void
  
  // Computed properties
  isRTL: boolean
  isArabic: boolean
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: 'ar',
      direction: 'rtl',

      setLocale: (locale) => {
        const direction = locale === 'ar' ? 'rtl' : 'ltr'
        set({ locale, direction })
        
        // Update document direction and language
        if (typeof window !== 'undefined') {
          document.documentElement.dir = direction
          document.documentElement.lang = locale
        }
      },

      toggleLanguage: () => {
        const { locale } = get()
        const newLocale = locale === 'ar' ? 'en' : 'ar'
        get().setLocale(newLocale)
      },

      get isRTL() {
        return get().direction === 'rtl'
      },

      get isArabic() {
        return get().locale === 'ar'
      },
    }),
    {
      name: 'saraya-language-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Helper function to get localized content
export function getLocalizedContent<T>(
  content: { en: T; ar: T },
  locale: Locale
): T {
  return content[locale] || content.en
}

// Helper function to get localized field names
export function getLocalizedField(
  fieldName: string,
  locale: Locale
): string {
  return locale === 'ar' 
    ? fieldName.replace('En', 'Ar') 
    : fieldName.replace('Ar', 'En')
}

// Helper to format currency based on locale
export function formatCurrency(
  amount: number | string,
  locale: Locale
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (locale === 'ar') {
    return `${numAmount} ج.م`
  } else {
    return `${numAmount} EGP`
  }
}