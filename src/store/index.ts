import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Interfaces para Variantes de Productos
export interface ProductVariant {
  id: string;
  name: string;
  priceAdjustment: number; // Ajuste de precio (positivo o negativo)
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode?: string;
  image?: string;
  variants?: ProductVariant[]; // Variantes del producto (opcional)
}

// Interfaces para Items de Carrito con Variante
export interface CartItem {
  id: string; // ID único para el item en el carrito
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant; // Variante seleccionada (opcional)
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Sale {
  id: string;
  date: Date;
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  customer?: Customer;
}

// Interfaz para Cuentas Aparcadas
export interface HeldTicket {
  id: string;
  date: Date;
  items: CartItem[];
  customerName?: string; // Nombre opcional para identificar la cuenta
  total: number;
}

// Interfaz para Contexto de Sesión y Caja
export interface SessionContext {
  cashier: string;
  cashRegister: string;
}

interface POSStore {
  // Datos principales
  products: Product[];
  cart: CartItem[];
  sales: Sale[];
  customers: Customer[];
  heldTickets: HeldTicket[];
  session: SessionContext;

  // Estado de UI
  selectedCategory: string;
  searchTerm: string;

  // Métodos de Catálogo
  setSelectedCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  addProduct: (product: Product) => void;

  // Métodos de Carrito
  addToCart: (product: Product, variant?: ProductVariant) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Métodos de Ventas y Cuentas Aparcadas
  completeSale: (paymentMethod: 'cash' | 'card' | 'transfer', customer?: Customer) => void;
  holdTicket: (customerName?: string) => void;
  retrieveHeldTicket: (ticketId: string) => void;
  deleteHeldTicket: (ticketId: string) => void;

  // Métodos de Clientes
  addCustomer: (customer: Customer) => void;

  // Métodos de Sesión
  updateSession: (session: Partial<SessionContext>) => void;
}

// Productos de prueba con variantes
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Café Americano',
    category: 'Bebidas',
    price: 2.5,
    stock: 100,
    variants: [
      { id: 'v1', name: 'Chico', priceAdjustment: 0 },
      { id: 'v2', name: 'Mediano', priceAdjustment: 0.8 },
      { id: 'v3', name: 'Grande', priceAdjustment: 1.5 },
    ],
  },
  {
    id: '2',
    name: 'Café con Leche',
    category: 'Bebidas',
    price: 3.0,
    stock: 100,
    variants: [
      { id: 'v1', name: 'Chico', priceAdjustment: 0 },
      { id: 'v2', name: 'Mediano', priceAdjustment: 1.0 },
      { id: 'v3', name: 'Grande', priceAdjustment: 1.8 },
    ],
  },
  { id: '3', name: 'Croissant', category: 'Panadería', price: 1.8, stock: 50 },
  { id: '4', name: 'Pan de Mantequilla', category: 'Panadería', price: 1.2, stock: 60 },
  { id: '5', name: 'Sandwich de Jamón y Queso', category: 'Comida', price: 5.5, stock: 30 },
  { id: '6', name: 'Ensalada César', category: 'Comida', price: 6.5, stock: 20 },
  { id: '7', name: 'Tarta de Chocolate', category: 'Postres', price: 4.5, stock: 20 },
  { id: '8', name: 'Flan Caramelizado', category: 'Postres', price: 3.8, stock: 25 },
  { id: '9', name: 'Refresco de Naranja', category: 'Bebidas', price: 2.0, stock: 80 },
  { id: '10', name: 'Agua Mineral', category: 'Bebidas', price: 1.2, stock: 120 },
];

// Función para calcular el precio final de un item con variante
export const calculateItemPrice = (item: CartItem): number => {
  let price = item.product.price;
  if (item.selectedVariant) {
    price += item.selectedVariant.priceAdjustment;
  }
  return price;
};

// Store principal con persistencia
export const usePOSStore = create<POSStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      products: mockProducts,
      cart: [],
      sales: [],
      customers: [],
      heldTickets: [],
      session: {
        cashier: 'Administrador',
        cashRegister: '01',
      },
      selectedCategory: 'Todos',
      searchTerm: '',

      // Métodos de Catálogo
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),

      // Métodos de Carrito
      addToCart: (product, variant) => set((state) => {
        const newItem: CartItem = {
          id: Date.now().toString(),
          product,
          quantity: 1,
          selectedVariant: variant,
        };
        return { cart: [...state.cart, newItem] };
      }),

      removeFromCart: (cartItemId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== cartItemId)
      })),

      updateCartQuantity: (cartItemId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.id === cartItemId
            ? { ...item, quantity }
            : item
        ).filter(item => item.quantity > 0)
      })),

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const state = get();
        return state.cart.reduce((sum, item) => {
          const itemPrice = calculateItemPrice(item);
          return sum + itemPrice * item.quantity;
        }, 0);
      },

      // Métodos de Ventas y Cuentas Aparcadas
      completeSale: (paymentMethod, customer) => {
        const state = get();
        const total = state.getCartTotal();
        const newSale: Sale = {
          id: Date.now().toString(),
          date: new Date(),
          items: [...state.cart],
          total,
          paymentMethod,
          customer,
        };
        set({ sales: [...state.sales, newSale], cart: [] });
      },

      holdTicket: (customerName) => {
        const state = get();
        const total = state.getCartTotal();
        const newHeldTicket: HeldTicket = {
          id: Date.now().toString(),
          date: new Date(),
          items: [...state.cart],
          customerName,
          total,
        };
        set({ heldTickets: [...state.heldTickets, newHeldTicket], cart: [] });
      },

      retrieveHeldTicket: (ticketId) => set((state) => {
        const ticket = state.heldTickets.find(t => t.id === ticketId);
        if (!ticket) return state;
        return {
          cart: [...ticket.items],
          heldTickets: state.heldTickets.filter(t => t.id !== ticketId),
        };
      }),

      deleteHeldTicket: (ticketId) => set((state) => ({
        heldTickets: state.heldTickets.filter(t => t.id !== ticketId)
      })),

      // Métodos de Clientes
      addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),

      // Métodos de Sesión
      updateSession: (session) => set((state) => ({
        session: { ...state.session, ...session }
      })),
    }),
    {
      name: 'pos-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        sales: state.sales,
        heldTickets: state.heldTickets,
        session: state.session,
        customers: state.customers,
      }),
      // Función para convertir strings de fecha de vuelta a objetos Date al cargar
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convertir fechas en ventas
          state.sales = state.sales.map(sale => ({
            ...sale,
            date: new Date(sale.date),
          }));
          // Convertir fechas en cuentas aparcadas
          state.heldTickets = state.heldTickets.map(ticket => ({
            ...ticket,
            date: new Date(ticket.date),
          }));
        }
      },
    }
  )
);
