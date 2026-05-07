'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productsAPI, reviewsAPI, usersAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [cartMsg, setCartMsg] = useState('');

  // Prevent treating "create" as an ID
  useEffect(() => {
    if (id === 'create') {
      router.replace('/products/create');
      return;
    }

    Promise.all([
      productsAPI.getById(id),
      reviewsAPI.getByProduct(id).catch(() => [])
    ]).then(([prod, revs]) => {
      setProduct(prod.product || prod);
      setReviews(Array.isArray(revs) ? revs : revs.reviews || []);
    }).catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return router.push('/auth/login');
    setAdding(true);
    try {
      await addToCart(id, quantity);
      setCartMsg('Added to cart!');
      setTimeout(() => setCartMsg(''), 2500);
    } catch (err) {
      setCartMsg(err.message || 'Failed to add');
      setTimeout(() => setCartMsg(''), 2500);
    }
    setAdding(false);
  };

  const handleWishlist = async () => {
    if (!user) return router.push('/auth/login');
    try { await usersAPI.toggleWishlist(id); setWishlisted(w => !w); } catch {}
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return router.push('/auth/login');
    setSubmittingReview(true);
    try {
      await reviewsAPI.add({ productId: id, ...newReview });
      const revs = await reviewsAPI.getByProduct(id);
      setReviews(Array.isArray(revs) ? revs : revs.reviews || []);
      setNewReview({ rating: 5, comment: '' });
    } catch {}
    setSubmittingReview(false);
  };

  if (id === 'create') return null;

  if (loading) return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-6"><div className="placeholder-glow"><div className="placeholder col-12" style={{ height: 400, borderRadius: 16 }}></div></div></div>
        <div className="col-lg-6"><div className="placeholder-glow"><div className="placeholder col-8 mb-3" style={{ height: 30 }}></div><div className="placeholder col-4 mb-3" style={{ height: 24 }}></div><div className="placeholder col-12 mb-2"></div></div></div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-5">
      <i className="fas fa-box-open fa-3x text-muted mb-3 d-block"></i>
      <h4 className="text-muted">Product not found</h4>
      <button onClick={() => router.push('/products')} className="btn mt-3" style={{ background: '#0d9488', color: '#fff', borderRadius: 10 }}>Browse Products</button>
    </div>
  );

  const images = product.images?.length ? product.images : [`https://picsum.photos/seed/${id}/600/500`];

  return (
    <div className="container py-4">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'none', border: '1.5px solid #e2e8f0',
          borderRadius: 10, padding: '7px 16px',
          color: '#042f2e', fontWeight: 600, fontSize: '0.88rem',
          cursor: 'pointer', marginBottom: 24,
          transition: 'all 0.2s', fontFamily: 'Poppins, sans-serif',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#f0fdfa'; e.currentTarget.style.borderColor = '#0d9488'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
      >
        <i className="fas fa-arrow-left" style={{ fontSize: '0.8rem' }} />
        Back
      </button>

      {/* Cart success/error toast */}
      {cartMsg && (
        <div className="position-fixed top-0 end-0 m-3" style={{ zIndex: 9999 }}>
          <div className={`alert ${cartMsg.includes('Added') ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2 shadow`} style={{ borderRadius: 12 }}>
            <i className={`fas ${cartMsg.includes('Added') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {cartMsg}
          </div>
        </div>
      )}

      <div className="row g-5">
        {/* Images */}
        <div className="col-lg-6">
          <div className="card" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
            <img src={images[selectedImage]} alt={product.name}
              style={{ width: '100%', height: 420, objectFit: 'cover' }}
              onError={e => e.target.src = 'https://picsum.photos/600/500'} />
          </div>
          {images.length > 1 && (
            <div className="d-flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setSelectedImage(i)}
                  style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, cursor: 'pointer',
                    border: selectedImage === i ? '2px solid #6c63ff' : '2px solid transparent' }} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="col-lg-6">
          <div className="mb-2">
            <span className="badge" style={{ background: '#0d948820', color: '#0d9488', borderRadius: 20 }}>
              {product.category?.name || product.category || 'General'}
            </span>
          </div>
          <h2 className="fw-bold mb-2">{product.name}</h2>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div>
              {[1,2,3,4,5].map(i => (
                <i key={i} className={`fas fa-star ${i <= Math.round(product.rating || 0) ? 'star-filled' : 'star-empty'}`}></i>
              ))}
              <span className="text-muted ms-2 small">({reviews.length} reviews)</span>
            </div>
            <span className={`badge ${product.stockQuantity > 0 ? 'bg-success' : 'bg-danger'}`}>
              {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
            </span>
          </div>

          <h3 className="fw-bold mb-4" style={{ color: '#0d9488', fontSize: '2rem' }}>${product.price}</h3>
          <p className="text-muted mb-4" style={{ lineHeight: 1.8 }}>{product.description}</p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center border rounded" style={{ borderRadius: '10px !important' }}>
              <button className="btn btn-sm px-3" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span className="px-3 fw-bold">{quantity}</span>
              <button className="btn btn-sm px-3" onClick={() => setQuantity(q => Math.min(product.stockQuantity || 99, q + 1))}>+</button>
            </div>
            <button className="btn flex-grow-1" disabled={adding || product.stockQuantity === 0} onClick={handleAddToCart}
              style={{ background: '#0d9488', color: '#fff', borderRadius: 12, padding: '10px 24px' }}>
              {adding ? <i className="fas fa-spinner fa-spin me-2"></i> : <i className="fas fa-cart-plus me-2"></i>}
              {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="btn border" onClick={handleWishlist} style={{ borderRadius: 12, width: 46, height: 46, padding: 0 }}>
              <i className={`fas fa-heart ${wishlisted ? 'text-danger' : 'text-muted'}`}></i>
            </button>
          </div>

          <div className="d-flex gap-4 text-muted small">
            <span><i className="fas fa-truck me-1" style={{ color: '#43b89c' }}></i>Free Shipping</span>
            <span><i className="fas fa-undo me-1" style={{ color: '#0d9488' }}></i>Easy Returns</span>
            <span><i className="fas fa-shield-alt me-1" style={{ color: '#f59e0b' }}></i>Warranty</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-4">
        <h4 className="fw-bold mb-3">Customer Reviews</h4>
        <div className="row g-3">
          <div className="col-lg-7">
            {reviews.length === 0 ? (
              <div className="card p-4 text-center text-muted">
                <i className="fas fa-comment-slash fa-2x mb-2 d-block"></i>
                No reviews yet — be the first!
              </div>
            ) : reviews.map((r, i) => (
              <div key={i} className="card p-3 mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{r.user?.name || 'Anonymous'}</strong>
                    <div>{[1,2,3,4,5].map(s => <i key={s} className={`fas fa-star ${s <= r.rating ? 'star-filled' : 'star-empty'}`} style={{ fontSize: '0.75rem' }}></i>)}</div>
                  </div>
                  <small className="text-muted">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</small>
                </div>
                <p className="mb-0 text-muted small">{r.comment}</p>
              </div>
            ))}
          </div>

          <div className="col-lg-5">
            {user ? (
              <div className="card p-3" style={{ position: 'sticky', top: 80 }}>
                <h6 className="fw-bold mb-3">Write a Review</h6>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Rating</label>
                    <select className="form-select form-select-sm" value={newReview.rating}
                      onChange={e => setNewReview(r => ({ ...r, rating: Number(e.target.value) }))} style={{ borderRadius: 8 }}>
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Comment</label>
                    <textarea className="form-control form-control-sm" rows={3} placeholder="Share your experience..."
                      value={newReview.comment}
                      onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
                      style={{ borderRadius: 8 }} required />
                  </div>
                  <button type="submit" className="btn w-100 btn-sm" style={{ background: '#0d9488', color: '#fff', borderRadius: 8 }} disabled={submittingReview}>
                    {submittingReview ? <i className="fas fa-spinner fa-spin"></i> : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="card p-3 text-center text-muted">
                <i className="fas fa-lock mb-2 d-block"></i>
                <small>Login to write a review</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
