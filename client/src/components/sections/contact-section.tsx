import { PROFILE } from "@/lib/constants";
import ContactForm from "@/components/ui/contact-form";
import { RectangleEllipsis, MapPinIcon } from "lucide-react";
import { FaTwitter, FaLinkedin } from "react-icons/fa";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-inter font-bold text-3xl md:text-4xl mb-6">Get In Touch</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Interested in working together? Have questions about my projects? Feel free to reach out!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg p-8">
            <h3 className="font-inter font-semibold text-2xl mb-6">Send a Message</h3>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&h=400&q=80" 
                alt="Coding environment" 
                className="rounded-xl shadow-lg mb-8 w-full"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-android-green/10 grid place-items-center text-android-green">
                  <RectangleEllipsis size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Email</h4>
                  <a 
                    href={`mailto:${PROFILE.email}`} 
                    className="text-slate-600 dark:text-slate-400 hover:text-android-green dark:hover:text-android-green transition-colors"
                  >
                    {PROFILE.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-android-green/10 grid place-items-center text-android-green">
                  <MapPinIcon size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Location</h4>
                  <p className="text-slate-600 dark:text-slate-400">{PROFILE.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-android-green/10 grid place-items-center text-android-green">
                  <FaTwitter size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Twitter</h4>
                  <a 
                    href={PROFILE.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-slate-600 dark:text-slate-400 hover:text-android-green dark:hover:text-android-green transition-colors"
                  >
                    @johndoe
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-android-green/10 grid place-items-center text-android-green">
                  <FaLinkedin size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-lg">LinkedIn</h4>
                  <a 
                    href={PROFILE.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-slate-600 dark:text-slate-400 hover:text-android-green dark:hover:text-android-green transition-colors"
                  >
                    linkedin.com/in/johndoe
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
