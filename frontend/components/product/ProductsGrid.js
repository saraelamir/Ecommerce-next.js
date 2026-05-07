'use client';
import { useState, useEffect } from 'react';
import { productsAPI } from '@/lib/api';
import ProductCard from './ProductCard';

export default function ProductsGrid({ limit, search, category, minPrice, maxPrice }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (limit) params.limit = limit;
    params.page = 1;

    setLoading(true);
    productsAPI.getAll(params)
      .then(data => {
        const list = Array.isArray(data) ? data : data.products || data.data || [];
        setProducts(list);
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, [search, category, minPrice, maxPrice, limit]);

  if (loading) return (
    <div className="row g-4">
      {[...Array(limit || 8)].map((_, i) => (
        <div key={i} className="col-6 col-md-4 col-lg-3">
          <div className="card p-3" style={{ height: 300 }}>
            <div className="placeholder-glow h-100">
              <div className="placeholder col-12 mb-3" style={{ height: 180, borderRadius: 8 }}></div>
              <div className="placeholder col-8 mb-2"></div>
              <div className="placeholder col-4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!products.length) return <div className="text-center py-5 text-muted"><i className="fas fa-box-open fa-3x mb-3 d-block"></i>No products found</div>;

  return (
    <div className="row g-4">
      {products.map(product => (
        <div key={product._id || product.id} className="col-6 col-md-4 col-lg-3">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
