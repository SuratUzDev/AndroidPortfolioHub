import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
import { ArrowLeft, Smartphone, Upload } from "lucide-react";
import { uploadFile, uploadMultipleFiles } from "@/services/uploadService";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertAppSchema } from "@shared/schema";

// Extend the app schema with additional validation
const appFormSchema = insertAppSchema.extend({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  iconFile: z.instanceof(FileList).optional().transform(val => val && val.length > 0 ? val[0] : undefined),
  screenshotFiles: z.instanceof(FileList).optional().transform(val => val ? Array.from(val) : []),
});

type AppFormValues = z.infer<typeof appFormSchema>;

export default function NewApp() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Set up form
  const form = useForm<AppFormValues>({
    resolver: zodResolver(appFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Productivity",
      playStoreUrl: "",
      featured: false,
      iconUrl: "",
      screenshotUrls: [],
      // Initialize file fields with undefined
      iconFile: undefined,
      screenshotFiles: undefined,
    },
  });

  // Create app mutation
  const createMutation = useMutation({
    mutationFn: async (values: AppFormValues) => {
      // Upload icon if provided
      let iconUrl = values.iconUrl;
      if (values.iconFile) {
        setIsUploading(true);
        iconUrl = await uploadFile(values.iconFile, 'apps');
      }

      // Upload screenshots if provided
      let screenshotUrls = values.screenshotUrls || [];
      if (values.screenshotFiles && values.screenshotFiles.length > 0) {
        setIsUploading(true);
        const uploadedUrls = await uploadMultipleFiles(values.screenshotFiles, 'apps');
        screenshotUrls = [...screenshotUrls, ...uploadedUrls];
      }

      // Create app with uploaded image URLs
      const response = await apiRequest('/api/apps', {
        method: 'POST',
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          category: values.category,
          playStoreUrl: values.playStoreUrl,
          featured: values.featured,
          iconUrl,
          screenshotUrls,
        }),
      });
      
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "App created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setLocation("/admin/apps");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to create app: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  // Handle form submission
  const onSubmit = (values: AppFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <AdminLayout title="Add New App">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/admin/apps")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Add New Android App</h1>
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
                      <FormDescription>
                        The name of your Android application
                      </FormDescription>
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
                      <FormDescription>
                        The category that best describes your app
                      </FormDescription>
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
                    <FormDescription>
                      A detailed description of your application and its features
                    </FormDescription>
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
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>
                      Link to your app on the Google Play Store
                    </FormDescription>
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
                        <div className="flex items-center gap-4">
                          <Input
                            id="iconFile"
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            {...fieldProps}
                          />
                          <label
                            htmlFor="iconFile"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a square app icon image (PNG or JPG, 512x512px recommended)
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
                          checked={field.value === true}
                          onCheckedChange={(checked) => field.onChange(checked)}
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
                    <FormLabel>App Screenshots</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="screenshotFiles"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files)}
                          {...fieldProps}
                        />
                        <label
                          htmlFor="screenshotFiles"
                          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </label>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload screenshots of your app (PNG or JPG, multiple allowed)
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
                  disabled={createMutation.isPending || isUploading}
                >
                  {createMutation.isPending || isUploading
                    ? "Saving..."
                    : "Save App"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}