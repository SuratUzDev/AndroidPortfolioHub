import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { insertGithubRepoSchema } from "@shared/schema";
import { getGithubRepo, updateGithubRepo } from "@/services/firebaseService";
import { queryClient } from "@/lib/queryClient";

import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";

// Extend the schema for form validation
const formSchema = insertGithubRepoSchema;

type FormData = z.infer<typeof formSchema>;

export default function EditGithubRepoPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get repo data
  const { data: repo, isLoading } = useQuery({
    queryKey: ['/api/github-repos', id],
    queryFn: () => getGithubRepo(id),
  });

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      language: "",
      url: "",
      stars: 0,
      forks: 0,
      featured: false,
    },
  });

  // Update form values when repo data is loaded
  React.useEffect(() => {
    if (repo) {
      form.reset({
        name: repo.name,
        description: repo.description || "",
        language: repo.language || "",
        url: repo.url,
        stars: repo.stars || 0,
        forks: repo.forks || 0,
        featured: repo.featured || false,
      });
    }
  }, [repo, form]);

  // Update repo mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await updateGithubRepo(id, {
        name: data.name,
        description: data.description,
        language: data.language,
        url: data.url,
        stars: data.stars,
        forks: data.forks,
        featured: data.featured,
      });
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/github-repos'] });
      toast({
        title: "Repository updated",
        description: "The GitHub repository has been updated successfully.",
      });
      setLocation("/admin/github-repos");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update repository: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Edit GitHub Repository">
        <div className="flex justify-center py-10">Loading repository data...</div>
      </AdminLayout>
    );
  }

  if (!repo) {
    return (
      <AdminLayout title="Edit GitHub Repository">
        <div className="text-red-500 py-10">Repository not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit GitHub Repository">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setLocation("/admin/github-repos")}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Repositories
        </Button>
        <h1 className="text-2xl font-bold">Edit GitHub Repository</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repository Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter repository name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter repository description"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Language</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Kotlin, Java" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL*</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/username/repo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="stars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stars</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="forks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forks</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Repository</FormLabel>
                      <div className="text-sm text-gray-500">
                        Display this repository in featured sections
                      </div>
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

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/github-repos")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Updating..." : "Update Repository"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}