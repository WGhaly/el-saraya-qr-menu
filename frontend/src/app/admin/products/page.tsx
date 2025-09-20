'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminStore, useAuthStore } from '../../../store'

// Using any type for flexibility with the store data
type AdminProduct = any
type AdminCategory = any

export default function ProductsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { 
    products, 
    categories, 
    fetchAdminProducts, 
    fetchAdminCategories,
    createProduct, 
    updateProduct, 
    deleteProduct,
    isLoading,
    error 
  } = useAdminStore()

  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    basePrice: '',
    categoryId: '',
    isActive: true
  })

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('nameAr')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }
    fetchAdminProducts()
    fetchAdminCategories()
  }, [isAuthenticated, router, fetchAdminProducts, fetchAdminCategories])

  const handleOpenModal = (product?: AdminProduct) => {
    if (product) {
      setSelectedProduct(product)
      setFormData({
        nameAr: product.nameAr || '',
        nameEn: product.nameEn || '',
        descriptionAr: product.descriptionAr || '',
        descriptionEn: product.descriptionEn || '',
        basePrice: product.basePrice.toString(),
        categoryId: product.categoryId,
        isActive: product.isActive
      })
    } else {
      setSelectedProduct(null)
      setFormData({
        nameAr: '',
        nameEn: '',
        descriptionAr: '',
        descriptionEn: '',
        basePrice: '',
        categoryId: '',
        isActive: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const productData = {
        basePrice: parseFloat(formData.basePrice),
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        descriptionAr: formData.descriptionAr,
        descriptionEn: formData.descriptionEn,
        categoryId: formData.categoryId,
        isActive: formData.isActive
      }
      
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData)
      } else {
        await createProduct(productData)
      }
      
      handleCloseModal()
      fetchAdminProducts()
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const handleDelete = async (productId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await deleteProduct(productId)
        fetchAdminProducts()
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  // Filter and search logic
  const filteredProducts = products.filter(product => {
    // Search filter
    const searchMatch = searchQuery.trim() === '' || 
      product.nameAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descriptionAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descriptionEn?.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Category filter
    const categoryMatch = categoryFilter === 'all' || product.categoryId === categoryFilter
    
    // Status filter
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'active' && product.isActive) ||
      (statusFilter === 'inactive' && !product.isActive)
    
    // Price range filter
    const price = Number(product.basePrice)
    const minPrice = priceRange.min ? Number(priceRange.min) : 0
    const maxPrice = priceRange.max ? Number(priceRange.max) : Infinity
    const priceMatch = price >= minPrice && price <= maxPrice
    
    return searchMatch && categoryMatch && statusMatch && priceMatch
  }).sort((a, b) => {
    switch (sortBy) {
      case 'nameAr':
        return (a.nameAr || '').localeCompare(b.nameAr || '')
      case 'nameEn':
        return (a.nameEn || '').localeCompare(b.nameEn || '')
      case 'price':
        return Number(a.basePrice) - Number(b.basePrice)
      case 'category':
        return (a.category?.nameAr || '').localeCompare(b.category?.nameAr || '')
      default:
        return (a.nameAr || '').localeCompare(b.nameAr || '')
    }
  })

  const ProductCard = ({ product }: { product: AdminProduct }) => (
    <div className="bg-white rounded-xl shadow-wood p-6" dir="rtl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary text-right">{product.nameAr || product.nameEn}</h3>
          <p className="text-xs text-text-light mt-1 text-right">
            {product.category?.nameAr || product.category?.nameEn}
          </p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-lg font-bold text-primary-600">
            {product.basePrice} جنيه
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            product.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {product.isActive ? 'نشط' : 'غير نشط'}
          </span>
        </div>
      </div>
      
      {(product.descriptionAr || product.descriptionEn) && (
        <p className="text-sm text-text-secondary mb-3 line-clamp-2 text-right">
          {product.descriptionAr || product.descriptionEn}
        </p>
      )}
      
      <div className="flex justify-start space-x-2 space-x-reverse">
        <button
          onClick={() => handleOpenModal(product)}
          className="px-4 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 text-sm font-medium"
        >
          تعديل
        </button>
        <button
          onClick={() => handleDelete(product.id)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium"
        >
          حذف
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-wood" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-wood-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 flex-row-reverse">
            <div className="flex items-center space-x-reverse space-x-4">
              {/* Logo */}
              <img 
                src="/saraya-logo.jpeg" 
                alt="Saraya Logo" 
                className="h-10 w-auto rounded-lg"
              />
              <h1 className="text-xl font-display font-bold text-text-primary">
                إدارة المنتجات
              </h1>
            </div>
            <div className="flex items-center space-x-reverse space-x-3">
              <button
                onClick={() => handleOpenModal()}
                className="btn-primary"
              >
                إضافة منتج
              </button>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center space-x-reverse space-x-2 text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-lg font-medium transition-colors duration-200"
                title="العودة للوحة التحكم"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>رجوع</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" dir="rtl">
            <p className="text-red-600 text-right">{error}</p>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow-wood p-6" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                البحث في المنتجات
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="ابحث بالاسم أو الوصف..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                التصنيف
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              >
                <option value="all">جميع التصنيفات</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.nameAr || category.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                الحالة
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              >
                <option value="all">جميع المنتجات</option>
                <option value="active">المنتجات النشطة</option>
                <option value="inactive">المنتجات غير النشطة</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                ترتيب حسب
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              >
                <option value="nameAr">الاسم العربي</option>
                <option value="nameEn">الاسم الإنجليزي</option>
                <option value="price">السعر</option>
                <option value="category">التصنيف</option>
              </select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                نطاق السعر
              </label>
              <div className="flex space-x-2 space-x-reverse">
                <input
                  type="number"
                  placeholder="من"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                />
                <span className="flex items-center text-gray-500">إلى</span>
                <input
                  type="number"
                  placeholder="إلى"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('all')
                  setStatusFilter('all')
                  setPriceRange({ min: '', max: '' })
                  setSortBy('nameAr')
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors duration-200"
              >
                إعادة تعيين الفلاتر
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-text-secondary text-right">
            عرض {filteredProducts.length} من {products.length} منتج
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12" dir="rtl">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">لا يوجد منتجات</h3>
            <p className="text-text-secondary mb-4">ابدأ بإضافة أول منتج لك.</p>
            <button onClick={() => handleOpenModal()} className="btn-primary">
              إضافة منتج
            </button>
          </div>
        ) : (
          <div className="text-center py-12" dir="rtl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-text-secondary mb-4">جرب تغيير معايير البحث أو الفلترة.</p>
            <button 
              onClick={() => {
                setSearchQuery('')
                setCategoryFilter('all')
                setStatusFilter('all')
                setPriceRange({ min: '', max: '' })
                setSortBy('nameAr')
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-text-primary">
                  {selectedProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                      اسم المنتج بالعربية
                    </label>
                    <input
                      type="text"
                      value={formData.nameAr}
                      onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                      اسم المنتج بالإنجليزية
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                      السعر (جنيه)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                      التصنيف
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                      required
                    >
                      <option value="">اختر التصنيف</option>
                      {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.nameAr || category.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                      الوصف بالعربية
                    </label>
                    <textarea
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                      الوصف بالإنجليزية
                    </label>
                    <textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <label htmlFor="isActive" className="mr-2 block text-sm text-text-primary">
                    نشط (ظاهر للعملاء)
                  </label>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex justify-start space-x-3 space-x-reverse pt-4">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'جاري الحفظ...' : selectedProduct ? 'تحديث المنتج' : 'إنشاء المنتج'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-secondary"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}