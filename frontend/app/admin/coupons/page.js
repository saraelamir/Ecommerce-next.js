'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { couponsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminCouponsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [coupons, setCoupons] = useState([]);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    code: '',
    discount: '',
    expiresAt: '',
  });

  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');

    if (user?.role === 'admin') {
      couponsAPI.getAll()
        .then(data => setCoupons(data.coupons || []))
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [user, loading]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAdding(true);

    try {
      const data = await couponsAPI.create({
        code: form.code.toUpperCase().trim(),
        discountPercent: Number(form.discount), // ✔ مهم
        expiresAt: form.expiresAt,            // ✔ مهم
      });

      setCoupons(c => [...c, data.coupon || data]);

      setForm({
        code: '',
        discount: '',
        expiresAt: '',
      });

      setSuccess('Coupon created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create coupon');
    }

    setAdding(false);
  };

  if (loading || fetching)
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#0d9488' }}></div>
      </div>
    );

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">
          <i className="fas fa-tag me-2" style={{ color: '#0d9488' }}></i>
          Coupons Management
        </h3>

        <span className="badge px-3 py-2"
          style={{ background: '#0d948820', color: '#0d9488', borderRadius: 20 }}>
          {coupons.length} coupons
        </span>
      </div>

      <div className="row g-4">

        {/* Add Coupon */}
        <div className="col-lg-4">
          <div className="card p-4" style={{ borderRadius: 16 }}>

            <h5 className="fw-bold mb-4">
              <i className="fas fa-plus-circle me-2" style={{ color: '#0d9488' }}></i>
              Add New Coupon
            </h5>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {success && <div className="alert alert-success py-2 small">{success}</div>}

            <form onSubmit={handleAdd}>

              {/* CODE */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Coupon Code *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. WELCOME10"
                  value={form.code}
                  onChange={e =>
                    setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))
                  }
                  required
                />
              </div>

              {/* DISCOUNT */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Discount % *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="10"
                  min="1"
                  max="90"
                  value={form.discount}
                  onChange={e =>
                    setForm(f => ({ ...f, discount: e.target.value }))
                  }
                  required
                />
              </div>

              {/* EXPIRES AT */}
              <div className="mb-4">
                <label className="form-label fw-semibold small">Expires At *</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.expiresAt}
                  onChange={e =>
                    setForm(f => ({ ...f, expiresAt: e.target.value }))
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-100"
                style={{ background: '#0d9488', color: '#fff', borderRadius: 10 }}
                disabled={adding}
              >
                {adding ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus me-2"></i>
                    Add Coupon
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* List */}
        <div className="col-lg-8">
          <div className="card p-4" style={{ borderRadius: 16 }}>

            <h5 className="fw-bold mb-4">All Coupons</h5>

            {coupons.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-tag fa-3x mb-3 d-block"></i>
                <p>No coupons yet. Add your first one!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">

                  <thead style={{ background: '#f8f9fc' }}>
                    <tr>
                      <th>Code</th>
                      <th>Discount</th>
                      <th>Expires</th>
                      <th>Created</th>
                    </tr>
                  </thead>

                  <tbody>
                    {coupons.map((c, i) => (
                      <tr key={c._id || i}>
                        <td>
                          <span className="badge px-3 py-2 fw-bold"
                            style={{ background: '#0d948820', color: '#0d9488' }}>
                            {c.code}
                          </span>
                        </td>

                        <td className="fw-bold" style={{ color: '#0d9488' }}>
                          {c.discountPercent}%
                        </td>

                        <td>
                          {c.expiresAt
                            ? new Date(c.expiresAt).toLocaleDateString()
                            : 'N/A'}
                        </td>

                        <td className="text-muted small">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}