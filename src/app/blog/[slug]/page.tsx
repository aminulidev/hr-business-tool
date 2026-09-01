import { getPostData, getSortedPostsData } from '@/lib/blog';
import { SITE_URL, SITE_NAME } from '@/lib/calculator-meta';
import { Calendar, User, ArrowLeft, ShieldCheck, Calculator, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import AppShell from '@/components/layout/AppShell';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const post = await getPostData(slug);
    return {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
      alternates: {
        canonical: `${SITE_URL}/blog/${slug}`,
      },
      openGraph: {
        title: `${post.title} | ${SITE_NAME}`,
        description: post.excerpt,
        url: `${SITE_URL}/blog/${slug}`,
        type: 'article',
        siteName: SITE_NAME,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${post.title} | ${SITE_NAME}`,
        description: post.excerpt,
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  let post;
  try {
    post = await getPostData(slug);
  } catch {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: 'Financial & HR Specialist',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
  };

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="container mx-auto px-4 py-10 sm:py-16">
        <article className="max-w-3xl mx-auto">
          {/* Navigation */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to all insights &amp; guides
          </Link>

          {/* Header */}
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-medium">
                {post.category}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                <Calendar className="h-4 w-4" />
                {post.date}
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-600 font-bold text-xs">
                {post.author.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  {post.author}
                  <ShieldCheck className="h-4 w-4 text-emerald-600 inline" />
                </p>
                <p className="text-xs text-muted-foreground">Expert Reviewed &bull; QuickBizCalc Editorial Board</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose-custom prose prose-lg dark:prose-invert prose-emerald max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-a:text-emerald-600 prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-emerald-700
            prose-strong:text-foreground prose-blockquote:border-emerald-500
            prose-img:rounded-3xl prose-img:shadow-2xl mb-12"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Author Box & E-E-A-T Guarantee */}
          <div className="rounded-3xl border border-border/60 bg-muted/20 p-6 sm:p-8 space-y-4 mb-8">
            <h3 className="text-base font-bold text-foreground">About the Author &amp; Editorial Review</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This guide was researched and vetted by the QuickBizCalc editorial team in accordance with our{' '}
              <Link href="/about" className="text-emerald-600 hover:underline">
                5-step calculation and verification methodology
              </Link>
              . All payroll rates and formulas are verified against current IRS and Department of Labor guidelines.
            </p>
          </div>

          {/* Interactive Calculators CTA */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-xl shadow-emerald-600/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Try Our Interactive Business Calculators</h3>
              <p className="text-sm text-emerald-50/80 mt-1">
                Get instant, automated calculations with zero data storage and CSV/PDF export.
              </p>
            </div>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Calculator className="h-4 w-4" />
              All Calculators <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </div>
    </AppShell>
  );
}
