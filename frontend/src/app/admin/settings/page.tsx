'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuthStore } from '../../../store'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  isActive: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const { 
    user, 
    users,
    changePassword, 
    fetchUsers,
    createUser,
    resetUserPassword,
    deactivateUser,
    isLoading, 
    usersLoading,
    error, 
    clearError 
  } = useAuthStore()

  const [menuSettings, setMenuSettings] = useState({
    restaurantName: 'الســـرايــا',
    restaurantNameAr: 'الســـرايــا',
    description: 'Premium Beverage Menu',
    descriptionAr: 'قائمة مشروبات مميزة',
    currency: 'جنيه',
    showPrices: true,
    showDescriptions: true,
    defaultLanguage: 'ar'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // User management states
  const [showCreateUserForm, setShowCreateUserForm] = useState(false)
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
  const [userPasswords, setUserPasswords] = useState<{ [userId: string]: string }>({})
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })

  // Ref to track if users have been fetched to prevent infinite requests
  const hasFetchedUsers = useRef(false)

  // Clear errors on mount
  useEffect(() => {
    clearError()
  }, [clearError])

  // Authentication check
  useEffect(() => {
    if (!user) {
      router.push('/admin/login')
      return
    }
  }, [user, router])

    // Fetch users if user is admin - only once to prevent infinite requests
  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && !hasFetchedUsers.current && users.length === 0) {
      hasFetchedUsers.current = true
      fetchUsers()
    }
  }, [user, users.length]) // Remove fetchUsers from dependencies to prevent infinite loop

  const handleMenuSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd save these to the backend
    setSuccessMessage('تم تحديث إعدادات القائمة بنجاح!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('كلمات المرور الجديدة غير متطابقة')
      return
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
      setSuccessMessage('تم تغيير كلمة المرور بنجاح!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      // Error is handled by the store
    }
  }

  // User management functions
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createUser(newUserData)
      setNewUserData({ email: '', password: '', firstName: '', lastName: '' })
      setShowCreateUserForm(false)
      setSuccessMessage('تم إنشاء المستخدم بنجاح!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      // Error is handled by the store
    }
  }

  const handleResetPassword = async (userId: string) => {
    const newPassword = userPasswords[userId]
    if (!newPassword) {
      alert('يرجى إدخال كلمة مرور جديدة')
      return
    }

    try {
      await resetUserPassword(userId, newPassword)
      setUserPasswords({ ...userPasswords, [userId]: '' })
      setSuccessMessage('تم إعادة تعيين كلمة المرور بنجاح!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      // Error is handled by the store
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    if (confirm('هل أنت متأكد من إلغاء تفعيل هذا المستخدم؟')) {
      try {
        await deactivateUser(userId)
        setSuccessMessage('تم إلغاء تفعيل المستخدم بنجاح!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } catch (error) {
        // Error is handled by the store
      }
    }
  }

  const toggleUserExpansion = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId)
  }

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-wood p-6 mb-6">
      <h2 className="text-lg font-display font-semibold text-text-primary mb-4 text-right">{title}</h2>
      {children}
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
                alt="شعار الســـرايــا"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <h1 className="text-xl font-display font-bold text-text-primary">
                الإعدادات
              </h1>
            </div>
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
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-right">
            <p className="text-green-600">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-right">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Menu Settings */}
        <SettingsSection title="إعدادات القائمة">
          <form onSubmit={handleMenuSettingsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                  اسم المطعم (العربي)
                </label>
                <input
                  type="text"
                  value={menuSettings.restaurantNameAr}
                  onChange={(e) => setMenuSettings({ ...menuSettings, restaurantNameAr: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                  اسم المطعم (الإنجليزي)
                </label>
                <input
                  type="text"
                  value={menuSettings.restaurantName}
                  onChange={(e) => setMenuSettings({ ...menuSettings, restaurantName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                  وصف القائمة (العربي)
                </label>
                <textarea
                  value={menuSettings.descriptionAr}
                  onChange={(e) => setMenuSettings({ ...menuSettings, descriptionAr: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                  وصف القائمة (الإنجليزي)
                </label>
                <textarea
                  value={menuSettings.description}
                  onChange={(e) => setMenuSettings({ ...menuSettings, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                  العملة
                </label>
                <input
                  type="text"
                  value={menuSettings.currency}
                  onChange={(e) => setMenuSettings({ ...menuSettings, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                />
              </div>
              <div className="flex items-center pt-6 justify-end">
                <label htmlFor="showPrices" className="mr-2 block text-sm text-text-primary">
                  عرض الأسعار
                </label>
                <input
                  type="checkbox"
                  id="showPrices"
                  checked={menuSettings.showPrices}
                  onChange={(e) => setMenuSettings({ ...menuSettings, showPrices: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center pt-6 justify-end">
                <label htmlFor="showDescriptions" className="mr-2 block text-sm text-text-primary">
                  عرض الأوصاف
                </label>
                <input
                  type="checkbox"
                  id="showDescriptions"
                  checked={menuSettings.showDescriptions}
                  onChange={(e) => setMenuSettings({ ...menuSettings, showDescriptions: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                حفظ إعدادات القائمة
              </button>
            </div>
          </form>
        </SettingsSection>

        {/* Account Settings */}
        <SettingsSection title="إعدادات الحساب">
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-row-reverse">
              <div className="text-right">
                <p className="font-medium text-text-primary">تغيير كلمة المرور</p>
                <p className="text-sm text-text-secondary">قم بتحديث كلمة المرور الخاصة بك</p>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                {showPasswordForm ? 'إلغاء' : 'تغيير كلمة المرور'}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                    كلمة المرور الحالية
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-reverse space-x-3">
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </SettingsSection>

        {/* User Management - Admin Only */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <SettingsSection title="إدارة المستخدمين">
            <div className="space-y-4">
              {/* Create New User Button */}
              <div className="flex justify-between items-center flex-row-reverse">
                <div className="text-right">
                  <p className="font-medium text-text-primary">إضافة مستخدم جديد</p>
                  <p className="text-sm text-text-secondary">إنشاء حساب مستخدم جديد للنظام</p>
                </div>
                <button
                  onClick={() => setShowCreateUserForm(!showCreateUserForm)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  {showCreateUserForm ? 'إلغاء' : 'إضافة مستخدم'}
                </button>
              </div>

              {/* Create User Form */}
              {showCreateUserForm && (
                <form onSubmit={handleCreateUser} className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                        كلمة المرور
                      </label>
                      <input
                        type="password"
                        value={newUserData.password}
                        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                        الاسم الأول (اختياري)
                      </label>
                      <input
                        type="text"
                        value={newUserData.firstName}
                        onChange={(e) => setNewUserData({ ...newUserData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                        الاسم الأخير (اختياري)
                      </label>
                      <input
                        type="text"
                        value={newUserData.lastName}
                        onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-reverse space-x-3">
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                      disabled={usersLoading}
                    >
                      {usersLoading ? 'جاري الإنشاء...' : 'إنشاء المستخدم'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateUserForm(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}

              {/* Users List */}
              <div className="mt-6">
                <h3 className="text-md font-medium text-text-primary mb-4 text-right">المستخدمون الحاليون</h3>
                {users.length === 0 ? (
                  <p className="text-text-secondary text-center py-4">لا توجد مستخدمون حاليًا</p>
                ) : (
                  <div className="space-y-3">
                    {users.map((userData) => (
                      <div key={userData.id} className="border border-gray-200 rounded-lg bg-white">
                        {/* User Card Header */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => toggleUserExpansion(userData.id)}
                        >
                          <div className="flex justify-between items-center flex-row-reverse">
                            <div className="text-right">
                              <p className="font-medium text-text-primary">
                                {userData.firstName && userData.lastName 
                                  ? `${userData.firstName} ${userData.lastName}` 
                                  : userData.email}
                              </p>
                              <p className="text-sm text-text-secondary">{userData.email}</p>
                              <div className="flex items-center space-x-reverse space-x-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  userData.isActive 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-red-100 text-red-600'
                                }`}>
                                  {userData.isActive ? 'نشط' : 'معطل'}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                                  {userData.role === 'SUPER_ADMIN' ? 'مدير عام' : 
                                   userData.role === 'ADMIN' ? 'مدير' : 'مدير فرعي'}
                                </span>
                              </div>
                            </div>
                            <svg 
                              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                expandedUserId === userData.id ? 'transform rotate-180' : ''
                              }`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* User Card Expanded Content */}
                        {expandedUserId === userData.id && (
                          <div className="px-4 pb-4 border-t border-gray-100">
                            <div className="mt-4 space-y-4">
                              {/* Password Reset */}
                              <div>
                                <label className="block text-sm font-medium text-text-primary mb-2 text-right">
                                  إعادة تعيين كلمة المرور
                                </label>
                                <div className="flex space-x-reverse space-x-2">
                                  <input
                                    type="password"
                                    value={userPasswords[userData.id] || ''}
                                    onChange={(e) => setUserPasswords({ 
                                      ...userPasswords, 
                                      [userData.id]: e.target.value 
                                    })}
                                    placeholder="كلمة المرور الجديدة"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                                  />
                                  <button
                                    onClick={() => handleResetPassword(userData.id)}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                    disabled={!userPasswords[userData.id] || usersLoading}
                                  >
                                    تحديث
                                  </button>
                                </div>
                              </div>

                              {/* Deactivate User */}
                              {userData.isActive && userData.id !== user?.id && (
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleDeactivateUser(userData.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                    disabled={usersLoading}
                                  >
                                    إلغاء التفعيل
                                  </button>
                                </div>
                              )}
                              
                              {userData.id === user?.id && (
                                <p className="text-sm text-blue-600 text-right">هذا هو حسابك الحالي</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SettingsSection>
        )}

        {/* System Information */}
        <SettingsSection title="معلومات النظام">
          <div className="space-y-4 text-right">
            <div className="flex justify-between items-center flex-row-reverse">
              <div>
                <p className="font-medium text-text-primary">إصدار النظام</p>
                <p className="text-sm text-text-secondary">نظام إدارة قائمة الســـرايــا v1.0</p>
              </div>
            </div>
            <div className="flex justify-between items-center flex-row-reverse">
              <div>
                <p className="font-medium text-text-primary">آخر تحديث</p>
                <p className="text-sm text-text-secondary">20 سبتمبر 2025</p>
              </div>
            </div>
            <div className="flex justify-between items-center flex-row-reverse">
              <div>
                <p className="font-medium text-text-primary">المستخدم الحالي</p>
                <p className="text-sm text-text-secondary">{user?.email}</p>
              </div>
            </div>
          </div>
        </SettingsSection>
      </main>
    </div>
  )
}
