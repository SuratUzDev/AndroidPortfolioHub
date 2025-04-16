import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  FileText, 
  PlusCircle, 
  Pencil, 
  Trash2,
  Star,
  Eye
} from "lucide-react";
import * as firebaseService from "@/services/firebaseService";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function AdminBlogPosts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Fetch blog posts from Firebase
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: firebaseService.getBlogPosts,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => firebaseService.deleteBlogPost(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post deleted successfully!",
      });
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete blog post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Feature/unfeature mutation
  const featureMutation = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) => 
      firebaseService.updateBlogPost(id, { isFeatured }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update blog post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle delete
  const handleDelete = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deleteMutation.mutate(postToDelete.id);
    }
  };

  // Handle feature toggle
  const handleFeatureToggle = (post: BlogPost) => {
    featureMutation.mutate({
      id: post.id,
      isFeatured: !post.isFeatured,
    });
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout title="Blog Posts">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
        <Button onClick={() => setLocation("/admin/blog-posts/new")}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" /> 
            Blog Posts
          </CardTitle>
          <CardDescription>
            Manage your technical blog posts. Add new content, edit existing posts, or remove outdated articles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">Loading...</div>
          ) : error ? (
            <div className="text-red-500 py-6">Error loading blog posts: {(error as Error).message}</div>
          ) : posts && posts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.slug}</div>
                    </TableCell>
                    <TableCell>{formatDate(post.publishedAt)}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.isFeatured ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {post.isFeatured ? "Featured" : "Published"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        title="View post"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFeatureToggle(post)}
                        title={post.isFeatured ? "Unfeature post" : "Feature post"}
                      >
                        <Star className={`h-4 w-4 ${post.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setLocation(`/admin/blog-posts/edit/${post.id}`)}
                        title="Edit post"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post)}
                        title="Delete post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-6 text-center">
              <p className="text-gray-500">No blog posts found. Create your first post!</p>
              <Button className="mt-4" onClick={() => setLocation("/admin/blog-posts/new")}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Post
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the blog post "{postToDelete?.title}". This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}