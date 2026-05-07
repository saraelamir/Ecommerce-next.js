'use client';
import BackButton from '@/components/ui/BackButton';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersAPI, couponsAPI } from '@/lib/api';

export default function CheckoutPage() {
  const { cart, cartCount, fetchCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ shippingAddress: '', paymentMethod: 'cod', couponCode: '' });
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading]);

  // جيب الكوبونات المتاحة
  useEffect(() => {
    couponsAPI.getAll()
      .then(data => setCoupons(data.coupons || []))
      .catch(() => {});
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price || item.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  // حساب الخصم
  const calcDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') return (subtotal * appliedCoupon.discount) / 100;
    return Math.min(appliedCoupon.discount, subtotal);
  };

  const discount = calcDiscount();
  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = form.couponCode.toUpperCase().trim();
    if (!code) return setCouponError('Please enter a coupon code');

    const found = coupons.find(c => c.code.toUpperCase() === code);
    if (!found) return setCouponError('Invalid coupon code');
    if (found.minOrder > 0 && subtotal < found.minOrder) {
      return setCouponError(`Minimum order $${found.minOrder} required`);
    }

    setAppliedCoupon(found);
    setCouponError('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setForm(f => ({ ...f, couponCode: '' }));
    setCouponError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      const body = {
        shippingAddress: form.shippingAddress,
        paymentMethod: form.paymentMethod,
      };
      if (appliedCoupon) body.couponCode = appliedCoupon.code;
      await ordersAPI.create(body);
      setSuccess(true);
      fetchCart();
    } catch (err) {
      setError(err.message || 'Failed to place order');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>;

  if (success) return (
    <div className="container py-5">
      <div className="text-center card p-5" style={{ maxWidth: 500, margin: '0 auto', borderRadius: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem', color: '#10b981' }}>
          <i className="fas fa-check"></i>
        </div>
        <h4 className="fw-bold mb-2">Order Placed!</h4>
        <p className="text-muted mb-4">Thank you! Your order is being processed.</p>
        <div className="d-flex gap-3 justify-content-center">
          <button onClick={() => router.push('/orders')} className="btn" style={{ background: '#0d9488', color: '#fff', borderRadius: 10 }}>View Orders</button>
          <button onClick={() => router.push('/products')} className="btn btn-outline-secondary" style={{ borderRadius: 10 }}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <BackButton />
      <h3 className="fw-bold mb-4"><i className="fas fa-credit-card me-2" style={{ color: '#0d9488' }}></i>Checkout</h3>
      <div className="row g-4">
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Shipping */}
            <div className="card p-4 mb-4">
              <h5 className="fw-bold mb-3"><i className="fas fa-map-marker-alt me-2" style={{ color: '#0d9488' }}></i>Shipping Address</h5>
              <textarea className="form-control" rows={3} placeholder="Enter your full address..." value={form.shippingAddress}
                onChange={e => setForm(f => ({ ...f, shippingAddress: e.target.value }))} required style={{ borderRadius: 10 }} />
            </div>

            {/* Payment */}
            <div className="card p-4 mb-4">
              <h5 className="fw-bold mb-3"><i className="fas fa-wallet me-2" style={{ color: '#0d9488' }}></i>Payment Method</h5>
              <div className="d-flex gap-3 flex-wrap">
                {[{ val: 'cod', icon: 'fa-money-bill', label: 'Cash on Delivery' }, { val: 'card', icon: 'fa-credit-card', label: 'Credit Card' }, { val: 'paypal', icon: 'fa-paypal', label: 'PayPal' }].map(({ val, icon, label }) => (
                  <button key={val} type="button" onClick={() => setForm(f => ({ ...f, paymentMethod: val }))}
                    className="btn flex-fill"
                    style={{ borderRadius: 12, border: `2px solid ${form.paymentMethod === val ? '#0d9488' : '#e0e0e0'}`, background: form.paymentMethod === val ? '#0d948815' : '#fff', color: form.paymentMethod === val ? '#0d9488' : '#666', fontWeight: 600, padding: '12px' }}>
                    <i className={`fas ${icon} d-block mb-1`} style={{ fontSize: '1.4rem' }}></i>
                    <small>{label}</small>
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="card p-4 mb-4">
              <h5 className="fw-bold mb-3"><i className="fas fa-tag me-2" style={{ color: '#0d9488' }}></i>Coupon Code (Optional)</h5>

              {/* Available coupons hint */}
              {coupons.length > 0 && !appliedCoupon && (
                <div className="mb-3 p-3" style={{ background: '#f0fdfa', borderRadius: 10, border: '1px solid #ccfbf1' }}>
                  <p className="small fw-semibold mb-2" style={{ color: '#0d9488' }}>
                    <i className="fas fa-gift me-1"></i>Available Coupons:
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    {coupons.map((c, i) => (
                      <button key={i} type="button"
                        onClick={() => { setForm(f => ({ ...f, couponCode: c.code })); setCouponError(''); }}
                        className="btn btn-sm"
                        style={{ background: '#0d948820', color: '#0d9488', borderRadius: 8, fontWeight: 700, border: '1px solid #0d9488', letterSpacing: 0.5 }}>
                        {c.code}
                        <span className="ms-1 text-muted fw-normal" style={{ fontSize: '0.78rem' }}>
                          ({c.type === 'percentage' ? `${c.discount}% off` : `$${c.discount} off`}{c.minOrder > 0 ? `, min $${c.minOrder}` : ''})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {appliedCoupon ? (
                <div className="d-flex align-items-center gap-3 p-3" style={{ background: '#d1fae5', borderRadius: 10 }}>
                  <i className="fas fa-check-circle text-success fs-5"></i>
                  <div className="flex-grow-1">
                    <div className="fw-bold" style={{ color: '#065f46' }}>{appliedCoupon.code} applied!</div>
                    <small className="text-success">
                      You save {appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}%` : `$${appliedCoupon.discount}`} — ${discount.toFixed(2)} off
                    </small>
                  </div>
                  <button type="button" onClick={removeCoupon} className="btn btn-sm btn-outline-danger" style={{ borderRadius: 8 }}>Remove</button>
                </div>
              ) : (
                <>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Enter coupon code..." value={form.couponCode}
                      onChange={e => setForm(f => ({ ...f, couponCode: e.target.value.toUpperCase() }))}
                      style={{ borderRadius: '8px 0 0 8px', letterSpacing: 1 }} />
                    <button type="button" onClick={handleApplyCoupon} className="btn" style={{ background: '#0d9488', color: '#fff', borderRadius: '0 8px 8px 0' }}>
                      Apply
                    </button>
                  </div>
                  {couponError && <div className="text-danger small mt-2"><i className="fas fa-exclamation-circle me-1"></i>{couponError}</div>}
                </>
              )}
            </div>

            <button type="submit" className="btn w-100 py-3" style={{ background: '#0d9488', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: '1.1rem' }} disabled={submitting || items.length === 0}>
              {submitting ? <><i className="fas fa-spinner fa-spin me-2"></i>Placing Order...</> : <><i className="fas fa-check me-2"></i>Place Order</>}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card p-4" style={{ position: 'sticky', top: 80 }}>
            <h5 className="fw-bold mb-3">Order Summary</h5>
            {items.map((item, i) => {
              const product = item.product || item;
              const price = product.price || 0;
              return (
                <div key={i} className="d-flex justify-content-between mb-2 small">
                  <span className="text-muted">{product.name?.substring(0, 22)}... × {item.quantity}</span>
                  <span className="fw-semibold">${(price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
            <hr />
            <div className="d-flex justify-content-between mb-2 text-muted small">
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="d-flex justify-content-between mb-2 small text-success">
                <span><i className="fas fa-tag me-1"></i>Discount ({appliedCoupon.code})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-2 text-muted small">
              <span>Shipping</span><span className="text-success">Free</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span style={{ color: '#0d9488' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
