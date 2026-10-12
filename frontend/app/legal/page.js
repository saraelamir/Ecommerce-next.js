'use client';

import { useState } from 'react';
import styles from './legal.module.css';

export default function LegalPage() {

  const [open, setOpen] = useState({
    faq: null,
    privacy: null,
    terms: null
  });

  const faq = [
    { q: 'How can I place an order?', a: 'Add products to cart then proceed to checkout.' },
    { q: 'How long does delivery take?', a: 'Usually 3–5 business days depending on location.' },
    { q: 'Can I return a product?', a: 'Yes, within 14 days if eligible.' },
  ];

  const privacy = [
    { t: 'Information We Collect', c: 'We collect name, email, address, and order details.' },
    { t: 'How We Use Data', c: 'To process orders and improve experience.' },
    { t: 'Security', c: 'We use encryption and secure servers to protect your data.' },
    { t: 'Cookies', c: 'Used to improve browsing experience.' },
  ];

  const terms = [
    { t: 'Acceptance', c: 'By using ShopZone you agree to our terms.' },
    { t: 'Payments', c: 'All payments are in EGP and completed at checkout.' },
    { t: 'Shipping', c: 'Delivery times are estimates.' },
    { t: 'Returns', c: 'Returns within 14 days if eligible.' },
  ];

  const Accordion = ({ title, content, isOpen, onClick }) => (
    <div className={styles.item} onClick={onClick}>

      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>›</span>
      </div>

      <div className={`${styles.body} ${isOpen ? styles.show : ''}`}>
        {content}
      </div>

    </div>
  );

  return (
    <div className={styles.page}>

      {/* HERO (NEW MODERN STYLE) */}
      <div className={styles.hero}>
        <div className="container text-center position-relative">

          <div className={styles.glow}></div>

          <h1 className="fw-bold text-muted">Legal Center</h1>
          <p className="text-muted">
            FAQ • Privacy Policy • Terms of Service
          </p>

        </div>
      </div>

      {/* CONTENT */}
      <div className="container py-5" style={{ maxWidth: 900 }}>

        {/* FAQ */}
        <h4 className={styles.sectionTitle}>FAQ</h4>

        {faq.map((item, i) => (
          <Accordion
            key={i}
            title={item.q}
            isOpen={open.faq === i}
            onClick={() =>
              setOpen(prev => ({
                ...prev,
                faq: prev.faq === i ? null : i
              }))
            }
            content={<p className="mb-0">{item.a}</p>}
          />
        ))}

        {/* PRIVACY */}
        <h4 className={styles.sectionTitle}>Privacy Policy</h4>

        {privacy.map((item, i) => (
          <Accordion
            key={i}
            title={item.t}
            isOpen={open.privacy === i}
            onClick={() =>
              setOpen(prev => ({
                ...prev,
                privacy: prev.privacy === i ? null : i
              }))
            }
            content={<p className="mb-0">{item.c}</p>}
          />
        ))}

        {/* TERMS */}
        <h4 className={styles.sectionTitle}>Terms of Service</h4>

        {terms.map((item, i) => (
          <Accordion
            key={i}
            title={item.t}
            isOpen={open.terms === i}
            onClick={() =>
              setOpen(prev => ({
                ...prev,
                terms: prev.terms === i ? null : i
              }))
            }
            content={<p className="mb-0">{item.c}</p>}
          />
        ))}

      </div>
    </div>
  );
}