import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { apiClient } from '../lib/api-client'
import { 
  User, 
  Category, 
  Product, 
  ProductVariation,
  MenuConfig,
  LoginRequest,
  LoginResponse 
} from '../types'

// Auth Store
interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
  clearError: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  
  // User management (admin only)
  users: User[]
  usersLoading: boolean
  fetchUsers: () => Promise<void>
  createUser: (userData: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>
  resetUserPassword: (userId: string, newPassword: string) => Promise<void>
  deactivateUser: (userId: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading to prevent hydration mismatch
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.login(credentials)
          if (response.success && response.data) {
            const { user, accessToken, refreshToken } = response.data
            
            // Set token in API client
            apiClient.setToken(accessToken)
            
            set({
              user,
              token: accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Login failed',
            isAuthenticated: false,
          })
          throw error
        }
      },

      logout: () => {
        apiClient.logout().catch(() => {}) // Fire and forget
        apiClient.setToken(null)
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      refreshAuth: async () => {
        const { refreshToken } = get()
        if (!refreshToken) {
          get().logout()
          return
        }

        try {
          const response = await apiClient.refreshToken({ refreshToken })
          if (response.success && response.data) {
            const { user, accessToken, refreshToken: newRefreshToken } = response.data
            
            apiClient.setToken(accessToken)
            
            set({
              user,
              token: accessToken,
              refreshToken: newRefreshToken,
              isAuthenticated: true,
              error: null,
            })
          }
        } catch (error) {
          get().logout()
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null })
        try {
          await apiClient.changePassword({
            currentPassword,
            newPassword,
          })
          set({ isLoading: false })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Password change failed',
          })
          throw error
        }
      },

      clearError: () => set({ error: null }),

      // User management (admin only)
      users: [],
      usersLoading: false,
      fetchUsers: async () => {
        try {
          set({ usersLoading: true, error: null })
          const response = await apiClient.getUsers()
          set({ users: response.data?.users || [] })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch users' })
        } finally {
          set({ usersLoading: false })
        }
      },
      
      createUser: async (userData) => {
        try {
          set({ usersLoading: true, error: null })
          await apiClient.createUser(userData)
          // Refresh the users list
          const response = await apiClient.getUsers()
          set({ users: response.data?.users || [] })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create user' })
          throw error
        } finally {
          set({ usersLoading: false })
        }
      },

      resetUserPassword: async (userId, newPassword) => {
        try {
          set({ usersLoading: true, error: null })
          await apiClient.resetUserPassword(userId, newPassword)
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to reset password' })
          throw error
        } finally {
          set({ usersLoading: false })
        }
      },

      deactivateUser: async (userId) => {
        try {
          set({ usersLoading: true, error: null })
          await apiClient.deactivateUser(userId)
          // Refresh the users list
          const response = await apiClient.getUsers()
          set({ users: response.data?.users || [] })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to deactivate user' })
          throw error
        } finally {
          set({ usersLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // Restore function to properly initialize API client with token
      onRehydrateStorage: () => (state) => {
        // Set loading to false after rehydration
        setTimeout(() => {
          useAuthStore.setState({ isLoading: false })
        }, 0)
        
        if (state?.token) {
          const { apiClient } = require('../lib/api-client')
          apiClient.setToken(state.token)
        }
      },
    }
  )
)

// Menu Store for customer-facing menu
interface MenuState {
  categories: Category[]
  products: Product[]
  selectedCategory: string | null
  isLoading: boolean
  error: string | null
  searchQuery: string
  menuConfig: MenuConfig | null
  currentLang: string
  
  // Actions
  fetchCategories: (lang?: string) => Promise<void>
  fetchProducts: (categoryId?: string, lang?: string) => Promise<void>
  fetchPublicMenu: (lang?: string) => Promise<void>
  fetchMenuConfig: () => Promise<void>
  setSelectedCategory: (categoryId: string | null) => void
  setSearchQuery: (query: string) => void
  setLanguage: (lang: string) => void
  clearError: () => void
  
  // Computed properties
  filteredProducts: Product[]
  activeCategories: Category[]
}

export const useMenuStore = create<MenuState>((set, get) => ({
  categories: [],
  products: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  menuConfig: null,
  currentLang: 'ar',

  fetchCategories: async (lang = 'ar') => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.getCategories(lang)
      if (response.success && response.data) {
        set({ 
          categories: response.data.filter((cat: any) => cat.isActive),
          isLoading: false 
        })
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch categories',
      })
    }
  },

  fetchProducts: async (categoryId, lang = 'ar') => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.getProducts(categoryId, lang)
      if (response.success && response.data) {
        set({ 
          products: response.data.filter((product: any) => product.isActive),
          isLoading: false 
        })
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch products',
      })
    }
  },

  fetchPublicMenu: async (lang = 'ar') => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.getPublicCategories(lang)
      if (response.success && response.data) {
        set({ 
          categories: response.data.filter((cat: any) => cat.isActive),
          // Extract all products from categories
          products: response.data.flatMap((cat: any) => cat.products || []),
          isLoading: false,
          currentLang: lang
        })
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch menu',
      })
    }
  },

  fetchMenuConfig: async () => {
    try {
      const response = await apiClient.getMenuConfig()
      if (response.success && response.data) {
        set({ menuConfig: response.data })
      }
    } catch (error) {
      // Menu config is optional, don't set error
      console.warn('Failed to fetch menu config:', error)
    }
  },

  setSelectedCategory: (categoryId) => {
    const { currentLang } = get()
    set({ selectedCategory: categoryId })
    if (categoryId) {
      get().fetchProducts(categoryId, currentLang)
    } else {
      get().fetchProducts(undefined, currentLang)
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setLanguage: (lang) => {
    set({ currentLang: lang })
    // Reload data with new language
    get().fetchPublicMenu(lang)
  },
  
  clearError: () => set({ error: null }),

  get filteredProducts() {
    const { products, searchQuery, selectedCategory, currentLang } = get()
    let filtered = products

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((product: any) => product.categoryId === selectedCategory)
    }

    // Filter by search query - support both English and Arabic
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((product: any) => {
        const nameEn = product.nameEn?.toLowerCase() || ''
        const nameAr = product.nameAr?.toLowerCase() || ''
        const descEn = product.descriptionEn?.toLowerCase() || ''
        const descAr = product.descriptionAr?.toLowerCase() || ''
        
        return nameEn.includes(query) || 
               nameAr.includes(query) || 
               descEn.includes(query) || 
               descAr.includes(query)
      })
    }

    return filtered
  },

  get activeCategories() {
    const { categories } = get()
    return categories.filter((category: any) => category.isActive)
  },
}))

