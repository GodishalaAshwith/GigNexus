import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.profile?.name || "",
    email: user?.email || "",
    bio: "",
    location: "",
    skills: [],
    hourlyRate: "",
    availability: "",
    companyName: user?.profile?.companyName || "",
    industry: "",
    website: "",
    hiringNeeds: "",
  });
  
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() === "") return;
    
    if (formData.skills.includes(skillInput.trim())) {
      toast.error("This skill is already added");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()]
    }));
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send the profile data to an API
      console.log("Profile data:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      // In a real app, you would refresh the user data
      // refreshUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profile?.avatar} />
                <AvatarFallback className="text-lg">
                  {user.profile?.name ? getInitials(user.profile.name) : <User className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="mt-4">
                Change Photo
              </Button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {user.profile?.name || user.email}
              </h2>
              <p className="text-gray-500 capitalize mb-2">
                {user.role}
              </p>
              <p className="text-gray-700 mb-4">
                {user.role === "business" && user.profile?.companyName && (
                  <span className="block">Company: {user.profile.companyName}</span>
                )}
                <span className="block">Email: {user.email}</span>
              </p>
              
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {isEditing ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <Tabs defaultValue={user.role} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="personal" disabled={user.role !== "freelancer" && user.role !== "business"}>
                  Personal Info
                </TabsTrigger>
                {user.role === "freelancer" && (
                  <TabsTrigger value="freelancer">Freelancer Profile</TabsTrigger>
                )}
                {user.role === "business" && (
                  <TabsTrigger value="business">Business Profile</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="personal">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Your email"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleChange} 
                      placeholder="Tell us about yourself"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleChange} 
                      placeholder="Your location"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="freelancer">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddSkill}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill) => (
                        <div 
                          key={skill} 
                          className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-primary-700 hover:text-primary-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input 
                        id="hourlyRate" 
                        name="hourlyRate" 
                        value={formData.hourlyRate} 
                        onChange={handleChange} 
                        placeholder="Your hourly rate"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Input 
                        id="availability" 
                        name="availability" 
                        value={formData.availability} 
                        onChange={handleChange} 
                        placeholder="e.g. Full-time, 20hrs/week"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="business">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        name="companyName" 
                        value={formData.companyName} 
                        onChange={handleChange} 
                        placeholder="Your company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input 
                        id="industry" 
                        name="industry" 
                        value={formData.industry} 
                        onChange={handleChange} 
                        placeholder="Your industry"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      name="website" 
                      value={formData.website} 
                      onChange={handleChange} 
                      placeholder="Your company website"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hiringNeeds">Hiring Needs</Label>
                    <Textarea 
                      id="hiringNeeds" 
                      name="hiringNeeds" 
                      value={formData.hiringNeeds} 
                      onChange={handleChange} 
                      placeholder="Describe your hiring needs"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
            <p className="text-gray-500 mb-6">
              {user.role === "freelancer" 
                ? "Complete your profile to increase your chances of getting hired."
                : "Complete your business profile to attract the best talent."}
            </p>
            
            <div className="space-y-4">
              {user.role === "freelancer" && (
                <>
                  <div>
                    <h3 className="font-medium text-gray-700">Skills</h3>
                    <p className="text-gray-500">
                      No skills added yet. Edit your profile to add skills.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Hourly Rate</h3>
                      <p className="text-gray-500">Not specified</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Availability</h3>
                      <p className="text-gray-500">Not specified</p>
                    </div>
                  </div>
                </>
              )}
              
              {user.role === "business" && (
                <>
                  <div>
                    <h3 className="font-medium text-gray-700">Company Name</h3>
                    <p className="text-gray-500">
                      {user.profile?.companyName || "Not specified"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">Industry</h3>
                    <p className="text-gray-500">Not specified</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">Website</h3>
                    <p className="text-gray-500">Not specified</p>
                  </div>
                </>
              )}
              
              <div>
                <h3 className="font-medium text-gray-700">Location</h3>
                <p className="text-gray-500">Not specified</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
