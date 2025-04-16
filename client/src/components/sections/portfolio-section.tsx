import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import AppCard from "@/components/ui/app-card";
import GithubRepoCard from "@/components/ui/github-repo-card";
import { App, GithubRepo } from "@shared/schema";

export default function PortfolioSection() {
  const { data: apps, isLoading: isLoadingApps } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  const { data: repos, isLoading: isLoadingRepos } = useQuery<GithubRepo[]>({
    queryKey: ["/api/github-repos"],
  });

  return (
    <section id="portfolio" className="py-20 bg-slate-100 dark:bg-dark-elevated scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-inter font-bold text-3xl md:text-4xl mb-6">My Android Applications</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Browse through my published Android applications. Each project showcases my skills in creating 
            intuitive, reliable, and engaging mobile experiences.
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoadingApps ? (
            // Loading skeleton for apps
            Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md animate-pulse"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                  <div className="flex gap-2 mb-6">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            apps?.map((app) => <AppCard key={app.id} app={app} />)
          )}
        </div>

        {/* GitHub Projects */}
        <div className="mt-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-inter font-bold text-3xl md:text-4xl mb-6">Open Source Contributions</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Check out my open-source projects and contributions on GitHub. I'm passionate about giving 
              back to the Android community.
            </p>
            <Button
              size="lg"
              variant="default"
              className="mt-6 rounded-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600"
              asChild
            >
              <a href="https://github.com/johndoe" target="_blank" rel="noopener noreferrer">
                <FaGithub className="mr-2" />
                View My GitHub Profile
              </a>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {isLoadingRepos ? (
              // Loading skeleton for GitHub repos
              Array.from({ length: 2 }).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-dark-surface rounded-xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="flex items-center space-x-2">
                      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
                </div>
              ))
            ) : (
              repos?.map((repo) => <GithubRepoCard key={repo.id} repo={repo} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
