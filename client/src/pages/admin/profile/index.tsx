
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import * as firebaseService from "@/services/firebaseService";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

export default function AdminProfile() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: firebaseService.getProfile,
  });

  const form = useForm({
    defaultValues: profile || {
      name: "",
      title: "",
      bio: "",
      email: "",
      phone: "",
      location: "",
      skills: [],
      experience: [],
      education: [],
      socialLinks: [],
    },
  });

  const updateMutation = useMutation({
    mutationFn: firebaseService.updateProfile,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: any) => {
    updateMutation.mutate(values);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const avatarUrl = await firebaseService.uploadFile(
        file,
        `profile/avatar-${Date.now()}`
      );
      form.setValue("avatarUrl", avatarUrl);
      toast({
        title: "Success",
        description: "Avatar uploaded successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to upload avatar: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <AdminLayout title="Profile">Loading...</AdminLayout>;
  }

  return (
    <AdminLayout title="Profile">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
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
    </AdminLayout>
  );
}
