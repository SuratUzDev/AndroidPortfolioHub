import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { insertBlogPostSchema, BlogPost } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Upload, RefreshCw, Check, Save, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Extend the schema for form validation
const formSchema = insertBlogPostSchema.extend({
  coverImageFile: z.instanceof(FileList).optional(),
  tagsString: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditBlogPostPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Get blog post data
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['/api/blog', id],
  });

  // Extend the form schema for this page
  const formSchema = insertBlogPostSchema.extend({
    coverImageFile: z.instanceof(FileList).optional(),
    tagsString: z.string().optional(),
  });

  type FormData = z.infer<typeof formSchema>;

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImageUrl: "",
      publishedAt: new Date().toISOString().split('T')[0],
      author: "Sulton UzDev",
      isFeatured: false,
      tagsString: "",
    },
  });

  // Update form values when post data is loaded
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImageUrl: post.coverImageUrl || "",
        publishedAt: new Date(post.publishedAt).toISOString().split('T')[0],
        author: post.author,
        isFeatured: post.isFeatured || false,
        tagsString: post.tags ? post.tags.join(", ") : "",
      });
    }
  }, [post, form]);

  // Function to handle file uploads to a cloud storage
  // For now we'll keep the existing coverImageUrl if we don't have a real upload service
  const handleFileUpload = async (file: File, path: string): Promise<string> => {
    // For a real implementation, you would:
    // 1. Upload the file to cloud storage (S3, Firebase Storage, etc.)
    // 2. Return the public URL
    
    // For now, we'll just simulate the process and keep the existing URL
    console.log(`Would upload file ${file.name} to ${path}`);
    
    // Temporary: create object URL for demo purposes only
    // In a real app, replace this with actual upload code
    return URL.createObjectURL(file);
  };

  // Update blog post mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsUploading(true);
      
      let coverImageUrl = post?.coverImageUrl || "";
      
      // Upload cover image if provided
      if (data.coverImageFile && data.coverImageFile.length > 0) {
        try {
          const file = data.coverImageFile[0];
          const uploadedUrl = await handleFileUpload(file, `blog/${id}/cover-${Date.now()}`);
          if (uploadedUrl) {
            coverImageUrl = uploadedUrl;
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          // Continue with the existing cover image URL
        }
      }
      
      // Process tags
      const tags = data.tagsString
        ? data.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
      
      // Update blog post data using our PostgreSQL API
      const updatedPost = await apiRequest(`/api/blog/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          coverImageUrl,
          publishedAt: data.publishedAt,
          author: data.author,
          isFeatured: data.isFeatured,
          tags,
        })
      });
      
      setIsUploading(false);
      return updatedPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/featured'] });
      toast({
        title: "Blog post updated",
        description: "The blog post has been updated successfully.",
      });
      setLocation("/admin/blog-posts");
    },
    onError: (error) => {
      setIsUploading(false);
      toast({
        title: "Error",
        description: `Failed to update blog post: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Edit Blog Post">
        <div className="flex justify-center py-10">Loading post data...</div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout title="Edit Blog Post">
        <div className="text-red-500 py-10">Blog post not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Blog Post">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setLocation("/admin/blog-posts")}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog Posts
        </Button>
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="enter-blog-post-slug" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a short summary of the blog post"
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the full blog post content"
                        className="min-h-64"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication Date*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author*</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tagsString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter tags separated by commas (e.g., Android, Kotlin, Jetpack)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImageFile"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {post.coverImageUrl && (
                          <div className="mb-2">
                            <p className="text-sm text-gray-500 mb-1">Current cover image:</p>
                            <img
                              src={post.coverImageUrl}
                              alt="Blog Cover"
                              className="w-32 h-20 object-cover rounded"
                            />
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          {...fieldProps}
                          onChange={(e) => onChange(e.target.files)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Post</FormLabel>
                      <div className="text-sm text-gray-500">
                        Display this post as featured on the blog page
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/blog-posts")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || isUploading}
                >
                  {updateMutation.isPending || isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Blog Post"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}