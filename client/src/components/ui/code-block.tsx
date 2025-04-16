import { useState } from "react";

interface CodeBlockProps {
  title: string;
  language: string;
  code: string;
}

export default function CodeBlock({ title, language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
      <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
        <h3 className="font-medium">{title}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={copyToClipboard}
            className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <div className="code-block relative p-6 bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed overflow-x-auto" data-language={language}>
        <pre className="whitespace-pre-wrap">{code}</pre>
        <div className="absolute top-0 right-0 px-3 py-1 text-xs bg-slate-800/50 text-white rounded-bl-md">
          {language}
        </div>
      </div>
    </div>
  );
}
