import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Github, FileText, Code } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import * as firebaseService from "@/services/firebaseService";

export default function AdminDashboard() {
  // Fetch data from Firebase
  const { data: apps, isLoading: isLoadingApps } = useQuery({
    queryKey: ["apps"],
    queryFn: firebaseService.getApps
  });
  
  const { data: githubRepos, isLoading: isLoadingRepos } = useQuery({ 
    queryKey: ["github-repos"],
    queryFn: firebaseService.getGithubRepos
  });
  
  const { data: blogPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: firebaseService.getBlogPosts
  });
  
  const { data: codeSamples, isLoading: isLoadingCodeSamples } = useQuery({
    queryKey: ["code-samples"],
    queryFn: firebaseService.getCodeSamples
  });

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
    </AdminLayout>
  );
}