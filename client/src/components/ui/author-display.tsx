import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/firebaseService";
import { formatDate } from "@/utils/date-utils";
import { handleImageError, getImageUrl } from "@/utils/image-utils";

interface AuthorDisplayProps {
  publishDate?: string;
  readTime?: number;
  customAuthor?: string;
  showDate?: boolean;
  showReadTime?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AuthorDisplay({
  publishDate,
  readTime,
  customAuthor,
  showDate = true,
  showReadTime = true,
  size = "md",
}: AuthorDisplayProps) {
  // Get profile data for author information
  const { data: profile } = useQuery({
    queryKey: ['/api/profile'],
    queryFn: () => getProfile(),
  });

  const avatarSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const nameSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const authorName = customAuthor || profile?.name || "Sulton UzDev";
  const authorInitials = authorName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
  
  const formattedDate = publishDate ? formatDate(publishDate) : "";

  return (
    <div className="flex items-center">
      <Avatar className={`${avatarSizes[size]} mr-3`}>
        <AvatarImage 
          src={getImageUrl(profile?.avatarUrl, 'profile')} 
          alt={authorName}
          onError={(e) => handleImageError(e, 'profile')}
        />
        <AvatarFallback>{authorInitials}</AvatarFallback>
      </Avatar>
      <div>
        <p className={`font-medium ${nameSize[size]}`}>{authorName}</p>
        {(showDate || showReadTime) && (
          <p className={`${textSizes[size]} text-slate-500 dark:text-slate-400`}>
            {showDate && formattedDate}
            {showDate && showReadTime && readTime && " • "}
            {showReadTime && readTime && `${readTime} min read`}
          </p>
        )}
      </div>
    </div>
  );
}