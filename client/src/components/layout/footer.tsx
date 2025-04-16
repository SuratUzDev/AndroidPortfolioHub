import { Link } from "wouter";
import { FaAndroid, FaGithub, FaTwitter, FaLinkedinIn, FaMedium } from "react-icons/fa";
import { PROFILE } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-android-green rounded-full grid place-items-center text-white">
                <FaAndroid className="text-xl" />
              </div>
              <span className="font-inter font-bold text-xl">{PROFILE.name}</span>
            </div>

            <p className="text-slate-400 mb-6">
              Android developer passionate about creating intuitive, high-performance 
              mobile applications that solve real-world problems.
            </p>

            <div className="flex space-x-4">
              <a 
                href={PROFILE.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 grid place-items-center transition-colors"
              >
                <FaGithub />
              </a>
              <a 
                href={PROFILE.twitter}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 grid place-items-center transition-colors"
              >
                <FaTwitter />
              </a>
              <a 
                href={PROFILE.linkedin}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 grid place-items-center transition-colors"
              >
                <FaLinkedinIn />
              </a>
              <a 
                href="#"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 grid place-items-center transition-colors"
              >
                <FaMedium />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-slate-400 hover:text-white transition-colors">
                  About Me
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-slate-400 hover:text-white transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#blog" className="text-slate-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://developer.android.com/docs" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Android Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://play.google.com/console/about/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Google Play Console
                </a>
              </li>
              <li>
                <a 
                  href="https://m3.material.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Material Design
                </a>
              </li>
              <li>
                <a 
                  href="https://kotlinlang.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Kotlin Language
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} {PROFILE.name}. All rights reserved.
          </p>

          <div className="flex space-x-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
