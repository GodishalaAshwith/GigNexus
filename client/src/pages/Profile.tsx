import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { authService } from "@/services/api";

interface ProfileFormData {
  name: string;
  avatar: string;
  location: string;
  bio: string;
  // Freelancer specific
  skills: string[];
  hourlyRate: number;
  portfolio: Array<{
    title: string;
    description: string;
    link: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: number;
  }>;
  // Business specific
  companyName: string;
  industry: string;
  website: string;
  companySize: string;
}

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.profile?.name || "",
    avatar: user?.profile?.avatar || "",
    location: user?.profile?.location || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills || [],
    hourlyRate: user?.profile?.hourlyRate || 0,
    portfolio: user?.profile?.portfolio || [],
    certifications: user?.profile?.certifications || [],
    companyName: user?.profile?.companyName || "",
    industry: user?.profile?.industry || "",
    website: user?.profile?.website || "",
    companySize: user?.profile?.companySize || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handlePortfolioChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addPortfolioItem = () => {
    setFormData((prev) => ({
      ...prev,
      portfolio: [
        ...prev.portfolio,
        { title: "", description: "", link: "" },
      ],
    }));
  };

  const removePortfolioItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index),
    }));
  };

  const handleCertificationChange = (index: number, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: "", issuer: "", year: new Date().getFullYear() },
      ],
    }));
  };

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.updateProfile(formData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      refreshUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
            <Avatar className="w-24 h-24">
              {user.profile?.avatar ? (
                <AvatarImage src={user.profile.avatar} alt={user.profile?.name || "User"} />
              ) : (
                <AvatarFallback className="text-xl">
                  {user.profile?.name ? getInitials(user.profile.name) : <User />}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-semibold">{user.profile?.name || "User"}</h2>
              <p className="text-gray-500 mb-2">{user.email}</p>
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
                {user.role}
              </div>
              {!isEditing && (
                <div className="mt-4">
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isEditing ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <Tabs defaultValue={user.role === "freelancer" ? "freelancer" : "business"} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="personal">
                  Personal Info
                </TabsTrigger>
                {user.role === "freelancer" && (
                  <TabsTrigger value="freelancer">
                    Freelancer Info
                  </TabsTrigger>
                )}
                {user.role === "business" && (
                  <TabsTrigger value="business">
                    Business Info
                  </TabsTrigger>
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
                      <Label htmlFor="avatar">Profile Picture URL</Label>
                      <Input 
                        id="avatar" 
                        name="avatar" 
                        value={formData.avatar} 
                        onChange={handleChange} 
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        placeholder="City, Country"
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
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
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
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill (e.g. React, Node.js)"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddSkill}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                          <span>{skill}</span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input 
                      id="hourlyRate" 
                      name="hourlyRate" 
                      type="number" 
                      value={formData.hourlyRate.toString()} 
                      onChange={handleChange} 
                      placeholder="Your hourly rate"
                    />
                  </div>

                  {/* Portfolio Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Portfolio</Label>
                      <Button type="button" variant="outline" onClick={addPortfolioItem}>
                        Add Project
                      </Button>
                    </div>
                    
                    {formData.portfolio.map((item, index) => (
                      <div key={index} className="border p-4 rounded-md space-y-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Project {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removePortfolioItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) => handlePortfolioChange(index, 'title', e.target.value)}
                            placeholder="Project title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => handlePortfolioChange(index, 'description', e.target.value)}
                            placeholder="Project description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Link</Label>
                          <Input
                            value={item.link}
                            onChange={(e) => handlePortfolioChange(index, 'link', e.target.value)}
                            placeholder="https://example.com/project"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certifications Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Certifications</Label>
                      <Button type="button" variant="outline" onClick={addCertification}>
                        Add Certification
                      </Button>
                    </div>
                    
                    {formData.certifications.map((cert, index) => (
                      <div key={index} className="border p-4 rounded-md space-y-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Certification {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={cert.name}
                            onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                            placeholder="Certification name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Issuer</Label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                            placeholder="Issuing organization"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            type="number"
                            value={cert.year}
                            onChange={(e) => handleCertificationChange(index, 'year', parseInt(e.target.value))}
                            placeholder="Year received"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
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
                        placeholder="e.g. Technology, Healthcare"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website" 
                        name="website" 
                        value={formData.website} 
                        onChange={handleChange} 
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Input 
                        id="companySize" 
                        name="companySize" 
                        value={formData.companySize} 
                        onChange={handleChange} 
                        placeholder="e.g. 1-10, 11-50, 51-200"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
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
                ? "Your professional profile visible to potential clients." 
                : "Your business profile visible to freelancers."}
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p>{user.profile?.name || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <p>{user.profile?.location || "Not provided"}</p>
                  </div>
                </div>
              </div>
              
              {user.role === "freelancer" && (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Professional Information</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-500">Skills:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {user.profile?.skills?.length > 0 ? (
                            user.profile.skills.map((skill, index) => (
                              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p>No skills added</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Hourly Rate:</span>
                        <p>{user.profile?.hourlyRate ? `$${user.profile.hourlyRate}/hr` : "Not provided"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Bio:</span>
                        <p className="mt-1">{user.profile?.bio || "No bio provided"}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {user.role === "business" && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Company Name:</span>
                      <p>{user.profile?.companyName || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Industry:</span>
                      <p>{user.profile?.industry || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Website:</span>
                      <p>
                        {user.profile?.website ? (
                          <a 
                            href={user.profile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {user.profile.website}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Company Size:</span>
                      <p>{user.profile?.companySize || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
