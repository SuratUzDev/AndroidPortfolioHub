import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Smartphone, PlusCircle, Pencil, Trash2 } from "lucide-react";
import * as firebaseService from "@/services/firebaseService";
import { useToast } from "@/hooks/use-toast";
import { App } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function AdminApps() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<App | null>(null);

  // Fetch apps from Firebase
  const {
    data: apps,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["apps"],
    queryFn: firebaseService.getApps,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => firebaseService.deleteApp(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "App deleted successfully!",
      });
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["apps"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete app: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle delete
  const handleDelete = (app: App) => {
    setAppToDelete(app);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (appToDelete) {
      deleteMutation.mutate(appToDelete.id);
    }
  };

  return (
    <AdminLayout title="Android Apps">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Android Apps</h1>
        <Button onClick={() => setLocation("/admin/apps/new")}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New App
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="mr-2 h-5 w-5" /> 
            Android Apps
          </CardTitle>
          <CardDescription>
            Manage your Android app portfolio. Add, edit, or remove apps from your showcase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">Loading...</div>
          ) : error ? (
            <div className="text-red-500 py-6">Error loading apps: {(error as Error).message}</div>
          ) : apps && apps.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {app.iconUrl ? (
                          <img
                            src={app.iconUrl}
                            alt={app.title}
                            className="w-8 h-8 rounded mr-2"
                          />
                        ) : (
                          <Smartphone className="w-8 h-8 p-1 mr-2" />
                        )}
                        <div>
                          <div className="font-medium">{app.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {app.description.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{app.category}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        app.featured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {app.featured ? "Featured" : "Regular"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setLocation(`/admin/apps/edit/${app.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(app)}
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
              <p className="text-gray-500">No apps found. Add your first app!</p>
              <Button className="mt-4" onClick={() => setLocation("/admin/apps/new")}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add App
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
              This will permanently delete the app "{appToDelete?.title}". This action cannot be undone.
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