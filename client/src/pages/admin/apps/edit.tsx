
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Smartphone } from "lucide-react";
import * as firebaseService from "@/services/firebaseService";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { App } from "@shared/schema";

const appFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string(),
  playStoreUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean(),
  iconFile: z.instanceof(FileList).optional(),
  screenshotFiles: z.instanceof(FileList).optional(),
});

type AppFormValues = z.infer<typeof appFormSchema>;

export default function EditApp() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const { data: app, isLoading } = useQuery<App>({
    queryKey: ["app", id],
    queryFn: () => firebaseService.getApp(id),
  });

  const form = useForm<AppFormValues>({
    resolver: zodResolver(appFormSchema),
    defaultValues: {
      title: app?.title || "",
      description: app?.description || "",
      category: app?.category || "Productivity",
      playStoreUrl: app?.playStoreUrl || "",
      featured: app?.featured || false,
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: AppFormValues) => {
      let iconUrl = app?.iconUrl;
      if (values.iconFile?.length) {
        setIsUploading(true);
        iconUrl = await firebaseService.uploadFile(
          values.iconFile[0],
          `apps/icons/${values.title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`
        );
      }

      let screenshotUrls = app?.screenshotUrls || [];
      if (values.screenshotFiles?.length) {
        setIsUploading(true);
        const uploadPromises = Array.from(values.screenshotFiles).map((file, index) => {
          return firebaseService.uploadFile(
            file,
            `apps/screenshots/${values.title.replace(/\s+/g, "-").toLowerCase()}-${index}-${Date.now()}`
          );
        });
        
        const uploadedUrls = await Promise.all(uploadPromises);
        screenshotUrls = [...screenshotUrls, ...uploadedUrls];
      }

      return firebaseService.updateApp(id, {
        title: values.title,
        description: values.description,
        category: values.category,
        playStoreUrl: values.playStoreUrl,
        featured: values.featured,
        iconUrl,
        screenshotUrls,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "App updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setLocation("/admin/apps");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update app: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const onSubmit = (values: AppFormValues) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return <AdminLayout title="Edit App">Loading...</AdminLayout>;
  }

  if (!app) {
    return <AdminLayout title="Edit App">App not found</AdminLayout>;
  }

  return (
    <AdminLayout title="Edit App">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/admin/apps")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Android App</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="mr-2 h-5 w-5" />
            App Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., TaskMaster Pro" {...field} />
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
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Productivity">Productivity</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Social">Social</SelectItem>
                          <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                          <SelectItem value="Game">Game</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your app and its key features..."
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
                name="playStoreUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Play Store URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://play.google.com/store/apps/details?id=com.example.app"
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
                  name="iconFile"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Update App Icon</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files)}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormDescription>
                        Current icon will be kept if no new file is selected
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured App</FormLabel>
                        <FormDescription>
                          Mark this app as featured on your portfolio
                        </FormDescription>
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
              </div>

              <FormField
                control={form.control}
                name="screenshotFiles"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Add More Screenshots</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormDescription>
                      New screenshots will be added to existing ones
                    </FormDescription>
                    <FormMessage />
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
                  {updateMutation.isPending || isUploading
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
