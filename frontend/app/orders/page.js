'use client';
import BackButton from '@/components/ui/BackButton';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ordersAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const statusColors = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' };
const statusIcons = { pending: 'fa-clock', processing: 'fa-cog fa-spin', shipped: 'fa-truck', delivered: 'fa-check-circle', cancelled: 'fa-times-circle' };

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    if (user) {
      ordersAPI.mine()
        .then(data => setOrders(Array.isArray(data) ? data : data.orders || []))
        .catch(() => setOrders([]))
        .finally(() => setFetching(false));
    }
  }, [user, loading]);

  if (loading || fetching) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>;

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4"><i className="fas fa-box me-2" style={{ color: '#0d9488' }}></i>My Orders</h3>

      {orders.length === 0 ? (
        <div className="text-center card p-5">
          <i className="fas fa-box-open fa-4x text-muted mb-3 d-block"></i>
          <h5 className="text-muted mb-2">No orders yet</h5>
          <p className="text-muted mb-4">Start shopping and your orders will appear here</p>
          <a href="/products" className="btn mx-auto" style={{ background: '#0d9488', color: '#fff', borderRadius: 10, maxWidth: 180 }}>Shop Now</a>
        </div>
      ) : (
        orders.map((order, i) => {
          const status = order.status || 'pending';
          const color = statusColors[status] || '#0d9488';
          const icon = statusIcons[status] || 'fa-circle';
          const total = order.totalPrice || order.total || 0;
          const items = order.items || order.orderItems || [];

          return (
            <div key={order._id || i} className="card p-4 mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                <div>
                  <h6 className="fw-bold mb-1">Order #{(order._id || order.id || '').slice(-8).toUpperCase()}</h6>
                  <small className="text-muted">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</small>
                </div>
                <span className="badge d-flex align-items-center gap-2 px-3 py-2" style={{ background: `${color}20`, color, borderRadius: 20, fontSize: '0.85rem' }}>
                  <i className={`fas ${icon}`}></i>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              {items.length > 0 && (
                <div className="mb-3">
                  {items.slice(0, 3).map((item, j) => {
                    const product = item.product || item;
                    const img = product.images?.[0] || `https://picsum.photos/seed/${j}/60/60`;
                    return (
                      <div key={j} className="d-flex align-items-center gap-3 mb-2">
                        <img src={img} alt={product.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.src='https://picsum.photos/60/60'} />
                        <div>
                          <div className="small fw-semibold">{product.name}</div>
                          <small className="text-muted">Qty: {item.quantity} × ${product.price || item.price || 0}</small>
                        </div>
                      </div>
                    );
                  })}
                  {items.length > 3 && <small className="text-muted">+{items.length - 3} more items</small>}
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center border-top pt-3 flex-wrap gap-2">
                <div>
                  <small className="text-muted d-block"><i className="fas fa-map-marker-alt me-1"></i>{order.shippingAddress}</small>
                  <small className="text-muted"><i className="fas fa-wallet me-1"></i>{order.paymentMethod?.toUpperCase()}</small>
                </div>
                <div className="fw-bold fs-5" style={{ color: '#0d9488' }}>${total}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
