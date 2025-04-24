import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type CommentsProps = {
  blogPostId: number;
};

export default function Comments({ blogPostId }: CommentsProps) {
  return (
    <Card className="my-8">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6">Discussion</h2>
        
        {/* Comment form */}
        <CommentForm blogPostId={blogPostId} />
        
        <Separator className="my-8" />
        
        {/* Comments list */}
        <CommentList blogPostId={blogPostId} />
      </CardContent>
    </Card>
  );
}