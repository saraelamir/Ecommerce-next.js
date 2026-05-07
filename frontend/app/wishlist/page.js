'use client';
import BackButton from '@/components/ui/BackButton';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usersAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    if (user) {
      usersAPI.getProfile()
        .then(data => {
          const p = data.user || data;
          setWishlist(p.wishlist || []);
        })
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [user, loading]);

  if (loading || fetching) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>;

  return (
    <div className="container py-5">
      <BackButton />
      <h3 className="fw-bold mb-4"><i className="fas fa-heart me-2 text-danger"></i>My Wishlist
        <span className="badge ms-2" style={{ background: '#0d9488', fontSize: '0.8rem' }}>{wishlist.length}</span>
      </h3>

      {wishlist.length === 0 ? (
        <div className="text-center card p-5">
          <i className="fas fa-heart fa-4x text-muted mb-3 d-block"></i>
          <h5 className="text-muted mb-2">Your wishlist is empty</h5>
          <p className="text-muted mb-4">Save products you love!</p>
          <a href="/products" className="btn mx-auto" style={{ background: '#0d9488', color: '#fff', borderRadius: 10, maxWidth: 180 }}>Browse Products</a>
        </div>
      ) : (
        <div className="row g-4">
          {wishlist.map(product => (
            <div key={product._id || product.id} className="col-6 col-md-4 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
