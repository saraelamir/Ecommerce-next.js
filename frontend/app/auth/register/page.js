'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-4" style={{ background: 'linear-gradient(135deg, #042f2e 0%, #0f2a1a 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="text-center mb-4">
              <Link href="/" className="text-decoration-none">
                <h3 className="text-white fw-bold"><i className="fas fa-bolt me-2" style={{ color: '#0d9488' }}></i>ShopZone</h3>
              </Link>
            </div>
            <div className="card p-4" style={{ borderRadius: 20 }}>
              <h4 className="fw-bold mb-1">Create Account</h4>
              <p className="text-muted mb-4">Join thousands of shoppers</p>

              {error && <div className="alert alert-danger py-2"><i className="fas fa-exclamation-circle me-2"></i>{error}</div>}

              {/* Google Register */}
              <div className="mb-3">
                <GoogleLoginButton onError={setError} />
              </div>

              <div className="d-flex align-items-center gap-2 mb-3">
                <hr className="flex-grow-1" />
                <span className="text-muted small">or</span>
                <hr className="flex-grow-1" />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: '#f8f9fc', border: '1px solid #e0e0e0' }}><i className="fas fa-user text-muted"></i></span>
                    <input type="text" className="form-control" placeholder="sara elamir" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={{ borderRadius: '0 8px 8px 0' }} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: '#f8f9fc', border: '1px solid #e0e0e0' }}><i className="fas fa-envelope text-muted"></i></span>
                    <input type="email" className="form-control" placeholder="user@gmail.com" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required style={{ borderRadius: '0 8px 8px 0' }} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Password</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: '#f8f9fc', border: '1px solid #e0e0e0' }}><i className="fas fa-lock text-muted"></i></span>
                    <input type="password" className="form-control" placeholder="Min. 6 characters" value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} style={{ borderRadius: '0 8px 8px 0' }} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold small">Register As</label>
                  <div className="d-flex gap-2">
                    {['customer', 'seller'].map(r => (
                      <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                        className="btn flex-fill"
                        style={{ borderRadius: 10, border: `2px solid ${form.role === r ? '#0d9488' : '#e0e0e0'}`, background: form.role === r ? '#0d948815' : '#fff', color: form.role === r ? '#0d9488' : '#666', fontWeight: 600, textTransform: 'capitalize' }}>
                        <i className={`fas fa-${r === 'customer' ? 'user' : 'store'} me-2`}></i>{r}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn w-100 py-2" style={{ background: '#0d9488', color: '#fff', borderRadius: 10, fontWeight: 600 }} disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin me-2"></i>Creating account...</> : 'Create Account'}
                </button>
              </form>

              <div className="text-center mt-3 text-muted small">
                Already have an account?{' '}
                <Link href="/auth/login" style={{ color: '#0d9488', fontWeight: 600 }}>Sign in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
