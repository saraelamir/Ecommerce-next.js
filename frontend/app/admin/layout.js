'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const links = [
    { href: '/admin', label: 'Dashboard', icon: 'fa-chart-line' },
    { href: '/admin/users', label: 'Users', icon: 'fa-users' },
    { href: '/admin/orders', label: 'Orders', icon: 'fa-shopping-bag' },
    { href: '/admin/coupons', label: 'Coupons', icon: 'fa-tag' },
  ];

  useEffect(() => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>

      {/* Burger Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          top: 15,
          left: 15,
          zIndex: 1000,
          fontSize: 22,
          background: '#042f2e',
          color: '#fff',
          border: 'none',
          padding: '8px 12px',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
       <i className="fa-solid fa-bars"></i>
      </button>

      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: '#042f2e',
          color: '#fff',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: '0.3s ease',
          zIndex: 999,
        }}
      >
        <h5 style={{ marginBottom: 10 }}>Admin Panel</h5>

        <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column' }}>

          {links.map(link => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => window.innerWidth < 768 && setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  marginBottom: 8,
                  borderRadius: 10,
                  textDecoration: 'none',
                  color: active ? '#2dd4bf' : 'rgba(255,255,255,0.8)',
                  background: active ? 'rgba(255,255,255,0.08)' : 'transparent'
                }}
              >
                <i className={`fas ${link.icon}`}></i>
                {link.label}
              </Link>
            );
          })}

        </div>
      </aside>

      {/* Content */}
      <main
        style={{
          flex: 1,
          padding: 24,
          marginLeft: open ? 240 : 0,
          transition: '0.3s ease',
          width: '100%'
        }}
      >
        {children}
      </main>
    </div>
  );
}