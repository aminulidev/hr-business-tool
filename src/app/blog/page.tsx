import Link from 'next/link';
import { BookOpen, Calendar, User, ChevronRight } from 'lucide-react';
import { getSortedPostsData } from '@/lib/blog';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Blog - QuickBizCalc HR & Business Insights',
  description: 'Expert advice, guides, and insights on HR, payroll, taxation, and business management to help you grow your business.',
};

export default async function BlogPage() {
  const posts = await getSortedPostsData();

  return (
    <div className="min-h-screen flex flex-col mesh-gradient">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-3 py-1 bg-emerald-500/10 border-emerald-500/30 text-emerald-600">
              Latest Insights
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              QuickBizCalc <span className="text-emerald-600">Insights</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert guides and strategic advice on HR, payroll, and business finance to help you navigate the complexities of management.
            </p>
          </div>

          {/* Blog Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className="group block rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-emerald-500/30 hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-foreground group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <User className="h-3 w-3 text-emerald-600" />
                        </div>
                        {post.author}
                      </div>
                      <div className="text-emerald-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-3xl border border-dashed border-border bg-muted/20">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground">Check back soon for expert HR and business insights.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
