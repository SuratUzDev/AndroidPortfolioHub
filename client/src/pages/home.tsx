import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import PortfolioSection from "@/components/sections/portfolio-section";
import BlogSection from "@/components/sections/blog-section";
import CodeSampleSection from "@/components/sections/code-sample-section";
import ContactSection from "@/components/sections/contact-section";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>John Doe | Android Developer</title>
        <meta name="description" content="Professional Android Developer specializing in native app development. View my portfolio, open-source projects, and technical insights." />
        <meta name="keywords" content="Android Developer, Mobile Apps, Kotlin, Java, Android SDK, App Development" />
        <meta property="og:title" content="John Doe | Android Developer" />
        <meta property="og:description" content="Professional Android Developer showcasing mobile applications and technical expertise" />
        <meta property="og:type" content="website" />
      </Helmet>
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <BlogSection />
      <CodeSampleSection />
      <ContactSection />
    </>
  );
}
