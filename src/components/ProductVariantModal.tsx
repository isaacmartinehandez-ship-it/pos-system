'use client';

import { Product, ProductVariant, usePOSStore } from '@/store';
import { X } from 'lucide-react';

interface ProductVariantModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductVariantModal({ product, isOpen, onClose }: ProductVariantModalProps) {
  const { addToCart } = usePOSStore();

  if (!isOpen || !product.variants || product.variants.length === 0) return null;

  const handleVariantSelect = (variant: ProductVariant) => {
    addToCart(product, variant);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            Seleccionar variante para {product.name}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Variants */}
        <div className="p-4 space-y-3">
          {product.variants.map((variant) => {
            const finalPrice = product.price + variant.priceAdjustment;
            return (
              <button
                key={variant.id}
                onClick={() => handleVariantSelect(variant)}
                className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{variant.name}</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${finalPrice.toFixed(2)}
                  </span>
                </div>
                {variant.priceAdjustment !== 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    {variant.priceAdjustment > 0 ? '+' : ''}${variant.priceAdjustment.toFixed(2)} vs. precio base
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
