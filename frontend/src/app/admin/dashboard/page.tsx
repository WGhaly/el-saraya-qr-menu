'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../../store'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'

// Admin Stats Card Component
interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-wood p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
          <p className="text-2xl font-display font-bold text-text-primary mt-2">{value}</p>
          {description && (
            <p className="text-sm text-text-light mt-1">{description}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

// Quick Action Button Component
interface QuickActionProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}

function QuickAction({ title, description, icon, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-wood p-6 text-right hover:shadow-wood-lg transition-shadow duration-200 w-full"
    >
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>
    </button>
  )
}

export default function AdminDashboard() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalProducts: 0,
    totalOrders: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/admin/login')
      return
    }

    // Simulate loading stats (you can replace this with actual API calls)
    const loadStats = async () => {
      try {
        // In a real app, you'd fetch these from your API
        setStats({
          totalCategories: 5,
          totalProducts: 18,
          totalOrders: 142
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [user, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const quickActions = [
    {
      title: 'إدارة الأصناف',
      description: 'إضافة أو تعديل أو حذف أصناف القائمة',
      icon: (
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      onClick: () => router.push('/admin/categories')
    },
    {
      title: 'إدارة المنتجات',
      description: 'إضافة وتعديل وحذف عناصر القائمة وتعديل الأسعار',
      icon: (
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      onClick: () => router.push('/admin/products')
    },
    {
      title: 'إعدادات القائمة',
      description: 'تكوين عرض القائمة وإعدادات المطعم',
      icon: (
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      onClick: () => router.push('/admin/settings')
    },
    {
      title: 'معاينة القائمة',
      description: 'اعرض كيف يرى العملاء قائمتك',
      icon: (
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: () => window.open('/', '_blank')
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-wood flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-wood">
      {/* Header */}
      <header className="bg-white shadow-wood-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <img 
                src="/saraya-logo.jpeg" 
                alt="شعار سراية" 
                className="w-10 h-10 object-contain rounded-lg"
              />
              <div className="text-2xl font-display font-bold text-primary-600">
                لوحة تحكم سراية
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="text-sm text-text-secondary">
                مرحباً، {user?.email}
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            إدارة القائمة
          </h1>
          <p className="text-text-secondary">
            إدارة قائمة مشروبات سراية الرقمية - الأصناف والمنتجات والأسعار
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatsCard
            title="إجمالي الأصناف"
            value={stats.totalCategories}
            description="أصناف القائمة"
            icon={
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatsCard
            title="إجمالي المنتجات"
            value={stats.totalProducts}
            description="عناصر القائمة"
            icon={
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-display font-semibold text-text-primary mb-4">
            إجراءات سريعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickAction
                key={index}
                title={action.title}
                description={action.description}
                icon={action.icon}
                onClick={action.onClick}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-wood p-6">
          <h2 className="text-xl font-display font-semibold text-text-primary mb-4">
            آخر تغييرات القائمة
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-primary-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">منتج جديد تمت إضافته</p>
                <p className="text-xs text-text-secondary">قهوة النوتيلا تمت إضافتها لصنف القهوة</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-amber-50 rounded-lg">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">تم تحديث السعر</p>
                <p className="text-xs text-text-secondary">تم تحديث أسعار صنف المشروبات الساخنة</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">تم تحديث الصورة</p>
                <p className="text-xs text-text-secondary">تم تحديث صور العصائر الطازجة</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}