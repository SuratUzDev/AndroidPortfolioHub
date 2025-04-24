import { PROFILE, SKILLS } from "@/lib/constants";
import { 
  BuildingIcon, 
  MapPinIcon, 
  GraduationCapIcon 
} from "lucide-react";
import { handleImageError, getImageUrl } from "@/utils/image-utils";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/firebaseService";

export default function AboutSection() {
  // Get profile data
  const { data: profileData } = useQuery({
    queryKey: ['/api/profile'],
    queryFn: getProfile
  });
  return (
    <section id="about" className="py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="font-inter font-bold text-3xl md:text-4xl mb-12 text-center">About Me</h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="font-semibold text-2xl mb-4">Expert Android Developer</h3>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              {PROFILE.bio}
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              I'm passionate about creating applications that are not only functional but also provide 
              exceptional user experiences through thoughtful design and smooth performance.
            </p>

            <div className="flex flex-wrap gap-2 pt-4">
              {SKILLS.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-dark-elevated rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center mb-6">
              <img 
                src={getImageUrl(profileData?.avatarUrl, 'profile')} 
                alt={profileData?.name || "Sulton UzDev"} 
                className="w-20 h-20 rounded-full object-cover"
                onError={(e) => handleImageError(e, 'profile')}
              />
              <div className="ml-4">
                <h3 className="font-inter font-semibold text-xl">{PROFILE.name}</h3>
                <p className="text-slate-600 dark:text-slate-400">{PROFILE.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 grid place-items-center text-android-green">
                  <BuildingIcon size={18} />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Currently working at</h4>
                  <p className="text-slate-600 dark:text-slate-400">{PROFILE.company}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 grid place-items-center text-google-blue">
                  <MapPinIcon size={18} />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Location</h4>
                  <p className="text-slate-600 dark:text-slate-400">{PROFILE.location}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 grid place-items-center text-purple-500">
                  <GraduationCapIcon size={18} />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Education</h4>
                  <p className="text-slate-600 dark:text-slate-400">{PROFILE.education}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
