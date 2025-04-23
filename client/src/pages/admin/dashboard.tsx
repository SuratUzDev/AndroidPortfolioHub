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
  Settings 
} from "lucide-react";
import { Link } from "wouter";
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
  const { data: apps, isLoading: isLoadingApps, refetch: refetchApps } = useQuery({
    queryKey: ['/api/apps'],
    queryFn: () => apiRequest('/api/apps')
  });
  
  const { data: githubRepos, isLoading: isLoadingRepos, refetch: refetchRepos } = useQuery({ 
    queryKey: ['/api/github-repos'],
    queryFn: () => apiRequest('/api/github-repos')
  });
  
  const { data: blogPosts, isLoading: isLoadingPosts, refetch: refetchBlogPosts } = useQuery({
    queryKey: ['/api/blog'],
    queryFn: () => apiRequest('/api/blog')
  });
  
  const { data: codeSamples, isLoading: isLoadingCodeSamples, refetch: refetchCodeSamples } = useQuery({
    queryKey: ['/api/code-samples'],
    queryFn: () => apiRequest('/api/code-samples')
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
    <AdminLayout title="Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <Card key={index}>
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
      
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/apps/new">
            <Button className="w-full">New Android App</Button>
          </Link>
          <Link href="/admin/github-repos/new">
            <Button className="w-full">New GitHub Repo</Button>
          </Link>
          <Link href="/admin/blog-posts/new">
            <Button className="w-full">New Blog Post</Button>
          </Link>
          <Link href="/admin/code-samples/new">
            <Button className="w-full">New Code Sample</Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-6">Recent Blog Posts</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {isLoadingPosts ? (
            <p>Loading blog posts...</p>
          ) : blogPosts && blogPosts.length > 0 ? (
            <ul className="space-y-4">
              {blogPosts.slice(0, 5).map((post) => (
                <li key={post.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No blog posts found.</p>
          )}
        </div>
      </div>
      
      {/* Sample Data Generator */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-6">Sample Data</h2>
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