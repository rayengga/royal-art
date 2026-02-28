'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, Product } from '@/types';
import { 
  getCartFromStorage, 
  saveCartToStorage, 
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateCartItemQuantity as updateCartItemQuantityUtil,
  clearCart as clearCartUtil
} from '@/lib/cart';

interface CartState {
  cart: Cart;
  isLoading: boolean;
}

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  items: CartItem[];
}

type CartAction =
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_TO_CART':
      const updatedCartAdd = addToCartUtil(state.cart, action.payload.product, action.payload.quantity);
      saveCartToStorage(updatedCartAdd);
      return { ...state, cart: updatedCartAdd };
    case 'REMOVE_FROM_CART':
      const updatedCartRemove = removeFromCartUtil(state.cart, action.payload);
      saveCartToStorage(updatedCartRemove);
      return { ...state, cart: updatedCartRemove };
    case 'UPDATE_QUANTITY':
      const updatedCartQuantity = updateCartItemQuantityUtil(
        state.cart,
        action.payload.productId,
        action.payload.quantity
      );
      saveCartToStorage(updatedCartQuantity);
      return { ...state, cart: updatedCartQuantity };
    case 'CLEAR_CART':
      const emptyCart = clearCartUtil();
      return { ...state, cart: emptyCart };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: { items: [], total: 0, itemCount: 0 },
    isLoading: true,
  });

  useEffect(() => {
    const cart = getCartFromStorage();
    dispatch({ type: 'SET_CART', payload: cart });
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = (): number => {
    return state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = (): number => {
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    updateQuantity,
    clearCart,
    getItemQuantity,
    getTotalPrice,
    getTotalItems,
    items: state.cart.items,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}