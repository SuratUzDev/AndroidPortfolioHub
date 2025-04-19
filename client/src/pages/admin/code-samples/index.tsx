
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
import { Code, PlusCircle, Pencil, Trash2 } from "lucide-react";
import * as firebaseService from "@/services/firebaseService";
import { useToast } from "@/hooks/use-toast";
import { CodeSample } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function AdminCodeSamples() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sampleToDelete, setSampleToDelete] = useState<CodeSample | null>(null);

  const {
    data: samples,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["code-samples"],
    queryFn: firebaseService.getCodeSamples,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => firebaseService.deleteCodeSample(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Code sample deleted successfully!",
      });
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["code-samples"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete code sample: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (sample: CodeSample) => {
    setSampleToDelete(sample);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (sampleToDelete) {
      deleteMutation.mutate(sampleToDelete.id);
    }
  };

  return (
    <AdminLayout title="Code Samples">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Code Samples</h1>
        <Button onClick={() => setLocation("/admin/code-samples/new")}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Sample
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="mr-2 h-5 w-5" />
            Code Samples
          </CardTitle>
          <CardDescription>
            Manage your code samples and snippets. Add new samples or update existing ones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">Loading...</div>
          ) : error ? (
            <div className="text-red-500 py-6">Error loading code samples: {(error as Error).message}</div>
          ) : samples && samples.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.title}</TableCell>
                    <TableCell>{sample.language}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setLocation(`/admin/code-samples/edit/${sample.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sample)}
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
              <p className="text-gray-500">No code samples found. Add your first sample!</p>
              <Button
                className="mt-4"
                onClick={() => setLocation("/admin/code-samples/new")}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Sample
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
              This will permanently delete the code sample "{sampleToDelete?.title}". This action cannot be undone.
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
