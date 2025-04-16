import { format } from "date-fns";
import { ArrowRightIcon, CalendarIcon, ClockIcon } from "lucide-react";
import { Link } from "wouter";
import { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { title, slug, summary, image, publishedAt, readTime, tags } = post;
  const formattedDate = format(new Date(publishedAt), 'MMMM d, yyyy');

  return (
    <article className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <div className="flex items-center mb-4 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center">
            <CalendarIcon className="mr-1 h-4 w-4" /> {formattedDate}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <ClockIcon className="mr-1 h-4 w-4" /> {readTime} min read
          </span>
        </div>

        <h3 className="font-inter font-semibold text-xl mb-3">{title}</h3>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/blog/${slug}`}>
          <a className="inline-flex items-center text-android-green hover:text-android-green/80 font-medium">
            Read Article
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </a>
        </Link>
      </div>
    </article>
  );
}
