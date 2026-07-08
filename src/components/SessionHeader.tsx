'use client';

import { usePOSStore } from '@/store';
import { User, DollarSign, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SessionHeader() {
  const { session } = usePOSStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-gray-800 border-t border-gray-700 p-3 h-28"></div>
    );
  }

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-gray-300">
          <User size={16} />
          <span className="text-sm font-medium">Cajero:</span>
          <span className="text-sm font-bold text-white">{session.cashier}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <DollarSign size={16} />
          <span className="text-sm font-medium">Caja:</span>
          <span className="text-sm font-bold text-white">{session.cashRegister}</span>
        </div>
      </div>
      <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
        <Settings size={16} />
        Arqueo / Cierre de Caja
      </button>
    </div>
  );
}
