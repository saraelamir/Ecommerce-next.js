'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { usersAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import styles from './ProductCard.module.css';

function StarRating({ rating = 0 }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className="fas fa-star" style={{ fontSize: '0.7rem', color: i <= Math.round(rating) ? '#fbbf24' : '#e2e8f0' }} />
      ))}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const id    = product._id || product.id;
  const image = product.images?.[0] || `https://picsum.photos/seed/${id}/400/400`;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) return (window.location.href = '/auth/login');
    setAdding(true);
    try {
      await addToCart(id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {}
    setAdding(false);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return (window.location.href = '/auth/login');
    try {
      await usersAPI.toggleWishlist(id);
      setWishlisted(w => !w);
    } catch {}
  };

  return (
    <Link href={`/products/${id}`} className="text-decoration-none d-block h-100">
      <div className={styles.pcard}>
        <div className={styles.imgWrap}>
          <img
            src={image}
            alt={product.name}
            className={styles.img}
            onError={e => (e.target.src = `https://picsum.photos/seed/${id}x/400/400`)}
          />
          <button className={styles.wishBtn} onClick={handleWishlist} aria-label="Wishlist">
            <i className="fas fa-heart" style={{ color: wishlisted ? '#ef4444' : '#94a3b8' }} />
          </button>
          {product.stockQuantity === 0 && (
            <span className={styles.badge}>Out of Stock</span>
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.cat}>
            {product.category?.name?.replace(/-\d+$/, '') || 'General'}
          </div>
          <div className={styles.name}>{product.name}</div>
          <div className="mb-2">
            <StarRating rating={product.averageRating || product.rating || 0} />
            {product.reviewCount > 0 && (
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: 4 }}>
                ({product.reviewCount})
              </span>
            )}
          </div>
          <div className={styles.footer}>
            <span className={styles.price}>${product.price}</span>
            <button
              className={`${styles.cartBtn}${added ? ' ' + styles.added : ''}`}
              onClick={handleAddToCart}
              disabled={adding || product.stockQuantity === 0}
            >
              {adding ? (
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '0.75rem' }} />
              ) : added ? (
                <><i className="fas fa-check" /> Added</>
              ) : (
                <><i className="fas fa-cart-plus" /> Add</>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
