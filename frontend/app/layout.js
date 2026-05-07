import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SessionWrapper from '@/components/auth/SessionWrapper';

export const metadata = {
  title: 'ShopZone - متجرك الإلكتروني',
  description: 'ShopZone - Discover amazing products online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="ltr">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          * { font-family: 'Poppins', sans-serif; }
          :root {
            --primary: #6c63ff;
            --primary-dark: #5a52d5;
            --secondary: #ff6584;
            --dark: #1a1a2e;
            --card-shadow: 0 4px 20px rgba(108,99,255,0.12);
          }
          body { background: #f8f9fc; color: #1a1a2e; }
          .btn-primary { background: var(--primary); border-color: var(--primary); }
          .btn-primary:hover { background: var(--primary-dark); border-color: var(--primary-dark); }
          .text-primary { color: var(--primary) !important; }
          .bg-primary { background: var(--primary) !important; }
          .card { border: none; box-shadow: var(--card-shadow); border-radius: 12px; }
          .product-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
          .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(108,99,255,0.2); }
          .navbar-brand { font-weight: 800; font-size: 1.5rem; }
          .star-filled { color: #ffc107; }
          .star-empty { color: #dee2e6; }
          .google-btn { display: flex; align-items: center; justify-content: center; gap: 10px; background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 10px 20px; width: 100%; cursor: pointer; font-weight: 600; color: #444; transition: all 0.2s; font-family: 'Poppins', sans-serif; font-size: 0.95rem; }
          .google-btn:hover { border-color: #6c63ff; background: #f8f7ff; }
          .google-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        `}</style>
      </head>
      <body>
        <SessionWrapper>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main style={{ minHeight: '80vh' }}>{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </SessionWrapper>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" async></script>
      </body>
    </html>
  );
}
