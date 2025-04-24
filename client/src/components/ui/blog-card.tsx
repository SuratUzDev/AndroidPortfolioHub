import { ArrowRightIcon } from "lucide-react";
import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { formatDate } from "@/utils/date-utils";
import { AuthorDisplay } from "@/components/ui/author-display";
import { handleImageError, getImageUrl } from "@/utils/image-utils";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { title, slug, excerpt, coverImageUrl, publishedAt, author, tags } = post;
  // Default read time estimation - 1 min per 200 words
  const estimatedReadTime = Math.ceil(post.content.split(/\s+/).length / 200);

  return (
    <article className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300">
      <img 
        src={getImageUrl(coverImageUrl, 'blog')} 
        alt={title} 
        className="w-full h-48 object-cover"
        onError={(e) => handleImageError(e, 'blog')}
      />

      <div className="p-6">
        <h3 className="font-inter font-semibold text-xl mb-3">{title}</h3>
        
        <div className="mb-4">
          <AuthorDisplay
            customAuthor={author}
            publishDate={publishedAt}
            readTime={estimatedReadTime}
            size="sm"
          />
        </div>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags && tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/blog/${slug}`}>
          <div className="inline-flex items-center text-android-green hover:text-android-green/80 font-medium cursor-pointer">
            Read Article
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </div>
        </Link>
      </div>
    </article>
  );
}
