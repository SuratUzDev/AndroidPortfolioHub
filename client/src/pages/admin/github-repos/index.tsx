import { useState } from "react";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";

export default function AdminGithubRepos() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: repos } = useQuery({
    queryKey: ["githubRepos"],
    queryFn: async () => {
      const response = await fetch("/api/github-repos");
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub repositories");
      }
      return response.json();
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this repository?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/github-repos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete repository");

      toast({
        title: "Success",
        description: "Repository deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete repository",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">GitHub Repositories</h1>
        <Button asChild>
          <Link href="/admin/github-repos/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Repository
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {repos?.map((repo: any) => (
          <div
            key={repo.id}
            className="p-4 border rounded-lg bg-card text-card-foreground"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{repo.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {repo.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/admin/github-repos/edit/${repo.id}`}>
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(repo.id)}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}