'use client';

import Link from 'next/link';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.glow} />

        <div className="container text-center">
          <h1 className={`${styles.title} ${styles.fadeUp}`}>
            About ShopZone
          </h1>

          <p className={`${styles.subtitle} ${styles.fadeUpDelay}`}>
            Your ultimate online shopping destination since 2020
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className={`container ${styles.section}`}>
        <div className={styles.grid}>

          <div className={`${styles.textBox} ${styles.fadeUp}`}>
            <h2>Our Mission</h2>
            <p>
              At ShopZone, we believe shopping should be simple, enjoyable, and accessible to everyone.
              We connect buyers with the best sellers to deliver quality products at unbeatable prices.
            </p>
            <p>
              From electronics to fashion, everything you need in one place.
            </p>
          </div>

          <div className={`${styles.cardsGrid} ${styles.fadeUpDelay}`}>

            {[
              { icon: 'fa-store', value: '10K+', label: 'Products' },
              { icon: 'fa-users', value: '50K+', label: 'Customers' },
              { icon: 'fa-truck', value: '100K+', label: 'Deliveries' },
              { icon: 'fa-star', value: '4.8', label: 'Rating' },
            ].map((item) => (
              <div key={item.label} className={styles.card}>
                <i className={`fas ${item.icon}`} />
                <h3>{item.value}</h3>
                <p>{item.label}</p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* VALUES */}
      <section className={`container ${styles.section}`}>
        <h2 className={`${styles.sectionTitle} ${styles.fadeUp}`}>
          Our Values
        </h2>

        <div className={styles.valuesGrid}>

          {[
            { icon: 'fa-shield-alt', title: 'Trust & Safety', desc: 'Secure shopping experience.' },
            { icon: 'fa-leaf', title: 'Sustainability', desc: 'Eco-friendly packaging.' },
            { icon: 'fa-headset', title: 'Support', desc: '24/7 customer support.' },
            { icon: 'fa-bolt', title: 'Fast Delivery', desc: 'Quick & reliable shipping.' },
          ].map((v) => (
            <div key={v.title} className={styles.valueCard}>
              <div className={styles.iconBox}>
                <i className={`fas ${v.icon}`} />
              </div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h3>Ready to start shopping?</h3>
        <Link href="/products" className={styles.btn}>
          <i className="fas fa-shopping-bag" /> Shop Now
        </Link>
      </section>

    </div>
  );
}