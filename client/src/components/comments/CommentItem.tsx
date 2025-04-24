import { formatDistanceToNow } from "date-fns";
import { MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Comment } from "../../../shared/schema";
import CommentForm from "./CommentForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type CommentItemProps = {
  comment: Comment;
  replies: Comment[];
  blogPostId: number;
  isReplying: boolean;
  onReplyClick: (commentId: number) => void;
  depth?: number; // For nested comments
};

export default function CommentItem({
  comment,
  replies,
  blogPostId,
  isReplying,
  onReplyClick,
  depth = 0,
}: CommentItemProps) {
  // Format the comment date
  const formattedDate = comment.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : "";

  // Get the commenter's initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleReplyClick = () => {
    onReplyClick(comment.id);
  };

  return (
    <div
      className={`${depth > 0 ? "ml-8 mt-4" : ""} bg-card rounded-lg p-4 border`}
      style={{ maxWidth: depth > 0 ? `calc(100% - ${depth * 8}px)` : "100%" }}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{getInitials(comment.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div>
            <h4 className="font-medium">{comment.name}</h4>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
          <div className="mt-2 text-card-foreground">{comment.content}</div>
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              onClick={handleReplyClick}
            >
              <MessageSquare className="h-4 w-4" />
              Reply
            </Button>
          </div>

          {/* Reply form */}
          {isReplying && (
            <div className="mt-2">
              <CommentForm
                blogPostId={blogPostId}
                parentId={comment.id}
                onSuccess={() => onReplyClick(0)} // Close the reply form after submission
              />
            </div>
          )}

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  replies={[]} // We don't support nested replies beyond one level
                  blogPostId={blogPostId}
                  isReplying={false} // No nested reply forms
                  onReplyClick={onReplyClick}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}