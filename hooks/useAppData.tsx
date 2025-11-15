import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppData, Role, CartItem } from '../types';
import * as dataService from '../services/dataService';
import { LOCAL_STORAGE_CART_KEY } from '../constants';

interface AppDataContextType {
  data: AppData | null;
  loading: boolean;
  error: string | null;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  resetDemoData: () => Promise<void>;
  updateData: (updatedData: AppData) => Promise<void>;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCustomOrderModalOpen: boolean;
  openCustomOrderModal: () => void;
  closeCustomOrderModal: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<Role>(Role.Customer);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);


  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await dataService.initData();
      const appData = await dataService.getData();
      setData(appData);
    } catch (err) {
      setError('Failed to load application data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetDemoData = useCallback(async () => {
    try {
      setLoading(true);
      const resetData = await dataService.resetData();
      setData(resetData);
      clearCart();
    } catch (err) {
      setError('Failed to reset data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateData = useCallback(async (updatedData: AppData) => {
    try {
      // Optimistic update
      setData(updatedData);
      await dataService.setData(updatedData);
    } catch (err) {
      setError('Failed to update data.');
      console.error(err);
      // Rollback if needed
      loadData();
    }
  }, [loadData]);

  const addToCart = (newItem: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === newItem.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    setCart(prevCart => prevCart.map(item =>
      item.id === itemId
        ? { ...item, quantity: quantity > 0 ? quantity : 1 }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCustomOrderModal = () => setIsCustomOrderModalOpen(true);
  const closeCustomOrderModal = () => setIsCustomOrderModalOpen(false);

  const value = {
    data,
    loading,
    error,
    currentRole,
    setCurrentRole,
    resetDemoData,
    updateData,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    isCustomOrderModalOpen,
    openCustomOrderModal,
    closeCustomOrderModal,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};