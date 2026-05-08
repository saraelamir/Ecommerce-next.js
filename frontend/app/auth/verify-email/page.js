'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Verification failed');
        setStatus('success');
       setTimeout(() => router.push(`/auth/login?verified=true&email=${searchParams.get('token') ? '' : ''}`), 3000);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message);
      });
  }, []);

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #042f2e 0%, #0f2a1a 100%)' }}
    >
      <div className="col-md-5 col-lg-4 px-3">
        <div className="text-center mb-4">
          <Link href="/" className="text-decoration-none">
            <h3 className="text-white fw-bold">
              <i className="fas fa-bolt me-2" style={{ color: '#0d9488' }}></i>ShopZone
            </h3>
          </Link>
        </div>

        <div className="card p-4 text-center" style={{ borderRadius: 20 }}>
          {status === 'loading' && (
            <>
              <div className="mb-3">
                <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#0d9488' }}></i>
              </div>
              <h5 className="fw-bold">Verifying your email...</h5>
              <p className="text-muted small">Please wait a moment</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-3">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 72, height: 72, background: '#d1fae5' }}
                >
                  <i className="fas fa-check fa-2x" style={{ color: '#059669' }}></i>
                </div>
              </div>
              <h5 className="fw-bold">Account Verified! </h5>
              <p className="text-muted small mb-3">
                You will be redirected to login...
              </p>
              <Link
                href="/auth/login"
                className="btn w-100 py-2"
                style={{ background: '#0d9488', color: '#fff', borderRadius: 10, fontWeight: 600 }}
              >
                <i className="fas fa-sign-in-alt me-2"></i>Go to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-3">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 72, height: 72, background: '#fee2e2' }}
                >
                  <i className="fas fa-times fa-2x" style={{ color: '#dc2626' }}></i>
                </div>
              </div>
              <h5 className="fw-bold">Verification Failed</h5>
              <p className="text-muted small mb-3">{message}</p>
              <Link
                href="/auth/login"
                className="btn w-100 py-2"
                style={{ background: '#0d9488', color: '#fff', borderRadius: 10, fontWeight: 600 }}
              >
                <i className="fas fa-sign-in-alt me-2"></i>Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}