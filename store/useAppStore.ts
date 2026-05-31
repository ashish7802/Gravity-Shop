import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number; // numeric price for math
  category: string;
  quantity: number;
  image: string;
}

interface AppState {
  isLoaded: boolean;
  setLoaded: (loaded: boolean) => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  mousePosition: { x: number; y: number };
  setMousePosition: (pos: { x: number; y: number }) => void;
  cartIconPosition: { x: number; y: number } | null;
  setCartIconPosition: (pos: { x: number; y: number } | null) => void;
  isHoveringInteractive: boolean;
  setHoveringInteractive: (hovering: boolean) => void;
  
  // New Cart Logic
  isCartOpen: boolean;
  toggleCart: () => void;
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  cartTotal: number;
  
  // Auth State
  user: { id: string; name: string; email: string; role: string } | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setUser: (user: { id: string; name: string; email: string; role: string } | null) => void;
  toggleAuthModal: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoaded: false,
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  mousePosition: { x: 0, y: 0 },
  setMousePosition: (pos) => set({ mousePosition: pos }),
  cartIconPosition: null,
  setCartIconPosition: (pos) => set({ cartIconPosition: pos }),
  isHoveringInteractive: false,
  setHoveringInteractive: (hovering) => set({ isHoveringInteractive: hovering }),

  // Cart Implementation
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  cartItems: [],
  cartTotal: 0,
  
  addToCart: (item) => set((state) => {
    const existingItem = state.cartItems.find(i => i.id === item.id);
    let newItems;
    if (existingItem) {
      newItems = state.cartItems.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newItems = [...state.cartItems, { ...item, quantity: 1 }];
    }
    const newTotal = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    return { cartItems: newItems, cartTotal: newTotal };
  }),

  removeFromCart: (id) => set((state) => {
    const newItems = state.cartItems.filter(i => i.id !== id);
    const newTotal = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    return { cartItems: newItems, cartTotal: newTotal };
  }),

  updateQuantity: (id, quantity) => set((state) => {
    if (quantity <= 0) return state; // handled by remove
    const newItems = state.cartItems.map(i => 
      i.id === id ? { ...i, quantity } : i
    );
    const newTotal = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    return { cartItems: newItems, cartTotal: newTotal };
  }),

  // Auth Implementation
  user: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  toggleAuthModal: () => set((state) => ({ isAuthModalOpen: !state.isAuthModalOpen })),
  logout: () => {
    // We will clear the cookie via an API route in real usage or fetch,
    // but for state we just reset:
    set({ user: null, isAuthenticated: false });
  }
}));
