'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sellerAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const statusColors = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' };

export default function SellerOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'seller') router.push('/');
      else sellerAPI.orders().then(data => setOrders(Array.isArray(data) ? data : data.orders || [])).catch(() => {}).finally(() => setFetching(false));
    }
  }, [user, loading]);

  if (loading || fetching) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>;

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4"><i className="fas fa-shopping-bag me-2" style={{ color: '#0d9488' }}></i>My Orders</h3>
      {orders.length === 0 ? (
        <div className="text-center card p-5">
          <i className="fas fa-box-open fa-4x text-muted mb-3 d-block"></i>
          <h5 className="text-muted">No orders yet for your products</h5>
        </div>
      ) : (
        <div className="card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead style={{ background: '#f8f9fc' }}>
                <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const status = order.status || 'pending';
                  const color = statusColors[status] || '#0d9488';
                  const customer = order.user || order.customer;
                  return (
                    <tr key={order._id}>
                      <td className="fw-semibold small">#{(order._id || '').slice(-8).toUpperCase()}</td>
                      <td>
                        <div className="small">{customer?.name || 'N/A'}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{customer?.email}</div>
                      </td>
                      <td className="fw-bold" style={{ color: '#0d9488' }}>${order.totalPrice || order.total || 0}</td>
                      <td>
                        <span className="badge px-3 py-2" style={{ background: `${color}20`, color, borderRadius: 20 }}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td className="small text-muted">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
