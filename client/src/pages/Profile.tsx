import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
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
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({
      ...prev,
      skills,
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
      await refreshUser();
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.msg || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="input-field min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Freelancer Specific Fields */}
          {user.role === "freelancer" && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills.join(", ")}
                      onChange={handleSkillsChange}
                      className="input-field"
                      placeholder="React, Node.js, TypeScript"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate (USD)
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      className="input-field"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Portfolio Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Portfolio</h2>
                  <Button type="button" variant="outline" onClick={addPortfolioItem}>
                    Add Project
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.portfolio.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Project {index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removePortfolioItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            handlePortfolioChange(index, "title", e.target.value)
                          }
                          className="input-field"
                          placeholder="Project Title"
                        />
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handlePortfolioChange(index, "description", e.target.value)
                          }
                          className="input-field"
                          placeholder="Project Description"
                        />
                        <input
                          type="url"
                          value={item.link}
                          onChange={(e) =>
                            handlePortfolioChange(index, "link", e.target.value)
                          }
                          className="input-field"
                          placeholder="Project URL"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Certifications</h2>
                  <Button type="button" variant="outline" onClick={addCertification}>
                    Add Certification
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Certification {index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeCertification(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) =>
                            handleCertificationChange(index, "name", e.target.value)
                          }
                          className="input-field"
                          placeholder="Certification Name"
                        />
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) =>
                            handleCertificationChange(index, "issuer", e.target.value)
                          }
                          className="input-field"
                          placeholder="Issuing Organization"
                        />
                        <input
                          type="number"
                          value={cert.year}
                          onChange={(e) =>
                            handleCertificationChange(
                              index,
                              "year",
                              parseInt(e.target.value)
                            )
                          }
                          className="input-field"
                          placeholder="Year"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Business Specific Fields */}
          {user.role === "business" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;