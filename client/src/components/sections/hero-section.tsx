import { Button } from "@/components/ui/button";
import { MonitorSmartphone, RectangleEllipsis } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-surface dark:to-dark-elevated border-b border-slate-200 dark:border-slate-800">
      {/* Animated Dots Background (visual flair) */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-android-green/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 -left-20 w-80 h-80 bg-google-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="order-2 md:order-1">
          <h1 className="font-inter font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Android{" "}
            <span className="bg-gradient-to-r from-android-green to-google-blue bg-clip-text text-transparent">
              Developer
            </span>{" "}
            crafting exceptional experiences
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Hi, I'm Sulton UzDev. I specialize in building high-performance, user-focused 
            Android applications that solve real problems.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-android-green hover:bg-android-green/90 text-white rounded-full"
              asChild
            >
              <a href="#portfolio">
                <MonitorSmartphone className="mr-2 h-5 w-5" />
                View My Work
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              asChild
            >
              <a href="#contact">
                <RectangleEllipsis className="mr-2 h-5 w-5" />
                Contact Me
              </a>
            </Button>
          </div>
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1588239034647-25783cbfcfc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600&q=80"
            alt="Modern workspace with Android development tools"
            className="rounded-lg shadow-lg max-w-full h-auto dark:opacity-90"
          />
        </div>
      </div>
    </section>
  );
}
