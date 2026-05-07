'use client';
import BackButton from '@/components/ui/BackButton';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usersAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    if (user) {
      usersAPI.getProfile()
        .then(data => {
          const p = data.user || data;
          setProfile(p);
          setForm({ name: p.name || '', phone: p.phone || '', address: p.address || '' });
        }).catch(() => {});
    }
  }, [user, loading]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      await usersAPI.updateProfile(form);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update');
    }
    setSaving(false);
  };

  if (loading || !profile) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
          <div className="col-lg-7 mb-0"><BackButton /></div>
        <div className="col-lg-7">
          <div className="card p-0" style={{ borderRadius: 20, overflow: 'hidden' }}>
            {/* Header */}
            <div className="p-5 text-white text-center" style={{ background: 'linear-gradient(135deg, #6c63ff, #a78bfa)' }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2.5rem', fontWeight: 700 }}>
                {profile.name?.[0]?.toUpperCase()}
              </div>
              <h4 className="fw-bold mb-1">{profile.name}</h4>
              <p className="mb-1" style={{ opacity: 0.85 }}>{profile.email}</p>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 20 }}>
                <i className="fas fa-user-tag me-1"></i>{profile.role || 'customer'}
              </span>
            </div>

            <div className="p-4">
              {success && <div className="alert alert-success py-2"><i className="fas fa-check-circle me-2"></i>{success}</div>}
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <h5 className="fw-bold mb-4">Edit Profile</h5>
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Full Name</label>
                  <input type="text" className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ borderRadius: 8 }} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email (read-only)</label>
                  <input type="email" className="form-control" value={profile.email} readOnly style={{ borderRadius: 8, background: '#f8f9fc' }} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Phone</label>
                  <input type="tel" className="form-control" placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={{ borderRadius: 8 }} />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold small">Address</label>
                  <textarea className="form-control" rows={2} placeholder="Your address..." value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={{ borderRadius: 8 }} />
                </div>
                <button type="submit" className="btn w-100 py-2" style={{ background: '#0d9488', color: '#fff', borderRadius: 10, fontWeight: 600 }} disabled={saving}>
                  {saving ? <><i className="fas fa-spinner fa-spin me-2"></i>Saving...</> : <><i className="fas fa-save me-2"></i>Save Changes</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
