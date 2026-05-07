'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sellerAPI, productsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function SellerProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'seller') router.push('/');
      else sellerAPI.products().then(data => setProducts(Array.isArray(data) ? data : data.products || [])).catch(() => {}).finally(() => setFetching(false));
    }
  }, [user, loading]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try { await productsAPI.delete(id); setProducts(p => p.filter(pr => pr._id !== id)); } catch {}
    setDeleting(null);
  };

  if (loading || fetching) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0"><i className="fas fa-box me-2" style={{ color: '#0d9488' }}></i>My Products</h3>
        <Link href="/products/create" className="btn" style={{ background: '#0d9488', color: '#fff', borderRadius: 10 }}>
          <i className="fas fa-plus me-2"></i>Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center card p-5">
          <i className="fas fa-box-open fa-4x text-muted mb-3 d-block"></i>
          <h5 className="text-muted mb-4">No products yet</h5>
          <Link href="/products/create" className="btn mx-auto" style={{ background: '#0d9488', color: '#fff', borderRadius: 10, maxWidth: 180 }}>Add First Product</Link>
        </div>
      ) : (
        <div className="card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead style={{ background: '#f8f9fc' }}>
                <tr><th>Product</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const image = product.images?.[0] || `https://picsum.photos/seed/${product._id}/60/60`;
                  return (
                    <tr key={product._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img src={image} alt={product.name} style={{ width: 50, height: 50, borderRadius: 10, objectFit: 'cover' }} onError={e => e.target.src='https://picsum.photos/60/60'} />
                          <div>
                            <div className="fw-semibold small">{product.name}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{product.description?.substring(0, 40)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold" style={{ color: '#0d9488' }}>${product.price}</td>
                      <td>
                        <span className={`badge ${product.stockQuantity > 10 ? 'bg-success' : product.stockQuantity > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="small text-muted">{product.category?.name || product.category || 'N/A'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link href={`/products/${product._id}/edit`} className="btn btn-sm btn-outline-primary" style={{ borderRadius: 8 }}>
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button onClick={() => handleDelete(product._id)} className="btn btn-sm btn-outline-danger" disabled={deleting === product._id} style={{ borderRadius: 8 }}>
                            {deleting === product._id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
