import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/layout/theme-provider"; 
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BlogPost from "@/pages/blog-post";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Lazily import admin pages
import AdminApps from "@/pages/admin/apps";
import AdminAppsNew from "@/pages/admin/apps/new";
import AdminBlogPosts from "@/pages/admin/blog-posts";
import AdminBlogPostsNew from "@/pages/admin/blog-posts/new";
import AdminCodeSamples from "@/pages/admin/code-samples";
import AdminCodeSamplesNew from "@/pages/admin/code-samples/new";
import AdminGithubRepos from "@/pages/admin/github-repos";
import AdminGithubReposNew from "@/pages/admin/github-repos/new";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  // Don't render header/footer for admin routes
  if (isAdminRoute) {
    return (
      <main className="min-h-screen">
        <Switch>
          {/* For exact '/admin' path, just show the dashboard */}
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/apps" component={AdminApps} />
          <Route path="/admin/apps/new" component={AdminAppsNew} />
          <Route path="/admin/blog-posts" component={AdminBlogPosts} />
          <Route path="/admin/blog-posts/new" component={AdminBlogPostsNew} />
          <Route path="/admin/code-samples" component={AdminCodeSamples} />
          <Route path="/admin/code-samples/new" component={AdminCodeSamplesNew} />
          <Route path="/admin/github-repos" component={AdminGithubRepos} />
          <Route path="/admin/github-repos/new" component={AdminGithubReposNew} />
          <Route path="/admin/:rest*" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
    );
  }

  // Regular site routes with header/footer
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
