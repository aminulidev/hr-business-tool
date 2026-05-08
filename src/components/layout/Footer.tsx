'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.163 0 7.398 2.967 7.398 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return pathname === path;
  };

  const linkClass = (path: string) => {
    return `transition-colors duration-200 underline-offset-2 hover:underline ${isActive(path) ? 'text-foreground font-medium' : 'hover:text-foreground'
      }`;
  };

  return (
    <footer className="border-t border-border/50 bg-muted/30 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Brand row */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
          <img src="/logo.svg" alt="QuickBizCalc" className="h-5 w-5" />
          <span className="text-sm font-medium text-foreground">
            QuickBiz<span className="text-emerald-600">Calc</span>
          </span>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground/70 max-w-2xl mx-auto mb-6">
          Free online calculators for small businesses, HR professionals, and
          entrepreneurs. All calculations are for informational purposes only
          and should not be considered financial, tax, or legal advice.
          Please consult a qualified professional for advice specific to your situation.
        </p>

        {/* Legal links - 2 rows for better mobile layout */}
        <nav aria-label="Footer navigation">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground/60 mb-6">
            <Link href="/blog" className={linkClass('/blog')}>
              Blog
            </Link>
            <Link href="/about" className={linkClass('/about')}>
              About Us
            </Link>
            <Link href="/contact" className={linkClass('/contact')}>
              Contact
            </Link>
            <Link
              href="/glossary"
              className={linkClass('/glossary')}
            >
              Glossary
            </Link>
            <Link href="/privacy-policy" className={linkClass('/privacy-policy')}>
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className={linkClass('/terms-of-service')}>
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className={linkClass('/cookie-policy')}>
              Cookie Policy
            </Link>
            <Link href="/disclaimer" className={linkClass('/disclaimer')}>
              Disclaimer
            </Link>
          </div>
        </nav>

        <div className="flex items-center justify-center gap-4 mb-6">
          <Link
            href="https://www.linkedin.com/company/quickbizcalc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0077b5] hover:opacity-80 transition-opacity"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.facebook.com/QuickBizCalc/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1877F2] hover:opacity-80 transition-opacity"
            aria-label="Facebook Page"
          >
            <FacebookIcon className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.pinterest.com/quickbizcalc/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E60023] hover:opacity-80 transition-opacity"
            aria-label="Pinterest"
          >
            <PinterestIcon className="h-5 w-5" />
          </Link>
          <Link
            href="https://x.com/QuickBizCalc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:opacity-80 transition-opacity"
            aria-label="X/Twitter"
          >
            <XIcon className="h-5 w-5" />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()} QuickBizCalc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
