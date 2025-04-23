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
  Eye,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Tag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminBlogPosts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [filterByTag, setFilterByTag] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch blog posts from PostgreSQL
  const {
    data: posts = [],
    isLoading,
    error,
    refetch
  } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/blog/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post deleted successfully!",
      });
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
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
    mutationFn: async ({ id, isFeatured }: { id: number; isFeatured: boolean }) => {
      return apiRequest(`/api/blog/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isFeatured })
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
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
  
  // Get all unique tags from posts
  const allTags = posts
    .flatMap(post => post.tags || [])
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .sort();
    
  // Filter and sort blog posts
  const filteredPosts = posts
    .filter(post => {
      // Search filter
      const matchesSearch = 
        searchTerm === "" || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        
      // Tag filter
      const matchesTag = 
        filterByTag === "" || 
        (post.tags && post.tags.includes(filterByTag));
        
      // Status filter
      const matchesStatus = 
        filterStatus === "all" || 
        (filterStatus === "featured" && post.isFeatured) ||
        (filterStatus === "regular" && !post.isFeatured);
        
      return matchesSearch && matchesTag && matchesStatus;
    })
    .sort((a, b) => {
      // Sort based on selected option
      switch (sortBy) {
        case "newest":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case "oldest":
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case "a-z":
          return a.title.localeCompare(b.title);
        case "z-a":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

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
          {/* Blog post filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <span className="flex items-center">
                      {sortBy === "newest" || sortBy === "oldest" ? (
                        <SortDesc className="mr-2 h-4 w-4" />
                      ) : (
                        <SortAsc className="mr-2 h-4 w-4" />
                      )}
                      Sort
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="a-z">A-Z</SelectItem>
                    <SelectItem value="z-a">Z-A</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[160px]">
                    <span className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      Status
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Tag className="mr-1.5 h-4 w-4" />
                  Filter by tag:
                </div>
                <Button
                  variant={filterByTag === "" ? "secondary" : "outline"}
                  className="h-8 rounded-full text-xs"
                  onClick={() => setFilterByTag("")}
                >
                  All
                </Button>
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={filterByTag === tag ? "secondary" : "outline"}
                    className="h-8 rounded-full text-xs"
                    onClick={() => setFilterByTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-6">Loading blog posts...</div>
          ) : error ? (
            <div className="text-red-500 py-6">Error loading blog posts: {(error as Error).message}</div>
          ) : filteredPosts.length > 0 ? (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                Showing {filteredPosts.length} of {posts.length} posts
              </div>
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
                  {filteredPosts.map((post: BlogPost) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.tags.map(tag => (
                              <span 
                                key={tag} 
                                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
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
            </>
          ) : (
            <div className="py-6 text-center">
              {searchTerm || filterByTag || filterStatus !== "all" ? (
                <>
                  <p className="text-gray-500">No posts match your filters.</p>
                  <Button className="mt-4" variant="outline" onClick={() => {
                    setSearchTerm("");
                    setFilterByTag("");
                    setFilterStatus("all");
                  }}>
                    Reset Filters
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-gray-500">No blog posts found. Create your first post!</p>
                  <Button className="mt-4" onClick={() => setLocation("/admin/blog-posts/new")}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Post
                  </Button>
                </>
              )}
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