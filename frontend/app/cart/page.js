'use client';
import BackButton from '@/components/ui/BackButton';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CartPage() {
  const { cart, cartCount, updateItem, removeItem } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading]);

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price || item.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  if (loading) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>;

  return (
    <div className="container py-5">
      <BackButton />
      <h3 className="fw-bold mb-4"><i className="fas fa-shopping-cart me-2" style={{ color: '#0d9488' }}></i>Shopping Cart
        <span className="badge ms-2" style={{ background: '#0d9488', fontSize: '0.8rem' }}>{cartCount}</span>
      </h3>

      {items.length === 0 ? (
        <div className="text-center py-5 card p-5">
          <i className="fas fa-shopping-cart fa-4x text-muted mb-4 d-block"></i>
          <h5 className="text-muted mb-2">Your cart is empty</h5>
          <p className="text-muted mb-4">Start adding products you love!</p>
          <Link href="/products" className="btn mx-auto" style={{ background: '#0d9488', color: '#fff', borderRadius: 10, maxWidth: 200 }}>
            <i className="fas fa-shopping-bag me-2"></i>Shop Now
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            {items.map((item, i) => {
              const product = item.product || item;
              const price = product.price || 0;
              const image = product.images?.[0] || `https://picsum.photos/seed/${product._id || i}/100/100`;
              const productId = product._id || item.productId;
              return (
                <div key={i} className="card p-3 mb-3">
                  <div className="d-flex gap-3 align-items-center">
                    <img src={image} alt={product.name} style={{ width: 90, height: 90, borderRadius: 12, objectFit: 'cover' }} onError={e => e.target.src='https://picsum.photos/100/100'} />
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-1">{product.name}</h6>
                      <div className="fw-bold" style={{ color: '#0d9488' }}>${price}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => updateItem(productId, item.quantity - 1)} disabled={item.quantity <= 1} style={{ borderRadius: 8, width: 32, height: 32, padding: 0 }}>-</button>
                      <span className="fw-bold px-2">{item.quantity}</span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => updateItem(productId, item.quantity + 1)} style={{ borderRadius: 8, width: 32, height: 32, padding: 0 }}>+</button>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold mb-2">${(price * item.quantity).toFixed(2)}</div>
                      <button className="btn btn-sm text-danger" onClick={() => removeItem(productId)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-lg-4">
            <div className="card p-4" style={{ position: 'sticky', top: 80 }}>
              <h5 className="fw-bold mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Subtotal ({cartCount} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                <span>Total</span>
                <span style={{ color: '#0d9488' }}>${subtotal.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="btn w-100 py-2" style={{ background: '#0d9488', color: '#fff', borderRadius: 10, fontWeight: 600 }}>
                <i className="fas fa-credit-card me-2"></i>Proceed to Checkout
              </Link>
              <Link href="/products" className="btn btn-outline-secondary w-100 mt-2" style={{ borderRadius: 10 }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
