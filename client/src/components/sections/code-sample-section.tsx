import { useQuery } from "@tanstack/react-query";
import CodeBlock from "@/components/ui/code-block";
import { CODE_SAMPLES } from "@/lib/constants";
import { CodeSample } from "@shared/schema";

export default function CodeSampleSection() {
  const { data: codeSamples } = useQuery<CodeSample[]>({
    queryKey: ["/api/code-samples"],
  });

  // Use CODE_SAMPLES as fallback if the API hasn't been implemented yet
  const samples = codeSamples || CODE_SAMPLES;

  return (
    <section className="py-20 bg-slate-100 dark:bg-dark-elevated">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-inter font-bold text-3xl md:text-4xl mb-6">Code Snippets</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Here are some useful code snippets that showcase my coding style and best 
            practices for Android development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {samples.map((sample, index) => (
            <CodeBlock
              key={index}
              title={sample.title}
              language={sample.language}
              code={sample.code}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
