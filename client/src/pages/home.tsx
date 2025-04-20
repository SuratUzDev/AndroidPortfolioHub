import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import PortfolioSection from "@/components/sections/portfolio-section";
import BlogSection from "@/components/sections/blog-section";
import CodeSampleSection from "@/components/sections/code-sample-section";
import ContactSection from "@/components/sections/contact-section";
import { SEO } from "@/components/ui/seo";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/firebaseService";

export default function Home() {
  // Get profile data for meta information
  const { data: profile } = useQuery({
    queryKey: ['/api/profile'],
    queryFn: () => getProfile(),
  });

  const description = profile?.bio || 
    "Professional Android Developer specializing in native app development. View my portfolio, open-source projects, and technical insights.";
  
  const keywords = [
    "Android Developer", 
    "Mobile Apps", 
    "Kotlin", 
    "Java", 
    "Android SDK", 
    "App Development",
    ...(profile?.skills || [])
  ];

  return (
    <>
      <SEO 
        title="Home"
        description={description}
        keywords={keywords}
        ogImage={profile?.avatarUrl}
      />
      
      <main className="flex flex-col min-h-screen">
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <BlogSection />
        <CodeSampleSection />
        <ContactSection />
      </main>
    </>
  );
}
