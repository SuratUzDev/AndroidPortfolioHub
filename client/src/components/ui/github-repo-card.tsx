import { FaGithub, FaStar, FaCodeBranch } from "react-icons/fa";
import { GithubRepo } from "@shared/schema";

interface GithubRepoCardProps {
  repo: GithubRepo;
}

export default function GithubRepoCard({ repo }: GithubRepoCardProps) {
  const { name, description, stars, forks, url, tags } = repo;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-inter font-semibold text-xl">{name}</h3>
        <div className="flex items-center space-x-2">
          <span className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <FaStar className="mr-1" /> {stars}
          </span>
          <span className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <FaCodeBranch className="mr-1" /> {forks}
          </span>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-400 mb-4">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs">
            {tag}
          </span>
        ))}
      </div>

      <a 
        href={url} 
        className="inline-flex items-center text-android-green hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub className="mr-2" />
        View Repository
      </a>
    </div>
  );
}
