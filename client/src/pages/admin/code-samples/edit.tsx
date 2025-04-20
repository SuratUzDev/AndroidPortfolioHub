import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { insertCodeSampleSchema } from "@shared/schema";
import { getCodeSample, updateCodeSample } from "@/services/firebaseService";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";

// Extend the schema for form validation
const formSchema = insertCodeSampleSchema;

type FormData = z.infer<typeof formSchema>;

export default function EditCodeSamplePage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get code sample data
  const { data: codeSample, isLoading } = useQuery({
    queryKey: ['/api/code-samples', id],
    queryFn: () => getCodeSample(id),
  });

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      language: "",
      code: "",
    },
  });

  // Update form values when code sample data is loaded
  React.useEffect(() => {
    if (codeSample) {
      form.reset({
        title: codeSample.title,
        language: codeSample.language,
        code: codeSample.code,
      });
    }
  }, [codeSample, form]);

  // Update code sample mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await updateCodeSample(id, {
        title: data.title,
        language: data.language,
        code: data.code,
      });
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/code-samples'] });
      toast({
        title: "Code sample updated",
        description: "The code sample has been updated successfully.",
      });
      setLocation("/admin/code-samples");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update code sample: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Edit Code Sample">
        <div className="flex justify-center py-10">Loading code sample data...</div>
      </AdminLayout>
    );
  }

  if (!codeSample) {
    return (
      <AdminLayout title="Edit Code Sample">
        <div className="text-red-500 py-10">Code sample not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Code Sample">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setLocation("/admin/code-samples")}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Code Samples
        </Button>
        <h1 className="text-2xl font-bold">Edit Code Sample</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Code Sample Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter code sample title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programming Language*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Kotlin, Java, XML" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter or paste your code here"
                        className="min-h-64 font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/code-samples")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Updating..." : "Update Code Sample"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}