import { getPostData, getSortedPostsData } from '@/lib/blog';
import { Calendar, User, ChevronLeft, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const post = await getPostData(slug);
    return {
      title: `${post.title} - QuickBizCalc Blog`,
      description: post.excerpt,
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

  return (
    <div className="min-h-screen flex flex-col mesh-gradient">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 sm:py-20">
        <article className="max-w-3xl mx-auto">
          {/* Navigation */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-600 transition-colors mb-12 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to all posts
          </Link>

          {/* Header */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">
                {post.category}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                <Calendar className="h-4 w-4" />
                {post.date}
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-3 pt-2">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author}</p>
                <p className="text-xs text-muted-foreground">Author & Expert</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg dark:prose-invert prose-emerald max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-blockquote:border-emerald-500
            prose-img:rounded-3xl prose-img:shadow-2xl"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
          />

          {/* Footer Navigation */}
          <div className="mt-20 pt-8 border-t border-border/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} QuickBizCalc. All rights reserved.
              </div>
              <div className="flex items-center gap-4">
                <Link href="/calculators" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                  All Calculators
                </Link>
                <Link href="/contact" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
