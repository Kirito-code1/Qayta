"use client";

// --- Типы и Интерфейсы ---

export type DiscountReason = 
  | 'expiring_soon' 
  | 'damaged_packaging' 
  | 'overstock' 
  | 'outdated_collection' 
  | 'seasonal' 
  | 'other';

export interface UserProfile {
  full_name: string;
  email: string;
  password?: string;
  city: string;
  phone: string;
  role: 'user' | 'admin';
  eco_coins: number;
  total_waste_prevented_kg: number;
  total_co2_saved_kg: number;
  total_orders: number;
}

export interface Order {
  id: string;
  product_title: string;
  buyer_name: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'completed' | 'cancelled' | 'active' | 'confirmed';
  created_date: string;
  product_image: string;
}

export interface Product {
  id: string;
  title: string;
  name: string; 
  description?: string;
  category?: string;
  discounted_price: number;
  price: number; 
  original_price: number;
  quantity_available: number;
  status: string;
  image_url: string;
  image: string; 
  discount_reason: DiscountReason;
  seller_name: string;
  expiration_date?: string;
}

// --- Ключи для LocalStorage (Единые для всего приложения) ---
const STORAGE_KEYS = {
  PRODUCTS: 'eco_market_products',
  USER: 'eco_market_auth_data', // Тот самый ключ для авторизации
  ORDERS: 'eco_market_orders'
};

const isClient = typeof window !== 'undefined';

// --- Функции получения данных ---

export const getStoredUser = (): UserProfile | null => {
  if (!isClient) return null;
  const saved = localStorage.getItem(STORAGE_KEYS.USER);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
};

export const getStoredProducts = (): Product[] => {
  if (!isClient) return [];
  const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return saved ? JSON.parse(saved) : [];
};

export const getStoredOrders = (): Order[] => {
  if (!isClient) return [];
  const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return saved ? JSON.parse(saved) : [];
};

// --- Константы для экспорта ---
export const mockUser = getStoredUser();
export const mockProducts = getStoredProducts();
export const mockOrders = getStoredOrders();

// --- Функции обновления ---

// Обновление профиля (используется при регистрации и смене данных)
export const updateUserInfo = (newData: Partial<UserProfile>) => {
  if (!isClient) return;
  const current = getStoredUser();
  
  const baseUser: UserProfile = {
    full_name: "",
    email: "",
    password: "",
    city: "",
    phone: "",
    role: 'user',
    eco_coins: 0,
    total_waste_prevented_kg: 0,
    total_co2_saved_kg: 0,
    total_orders: 0,
  };

  const updated = { ...(current || baseUser), ...newData };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  
  // Принудительно обновляем страницу, чтобы все компоненты увидели изменения
  if (isClient) {
    window.location.reload();
  }
  return updated;
};

// Сохранение нового товара
export const saveProductMock = (data: Partial<Product>) => {
  if (!isClient) return data;
  const currentProducts = getStoredProducts();
  
  const newProduct: Product = {
    id: (data.id as string) || `p${Date.now()}`,
    title: data.title || data.name || "Без названия",
    name: data.title || data.name || "Без названия",
    description: data.description || "",
    category: data.category || "other",
    discounted_price: Number(data.discounted_price || data.price) || 0,
    price: Number(data.discounted_price || data.price) || 0,
    original_price: Number(data.original_price) || 0,
    quantity_available: Number(data.quantity_available) || 1,
    status: data.status || "active",
    image_url: data.image_url || data.image || "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400",
    image: data.image_url || data.image || "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400",
    discount_reason: (data.discount_reason as DiscountReason) || "other",
    seller_name: data.seller_name || "Eco Merchant",
    expiration_date: data.expiration_date || new Date(Date.now() + 172800000).toISOString(),
  };

  const updated = [newProduct, ...currentProducts];
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  return newProduct;
};