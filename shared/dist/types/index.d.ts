export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER"
}
export interface Category {
    id: string;
    name?: string;
    nameEn: string;
    nameAr: string;
    description?: string;
    descriptionEn?: string;
    descriptionAr?: string;
    imageUrl?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    createdById: string;
    updatedBy?: User;
    updatedById?: string;
    products?: Product[];
}
export interface CreateCategoryRequest {
    name?: string;
    nameEn: string;
    nameAr: string;
    description?: string;
    descriptionEn?: string;
    descriptionAr?: string;
    imageUrl?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface UpdateCategoryRequest {
    name?: string;
    nameEn?: string;
    nameAr?: string;
    description?: string;
    descriptionEn?: string;
    descriptionAr?: string;
    imageUrl?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface Product {
    id: string;
    name?: string;
    nameEn: string;
    nameAr: string;
    description?: string;
    descriptionEn?: string;
    descriptionAr?: string;
    basePrice: number;
    imageUrl?: string;
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
    preparationTime?: string;
    ingredientsEn?: string[];
    ingredientsAr?: string[];
    ingredients?: string[];
    allergensEn?: string[];
    allergensAr?: string[];
    allergens?: string[];
    nutritionInfo?: NutritionInfo;
    createdAt: Date;
    updatedAt: Date;
    category: Category;
    categoryId: string;
    variations?: ProductVariation[];
    createdBy: User;
    createdById: string;
    updatedBy?: User;
    updatedById?: string;
}
export interface CreateProductRequest {
    name: string;
    description?: string;
    basePrice: number;
    imageUrl?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    sortOrder?: number;
    preparationTime?: string;
    ingredients?: string[];
    allergens?: string[];
    nutritionInfo?: NutritionInfo;
    categoryId: string;
}
export interface UpdateProductRequest {
    name?: string;
    description?: string;
    basePrice?: number;
    imageUrl?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    sortOrder?: number;
    preparationTime?: string;
    ingredients?: string[];
    allergens?: string[];
    nutritionInfo?: NutritionInfo;
    categoryId?: string;
}
export interface ProductVariation {
    id: string;
    name?: string;
    nameEn: string;
    nameAr: string;
    type: VariationType;
    priceModifier: number;
    isDefault: boolean;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    product: Product;
    productId: string;
}
export declare enum VariationType {
    SIZE = "SIZE",
    TEMPERATURE = "TEMPERATURE",
    EXTRAS = "EXTRAS",
    SWEETNESS = "SWEETNESS",
    ICE_LEVEL = "ICE_LEVEL",
    MILK_TYPE = "MILK_TYPE"
}
export interface CreateVariationRequest {
    name: string;
    type: VariationType;
    priceModifier?: number;
    isDefault?: boolean;
    isActive?: boolean;
    sortOrder?: number;
    productId: string;
}
export interface UpdateVariationRequest {
    name?: string;
    type?: VariationType;
    priceModifier?: number;
    isDefault?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}
export interface MenuConfig {
    id: string;
    restaurantName: string;
    restaurantDescription?: string;
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    menuQrCode?: string;
    menuUrl?: string;
    isActive: boolean;
    openingHours?: OpeningHours;
    contactInfo?: ContactInfo;
    socialLinks?: SocialLinks;
    createdAt: Date;
    updatedAt: Date;
}
export interface OpeningHours {
    [key: string]: {
        open: string;
        close: string;
        isClosed: boolean;
    };
}
export interface ContactInfo {
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
}
export interface SocialLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
}
export interface NutritionInfo {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    sugar?: number;
    caffeine?: number;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
export interface RefreshTokenRequest {
    refreshToken: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface MenuCategory {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    sortOrder: number;
    products: MenuProduct[];
}
export interface MenuProduct {
    id: string;
    name: string;
    description?: string;
    basePrice: number;
    imageUrl?: string;
    preparationTime?: string;
    ingredients?: string[];
    allergens?: string[];
    variations: MenuVariation[];
}
export interface MenuVariation {
    id: string;
    name: string;
    type: VariationType;
    priceModifier: number;
    isDefault: boolean;
}
export interface FullMenu {
    restaurant: {
        name: string;
        description?: string;
        logoUrl?: string;
        contactInfo?: ContactInfo;
        openingHours?: OpeningHours;
    };
    categories: MenuCategory[];
}
export interface FileUploadResponse {
    success: boolean;
    fileUrl: string;
    fileName: string;
    fileSize: number;
}
export interface ApiError {
    message: string;
    code: string;
    details?: any;
}
//# sourceMappingURL=index.d.ts.map