// Admin Store for content management
interface AdminState {
  categories: Category[]
  products: Product[]
  selectedProduct: Product | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchAdminCategories: () => Promise<void>
  fetchAdminProducts: () => Promise<void>
  createCategory: (category: Partial<Category>) => Promise<Category>
  updateCategory: (id: string, category: Partial<Category>) => Promise<Category>
  deleteCategory: (id: string) => Promise<void>
  createProduct: (product: Partial<Product>) => Promise<Product>
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  setSelectedProduct: (product: Product | null) => void
  uploadImage: (file: File, type: 'category' | 'product') => Promise<string>
  clearError: () => void
}

export const useAdminStore = create<AdminState>((set, get) => ({
  categories: [],
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchAdminCategories: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.getCategories()
      if (response.success && response.data) {
        set({ categories: response.data, isLoading: false })
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch categories',
      })
    }
  },

  fetchAdminProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.getProducts()
      if (response.success && response.data) {
        set({ products: response.data, isLoading: false })
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch products',
      })
    }
  },

  createCategory: async (categoryData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.createCategory(categoryData)
      if (response.success && response.data) {
        const newCategory = response.data
        set(state => ({
          categories: [...state.categories, newCategory],
          isLoading: false,
        }))
        return newCategory
      }
      throw new Error('Failed to create category')
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to create category',
      })
      throw error
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.updateCategory(id, categoryData)
      if (response.success && response.data) {
        const updatedCategory = response.data
        set(state => ({
          categories: state.categories.map(cat => 
            cat.id === id ? updatedCategory : cat
          ),
          isLoading: false,
        }))
        return updatedCategory
      }
      throw new Error('Failed to update category')
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to update category',
      })
      throw error
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.deleteCategory(id)
      if (response.success) {
        set(state => ({
          categories: state.categories.filter(cat => cat.id !== id),
          isLoading: false,
        }))
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to delete category',
      })
      throw error
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.createProduct(productData)
      if (response.success && response.data) {
        const newProduct = response.data
        set(state => ({
          products: [...state.products, newProduct],
          isLoading: false,
        }))
        return newProduct
      }
      throw new Error('Failed to create product')
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to create product',
      })
      throw error
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.updateProduct(id, productData)
      if (response.success && response.data) {
        const updatedProduct = response.data
        set(state => ({
          products: state.products.map(product => 
            product.id === id ? updatedProduct : product
          ),
          isLoading: false,
        }))
        return updatedProduct
      }
      throw new Error('Failed to update product')
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to update product',
      })
      throw error
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.deleteProduct(id)
      if (response.success) {
        set(state => ({
          products: state.products.filter(product => product.id !== id),
          isLoading: false,
        }))
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to delete product',
      })
      throw error
    }
  },

  uploadImage: async (file, type) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.uploadImage(file, type)
      if (response.success && response.data) {
        set({ isLoading: false })
        return response.data.url
      }
      throw new Error('Failed to upload image')
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to upload image',
      })
      throw error
    }
  },

  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  clearError: () => set({ error: null }),
}))

// Initialize auth token on app start - handle hydration properly
if (typeof window !== 'undefined') {
  // Wait for hydration to complete
  setTimeout(() => {
    const authState = useAuthStore.getState()
    if (authState.token) {
      apiClient.setToken(authState.token)
    }
    // Ensure loading is false after initialization
    if (authState.isLoading && !authState.token) {
      useAuthStore.setState({ isLoading: false })
    }
  }, 0)
}