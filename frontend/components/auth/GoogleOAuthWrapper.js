'use client';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function GoogleOAuthWrapper({ children }) {
  return (
    <GoogleOAuthProvider clientId="880967415446-d96sfqm54f0oki1674s6m7rdpilr29h7.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
