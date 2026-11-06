import Link from 'next/link';
import { CalendarCheck, ShieldCheck, UserRound, Users } from 'lucide-react';
import { formatReviewDate, type Author } from '@/lib/authors';

interface BylineProps {
  author: Author;
  /** YYYY-MM-DD the page's math was last verified; omitted when it has not been */
  lastReviewed?: string;
  /** Shown as "Tax year 2026" on pages whose numbers depend on a tax year */
  taxYear?: number;
  /** "Published" date for blog posts, YYYY-MM-DD */
  published?: string;
  className?: string;
}

/**
 * "By {author} · Reviewed {date} · Tax year {year}" line rendered under
 * the H1 of calculators, salary pages and blog posts (Roadmap v2, Phase 13.1).
 * Every item links to something a reader can check: who the team is and the
 * editorial policy that explains what "reviewed" means.
 */
export default function Byline({ author, lastReviewed, taxYear, published, className }: BylineProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-muted-foreground ${className ?? ''}`}
      data-testid="byline"
    >
      <Link
        href={author.path}
        rel="author"
        className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        {author.kind === 'organization' ? (
          <Users className="size-3.5 text-emerald-600" aria-hidden />
        ) : (
          <UserRound className="size-3.5 text-emerald-600" aria-hidden />
        )}
        <span>
          By <span className="font-medium text-foreground">{author.name}</span>
        </span>
      </Link>
      {published && (
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>·</span>
          <time dateTime={published}>Published {formatReviewDate(published)}</time>
        </span>
      )}
      {lastReviewed && (
        <Link
          href="/editorial-policy#review"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          title="What a review covers"
        >
          <span aria-hidden>·</span>
          <CalendarCheck className="size-3.5 text-emerald-600" aria-hidden />
          <span>
            Reviewed <time dateTime={lastReviewed}>{formatReviewDate(lastReviewed)}</time>
          </span>
        </Link>
      )}
      {taxYear && (
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>·</span>
          <ShieldCheck className="size-3.5 text-emerald-600" aria-hidden />
          <span>Tax year {taxYear}</span>
        </span>
      )}
    </div>
  );
}
