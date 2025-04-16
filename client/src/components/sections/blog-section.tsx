import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import BlogCard from "@/components/ui/blog-card";
import { Link } from "wouter";
import { BlogPost } from "@shared/schema";

export default function BlogSection() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: featuredPost } = useQuery<BlogPost>({
    queryKey: ["/api/blog/featured"],
  });

  return (
    <section id="blog" className="py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-inter font-bold text-3xl md:text-4xl mb-6">Technical Blog</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            I share my thoughts, insights, and tutorials about Android development, 
            design patterns, and emerging technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeleton for regular blog posts
            Array.from({ length: 3 }).map((_, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md animate-pulse"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-700"></div>
                <div className="p-6">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-4/5 mb-3"></div>
                  <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                  <div className="flex gap-2 mb-6">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                </div>
              </div>
            ))
          ) : (
            posts?.filter(post => !post.isFeatured)
              .slice(0, 3)
              .map(post => <BlogCard key={post.id} post={post} />)
          )}
        </div>

        {/* Featured Blog Post */}
        {isLoading ? (
          <div className="mt-16 bg-white dark:bg-dark-surface rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/3 h-64 md:h-auto bg-slate-200 dark:bg-slate-700"></div>
              <div className="p-8 md:w-2/3">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-4/5 mb-4"></div>
                <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 mr-3"></div>
                    <div>
                      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-1"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        ) : featuredPost ? (
          <div className="mt-16 bg-white dark:bg-dark-surface rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8 md:w-2/3">
                <div className="inline-block px-3 py-1 bg-android-green/10 text-android-green rounded-full text-sm font-medium mb-4">
                  Featured Article
                </div>
                
                <h3 className="font-inter font-semibold text-2xl md:text-3xl mb-4">{featuredPost.title}</h3>
                
                <p className="text-slate-600 dark:text-slate-400 mb-6 md:text-lg">
                  {featuredPost.summary}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=50&h=50&q=80" 
                      alt="John Doe" 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} • {featuredPost.readTime} min read
                      </p>
                    </div>
                  </div>
                  
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Button className="bg-android-green text-white hover:bg-android-green/90">
                      Read Full Article
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        <div className="mt-12 text-center">
          <Link href="/#blog">
            <Button variant="outline" size="lg" className="rounded-full">
              View All Articles
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
