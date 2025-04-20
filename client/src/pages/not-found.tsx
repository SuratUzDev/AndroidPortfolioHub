import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { SEO } from "@/components/ui/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <>
      <SEO 
        title="Page Not Found" 
        description="The page you're looking for doesn't exist."
        noIndex={true}
      />
      
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md mx-4 border-2 border-red-100 dark:border-red-900">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">404</h1>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Page Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
              
              <Link href="/">
                <Button>
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
