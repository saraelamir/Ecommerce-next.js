'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?search=${encodeURIComponent(search)}`);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>

        {/* Brand */}
        <Link href="/" className={styles.brand}>
          <div className={styles.brandIcon}><i className="fas fa-store" /></div>
          <span className={styles.brandText}>ShopZone</span>
        </Link>

        {/* Search */}
        <div className={styles.searchWrap}>
          <form className={`${styles.searchForm}${focused ? ' ' + styles.focused : ''}`} onSubmit={handleSearch}>
            <div className={styles.searchIcon}><i className="fas fa-search" /></div>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {search && (
              <button type="button" className={styles.searchBtn} onClick={() => setSearch('')}>
                <i className="fas fa-times" />
              </button>
            )}
            <button type="submit" className={styles.searchBtn}><i className="fas fa-arrow-right" /></button>
          </form>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/products" className={`${styles.navLink} d-none d-md-block`}>
            Products
          </Link>

          {user ? (
            <>
              <Link href="/cart" className={styles.iconBtn}>
                <i className="fas fa-shopping-cart" />
                {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
              </Link>
              <Link href="/wishlist" className={styles.iconBtn}>
                <i className="fas fa-heart" />
              </Link>

              <div className="dropdown">
                <button
                  className={`${styles.iconBtn} d-flex align-items-center gap-2 pe-2`}
                  style={{ width: 'auto', paddingLeft: 6 }}
                  data-bs-toggle="dropdown"
                >
                  <div className={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
                  <span className="d-none d-md-block" style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <i className="fas fa-chevron-down" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end shopzone-dd">
                  <li><Link className="dropdown-item" href="/profile"><i className="fas fa-user me-2" style={{ color: '#0d9488' }} />Profile</Link></li>
                  <li><Link className="dropdown-item" href="/orders"><i className="fas fa-box me-2" style={{ color: '#0d9488' }} />My Orders</Link></li>
                  {user.role === 'admin'  && <li><Link className="dropdown-item" href="/admin"><i className="fas fa-shield-alt me-2 text-danger" />Admin Panel</Link></li>}
                  {user.role === 'seller' && <li><Link className="dropdown-item" href="/seller"><i className="fas fa-store me-2 text-success" />Seller Panel</Link></li>}
                  <li><hr className="dropdown-divider mx-2" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2" />Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login"    className={styles.loginBtn}>Login</Link>
              <Link href="/auth/register" className={styles.registerBtn}>Register</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
