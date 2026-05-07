'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.backendToken) {
      // Save the backend JWT token
      localStorage.setItem('token', session.backendToken);
      // Redirect based on role
      const role = session.backendUser?.role;
      if (role === 'admin') router.push('/admin');
      else if (role === 'seller') router.push('/seller');
      else router.push('/');
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [session, status]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border mb-3" style={{ color: '#0d9488', width: 48, height: 48 }}></div>
        <h5 className="text-muted">Signing you in with Google...</h5>
      </div>
    </div>
  );
}
