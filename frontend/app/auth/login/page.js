'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await login(form.email, form.password);
      const role = data.user?.role || data.role;
      if (role === 'admin') router.push('/admin');
      else if (role === 'seller') router.push('/seller');
      else router.push('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #042f2e 0%, #0f2a1a 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="text-center mb-4">
              <Link href="/" className="text-decoration-none">
                <h3 className="text-white fw-bold"><i className="fas fa-bolt me-2" style={{ color: '#0d9488' }}></i>ShopZone</h3>
              </Link>
            </div>
            <div className="card p-4" style={{ borderRadius: 20 }}>
              <h4 className="fw-bold mb-1">Welcome back!</h4>
              <p className="text-muted mb-4">Sign in to your account</p>

              {error && <div className="alert alert-danger py-2"><i className="fas fa-exclamation-circle me-2"></i>{error}</div>}

              {/* Google Login */}
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
                  <label className="form-label fw-semibold small">Email</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: '#f8f9fc', border: '1px solid #e0e0e0' }}><i className="fas fa-envelope text-muted"></i></span>
                    <input type="email" className="form-control" placeholder="you@gmail.com" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required style={{ borderRadius: '0 8px 8px 0' }} />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <label className="form-label fw-semibold small">Password</label>
                    <Link href="/auth/forgot-password" className="small" style={{ color: '#0d9488' }}>Forgot password?</Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: '#f8f9fc', border: '1px solid #e0e0e0' }}><i className="fas fa-lock text-muted"></i></span>
                    <input type={showPass ? 'text' : 'password'} className="form-control" placeholder="••••••••" value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                    <button type="button" className="input-group-text" onClick={() => setShowPass(s => !s)}
                      style={{ background: '#f8f9fc', border: '1px solid #e0e0e0', borderRadius: '0 8px 8px 0', cursor: 'pointer' }}>
                      <i className={`fas fa-eye${showPass ? '-slash' : ''} text-muted`}></i>
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn w-100 py-2" style={{ background: '#0d9488', color: '#fff', borderRadius: 10, fontWeight: 600 }} disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin me-2"></i>Signing in...</> : 'Sign In'}
                </button>
              </form>

              <div className="text-center mt-3 text-muted small">
                Don't have an account?{' '}
                <Link href="/auth/register" style={{ color: '#0d9488', fontWeight: 600 }}>Register now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
