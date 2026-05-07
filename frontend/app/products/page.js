'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';

const CATEGORIES = ['Electronics', 'Fashion', 'Books', 'Beauty'];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    setFilters(f => ({ ...f, category: cat, search }));
    setTempFilters(f => ({ ...f, category: cat, search }));
    setPage(1);
  }, [searchParams.get('category'), searchParams.get('search')]);

  const fetchProducts = async (f, p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12 };
      if (f.search) params.search = f.search;
      if (f.minPrice) params.minPrice = f.minPrice;
      if (f.maxPrice) params.maxPrice = f.maxPrice;
      const data = await productsAPI.getAll(params);
      let list = Array.isArray(data) ? data : data.products || [];
      if (f.category) {
        list = list.filter(p => {
          const catName = p.category?.name?.replace(/-\d+$/, '') || '';
          return catName.toLowerCase() === f.category.toLowerCase();
        });
      }
      if (f.rating) list = list.filter(p => (p.averageRating || 0) >= Number(f.rating));
      // Sort
      if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
      if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
      if (sortBy === 'rating') list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      setProducts(list);
      setTotal(data.pagination?.total || list.length);
    } catch { setProducts([]); }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(filters, page); }, [filters, page, sortBy]);

  const applyFilters = () => { setFilters(tempFilters); setPage(1); };
  const clearFilters = () => {
    const empty = { search: '', category: '', minPrice: '', maxPrice: '', rating: '' };
    setTempFilters(empty); setFilters(empty); setPage(1);
  };

  const totalPages = Math.ceil(total / 12) || 1;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .products-page * { box-sizing: border-box; }
        /* Sub navbar */
        .sub-nav { background: #fff; border-bottom: 1px solid #e8f5f4; padding: 0 24px; display: flex; align-items: center; gap: 0; overflow-x: auto; }
        .sub-nav-item { padding: 14px 18px; font-size: 0.88rem; font-weight: 500; color: #475569; white-space: nowrap; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; text-decoration: none; display: flex; align-items: center; gap: 6px; }
        .sub-nav-item:hover { color: #042f2e; border-bottom-color: #0d9488; }
        .sub-nav-item.hot { color: #ef4444; }
        .hot-badge { background: #ef4444; color: #fff; font-size: 0.6rem; font-weight: 800; padding: 1px 6px; border-radius: 10px; }
        .sub-nav-features { margin-left: auto; display: flex; gap: 24px; flex-shrink: 0; }
        .sub-nav-feat { display: flex; align-items: center; gap: 8px; padding: 10px 0; }
        .sub-nav-feat-icon { color: #0d9488; font-size: 1rem; }
        .sub-nav-feat-text { font-size: 0.78rem; }
        .sub-nav-feat-title { font-weight: 700; color: #042f2e; display: block; }
        .sub-nav-feat-sub { color: #94a3b8; display: block; }

        /* Sidebar */
        .filter-sidebar { background: #fff; border-radius: 16px; border: 1px solid #e8f5f4; overflow: hidden; position: sticky; top: 80px; }
        .filter-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .filter-title { font-weight: 700; font-size: 1rem; color: #042f2e; display: flex; align-items: center; gap: 8px; }
        .filter-clear { font-size: 0.8rem; color: #0d9488; font-weight: 600; background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 6px; }
        .filter-clear:hover { background: #f0fdfa; }
        .filter-section { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
        .filter-section:last-child { border-bottom: none; }
        .filter-section-title { font-size: 0.8rem; font-weight: 700; color: #042f2e; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .filter-search { position: relative; }
        .filter-search input { width: 100%; padding: 9px 12px 9px 34px; border: 1.5px solid #e8f5f4; border-radius: 10px; font-size: 0.85rem; outline: none; font-family: 'Poppins',sans-serif; background: #f8fffe; transition: border-color 0.2s; }
        .filter-search input:focus { border-color: #0d9488; }
        .filter-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.8rem; }
        .filter-check { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; cursor: pointer; }
        .filter-check-left { display: flex; align-items: center; gap: 10px; }
        .filter-check input[type=checkbox] { width: 16px; height: 16px; border-radius: 4px; accent-color: #042f2e; cursor: pointer; }
        .filter-check-label { font-size: 0.88rem; color: #475569; cursor: pointer; }
        .filter-check-count { font-size: 0.78rem; color: #94a3b8; background: #f1f5f9; padding: 1px 7px; border-radius: 10px; }
        .price-inputs { display: flex; gap: 8px; }
        .price-input-wrap { flex: 1; position: relative; }
        .price-input-wrap span { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.8rem; }
        .price-input-wrap input { width: 100%; padding: 8px 10px 8px 20px; border: 1.5px solid #e8f5f4; border-radius: 9px; font-size: 0.82rem; outline: none; font-family: 'Poppins',sans-serif; background: #f8fffe; }
        .price-input-wrap input:focus { border-color: #0d9488; }
        .rating-check { display: flex; align-items: center; gap: 8px; padding: 5px 0; cursor: pointer; }
        .rating-stars { color: #fbbf24; font-size: 0.8rem; }
        .apply-btn { width: 100%; padding: 11px; background: #042f2e; color: #fff; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; font-family: 'Poppins',sans-serif; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s; }
        .apply-btn:hover { background: #0d9488; }
        .reset-btn { width: 100%; padding: 9px; background: #fff; color: #475569; border: 1.5px solid #e2e8f0; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; font-family: 'Poppins',sans-serif; margin-top: 8px; transition: all 0.2s; }
        .reset-btn:hover { border-color: #042f2e; color: #042f2e; }

        /* Products area */
        .products-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .products-title { font-size: 1.3rem; font-weight: 800; color: #042f2e; }
        .products-count { font-size: 0.85rem; color: #94a3b8; margin-top: 2px; }
        .active-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
        .active-filter-tag { display: flex; align-items: center; gap: 6px; background: #f0fdfa; border: 1px solid #0d9488; color: #042f2e; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .active-filter-tag button { background: none; border: none; color: #0d9488; cursor: pointer; padding: 0; font-size: 0.85rem; line-height: 1; }
        .sort-wrap { display: flex; align-items: center; gap: 10px; }
        .sort-select { padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.85rem; outline: none; font-family: 'Poppins',sans-serif; color: #042f2e; background: #fff; cursor: pointer; }
        .view-toggle { display: flex; border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
        .view-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: #fff; border: none; cursor: pointer; color: #94a3b8; transition: all 0.2s; font-size: 0.9rem; }
        .view-btn.active { background: #042f2e; color: #fff; }

        /* Skeleton */
        .skel { background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 10px; }
        @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

        /* Pagination */
        .pagination { display: flex; justify-content: center; align-items: center; gap: 6px; margin-top: 36px; }
        .page-btn { width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; font-size: 0.88rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-family: 'Poppins',sans-serif; }
        .page-btn:hover { border-color: #042f2e; color: #042f2e; }
        .page-btn.active { background: #042f2e; color: #fff; border-color: #042f2e; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .page-btn:disabled:hover { border-color: #e2e8f0; color: #475569; }

        /* List view */
        .list-card { background: #fff; border-radius: 14px; border: 1px solid #f1f5f9; padding: 16px; display: flex; gap: 16px; align-items: center; transition: all 0.2s; }
        .list-card:hover { box-shadow: 0 8px 24px rgba(4,47,46,0.08); transform: translateY(-2px); }
        .list-card-img { width: 100px; height: 100px; border-radius: 10px; object-fit: contain; background: #f8fffe; flex-shrink: 0; padding: 8px; }
        .list-card-body { flex: 1; }
        .list-card-cat { font-size: 0.72rem; color: #0d9488; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .list-card-name { font-size: 1rem; font-weight: 700; color: #042f2e; margin: 4px 0; }
        .list-card-price { font-size: 1.1rem; font-weight: 800; color: #042f2e; }
        .list-add-btn { background: #042f2e; color: #fff; border: none; padding: 9px 20px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; font-family: 'Poppins',sans-serif; transition: background 0.2s; }
        .list-add-btn:hover { background: #0d9488; }
      `}</style>

      {/* Sub Navbar */}
      <div className="sub-nav d-none d-lg-flex">
        <a className="sub-nav-item" href="/products">Home</a>
        <a className="sub-nav-item hot" href="/products">Deals <span className="hot-badge">Hot</span></a>
        <a className="sub-nav-item" href="/products?category=Electronics">New Arrivals</a>
        <a className="sub-nav-item" href="/products">Top Rated</a>
        {CATEGORIES.map(c => (
          <a key={c} className="sub-nav-item" href={`/products?category=${c}`}>{c}</a>
        ))}
        <div className="sub-nav-features">
          {[
            { icon: 'fa-truck', title: 'Free Shipping', sub: 'On all orders over $50' },
            { icon: 'fa-undo', title: 'Easy Returns', sub: '30-day return policy' },
            { icon: 'fa-lock', title: 'Secure Payment', sub: '100% secure checkout' },
          ].map(f => (
            <div key={f.title} className="sub-nav-feat">
              <i className={`fas ${f.icon} sub-nav-feat-icon`}></i>
              <div className="sub-nav-feat-text">
                <span className="sub-nav-feat-title">{f.title}</span>
                <span className="sub-nav-feat-sub">{f.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-fluid py-4 products-page" style={{ maxWidth: 1320 }}>
        <div className="row g-4">

          {/* ── Sidebar ── */}
          <div className="col-lg-3">
            <div className="filter-sidebar">
              <div className="filter-header">
                <div className="filter-title">
                  <i className="fas fa-sliders-h" style={{ color: '#0d9488' }}></i> Filters
                </div>
                {(filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.rating) && (
                  <button className="filter-clear" onClick={clearFilters}>Clear all</button>
                )}
              </div>

              {/* Search */}
              <div className="filter-section">
                <div className="filter-section-title">Search products</div>
                <div className="filter-search">
                  <i className="fas fa-search filter-search-icon"></i>
                  <input type="text" placeholder="Search in products..."
                    value={tempFilters.search}
                    onChange={e => setTempFilters(f => ({ ...f, search: e.target.value }))} />
                </div>
              </div>

              {/* Category */}
              <div className="filter-section">
                <div className="filter-section-title">Category <i className="fas fa-chevron-up" style={{ fontSize: '0.7rem' }}></i></div>
                <label className="filter-check">
                  <div className="filter-check-left">
                    <input type="checkbox" checked={tempFilters.category === ''} onChange={() => setTempFilters(f => ({ ...f, category: '' }))} />
                    <span className="filter-check-label">All Categories</span>
                  </div>
                </label>
                {CATEGORIES.map(c => (
                  <label key={c} className="filter-check">
                    <div className="filter-check-left">
                      <input type="checkbox" checked={tempFilters.category === c}
                        onChange={() => setTempFilters(f => ({ ...f, category: f.category === c ? '' : c }))} />
                      <span className="filter-check-label">{c}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <div className="filter-section-title">Price Range <i className="fas fa-chevron-up" style={{ fontSize: '0.7rem' }}></i></div>
                <div className="price-inputs">
                  <div className="price-input-wrap">
                    <span>$</span>
                    <input type="number" placeholder="Min" value={tempFilters.minPrice}
                      onChange={e => setTempFilters(f => ({ ...f, minPrice: e.target.value }))} />
                  </div>
                  <div className="price-input-wrap">
                    <span>$</span>
                    <input type="number" placeholder="Max" value={tempFilters.maxPrice}
                      onChange={e => setTempFilters(f => ({ ...f, maxPrice: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="filter-section">
                <div className="filter-section-title">Rating <i className="fas fa-chevron-up" style={{ fontSize: '0.7rem' }}></i></div>
                {[4, 3, 2, 1].map(r => (
                  <label key={r} className="rating-check" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#042f2e', cursor: 'pointer' }}
                      checked={tempFilters.rating === String(r)}
                      onChange={() => setTempFilters(f => ({ ...f, rating: f.rating === String(r) ? '' : String(r) }))} />
                    <span className="rating-stars">
                      {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star" style={{ fontSize: '0.78rem', color: s <= r ? '#fbbf24' : '#e2e8f0' }} />)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({r} & up)</span>
                  </label>
                ))}
              </div>

              {/* Buttons */}
              <div className="filter-section">
                <button className="apply-btn" onClick={applyFilters}>
                  <i className="fas fa-filter"></i> Apply Filters
                </button>
                <button className="reset-btn" onClick={clearFilters}>
                  <i className="fas fa-undo me-2"></i>Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* ── Products ── */}
          <div className="col-lg-9">
            {/* Header */}
            <div className="products-header">
              <div>
                <div className="products-title">
                  {filters.category || 'All Products'}
                </div>
                <div className="products-count">{products.length} results found</div>
              </div>
              <div className="sort-wrap">
                <div className="view-toggle">
                  <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                    <i className="fas fa-th"></i>
                  </button>
                  <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                    <i className="fas fa-list"></i>
                  </button>
                </div>
                <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="latest">Sort by: Latest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Active filter tags */}
            {(filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.rating) && (
              <div className="active-filters mb-3">
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', alignSelf: 'center' }}>Active:</span>
                {filters.category && (
                  <span className="active-filter-tag">{filters.category}
                    <button onClick={() => { setFilters(f => ({ ...f, category: '' })); setTempFilters(f => ({ ...f, category: '' })); }}><i className="fas fa-times" /></button>
                  </span>
                )}
                {filters.search && (
                  <span className="active-filter-tag">"{filters.search}"
                    <button onClick={() => { setFilters(f => ({ ...f, search: '' })); setTempFilters(f => ({ ...f, search: '' })); }}><i className="fas fa-times" /></button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="active-filter-tag">${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                    <button onClick={() => { setFilters(f => ({ ...f, minPrice: '', maxPrice: '' })); setTempFilters(f => ({ ...f, minPrice: '', maxPrice: '' })); }}><i className="fas fa-times" /></button>
                  </span>
                )}
                {filters.rating && (
                  <span className="active-filter-tag">
                    {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star" style={{ fontSize: '0.7rem', color: s <= Number(filters.rating) ? '#fbbf24' : '#e2e8f0' }} />)} & up
                    <button onClick={() => { setFilters(f => ({ ...f, rating: '' })); setTempFilters(f => ({ ...f, rating: '' })); }}><i className="fas fa-times" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products */}
            {loading ? (
              <div className="row g-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={viewMode === 'grid' ? 'col-6 col-md-4 col-lg-3' : 'col-12'}>
                    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', height: viewMode === 'grid' ? 340 : 120 }}>
                      <div className="skel" style={{ height: viewMode === 'grid' ? 220 : 120, width: viewMode === 'list' ? 120 : '100%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16 }}>
                <i className="fas fa-box-open" style={{ fontSize: '3rem', color: '#cbd5e1', display: 'block', marginBottom: 16 }}></i>
                <h5 style={{ color: '#042f2e', fontWeight: 700 }}>No products found</h5>
                <p style={{ color: '#94a3b8', marginBottom: 20 }}>Try adjusting your filters</p>
                <button onClick={clearFilters} style={{ background: '#042f2e', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>
                  Show All Products
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="row g-4">
                {products.map(p => (
                  <div key={p._id || p.id} className="col-6 col-md-4 col-lg-3">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {products.map(p => {
                  const image = p.images?.[0] || `https://picsum.photos/seed/${p._id}/100/100`;
                  return (
                    <a key={p._id} href={`/products/${p._id}`} className="text-decoration-none">
                      <div className="list-card">
                        <img src={image} alt={p.name} className="list-card-img" onError={e => e.target.src = 'https://picsum.photos/100/100'} />
                        <div className="list-card-body">
                          <div className="list-card-cat">{p.category?.name?.replace(/-\d+$/, '') || 'General'}</div>
                          <div className="list-card-name">{p.name}</div>
                          <div style={{ margin: '4px 0' }}>
                            {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star" style={{ fontSize: '0.75rem', color: s <= Math.round(p.averageRating || 0) ? '#fbbf24' : '#e2e8f0' }} />)}
                          </div>
                          <div className="list-card-price">${p.price}</div>
                        </div>
                        <button className="list-add-btn">
                          <i className="fas fa-cart-plus me-2"></i>Add to Cart
                        </button>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {total > 12 && (
              <div className="pagination">
                <button className="page-btn" disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) => p === '...' ? (
                    <span key={`d${i}`} style={{ color: '#94a3b8', padding: '0 4px' }}>...</span>
                  ) : (
                    <button key={p} className={`page-btn ${p === page ? 'active' : ''}`}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                      {p}
                    </button>
                  ))
                }
                <button className="page-btn" disabled={page >= totalPages} onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-5"><div className="spinner-border" style={{ color: '#0d9488' }}></div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
