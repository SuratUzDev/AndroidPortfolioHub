import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { insertAppSchema } from "@shared/schema";
import { getApp, updateApp, uploadFile } from "@/services/firebaseService";
import { queryClient, apiRequest } from "@/lib/queryClient";

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
import { ChevronLeft, Upload } from "lucide-react";

// Extend the schema for form validation
const formSchema = insertAppSchema.extend({
  iconFile: z.instanceof(FileList).optional(),
  screenshotFiles: z.instanceof(FileList).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditAppPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Get app data
  const { data: app, isLoading } = useQuery({
    queryKey: ['/api/apps', id],
    queryFn: () => getApp(id),
  });

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      iconUrl: "",
      playStoreUrl: "",
      featured: false,
      screenshotUrls: [],
    },
  });

  // Update form values when app data is loaded
  useEffect(() => {
    if (app) {
      form.reset({
        title: app.title,
        description: app.description,
        category: app.category,
        iconUrl: app.iconUrl || "",
        playStoreUrl: app.playStoreUrl || "",
        featured: app.featured || false,
        screenshotUrls: app.screenshotUrls || [],
      });
    }
  }, [app, form]);

  // Update app mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsUploading(true);
      
      let iconUrl = app?.iconUrl || "";
      let screenshotUrls = app?.screenshotUrls || [];
      
      // Upload icon if provided
      if (data.iconFile && data.iconFile.length > 0) {
        const file = data.iconFile[0];
        iconUrl = await uploadFile(file, `apps/${id}/icon-${Date.now()}`);
      }
      
      // Upload screenshots if provided
      if (data.screenshotFiles && data.screenshotFiles.length > 0) {
        const newScreenshots = [];
        for (let i = 0; i < data.screenshotFiles.length; i++) {
          const file = data.screenshotFiles[i];
          const url = await uploadFile(file, `apps/${id}/screenshot-${Date.now()}-${i}`);
          newScreenshots.push(url);
        }
        screenshotUrls = [...screenshotUrls, ...newScreenshots];
      }
      
      // Update app data
      await updateApp(id, {
        title: data.title,
        description: data.description,
        category: data.category,
        iconUrl,
        playStoreUrl: data.playStoreUrl,
        featured: data.featured,
        screenshotUrls,
      });
      
      setIsUploading(false);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/apps'] });
      toast({
        title: "App updated",
        description: "The app has been updated successfully.",
      });
      setLocation("/admin/apps");
    },
    onError: (error) => {
      setIsUploading(false);
      toast({
        title: "Error",
        description: `Failed to update app: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Edit App">
        <div className="flex justify-center py-10">Loading app data...</div>
      </AdminLayout>
    );
  }

  if (!app) {
    return (
      <AdminLayout title="Edit App">
        <div className="text-red-500 py-10">App not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit App">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setLocation("/admin/apps")}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Apps
        </Button>
        <h1 className="text-2xl font-bold">Edit App</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>App Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter app title" {...field} />
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
                        placeholder="Enter app description"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter app category (e.g., Productivity, Health)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playStoreUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Play Store URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Google Play Store URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="iconFile"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>App Icon</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {app.iconUrl && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-500 mb-1">Current icon:</p>
                              <img
                                src={app.iconUrl}
                                alt="App Icon"
                                className="w-16 h-16 rounded"
                              />
                            </div>
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            {...fieldProps}
                            onChange={(e) => onChange(e.target.files)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="screenshotFiles"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>App Screenshots (multiple)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {app.screenshotUrls && app.screenshotUrls.length > 0 && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-500 mb-1">Current screenshots:</p>
                              <div className="flex flex-wrap gap-2">
                                {app.screenshotUrls.map((url, idx) => (
                                  <img
                                    key={idx}
                                    src={url}
                                    alt={`Screenshot ${idx + 1}`}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            {...fieldProps}
                            onChange={(e) => onChange(e.target.files)}
                          />
                        </div>
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
                      <FormLabel className="text-base">Featured App</FormLabel>
                      <div className="text-sm text-gray-500">
                        Display this app in featured sections
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
                  onClick={() => setLocation("/admin/apps")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || isUploading}
                >
                  {updateMutation.isPending || isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update App"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}