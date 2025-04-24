import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { commentFormSchema } from "@shared/schema";
import type { z } from "zod";

type CommentFormProps = {
  blogPostId: number;
  parentId?: number; // Optional for reply functionality
  onSuccess?: () => void;
};

export default function CommentForm({ blogPostId, parentId, onSuccess }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form definition using react-hook-form and zod validation
  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
      blogPostId,
      parentId
    },
  });

  // Mutation for submitting a comment
  const submitComment = useMutation({
    mutationFn: async (values: z.infer<typeof commentFormSchema>) => {
      return apiRequest<{ message: string, comment: any }>(
        `/api/blog/${blogPostId}/comments`,
        {
          method: "POST",
          body: JSON.stringify(values),
        }
      );
    },
    onSuccess: () => {
      // Reset the form
      form.reset();
      
      // Show success message
      toast({
        title: "Comment submitted",
        description: "Your comment has been submitted and will be visible after approval.",
        variant: "default",
      });
      
      // Invalidate comments query to refresh data (even though new comments won't show until approved)
      queryClient.invalidateQueries({ queryKey: [`/api/blog/${blogPostId}/comments`] });
      
      // Optional callback
      if (onSuccess) {
        onSuccess();
      }
      
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("Error submitting comment:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your comment. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof commentFormSchema>) {
    setIsSubmitting(true);
    submitComment.mutate(values);
  }

  return (
    <div className="bg-card p-6 rounded-lg border mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {parentId ? "Leave a Reply" : "Leave a Comment"}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Your comment" 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="mt-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Comment"}
          </Button>
        </form>
      </Form>
      
      <p className="text-sm text-muted-foreground mt-4">
        Your comment will be visible after approval. We don't share your email address.
      </p>
    </div>
  );
}