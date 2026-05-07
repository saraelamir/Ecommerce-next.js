import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>

          {/* About */}
          <div className={styles.about}>
            <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.75rem' }}>
              <i className="fas fa-bolt me-2" style={{ color: '#0d9488' }} />ShopZone
            </h5>
            <p>Your ultimate online shopping destination. Quality products, fast delivery, unbeatable prices.</p>
            <div className={styles.socials}>
              {['facebook', 'twitter', 'instagram', 'youtube'].map(s => (
                <a key={s} href="#"><i className={`fab fa-${s}`} /></a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className={styles.col}>
            <h6>Shop</h6>
            <ul>
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/products?category=Electronics">Electronics</Link></li>
              <li><Link href="/products?category=Fashion">Fashion</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className={styles.col}>
            <h6>Account</h6>
            <ul>
              <li><Link href="/profile">Profile</Link></li>
              <li><Link href="/orders">Orders</Link></li>
              <li><Link href="/wishlist">Wishlist</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.newsletter}>
            <h6 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.75rem' }}>Newsletter</h6>
            <p>Get exclusive deals straight to your inbox.</p>
            <div className={styles.emailRow}>
              <input type="email" className={styles.emailInput} placeholder="your@email.com" />
              <button className={styles.emailBtn}><i className="fas fa-paper-plane" /></button>
            </div>
          </div>

        </div>

        <div className={styles.bottom}>
          © 2025 ShopZone. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
