'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import styles from './HomePage.module.css';
// import imgbook from '../public/imgss/books.jpeg'

/* ── Scroll-triggered fade-in ───────────────────────── */
function useScrollAnimation() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, y = 32 }) {
  const [ref, v] = useScrollAnimation();
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? 'none' : `translateY(${y}px)`,
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ── Data ────────────────────────────────────────────── */
const CATEGORIES = [
  {
    label: 'Electronics',
    cat: 'Electronics',
    img: '../imgss/download (2).webp',
    badge: 'Gadgets & Tech',
  },
  {
    label: 'Fashion',
    cat: 'Fashion',
    img: '../imgss/beauty4).jpeg',
    badge: 'Style & Trends',
  },
  {
    label: 'Books',
    cat: 'Books',
    img: '../imgss/books.jpeg',
    badge: 'Knowledge & Stories',
  },
  {
    label: 'Beauty',
    cat: 'Beauty',
    img: '../imgss/beaut6).jpeg',
    badge: 'Skincare & Makeup',
  },
];
const FEATURES = [
  { icon: 'fa-truck',      title: 'Free Shipping',  desc: 'On orders over $50',   color: '#0d9488', bg: '#f0fdfa' },
  { icon: 'fa-undo',       title: 'Easy Returns',   desc: '30-day return policy',  color: '#ec4899', bg: '#fdf2f8' },
  { icon: 'fa-shield-alt', title: 'Secure Payment', desc: '100% secure checkout', color: '#3b82f6', bg: '#eff6ff' },
  { icon: 'fa-headset',    title: '24/7 Support',   desc: 'Always here to help',  color: '#a855f7', bg: '#faf5ff' },
];
const MARQUEE_ITEMS = [
  'Free Shipping Over $50','New Arrivals Weekly','Easy Returns',
  'Secure Checkout','Trusted Sellers','Top Rated Products',
];
const FLOAT_CARDS = [
  { cls: styles.float1, label: 'New Arrival', sub: 'iPhone 16 Pro', color: '#0d9488', icon: 'fa-mobile-alt' },
  { cls: styles.float2, label: 'Best Seller', sub: 'Liquid Blush',  color: '#a855f7', icon: 'fa-spa' },
  { cls: styles.float3, label: 'On Sale 20%', sub: 'Book Bundle',   color: '#ec4899', icon: 'fa-book' },
];

/* ── Product Slider ──────────────────────────────────── */
function ProductSlider({ products }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(4);

  // Detect how many items fit
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisible(w < 576 ? 1 : w < 768 ? 2 : w < 1024 ? 3 : 4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxSlide = Math.max(0, products.length - visible);
  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(maxSlide, c + 1));
  // Reset when visible count changes
  useEffect(() => setCurrent(c => Math.min(c, maxSlide)), [maxSlide]);

  return (
    <div className={styles.sliderWrap}>
      <div className={styles.sliderInner}>
        <div
          className={styles.sliderTrack}
          style={{ transform: `translateX(calc(-${current} * (100% / ${visible} + 5px)))` }}
        >
          {products.map(p => (
            <div key={p._id || p.id} className={styles.sliderItem}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      <button className={`${styles.sliderArrow} ${styles.left}`}  onClick={prev} disabled={current === 0}>
        <i className="fas fa-chevron-left" />
      </button>
      <button className={`${styles.sliderArrow} ${styles.right}`} onClick={next} disabled={current >= maxSlide}>
        <i className="fas fa-chevron-right" />
      </button>

      <div className={styles.sliderDots}>
        {Array.from({ length: maxSlide + 1 }).map((_, i) => (
          <button key={i} className={`${styles.sliderDot}${i === current ? ' ' + styles.active : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────── */
const words = ['Amazing', 'Curated', 'Trending', 'Exclusive'];

export default function HomePage() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [wordIdx, setWordIdx]     = useState(0);

  useEffect(() => {
    productsAPI.getAll({ limit: 8 })
      .then(d => setProducts(Array.isArray(d) ? d : d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(w => (w + 1) % words.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: '#fff' }}>

      {/* ══ HERO ══════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroBgImg} />
        <div className={styles.blob1} />
        <div className={styles.blob2} />

        <div className={styles.heroInner}>
          <div className={styles.heroRow}>

            {/* Left */}
            <div className={styles.heroLeft}>
              <div className={styles.a1}>
                <span className={styles.heroBadge}>
                  <span className={styles.badgeDot} />
                  FREE SHIPPING ON ORDERS OVER $50
                </span>
              </div>

              <div className={styles.a2}>
                <div className={styles.heroHeadline}>
                  <span className={styles.headlineWhite}>Discover</span>
                  <span className={styles.headlineAccent}>
                    <span className={styles.wordSwap} key={wordIdx}>{words[wordIdx]}</span>
                  </span>
                  <span className={styles.headlineDim}>Products</span>
                </div>
              </div>

              <div className={styles.a3}>
                <p className={styles.heroDesc}>
                  Shop thousands of curated products from trusted sellers. Fast delivery, easy returns, prices you'll love.
                </p>
              </div>

              <div className={styles.a4}>
                <div className={styles.heroBtns}>
                  <Link href="/products" className={styles.btnPrimary}>
                    <i className="fas fa-shopping-bag" /> Shop Now
                  </Link>
                  <Link href="/auth/register" className={styles.btnGhost}>
                    Join Free <i className="fas fa-arrow-right" style={{ fontSize: '0.85rem' }} />
                  </Link>
                </div>

                <div className={styles.statsBar}>
                  {[['10K+','Products'],['50K+','Customers'],['4.9','Rating']].map(([n, l]) => (
                    <div key={l} className={styles.statItem}>
                      <div className={styles.statNum}>
                        {n}{l === 'Rating' && <i className="fas fa-star" style={{ fontSize: '0.8rem', marginLeft: 3, color: '#fbbf24' }} />}
                      </div>
                      <div className={styles.statLabel}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — floating cards (hidden on mobile via CSS) */}
            <div className={styles.heroRight}>
              {FLOAT_CARDS.map((c, i) => (
                <div key={i} className={`${styles.floatCard} ${c.cls}`}>
                  <div className={styles.floatIcon} style={{ background: c.color }}>
                    <i className={`fas ${c.icon}`} />
                  </div>
                  <div>
                    <div className={styles.floatLabel}>{c.label}</div>
                    <div className={styles.floatName}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className={styles.scrollHint}>
          <div style={{ marginBottom: 8 }}>SCROLL</div>
          <i className="fas fa-chevron-down" />
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════ */}
      <div className={styles.marqueeBar}>
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
            <span key={i} className={styles.marqueeItem}>
              <span className={styles.marqueeDot} />{t}
            </span>
          ))}
        </div>
      </div>

      {/* ══ CATEGORIES ════════════════════════════════ */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <FadeIn>
            <div className={styles.catHeaderRow}>
              <div>
                <div className={styles.sectionTag}>Browse</div>
                <h2 className={styles.sectionTitle}>Shop by Category</h2>
              </div>
              <Link href="/products" className={styles.catViewAll}>
                View all <i className="fas fa-arrow-right" style={{ fontSize: '0.78rem' }} />
              </Link>
            </div>
          </FadeIn>

          <div className={styles.catGrid}>
            {CATEGORIES.map((c, i) => (
              <FadeIn key={c.cat} delay={i * 0.08}>
                <Link href={`/products?category=${c.cat}`} className={styles.catCard}>
                  <img src={c.img} alt={c.label} className={styles.catImg}
                    onError={e => e.target.src = `https://picsum.photos/seed/${c.cat}/600/800`} />
                  <div className={styles.catOverlay} />
                  <div className={styles.catContent}>
                    <span className={styles.catBadge}>{c.badge}</span>
                    <span className={styles.catName}>{c.label}</span>
                    <span className={styles.catShop}>
                      Shop Now <i className="fas fa-arrow-right" style={{ fontSize: '0.7rem' }} />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ═════════════════════════ */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <FadeIn>
            <div className={styles.featuredHead}>
              <div>
                <div className={styles.sectionTag}>Hand-picked</div>
                <h2 className={styles.sectionTitle}>Featured Products</h2>
              </div>
              <Link href="/products" className={styles.viewAll}>View All <i className="fas fa-arrow-right" style={{fontSize:'0.8rem'}} /></Link>
            </div>
          </FadeIn>

          {loading ? (
            <div className={styles.skeletonGrid}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`${styles.skeletonCard} placeholder-glow`}>
                  <div className="placeholder" style={{ height: 220, width: '100%' }} />
                  <div style={{ padding: 14 }}>
                    <div className="placeholder col-8 mb-2" style={{ height: 12 }} />
                    <div className="placeholder col-4" style={{ height: 12 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductSlider products={products} />
          )}
        </div>
      </section>

      {/* ══ NEW ARRIVALS BANNER ═══════════════════════ */}
      <section className={styles.darkBanner}>
        <div className={styles.bannerInner}>
          <FadeIn>
            <div className={styles.bannerCard}>
              <div className={styles.bannerBg1} />
              <div className={styles.bannerBg2} />
              <div className={styles.bannerBg3} />

              {/* Left — text */}
              <div className={styles.bannerLeft}>
                <div className={styles.bannerTag}>
                  <span className={styles.bannerTagDot} />
                  Fresh Drops
                </div>
                <h2 className={styles.bannerTitle}>
                  New Arrivals <span>Every Week</span> <i className="fas fa-bolt" style={{fontSize:'1.8rem', color:'#0d9488'}} />
                </h2>
                <p className={styles.bannerDesc}>
                  Be the first to discover the latest products from our trusted sellers — fresh drops added every week.
                </p>
                <div className={styles.bannerStats}>
                  {[['500+','New this week'],['4.9','Avg rating'],['2-day','Fast delivery']].map(([n,l]) => (
                    <div key={l} className={styles.bannerStat}>
                      <span className={styles.bannerStatNum}>
                        {n}{l === 'Avg rating' && <i className="fas fa-star" style={{ fontSize: '0.75rem', marginLeft: 3, color: '#fbbf24' }} />}
                      </span>
                      <span className={styles.bannerStatLabel}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — teal CTA panel */}
              <div className={styles.bannerRight}>
                <div className={styles.bannerRightEmoji}><i className="fas fa-shopping-bag" /></div>
                <div className={styles.bannerRightTitle}>Don't miss out<br />on new arrivals</div>
                <div className={styles.bannerRightSub}>Updated every week</div>
                <Link href="/products" className={styles.bannerBtn}>
                  <i className="fas fa-shopping-bag" /> Explore All
                </Link>
                <Link href="/products?sort=latest" className={styles.bannerSecondary}>
                  See what's new <i className="fas fa-arrow-right" style={{ fontSize: '0.75rem' }} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════ */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1}>
                <div className={styles.featureCard} style={{ background: f.bg, border: `1px solid ${f.color}14` }}>
                  <div className={styles.featureIconWrap} style={{ background: `${f.color}14`, color: f.color }}>
                    <i className={`fas ${f.icon}`} />
                  </div>
                  <h6 className={styles.featureTitle}>{f.title}</h6>
                  <small className={styles.featureDesc}>{f.desc}</small>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
