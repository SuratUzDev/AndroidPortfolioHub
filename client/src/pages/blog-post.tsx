import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="flex items-center mb-8">
          <Skeleton className="h-10 w-10 rounded-full mr-3" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Blog Post</h1>
        <p className="mb-8">We couldn't load the requested blog post.</p>
        <Link href="/#blog">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const { title, content, publishedAt, readTime, image, tags } = post;
  const formattedDate = format(new Date(publishedAt), 'MMMM d, yyyy');

  return (
    <>
      <Helmet>
        <title>{title} | Sulton UzDev's Blog</title>
        <meta name="description" content={content.substring(0, 160)} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={content.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={image} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <Link href="/#blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <h1 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl mb-6">{title}</h1>
        
        <div className="flex items-center mb-8">
          <img 
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=50&h=50&q=80" 
            alt="Sulton UzDev" 
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-medium">Sulton UzDev</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formattedDate} • {readTime} min read
            </p>
          </div>
        </div>

        <img 
          src={image} 
          alt={title} 
          className="w-full h-auto max-h-96 object-cover rounded-xl mb-8"
        />

        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </>
  );
}
