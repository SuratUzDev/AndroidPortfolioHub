import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Comment } from "../../../shared/schema";
import CommentItem from "./CommentItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type CommentListProps = {
  blogPostId: number;
};

export default function CommentList({ blogPostId }: CommentListProps) {
  // State for tracking which comment is being replied to
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // Query to fetch comments for this blog post
  const { 
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`/api/blog/${blogPostId}/comments`],
    queryFn: getQueryFn<Comment[]>({ on401: "returnNull" }),
    refetchOnWindowFocus: false,
  });

  // Function to handle reply button clicks
  const handleReplyClick = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 mt-8">
        <h3 className="text-xl font-semibold">Comments</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg p-4 border">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-[90%] mt-2" />
            <Skeleton className="h-4 w-[40%] mt-2" />
          </div>
        ))}
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          There was an error loading comments. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Show empty state
  if (!comments || comments.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <p className="text-muted-foreground">
          Be the first to leave a comment on this post!
        </p>
      </div>
    );
  }

  // Filter for only approved comments
  const approvedComments = comments.filter(comment => comment.isApproved);

  // Get top-level comments (not replies)
  const topLevelComments = approvedComments.filter(
    (comment) => comment.parentId === null
  );

  // Get replies by parent comment id
  const getReplies = (parentId: number) => {
    return approvedComments.filter(
      (comment) => comment.parentId === parentId
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">
        Comments ({approvedComments.length})
      </h3>
      
      <div className="space-y-6">
        {topLevelComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={getReplies(comment.id)}
            isReplying={replyingTo === comment.id}
            onReplyClick={handleReplyClick}
            blogPostId={blogPostId}
          />
        ))}
      </div>
    </div>
  );
}