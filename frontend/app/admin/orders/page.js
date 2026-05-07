'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI, ordersAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered'];
const statusColors = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' };

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') router.push('/');
      else adminAPI.orders().then(data => setOrders(Array.isArray(data) ? data : data.orders || [])).catch(() => {}).finally(() => setFetching(false));
    }
  }, [user, loading]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await ordersAPI.updateStatus(id, status);
      setOrders(os => os.map(o => o._id === id ? { ...o, status } : o));
    } catch {}
    setUpdating(null);
  };

  if (loading || fetching) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0"><i className="fas fa-shopping-bag me-2" style={{ color: '#0d9488' }}></i>All Orders</h3>
        <span className="badge px-3 py-2" style={{ background: '#0d948820', color: '#0d9488', borderRadius: 20 }}>{orders.length} orders</span>
      </div>

      <div className="card p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ background: '#f8f9fc' }}>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const status = order.status || 'pending';
                const color = statusColors[status] || '#0d9488';
                const items = order.items || order.orderItems || [];
                const customer = order.user || order.customer;
                return (
                  <tr key={order._id}>
                    <td className="small fw-semibold">#{(order._id || '').slice(-8).toUpperCase()}</td>
                    <td>
                      <div className="fw-semibold small">{customer?.name || 'N/A'}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{customer?.email}</div>
                    </td>
                    <td><span className="badge bg-secondary">{items.length} items</span></td>
                    <td className="fw-bold" style={{ color: '#0d9488' }}>${order.totalPrice || order.total || 0}</td>
                    <td><span className="badge bg-light text-dark">{order.paymentMethod?.toUpperCase() || 'COD'}</span></td>
                    <td>
                      <span className="badge px-3 py-2" style={{ background: `${color}20`, color, borderRadius: 20 }}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="small text-muted">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <select className="form-select form-select-sm" style={{ borderRadius: 8, minWidth: 120 }}
                        value={status} disabled={updating === order._id}
                        onChange={e => updateStatus(order._id, e.target.value)}>
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {orders.length === 0 && <div className="text-center text-muted py-4">No orders yet</div>}
        </div>
      </div>
    </div>
  );
}
