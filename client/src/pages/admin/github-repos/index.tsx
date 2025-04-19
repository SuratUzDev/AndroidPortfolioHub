
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
import { Github, PlusCircle, Pencil, Trash2 } from "lucide-react";
import * as firebaseService from "@/services/firebaseService";
import { useToast } from "@/hooks/use-toast";
import { GithubRepo } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function AdminGithubRepos() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<GithubRepo | null>(null);

  const {
    data: repos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["github-repos"],
    queryFn: firebaseService.getGithubRepos,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => firebaseService.deleteGithubRepo(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Repository deleted successfully!",
      });
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["github-repos"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete repository: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (repo: GithubRepo) => {
    setRepoToDelete(repo);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (repoToDelete) {
      deleteMutation.mutate(repoToDelete.id);
    }
  };

  return (
    <AdminLayout title="GitHub Repositories">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage GitHub Repositories</h1>
        <Button onClick={() => setLocation("/admin/github-repos/new")}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Repository
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Github className="mr-2 h-5 w-5" />
            GitHub Repositories
          </CardTitle>
          <CardDescription>
            Manage your featured GitHub repositories and their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">Loading...</div>
          ) : error ? (
            <div className="text-red-500 py-6">Error loading repositories: {(error as Error).message}</div>
          ) : repos && repos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repository</TableHead>
                  <TableHead>Stars</TableHead>
                  <TableHead>Forks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repos.map((repo) => (
                  <TableRow key={repo.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{repo.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {repo.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{repo.stars}</TableCell>
                    <TableCell>{repo.forks}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setLocation(`/admin/github-repos/edit/${repo.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(repo)}
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
              <p className="text-gray-500">No repositories found. Add your first repository!</p>
              <Button className="mt-4" onClick={() => setLocation("/admin/github-repos/new")}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Repository
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the repository "{repoToDelete?.name}". This action cannot be undone.
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
