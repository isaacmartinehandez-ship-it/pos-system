'use client';

import { useState } from 'react';
import { usePOSStore, type Customer } from '@/store';
import { Plus, Edit2, Trash2, Search, Mail, Phone, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';

export default function CustomersPage() {
  const { customers, addCustomer } = usePOSStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
  });

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddCustomer = () => {
    const customer: Customer = {
      ...newCustomer,
      id: Date.now().toString(),
    };
    addCustomer(customer);
    setNewCustomer({ name: '' });
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Gestión de Clientes</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Nuevo Cliente
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Customers Grid */}
        {customers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No hay clientes registrados</p>
            <p className="text-gray-400 mt-2">Añade tu primer cliente para empezar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{customer.name}</h3>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit2 size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <Mail size={16} />
                    {customer.email}
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <Phone size={16} />
                    {customer.phone}
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin size={16} />
                    {customer.address}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Customer Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Nuevo Cliente</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newCustomer.email || ''}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={newCustomer.phone || ''}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <textarea
                    value={newCustomer.address || ''}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddCustomer}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
