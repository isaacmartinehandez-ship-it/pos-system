'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePOSStore, calculateItemPrice, Product } from '@/store';
import { ShoppingCart, Plus, Minus, X, DollarSign, CreditCard, Banknote, Users, Box, BarChart3, Search, Clock2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductVariantModal from '@/components/ProductVariantModal';
import HeldTicketsModal from '@/components/HeldTicketsModal';
import SessionHeader from '@/components/SessionHeader';

export default function POSPage() {
  const pathname = usePathname();
  const {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    completeSale,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    getCartTotal,
    holdTicket,
    heldTickets,
  } = usePOSStore();

  // Estado para modales
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [isHeldTicketsModalOpen, setIsHeldTicketsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Evitar errores de hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Obtener todas las categorías
  const categories = ['Todos', ...new Set(products.map(p => p.category))];

  // Filtrar productos según categoría y búsqueda
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Manejar clic en producto
  const handleProductClick = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      setSelectedProduct(product);
      setIsVariantModalOpen(true);
    } else {
      addToCart(product);
    }
  };

  // Manejar cierre de modal de variantes
  const handleVariantModalClose = () => {
    setIsVariantModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCheckout = (paymentMethod: 'cash' | 'card' | 'transfer') => {
    completeSale(paymentMethod);
    alert('Venta completada!');
  };

  const cartTotal = getCartTotal();

  const navItems = [
    { href: '/', icon: ShoppingCart, label: 'Punto de Venta' },
    { href: '/products', icon: Box, label: 'Artículos' },
    { href: '/customers', icon: Users, label: 'Clientes' },
    { href: '/reports', icon: BarChart3, label: 'Informes' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-8">POS System</h1>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded ${pathname === item.href ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Session Header al final del sidebar */}
        <div className="mt-auto">
          <SessionHeader />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar con Tabs de Categorías y Búsqueda */}
        <div className="bg-white border-b border-gray-200 p-4">
          {/* Barra de Búsqueda */}
          <div className="mb-4 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar artículo (ej: Café, Croissant)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          {/* Tabs de Categorías */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Products Grid - Compact View */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                No se encontraron artículos que coincidan con tu búsqueda
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-300 flex flex-col"
                  >
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-blue-600 font-bold text-base mt-1">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 mt-auto pt-1">
                      Stock: {product.stock}
                    </div>
                    {product.variants && (
                      <div className="text-xs text-blue-500 mt-1">
                        + Opciones
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Section - Mejorado */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShoppingCart size={20} />
                Carrito
              </h2>
              <button
                onClick={() => setIsHeldTicketsModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Clock2 size={16} />
                {isMounted && heldTickets.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {heldTickets.length}
                  </span>
                )}
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-3">
              {!isMounted ? (
                <div className="text-center text-gray-500 mt-10">
                  Cargando...
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  El carrito está vacío
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => {
                    const itemPrice = calculateItemPrice(item);
                    return (
                      <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 mr-2">
                            <div className="font-semibold text-sm text-gray-900">
                              {item.product.name}
                            </div>
                            {item.selectedVariant && (
                              <div className="text-xs text-blue-600 font-medium">
                                {item.selectedVariant.name}
                              </div>
                            )}
                            <div className="text-sm text-gray-600 mt-1">
                              ${itemPrice.toFixed(2)} c/u
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="font-bold text-gray-900">
                            ${(itemPrice * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${isMounted ? cartTotal.toFixed(2) : "0.00"}
                </span>
              </div>

              {isMounted && cart.length > 0 && (
                <>
                  <div className="space-y-2 mb-4">
                    <button
                      onClick={() => handleCheckout('cash')}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      <Banknote size={20} />
                      Efectivo
                    </button>
                    <button
                      onClick={() => handleCheckout('card')}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <CreditCard size={20} />
                      Tarjeta
                    </button>
                    <button
                      onClick={() => handleCheckout('transfer')}
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      <DollarSign size={20} />
                      Transferencia
                    </button>
                    <button
                      onClick={() => holdTicket()}
                      className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                    >
                      <Clock2 size={18} />
                      Aparcar Cuenta
                    </button>
                  </div>
                  <button
                    onClick={clearCart}
                    className="w-full text-red-600 py-2 hover:bg-red-50 rounded-lg font-semibold"
                  >
                    Limpiar Carrito
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductVariantModal
          product={selectedProduct}
          isOpen={isVariantModalOpen}
          onClose={handleVariantModalClose}
        />
      )}

      <HeldTicketsModal
        isOpen={isHeldTicketsModalOpen}
        onClose={() => setIsHeldTicketsModalOpen(false)}
      />
    </div>
  );
}
