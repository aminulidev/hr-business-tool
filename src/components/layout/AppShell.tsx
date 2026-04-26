'use client';

import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import CookieConsentBanner from './CookieConsentBanner';
import Scripts from '../analytics/Scripts';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient relative overflow-hidden">
      {/* Analytics & Ads */}
      <Scripts />

      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-gold-500/8 blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-40 right-1/3 h-96 w-96 rounded-full bg-emerald-600/8 blur-3xl animate-float-slow" />
      </div>

      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
}
