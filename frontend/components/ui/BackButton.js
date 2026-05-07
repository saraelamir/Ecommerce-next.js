'use client';
import { useRouter } from 'next/navigation';

export default function BackButton({ label = 'Back' }) {
  const router = useRouter();
  return (
    <button onClick={() => router.back()}
      className="btn btn-sm d-inline-flex align-items-center gap-2 mb-4"
      style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #0d9488', borderRadius: 10, fontWeight: 600 }}>
      <i className="fas fa-arrow-left"></i> {label}
    </button>
  );
}
