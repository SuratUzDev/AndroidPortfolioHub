import { useState } from "react";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";

export default function AdminCodeSamples() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: codeSamples } = useQuery({
    queryKey: ["codeSamples"],
    queryFn: async () => {
      const response = await fetch("/api/code-samples");
      if (!response.ok) {
        throw new Error("Failed to fetch code samples");
      }
      return response.json();
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this code sample?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/code-samples/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete code sample");

      toast({
        title: "Success",
        description: "Code sample deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete code sample",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Code Samples</h1>
        <Button asChild>
          <Link href="/admin/code-samples/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Code Sample
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {codeSamples?.map((sample: any) => (
          <div
            key={sample.id}
            className="p-4 border rounded-lg bg-card text-card-foreground"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{sample.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {sample.language}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/admin/code-samples/edit/${sample.id}`}>
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(sample.id)}
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