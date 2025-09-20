import { 
  ApiResponse,
  User, 
  Category, 
  Product, 
  ProductVariation,
  MenuConfig,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest
} from '../../../shared/src/types'

// Define ChangePasswordRequest type locally since it's not in shared types yet
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    
    // Initialize token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    // Add auth token if available
    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP error! status: ${response.status}`,
          response.status,
          data.code
        )
      }

      return data as ApiResponse<T>
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error occurred', 0)
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async refreshToken(refreshRequest: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(refreshRequest),
    })
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    })
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    const result = await this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    })
    this.setToken(null)
    return result
  }

  // Categories endpoints
  async getCategories(lang?: string): Promise<ApiResponse<Category[]>> {
    const query = lang ? `?lang=${lang}` : ''
    return this.request<Category[]>(`/categories${query}`)
  }

  // Public categories with products (bilingual)
  async getPublicCategories(lang?: string): Promise<ApiResponse<Category[]>> {
    const query = lang ? `?lang=${lang}` : ''
    return this.request<Category[]>(`/categories/public${query}`)
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`)
  }

  async createCategory(category: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    })
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    })
  }

  async deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    })
  }

  // Products endpoints
  async getProducts(categoryId?: string, lang?: string): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams()
    if (categoryId) params.append('categoryId', categoryId)
    if (lang) params.append('lang', lang)
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<Product[]>(`/products${query}`)
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`)
  }

  async createProduct(product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
  }

  async deleteProduct(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Product variations endpoints
  async getProductVariations(productId: string): Promise<ApiResponse<ProductVariation[]>> {
    return this.request<ProductVariation[]>(`/products/${productId}/variations`)
  }

  async createProductVariation(
    productId: string, 
    variation: Partial<ProductVariation>
  ): Promise<ApiResponse<ProductVariation>> {
    return this.request<ProductVariation>(`/products/${productId}/variations`, {
      method: 'POST',
      body: JSON.stringify(variation),
    })
  }

  async updateProductVariation(
    productId: string,
    variationId: string,
    variation: Partial<ProductVariation>
  ): Promise<ApiResponse<ProductVariation>> {
    return this.request<ProductVariation>(`/products/${productId}/variations/${variationId}`, {
      method: 'PUT',
      body: JSON.stringify(variation),
    })
  }

  async deleteProductVariation(
    productId: string,
    variationId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/products/${productId}/variations/${variationId}`, {
      method: 'DELETE',
    })
  }

  // Menu configuration endpoints
  async getMenuConfig(): Promise<ApiResponse<MenuConfig>> {
    return this.request<MenuConfig>('/menu/config')
  }

  async updateMenuConfig(config: Partial<MenuConfig>): Promise<ApiResponse<MenuConfig>> {
    return this.request<MenuConfig>('/menu/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    })
  }

  // File upload endpoints
  async uploadImage(file: File, type: 'category' | 'product' = 'product'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', type)

    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {},
    }

    // Add auth token if available (don't set Content-Type for FormData)
    if (this.token) {
      config.headers = {
        Authorization: `Bearer ${this.token}`,
      }
    }

    const url = `${this.baseURL}/upload`
    
    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP error! status: ${response.status}`,
          response.status,
          data.code
        )
      }

      return data as ApiResponse<{ url: string }>
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error occurred during upload', 0)
    }
  }

  // User management endpoints (admin only)
  async getUsers(): Promise<ApiResponse<{ users: User[] }>> {
    return this.request<{ users: User[] }>('/auth/users')
  }

  async createUser(userData: { email: string; password: string; firstName?: string; lastName?: string; role?: string }): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ userId, newPassword }),
    })
  }

  async deactivateUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/auth/users/${userId}/deactivate`, {
      method: 'PATCH',
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request<{ status: string; timestamp: string }>('/health')
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient()

// Export the ApiClient class for testing or custom instances
export { ApiClient, ApiError }

// Export types for convenience
export type {
  ApiResponse,
  User,
  Category,
  Product,
  ProductVariation,
  MenuConfig,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  ChangePasswordRequest,
}