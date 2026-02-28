import { Cart, CartItem, Product } from '@/types';

const CART_STORAGE_KEY = 'co2_cart';

export function getCartFromStorage(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, itemCount: 0 };
  }
  
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) {
      return { items: [], total: 0, itemCount: 0 };
    }
    
    const cart = JSON.parse(cartData) as Cart;
    return {
      ...cart,
      total: calculateCartTotal(cart.items),
      itemCount: calculateItemCount(cart.items),
    };
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return { items: [], total: 0, itemCount: 0 };
  }
}

export function saveCartToStorage(cart: Cart): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
}

export function addToCart(cart: Cart, product: Product, quantity: number = 1): Cart {
  const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);
  
  if (existingItemIndex > -1) {
    const updatedItems = [...cart.items];
    updatedItems[existingItemIndex].quantity += quantity;
    
    return {
      items: updatedItems,
      total: calculateCartTotal(updatedItems),
      itemCount: calculateItemCount(updatedItems),
    };
  } else {
    const updatedItems = [...cart.items, { product, quantity }];
    
    return {
      items: updatedItems,
      total: calculateCartTotal(updatedItems),
      itemCount: calculateItemCount(updatedItems),
    };
  }
}

export function removeFromCart(cart: Cart, productId: string): Cart {
  const updatedItems = cart.items.filter(item => item.product.id !== productId);
  
  return {
    items: updatedItems,
    total: calculateCartTotal(updatedItems),
    itemCount: calculateItemCount(updatedItems),
  };
}

export function updateCartItemQuantity(cart: Cart, productId: string, quantity: number): Cart {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  
  const updatedItems = cart.items.map(item =>
    item.product.id === productId ? { ...item, quantity } : item
  );
  
  return {
    items: updatedItems,
    total: calculateCartTotal(updatedItems),
    itemCount: calculateItemCount(updatedItems),
  };
}

export function clearCart(): Cart {
  const emptyCart = { items: [], total: 0, itemCount: 0 };
  saveCartToStorage(emptyCart);
  return emptyCart;
}

function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function formatCartTotal(total: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(total);
}