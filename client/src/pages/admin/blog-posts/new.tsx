import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Upload } from "lucide-react";
import * as firebaseService from "@/services/firebaseService";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertBlogPostSchema } from "@shared/schema";

// Helper function to generate a slug from a title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}

// Extend the blog post schema with additional validation
const blogPostFormSchema = insertBlogPostSchema.extend({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  coverImageFile: z.instanceof(FileList).optional().transform(val => val && val.length > 0 ? val[0] : undefined),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters" }).max(200, { message: "Excerpt cannot exceed 200 characters" }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }).optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

export default function NewBlogPost() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  // Set up form
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      author: "Admin",
      isFeatured: false,
      coverImageUrl: "",
      publishedAt: new Date().toISOString(),
    },
  });

  // Watch the title to generate slug
  const title = form.watch("title");
  if (title && autoSlug) {
    const generatedSlug = generateSlug(title);
    form.setValue("slug", generatedSlug);
  }

  // Create blog post mutation
  const createMutation = useMutation({
    mutationFn: async (values: BlogPostFormValues) => {
      // Upload cover image if provided
      let coverImageUrl = values.coverImageUrl;
      if (values.coverImageFile) {
        setIsUploading(true);
        coverImageUrl = await firebaseService.uploadFile(
          values.coverImageFile,
          `blog/covers/${values.slug || generateSlug(values.title)}-${Date.now()}`
        );
      }

      // Ensure slug exists
      const slug = values.slug || generateSlug(values.title);

      // Create blog post with uploaded image URL
      return firebaseService.createBlogPost({
        title: values.title,
        content: values.content,
        excerpt: values.excerpt,
        author: values.author,
        isFeatured: values.isFeatured,
        slug,
        coverImageUrl,
        publishedAt: values.publishedAt,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      setLocation("/admin/blog-posts");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to create blog post: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  // Handle form submission
  const onSubmit = (values: BlogPostFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <AdminLayout title="Add New Blog Post">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/admin/blog-posts")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Add New Blog Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Blog Post Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Modern Android Architecture: A Deep Dive"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The title of your blog post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between">
                        <span>URL Slug</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Auto-generate</span>
                          <Switch
                            checked={autoSlug}
                            onCheckedChange={(checked) => {
                              setAutoSlug(checked);
                              if (!checked) {
                                form.clearErrors("slug");
                              }
                            }}
                          />
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., modern-android-architecture"
                          {...field}
                          disabled={autoSlug}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        The URL-friendly version of the title
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        The author of the blog post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief summary of your blog post..."
                        className="h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A short summary that appears in blog listings (max 200 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your blog post content here..."
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The full content of your blog post (supports markdown)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="coverImageFile"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            id="coverImageFile"
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            {...fieldProps}
                          />
                          <label
                            htmlFor="coverImageFile"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a cover image for your blog post (16:9 aspect ratio recommended)
                      </FormDescription>
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
                        <FormDescription>
                          Mark this post as featured on your blog
                        </FormDescription>
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
              </div>

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
                  disabled={createMutation.isPending || isUploading}
                >
                  {createMutation.isPending || isUploading
                    ? "Publishing..."
                    : "Publish Post"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}