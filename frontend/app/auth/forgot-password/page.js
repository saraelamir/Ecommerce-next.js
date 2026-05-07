'use client';
import { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #042f2e 0%, #0f2a1a 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card p-4" style={{ borderRadius: 20 }}>
              <div className="text-center mb-4">
                <div style={{ width: 64, height: 64, borderRadius: 20, background: '#0d948820', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem', color: '#0d9488' }}>
                  <i className="fas fa-key"></i>
                </div>
                <h4 className="fw-bold mb-1">Forgot Password?</h4>
                <p className="text-muted">Enter your email and we'll send reset instructions</p>
              </div>

              {sent ? (
                <div className="text-center">
                  <div className="alert alert-success"><i className="fas fa-check-circle me-2"></i>Reset link sent! Check your email.</div>
                  <Link href="/auth/login" className="btn" style={{ background: '#0d9488', color: '#fff', borderRadius: 10 }}>Back to Login</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger py-2">{error}</div>}
                  <div className="mb-4">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <input type="email" className="form-control" placeholder="you@example.com" value={email}
                      onChange={e => setEmail(e.target.value)} required style={{ borderRadius: 8 }} />
                  </div>
                  <button type="submit" className="btn w-100 py-2" style={{ background: '#0d9488', color: '#fff', borderRadius: 10, fontWeight: 600 }} disabled={loading}>
                    {loading ? <i className="fas fa-spinner fa-spin me-2"></i> : null}Send Reset Link
                  </button>
                  <div className="text-center mt-3">
                    <Link href="/auth/login" className="text-muted small text-decoration-none"><i className="fas fa-arrow-left me-1"></i>Back to login</Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
