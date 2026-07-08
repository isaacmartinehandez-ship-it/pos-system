'use client';

import { HeldTicket, usePOSStore } from '@/store';
import { X, Clock2, Trash2, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HeldTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HeldTicketsModal({ isOpen, onClose }: HeldTicketsModalProps) {
  const { heldTickets, retrieveHeldTicket, deleteHeldTicket } = usePOSStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Clock2 className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-gray-900">
              Cuentas Aparcadas
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Tickets List */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {heldTickets.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <Clock2 size={48} className="mx-auto text-gray-300 mb-3" />
              <p>No hay cuentas aparcadas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {heldTickets.map((ticket: HeldTicket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {ticket.customerName && (
                          <span className="font-semibold text-gray-900">
                            {ticket.customerName}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {format(new Date(ticket.date), "dd/MM/yyyy HH:mm", { locale: es })}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        ${ticket.total.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => retrieveHeldTicket(ticket.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <ShoppingCart size={16} />
                        Recuperar
                      </button>
                      <button
                        onClick={() => deleteHeldTicket(ticket.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                    {ticket.items.length} {ticket.items.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
