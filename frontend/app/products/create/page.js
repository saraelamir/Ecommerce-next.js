'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ImageUpload from '@/components/ui/ImageUpload';

const CATEGORIES = ['Electronics', 'Fashion', 'Books', 'Beauty'];

export default function CreateProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', description: '', price: '', stockQuantity: '', category: '', images: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'seller' && user.role !== 'admin'))) router.push('/');
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) return setError('Please upload at least one image');
    setError(''); setSubmitting(true);
    try {
      await productsAPI.create({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        category: form.category,
        images: form.images,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to create product');
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
        <h4 className="fw-bold mb-2">Product Created!</h4>
        <p className="text-muted mb-4">Your product has been listed successfully.</p>
        <div className="d-flex gap-3 justify-content-center">
          <button onClick={() => { setSuccess(false); setForm({ name:'', description:'', price:'', stockQuantity:'', category:'', images:[] }); }}
            className="btn" style={{ background: '#0d9488', color: '#fff', borderRadius: 10 }}>
            <i className="fas fa-plus me-2"></i>Add Another
          </button>
          <button onClick={() => router.push('/seller/products')} className="btn btn-outline-secondary" style={{ borderRadius: 10 }}>
            My Products
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="d-flex align-items-center gap-3 mb-4">
            <button onClick={() => router.back()} className="btn btn-outline-secondary" style={{ borderRadius: 10 }}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <h3 className="fw-bold mb-0"><i className="fas fa-plus-circle me-2" style={{ color: '#0d9488' }}></i>Add New Product</h3>
          </div>

          <div className="card p-4" style={{ borderRadius: 20 }}>
            {error && <div className="alert alert-danger"><i className="fas fa-exclamation-circle me-2"></i>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Product Name *</label>
                <input type="text" className="form-control" placeholder="e.g. iPhone 16 Pro" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={{ borderRadius: 8 }} />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Description *</label>
                <textarea className="form-control" rows={4} placeholder="Describe your product..." value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required style={{ borderRadius: 8 }} />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold small">Price ($) *</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: '#f8f9fc' }}>$</span>
                    <input type="number" className="form-control" placeholder="0.00" min="0" step="0.01" value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required style={{ borderRadius: '0 8px 8px 0' }} />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold small">Stock Quantity *</label>
                  <input type="number" className="form-control" placeholder="0" min="0" value={form.stockQuantity}
                    onChange={e => setForm(f => ({ ...f, stockQuantity: e.target.value }))} required style={{ borderRadius: 8 }} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Category *</label>
                <select className="form-select" value={form.category} required
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ borderRadius: 8 }}>
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Product Images *</label>
                <ImageUpload
                  images={form.images}
                  onChange={imgs => setForm(f => ({ ...f, images: imgs }))}
                />
              </div>

              <button type="submit" className="btn w-100 py-2"
                style={{ background: '#0d9488', color: '#fff', borderRadius: 10, fontWeight: 600 }}
                disabled={submitting}>
                {submitting ? <><i className="fas fa-spinner fa-spin me-2"></i>Creating...</> : <><i className="fas fa-plus me-2"></i>Create Product</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
