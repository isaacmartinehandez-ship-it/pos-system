'use client';

import { usePOSStore } from '@/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Layout from '@/components/Layout';

export default function ReportsPage() {
  const { sales, products } = usePOSStore();

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = sales.length;
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.items.reduce((s, item) => s + item.quantity, 0), 0);

  const salesByDate = sales.reduce((acc, sale) => {
    const date = format(sale.date, 'yyyy-MM-dd');
    acc[date] = (acc[date] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(salesByDate).map(([date, total]) => ({
    date: format(new Date(date), 'dd/MM', { locale: es }),
    total,
  }));

  const recentSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Informes y Estadísticas</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <ShoppingCart className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Ventas Realizadas</p>
                <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <ShoppingCart className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Artículos Vendidos</p>
                <p className="text-2xl font-bold text-gray-900">{totalItemsSold}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Ticket Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Ventas por Día</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ventas']} />
                  <Bar dataKey="total" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Ventas Recientes</h3>
            {recentSales.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay ventas registradas</p>
            ) : (
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">#{sale.id.slice(-6)}</p>
                      <p className="text-sm text-gray-500">
                        {format(sale.date, 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">${sale.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {sale.paymentMethod === 'cash' ? 'Efectivo' :
                         sale.paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Resumen de Artículos</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
