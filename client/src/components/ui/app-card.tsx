import { Button } from "@/components/ui/button";
import { FaGithub, FaGooglePlay } from "react-icons/fa";
import { App } from "@shared/schema";
import { handleImageError, getImageUrl } from "@/utils/image-utils";

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  const { title, description, iconUrl, screenshotUrls, rating, category, downloads, githubUrl, playStoreUrl } = app;

  // Use first screenshot if available, otherwise use icon
  const displayImage = screenshotUrls?.[0] || iconUrl;

  return (
    <div className="app-card bg-white dark:bg-dark-surface rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300">
      <img 
        src={getImageUrl(displayImage)} 
        alt={`${title} App`} 
        className="w-full h-48 object-cover"
        onError={handleImageError}
      />

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-inter font-semibold text-xl">{title}</h3>
          {rating && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded text-xs font-medium">
              {rating} ★
            </span>
          )}
        </div>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs">
            {category}
          </span>
          {downloads && (
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs">
              {downloads} Downloads
            </span>
          )}
        </div>

        <div className="flex space-x-4">
          {githubUrl && (
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg"
              asChild
            >
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaGithub className="mr-2" />
                Source
              </a>
            </Button>
          )}
          
          {playStoreUrl && (
            <Button 
              className="flex-1 bg-android-green text-white hover:bg-android-green/90 rounded-lg"
              asChild
            >
              <a 
                href={playStoreUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaGooglePlay className="mr-2" />
                Install
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
