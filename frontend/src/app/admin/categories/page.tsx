'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAdminStore, useAuthStore } from '../../../store'

// Using the Category type that's already imported in the store from shared types
// We need to use 'any' temporarily until we fix the type compatibility
type CategoryType = any

export default function CategoriesPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { 
    categories, 
    fetchAdminCategories,
    createCategory, 
    updateCategory, 
    deleteCategory,
    isLoading,
    error 
  } = useAdminStore()

  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null)
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    imageUrl: '',
    isActive: true,
    sortOrder: 0
  })

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'active', 'inactive'
  const [sortBy, setSortBy] = useState('sortOrder') // 'sortOrder', 'nameAr', 'nameEn'

  // Authentication check
  useEffect(() => {
    if (!user) {
      router.push('/admin/login')
      return
    }
  }, [user, router])

  useEffect(() => {
    fetchAdminCategories()
  }, [fetchAdminCategories])

  const handleOpenModal = (category?: CategoryType) => {
    if (category) {
      setSelectedCategory(category)
      setFormData({
        nameAr: category.nameAr || '',
        nameEn: category.nameEn || '',
        descriptionAr: category.descriptionAr || '',
        descriptionEn: category.descriptionEn || '',
        imageUrl: category.imageUrl || '',
        isActive: category.isActive,
        sortOrder: category.sortOrder
      })
    } else {
      setSelectedCategory(null)
      setFormData({
        nameAr: '',
        nameEn: '',
        descriptionAr: '',
        descriptionEn: '',
        imageUrl: '',
        isActive: true,
        sortOrder: categories.length + 1
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedCategory(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const categoryData = {
        ...formData,
        sortOrder: parseInt(formData.sortOrder.toString())
      }

      if (selectedCategory) {
        await updateCategory(selectedCategory.id, categoryData)
      } else {
        await createCategory(categoryData)
      }
      
      handleCloseModal()
      fetchAdminCategories()
    } catch (error) {
      console.error('Failed to save category:', error)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also affect all products in this category.')) {
      try {
        await deleteCategory(categoryId)
        fetchAdminCategories()
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  // Filter and search logic
  const filteredCategories = categories.filter(category => {
    // Search filter
    const searchMatch = searchQuery.trim() === '' || 
      category.nameAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.descriptionAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.descriptionEn?.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Status filter
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'active' && category.isActive) ||
      (statusFilter === 'inactive' && !category.isActive)
    
    return searchMatch && statusMatch
  }).sort((a, b) => {
    switch (sortBy) {
      case 'nameAr':
        return (a.nameAr || '').localeCompare(b.nameAr || '')
      case 'nameEn':
        return (a.nameEn || '').localeCompare(b.nameEn || '')
      case 'sortOrder':
      default:
        return a.sortOrder - b.sortOrder
    }
  })

  const CategoryCard = ({ category }: { category: CategoryType }) => (
    <div className="bg-white rounded-xl shadow-wood p-6">
      <div className="flex justify-between items-start mb-4 flex-row-reverse">
        <div className="flex-1 text-right">
          <div className="flex items-center space-x-reverse space-x-2 mb-2 justify-end">
            <span className={`px-2 py-1 rounded-full text-xs ${
              category.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {category.isActive ? 'نشط' : 'غير نشط'}
            </span>
          </div>
          <h3 className="font-semibold text-text-primary text-lg mb-1">{category.nameAr || category.nameEn}</h3>
          <p className="text-xs text-text-light">ترتيب العرض: {category.sortOrder}</p>
        </div>
      </div>
      
      {(category.descriptionAr || category.descriptionEn) && (
        <p className="text-sm text-text-secondary mb-3 line-clamp-2 text-right">
          {category.descriptionAr || category.descriptionEn}
        </p>
      )}
      
      {category.imageUrl && (
        <div className="mb-4">
          <img 
            src={category.imageUrl} 
            alt={category.nameAr || category.nameEn}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="flex justify-start space-x-reverse space-x-2">
        <button
          onClick={() => handleDelete(category.id)}
          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
        >
          حذف
        </button>
        <button
          onClick={() => handleOpenModal(category)}
          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 text-sm"
        >
          تعديل
        </button>
      </div>
    </div>
  )

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-wood" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-wood-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 flex-row-reverse">
            <div className="flex items-center space-x-reverse space-x-4">
              <Image
                src="/saraya-logo.jpeg"
                alt="شعار سراية"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <h1 className="text-xl font-display font-bold text-text-primary">
                إدارة الفئات
              </h1>
            </div>
            <div className="flex items-center space-x-reverse space-x-3">
              <button
                onClick={() => handleOpenModal()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                إضافة فئة
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-right">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow-wood p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                البحث في الفئات
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

            {/* Status Filter */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                حالة النشاط
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              >
                <option value="all">جميع الفئات</option>
                <option value="active">الفئات النشطة</option>
                <option value="inactive">الفئات غير النشطة</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                ترتيب حسب
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              >
                <option value="sortOrder">ترتيب العرض</option>
                <option value="nameAr">الاسم العربي</option>
                <option value="nameEn">الاسم الإنجليزي</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-text-secondary text-right">
            عرض {filteredCategories.length} من {categories.length} فئة
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">لم يتم العثور على فئات</h3>
            <p className="text-text-secondary mb-4">ابدأ بإضافة أول فئة لك.</p>
            <button 
              onClick={() => handleOpenModal()} 
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              إضافة فئة
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
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
                setStatusFilter('all')
                setSortBy('sortOrder')
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6" dir="rtl">
              <div className="flex justify-between items-center mb-6 flex-row-reverse">
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-xl font-display font-bold text-text-primary">
                  {selectedCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                      اسم الفئة (العربي)
                    </label>
                    <input
                      type="text"
                      value={formData.nameAr}
                      onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                      placeholder="مثال: مشروبات ساخنة"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                      اسم الفئة (الإنجليزي)
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left"
                      placeholder="Example: Hot Beverages"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                      الوصف (العربي)
                    </label>
                    <textarea
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                      placeholder="وصف مختصر للفئة..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                      الوصف (الإنجليزي)
                    </label>
                    <textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left"
                      placeholder="Brief category description..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                    رابط الصورة
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                      ترتيب العرض
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center pt-6 justify-end">
                    <label htmlFor="isActive" className="mr-2 block text-sm text-text-primary">
                      نشط (مرئي للعملاء)
                    </label>
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-reverse space-x-3 pt-4">
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'جاري الحفظ...' : selectedCategory ? 'تحديث الفئة' : 'إنشاء الفئة'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
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