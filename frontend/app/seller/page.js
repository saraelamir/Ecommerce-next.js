'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sellerAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function SellerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'seller') router.push('/');
      else sellerAPI.dashboard().then(setStats).catch(() => {}).finally(() => setFetching(false));
    }
  }, [user, loading]);

  if (loading || fetching) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>;

  const m = stats?.metrics || stats;
  const metrics = [
    { label: 'My Products', value: m?.products || m?.totalProducts || 0, icon: 'fa-box', color: '#0d9488' },
    { label: 'Total Orders', value: m?.orders || m?.totalOrders || 0, icon: 'fa-shopping-bag', color: '#ff6584' },
    { label: 'Revenue', value: `$${m?.revenue || m?.totalRevenue || 0}`, icon: 'fa-dollar-sign', color: '#10b981' },
    { label: 'Avg Rating', value: m?.avgRating || '4.5', icon: 'fa-star', color: '#f59e0b' },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="fw-bold mb-0"><i className="fas fa-store me-2" style={{ color: '#0d9488' }}></i>Seller Dashboard</h3>
        <span className="badge px-3 py-2" style={{ background: '#10b98120', color: '#10b981', borderRadius: 20 }}>
          <i className="fas fa-check-circle me-1"></i>Verified Seller
        </span>
      </div>

      <div className="row g-4 mb-4">
        {metrics.map(m => (
          <div key={m.label} className="col-6 col-lg-3">
            <div className="card p-4">
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, fontSize: '1.2rem', marginBottom: 12 }}>
                <i className={`fas ${m.icon}`}></i>
              </div>
              <h3 className="fw-bold mb-0">{m.value}</h3>
              <small className="text-muted">{m.label}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {[
          { href: '/seller/products', icon: 'fa-box', label: 'My Products', desc: 'Manage your product inventory', color: '#0d9488' },
          { href: '/seller/orders', icon: 'fa-shopping-bag', label: 'My Orders', desc: 'Track orders for your products', color: '#ff6584' },
          { href: '/products/create', icon: 'fa-plus-circle', label: 'Add Product', desc: 'List a new product', color: '#10b981' },
        ].map(({ href, icon, label, desc, color }) => (
          <div key={href} className="col-md-4">
            <Link href={href} className="text-decoration-none">
              <div className="card p-4 h-100" style={{ cursor: 'pointer', transition: 'transform 0.2s', borderTop: `3px solid ${color}` }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <i className={`fas ${icon} mb-3`} style={{ fontSize: '1.8rem', color }}></i>
                <h6 className="fw-bold mb-1">{label}</h6>
                <small className="text-muted">{desc}</small>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
