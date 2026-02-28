export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  material: 'wood' | 'leather';
  images: string[];
  category: string;
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  orders: Order[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  token: string;
  role: 'CLIENT' | 'ADMIN';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface FilterOptions {
  material: 'all' | 'wood' | 'leather';
  category: string; // 'all' or specific category ID
  priceRange: {
    min: number;
    max: number;
  };
  inStock: boolean;
}

export interface SearchParams {
  query: string;
  filters: FilterOptions;
  sortBy: 'name' | 'price' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalClients: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  monthlyRevenue: number[];
  topProducts: Product[];
  recentOrders: Order[];
}