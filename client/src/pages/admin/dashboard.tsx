import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Smartphone, 
  Github, 
  FileText, 
  Code, 
  Database, 
  LineChart, 
  Clock, 
  Activity, 
  Settings,
  Pencil,
  Edit
} from "lucide-react";
import { Link as RouterLink } from "wouter";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminDashboard() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  // Fetch data from PostgreSQL API
  const { data: apps = [], isLoading: isLoadingApps, refetch: refetchApps } = useQuery<any[]>({
    queryKey: ['/api/apps'],
  });
  
  const { data: githubRepos = [], isLoading: isLoadingRepos, refetch: refetchRepos } = useQuery<any[]>({ 
    queryKey: ['/api/github-repos'],
  });
  
  const { data: blogPosts = [], isLoading: isLoadingPosts, refetch: refetchBlogPosts } = useQuery<any[]>({
    queryKey: ['/api/blog'],
  });
  
  const { data: codeSamples = [], isLoading: isLoadingCodeSamples, refetch: refetchCodeSamples } = useQuery<any[]>({
    queryKey: ['/api/code-samples'],
  });

  // Handle seeding the database using PostgreSQL migration endpoint
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    
    try {
      // Call the migration endpoint
      const result = await apiRequest('/api/admin/migrate', {
        method: 'POST'
      });
      
      setSeedResult({
        success: true,
        message: result.message || "Sample data added successfully!"
      });
      
      toast({
        title: "Success",
        description: "Sample data added to the database successfully!",
      });
      
      // Refetch data to update the UI
      await Promise.all([
        refetchApps(),
        refetchRepos(),
        refetchBlogPosts(),
        refetchCodeSamples()
      ]);
    } catch (error) {
      setSeedResult({
        success: false,
        message: (error as Error).message || "An unknown error occurred"
      });
      
      toast({
        title: "Error",
        description: "Failed to seed database. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // Dashboard cards data
  const dashboardCards = [
    {
      title: "Android Apps",
      value: isLoadingApps ? "Loading..." : apps?.length || 0,
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      linkTo: "/admin/apps",
      linkText: "Manage Apps",
    },
    {
      title: "GitHub Repositories",
      value: isLoadingRepos ? "Loading..." : githubRepos?.length || 0,
      icon: <Github className="h-8 w-8 text-primary" />,
      linkTo: "/admin/github-repos",
      linkText: "Manage Repositories",
    },
    {
      title: "Blog Posts",
      value: isLoadingPosts ? "Loading..." : blogPosts?.length || 0,
      icon: <FileText className="h-8 w-8 text-primary" />,
      linkTo: "/admin/blog-posts",
      linkText: "Manage Blog Posts",
    },
    {
      title: "Code Samples",
      value: isLoadingCodeSamples ? "Loading..." : codeSamples?.length || 0,
      icon: <Code className="h-8 w-8 text-primary" />,
      linkTo: "/admin/code-samples",
      linkText: "Manage Code Samples",
    },
  ];

  return (
    <AdminLayout title="Portfolio Admin Dashboard">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome to Your Portfolio Admin</h1>
        <p className="text-muted-foreground mt-2">Manage your portfolio content and settings from this dashboard.</p>
      </div>
      
      {/* Admin stats overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{card.value}</div>
              <Link href={card.linkTo}>
                <Button variant="outline" className="w-full">
                  {card.linkText}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Quick actions section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <Link href="/admin/profile">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/admin/apps/new">
                <Button className="w-full flex items-center gap-2 h-auto py-4">
                  <Smartphone className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">New App</div>
                    <div className="text-xs opacity-70">Add a new Android app</div>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/github-repos/new">
                <Button className="w-full flex items-center gap-2 h-auto py-4">
                  <Github className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">New Repo</div>
                    <div className="text-xs opacity-70">Add a GitHub repository</div>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/blog-posts/new">
                <Button className="w-full flex items-center gap-2 h-auto py-4">
                  <FileText className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">New Post</div>
                    <div className="text-xs opacity-70">Create a blog post</div>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/code-samples/new">
                <Button className="w-full flex items-center gap-2 h-auto py-4">
                  <Code className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">New Code Sample</div>
                    <div className="text-xs opacity-70">Add a code example</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Admin insights section */}
      <div className="grid md:grid-cols-2 gap-8 mt-10">
        {/* Recent Blog Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPosts ? (
              <p className="py-4 text-center">Loading blog posts...</p>
            ) : blogPosts && blogPosts.length > 0 ? (
              <ul className="space-y-4">
                {blogPosts.slice(0, 5).map((post: any) => (
                  <li key={post.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Link href={`/admin/blog-posts/edit/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center">
                <p className="text-muted-foreground mb-4">No blog posts found.</p>
                <Link href="/admin/blog-posts/new">
                  <Button variant="outline">Create Your First Post</Button>
                </Link>
              </div>
            )}
            {blogPosts && blogPosts.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Link href="/admin/blog-posts">
                  <Button variant="outline">View All Posts</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Portfolio Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <LineChart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Database Migration</p>
                  <p className="text-sm text-muted-foreground">Successfully migrated from Firebase to PostgreSQL</p>
                  <p className="text-xs text-gray-500 mt-1">Today</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Admin Panel Updated</p>
                  <p className="text-sm text-muted-foreground">Enhanced features and improved UI</p>
                  <p className="text-xs text-gray-500 mt-1">Today</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Database className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Sample Data Created</p>
                  <p className="text-sm text-muted-foreground">Initialize your portfolio with sample content</p>
                  <p className="text-xs text-gray-500 mt-1">Today</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sample Data Generator */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-6">Database Management</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Initialize with Sample Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Need some example content for your portfolio? Click below to populate the database with sample Android apps, GitHub repositories, blog posts, and code samples.
            </p>
            
            {seedResult && (
              <Alert variant={seedResult.success ? "default" : "destructive"}>
                <AlertTitle>{seedResult.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{seedResult.message}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                {isSeeding ? "Adding Sample Data..." : "Add Sample Data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}