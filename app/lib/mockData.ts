"use client";

// --- 1. Типы и Интерфейсы ---

export type DiscountReason = 
  | 'expiring_soon' 
  | 'damaged_packaging' 
  | 'overstock' 
  | 'outdated_collection' 
  | 'seasonal' 
  | 'other';

export interface Product {
  id: string;
  coordinates?: [number, number];
  title: string;
  description?: string;location?: string; 
  created_at?: string;
  category: string;
  original_price: number;
  discounted_price: number;
  quantity_available: number;
  image: string;      
  sellerEmail: string; 
  seller_name: string;
  status: 'active' | 'sold' | string;
  discount_reason: DiscountReason;
  expiration_date?: string;
}

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
  sellerEmail?: string; 
}

// --- 2. Ключи LocalStorage ---

const STORAGE_KEYS = {
  PRODUCTS: 'eco_market_products',
  USER: 'eco_market_auth_data',
  ORDERS: 'eco_market_orders'
};

const isClient = typeof window !== 'undefined';

// --- 3. Функции получения данных ---

/**
 * Получает данные текущего пользователя
 */
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

/**
 * Получает все товары из хранилища
 */
export const getAllProducts = (): Product[] => {
  if (!isClient) return [];
  const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return saved ? JSON.parse(saved) : [];
};

export const getStoredProducts = getAllProducts;

/**
 * Получает все заказы из хранилища
 */
export const getStoredOrders = (): Order[] => {
  if (!isClient) return [];
  const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return saved ? JSON.parse(saved) : [];
};

// --- 4. Функции обновления и удаления (Actions) ---

/**
 * Обновляет данные профиля
 */
export const updateUserInfo = (newData: Partial<UserProfile>) => {
  if (!isClient) return;
  const current = getStoredUser();
  const baseUser: UserProfile = {
    full_name: "", email: "", city: "", phone: "",
    role: 'user', eco_coins: 0, total_waste_prevented_kg: 0,
    total_co2_saved_kg: 0, total_orders: 0,
  };

  const updated = { ...(current || baseUser), ...newData };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  window.location.reload();
  return updated;
};

/**
 * Сохраняет новый товар
 */
export const saveProductMock = (data: Partial<Product>) => {
  if (!isClient) return;
  
  const currentProducts = getAllProducts();
  
  const newProduct: Product = {
    id: data.id || `p${Date.now()}`,
    title: data.title || "Без названия",
    description: data.description || "",
    category: data.category || "other",
    original_price: Number(data.original_price) || 0,
    discounted_price: Number(data.discounted_price) || 0,
    quantity_available: Number(data.quantity_available) || 1,
    status: data.status || "active",
    image: data.image || "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400",
    sellerEmail: data.sellerEmail || "", 
    seller_name: data.seller_name || "Eco Merchant",
    discount_reason: data.discount_reason || "other",
    expiration_date: data.expiration_date || new Date(Date.now() + 172800000).toISOString(),
  };

  const updated = [newProduct, ...currentProducts];
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  return newProduct;
};

/**
 * ПОЛНОЕ УДАЛЕНИЕ: Стирает аккаунт и все связанные с ним товары и заказы.
 * Выполняет жесткую перезагрузку страницы для сброса состояния приложения.
 */
export const deleteUserAccount = (email: string) => {
  if (!isClient || !email) return;

  try {
    // 1. УДАЛЯЕМ ИЗ БАЗЫ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ (eco_market_users_db)
    const allUsersJson = localStorage.getItem('eco_market_users_db');
    if (allUsersJson) {
      const allUsers = JSON.parse(allUsersJson);
      // Оставляем всех, кроме того, чью почту удаляем
      const updatedUsers = allUsers.filter((u: any) => u.email !== email);
      localStorage.setItem('eco_market_users_db', JSON.stringify(updatedUsers));
    }

    // 2. Удаляем все товары этого продавца
    const allProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const remainingProducts = allProducts.filter((p: any) => p.sellerEmail !== email);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(remainingProducts));

    // 3. Удаляем заказы
    const allOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const remainingOrders = allOrders.filter((o: any) => o.sellerEmail !== email);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(remainingOrders));

    // 4. Удаляем текущую сессию (авторизацию)
    localStorage.removeItem(STORAGE_KEYS.USER); // это 'eco_market_auth_data'

    console.log(`Пользователь ${email} полностью удален из базы.`);

    // 5. Жесткая перезагрузка для выхода
    window.location.replace('/');
  } catch (error) {
    console.error("Ошибка при полном удалении:", error);
  }
};

// --- 5. Константы для быстрого доступа ---

export const mockUser = getStoredUser();
export const mockProducts = getAllProducts();
export const mockOrders = getStoredOrders();