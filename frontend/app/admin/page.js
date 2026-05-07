'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') router.push('/');
      else adminAPI.dashboard().then(setStats).catch(() => {}).finally(() => setFetching(false));
    }
  }, [user, loading]);

  if (loading || fetching) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>;

  const m = stats?.metrics || stats;
  const metrics = [
    { label: 'Total Users', value: m?.users || m?.totalUsers || 0, icon: 'fa-users', color: '#0d9488' },
    { label: 'Total Orders', value: m?.orders || m?.totalOrders || 0, icon: 'fa-shopping-bag', color: '#ff6584' },
    { label: 'Total Revenue', value: `$${m?.revenue || m?.totalRevenue || 0}`, icon: 'fa-dollar-sign', color: '#10b981' },
    { label: 'Total Products', value: m?.products || m?.totalProducts || 0, icon: 'fa-box', color: '#f59e0b' },
  ];

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="fw-bold mb-0"><i className="fas fa-shield-alt me-2" style={{ color: '#0d9488' }}></i>Admin Dashboard</h3>
        <span className="badge px-3 py-2" style={{ background: '#0d948820', color: '#0d9488', borderRadius: 20 }}>
          <i className="fas fa-circle me-1" style={{ fontSize: '0.6rem', color: '#10b981' }}></i>Live
        </span>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        {metrics.map(m => (
          <div key={m.label} className="col-6 col-lg-3">
            <div className="card p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, fontSize: '1.2rem' }}>
                  <i className={`fas ${m.icon}`}></i>
                </div>
                <i className="fas fa-arrow-up text-success" style={{ fontSize: '0.8rem' }}></i>
              </div>
              <h3 className="fw-bold mb-0">{m.value}</h3>
              <small className="text-muted">{m.label}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="row g-4">
        {[
          { href: '/admin/users', icon: 'fa-users', label: 'Manage Users', desc: 'View, block, or delete users', color: '#0d9488' },
          { href: '/admin/orders', icon: 'fa-shopping-bag', label: 'Manage Orders', desc: 'Update order statuses', color: '#ff6584' },
          { href: '/products', icon: 'fa-box', label: 'Products', desc: 'Browse all products', color: '#10b981' },
          { href: '/admin/coupons', icon: 'fa-tag', label: 'Coupons', desc: 'Create & manage coupons', color: '#f59e0b' },
        ].map(({ href, icon, label, desc, color }) => (
          <div key={href} className="col-6 col-lg-3">
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
