'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') router.push('/');
      else adminAPI.users().then(data => setUsers(Array.isArray(data) ? data : data.users || [])).catch(() => {}).finally(() => setFetching(false));
    }
  }, [user, loading]);

  const handleBlock = async (id) => {
    try { await adminAPI.blockUser(id); setUsers(u => u.map(usr => usr._id === id ? { ...usr, isBlocked: !usr.isBlocked } : usr)); } catch {}
  };
  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await adminAPI.deleteUser(id); setUsers(u => u.filter(usr => usr._id !== id)); } catch {}
  };

  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  if (loading || fetching) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0"><i className="fas fa-users me-2" style={{ color: '#0d9488' }}></i>Users Management</h3>
        <span className="badge px-3 py-2" style={{ background: '#0d948820', color: '#0d9488', borderRadius: 20 }}>{users.length} users</span>
      </div>

      <div className="card p-4">
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Search users..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ borderRadius: 8, maxWidth: 300 }} />
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ background: '#f8f9fc' }}>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0d948820', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-semibold small">{u.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.78rem' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge" style={{ background: u.role === 'admin' ? '#ef444420' : u.role === 'seller' ? '#10b98120' : '#0d948820', color: u.role === 'admin' ? '#ef4444' : u.role === 'seller' ? '#10b981' : '#0d9488', borderRadius: 20 }}>{u.role}</span></td>
                  <td><span className={`badge ${u.isBlocked ? 'bg-danger' : 'bg-success'}`} style={{ borderRadius: 20 }}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                  <td className="small text-muted">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button onClick={() => handleBlock(u._id)} className={`btn btn-sm ${u.isBlocked ? 'btn-outline-success' : 'btn-outline-warning'}`} style={{ borderRadius: 8 }}>
                        <i className={`fas fa-${u.isBlocked ? 'unlock' : 'ban'}`}></i>
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: 8 }}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center text-muted py-4">No users found</div>}
        </div>
      </div>
    </div>
  );
}
