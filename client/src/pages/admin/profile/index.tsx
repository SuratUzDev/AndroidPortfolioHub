import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { getProfile, updateProfile, uploadFile } from "@/services/firebaseService";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "@shared/schema";
import { formatDate, formatDateForInput } from "@/utils/date-utils";

import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Trash2, Upload, User, Briefcase, GraduationCap, Share2 } from "lucide-react";

// We've moved formatDateForInput to the date-utils.ts file

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Profile state with properly typed initial values
  const [profile, setProfile] = useState<Profile>({
    id: "",
    name: "Sulton UzDev",
    title: "Android Developer",
    bio: "",
    email: "",
    phone: undefined,
    location: undefined,
    avatarUrl: undefined,
    experience: [{ company: "", position: "", startDate: new Date(), endDate: undefined, description: "" }],
    education: [{ school: "", degree: "", field: "", graduationDate: new Date() }],
    skills: [""],
    socialLinks: [{ platform: "", url: "" }],
  });
  
  // State for file upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Fetch profile data using React Query
  const profileQuery = useQuery({
    queryKey: ['/api/profile'],
    queryFn: getProfile
  });
  
  // Update profile state when data is loaded
  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (profileData: any) => {
      setIsUploading(true);
      
      let avatarUrl = profile.avatarUrl;
      
      // Upload avatar if provided
      if (avatarFile) {
        avatarUrl = await uploadFile(avatarFile, `profile/avatar-${Date.now()}`);
      }
      
      // Update profile with new avatar URL
      const updatedProfile = {
        ...profileData,
        avatarUrl,
      };
      
      await updateProfile(updatedProfile);
      
      setIsUploading(false);
      return updatedProfile;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      setProfile(data);
      setAvatarFile(null);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      setIsUploading(false);
      toast({
        title: "Error",
        description: `Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  // Handle avatar file change
  const handleAvatarChange = (file: File) => {
    console.log("Avatar file changed:", file.name);
    setAvatarFile(file);
  };
  
  // Handle avatar removal
  const handleAvatarRemove = () => {
    console.log("Avatar removed");
    setAvatarFile(null);
    setProfile({ ...profile, avatarUrl: undefined });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting profile:", profile);
    updateMutation.mutate(profile);
  };
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  // Handle experience changes
  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updatedExperience = [...profile.experience];
    
    // Handle date conversions
    if (field === 'startDate' || field === 'endDate') {
      updatedExperience[index] = { 
        ...updatedExperience[index], 
        [field]: value ? new Date(value) : undefined 
      };
    } else {
      updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    }
    
    setProfile({ ...profile, experience: updatedExperience });
  };
  
  // Add new experience entry
  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [
        ...profile.experience,
        { company: "", position: "", startDate: new Date(), endDate: undefined, description: "" }
      ]
    });
  };
  
  // Remove experience entry
  const removeExperience = (index: number) => {
    const updatedExperience = [...profile.experience];
    updatedExperience.splice(index, 1);
    setProfile({ ...profile, experience: updatedExperience });
  };
  
  // Handle education changes
  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...profile.education];
    
    // Handle date conversions
    if (field === 'graduationDate') {
      updatedEducation[index] = { 
        ...updatedEducation[index], 
        [field]: value ? new Date(value) : new Date() 
      };
    } else {
      updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    }
    
    setProfile({ ...profile, education: updatedEducation });
  };
  
  // Add new education entry
  const addEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...profile.education,
        { school: "", degree: "", field: "", graduationDate: new Date() }
      ]
    });
  };
  
  // Remove education entry
  const removeEducation = (index: number) => {
    const updatedEducation = [...profile.education];
    updatedEducation.splice(index, 1);
    setProfile({ ...profile, education: updatedEducation });
  };
  
  // Handle skills changes
  const handleSkillsChange = (index: number, value: string) => {
    const updatedSkills = [...profile.skills];
    updatedSkills[index] = value;
    setProfile({ ...profile, skills: updatedSkills });
  };
  
  // Add new skill entry
  const addSkill = () => {
    setProfile({
      ...profile,
      skills: [...profile.skills, ""]
    });
  };
  
  // Remove skill entry
  const removeSkill = (index: number) => {
    const updatedSkills = [...profile.skills];
    updatedSkills.splice(index, 1);
    setProfile({ ...profile, skills: updatedSkills });
  };
  
  // Handle social link changes
  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const updatedSocialLinks = [...profile.socialLinks];
    updatedSocialLinks[index] = { ...updatedSocialLinks[index], [field]: value };
    setProfile({ ...profile, socialLinks: updatedSocialLinks });
  };
  
  // Add new social link entry
  const addSocialLink = () => {
    setProfile({
      ...profile,
      socialLinks: [
        ...profile.socialLinks,
        { platform: "", url: "" }
      ]
    });
  };
  
  // Remove social link entry
  const removeSocialLink = (index: number) => {
    const updatedSocialLinks = [...profile.socialLinks];
    updatedSocialLinks.splice(index, 1);
    setProfile({ ...profile, socialLinks: updatedSocialLinks });
  };

  if (profileQuery.isLoading) {
    return (
      <AdminLayout title="My Profile">
        <div className="flex justify-center py-10">Loading profile data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="My Profile">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and developer profile</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="personal">
              <User className="mr-2 h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="experience">
              <Briefcase className="mr-2 h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="education">
              <GraduationCap className="mr-2 h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="social">
              <Share2 className="mr-2 h-4 w-4" />
              Social & Skills
            </TabsTrigger>
          </TabsList>
          
          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={profile.title}
                      onChange={handleChange}
                      placeholder="e.g., Senior Android Developer"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Write a short bio about yourself"
                    className="min-h-32"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Photo</Label>
                  <div className="flex items-start space-x-4">
                    <ImageUpload
                      initialImageUrl={profile.avatarUrl}
                      onImageUpload={handleAvatarChange}
                      onImageRemove={handleAvatarRemove}
                      variant="circle"
                      size="lg"
                      disabled={updateMutation.isPending || isUploading}
                    />
                    
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">
                        Upload a professional profile photo
                      </p>
                      <p className="text-xs text-gray-500">
                        Recommended: Square image, at least 300x300 pixels
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Work Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Add your work history and professional experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Experience #{index + 1}</h3>
                      {profile.experience.length > 1 && (
                        <Button 
                          type="button"
                          variant="outline" 
                          size="icon"
                          onClick={() => removeExperience(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`company-${index}`}>Company</Label>
                        <Input
                          id={`company-${index}`}
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          placeholder="Company name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`position-${index}`}>Position</Label>
                        <Input
                          id={`position-${index}`}
                          value={exp.position}
                          onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                          placeholder="Your job title"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                        <Input
                          id={`startDate-${index}`}
                          type="date"
                          value={formatDateForInput(exp.startDate)}
                          onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${index}`}>End Date (leave empty if current)</Label>
                        <Input
                          id={`endDate-${index}`}
                          type="date"
                          value={exp.endDate ? formatDateForInput(exp.endDate) : ''}
                          onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        placeholder="Describe your responsibilities and achievements"
                        className="min-h-24"
                      />
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={addExperience}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Experience
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Education Tab */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>Add your educational background and qualifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.education.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Education #{index + 1}</h3>
                      {profile.education.length > 1 && (
                        <Button 
                          type="button"
                          variant="outline" 
                          size="icon"
                          onClick={() => removeEducation(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`school-${index}`}>School/University</Label>
                      <Input
                        id={`school-${index}`}
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                        placeholder="Institution name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`degree-${index}`}>Degree</Label>
                        <Input
                          id={`degree-${index}`}
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          placeholder="e.g., Bachelor's, Master's"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`field-${index}`}>Field of Study</Label>
                        <Input
                          id={`field-${index}`}
                          value={edu.field}
                          onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`graduationDate-${index}`}>Graduation Date</Label>
                      <Input
                        id={`graduationDate-${index}`}
                        type="date"
                        value={formatDateForInput(edu.graduationDate)}
                        onChange={(e) => handleEducationChange(index, 'graduationDate', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={addEducation}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Education
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Social & Skills Tab */}
          <TabsContent value="social">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>List your technical and professional skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={skill}
                        onChange={(e) => handleSkillsChange(index, e.target.value)}
                        placeholder="Enter a skill"
                      />
                      {profile.skills.length > 1 && (
                        <Button 
                          type="button"
                          variant="outline" 
                          size="icon"
                          onClick={() => removeSkill(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={addSkill}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Skill
                  </Button>
                </CardContent>
              </Card>
              
              {/* Social Links Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Add your social media and professional networking links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.socialLinks.map((link, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Link #{index + 1}</h3>
                        {profile.socialLinks.length > 1 && (
                          <Button 
                            type="button"
                            variant="outline" 
                            size="icon"
                            onClick={() => removeSocialLink(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`platform-${index}`}>Platform</Label>
                        <Input
                          id={`platform-${index}`}
                          value={link.platform}
                          onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                          placeholder="e.g., LinkedIn, Twitter, GitHub"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`url-${index}`}>URL</Label>
                        <Input
                          id={`url-${index}`}
                          value={link.url}
                          onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={addSocialLink}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6 space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/admin/dashboard")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateMutation.isPending || isUploading}
          >
            {updateMutation.isPending || isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}