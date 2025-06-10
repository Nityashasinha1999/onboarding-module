"use client";
import React, { useState } from "react";

type FormData = {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  
  // Education Details
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa: string;
  }[];
  
  // Work Experience
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
};

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  education: [{ degree: "", institution: "", year: "", gpa: "" }],
  experience: [{ company: "", position: "", startDate: "", endDate: "", description: "" }],
};

export default function CandidatesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [e.target.name]: e.target.value };
    setFormData({ ...formData, education: newEducation });
  };

  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newExperience = [...formData.experience];
    newExperience[index] = { ...newExperience[index], [e.target.name]: e.target.value };
    setFormData({ ...formData, experience: newExperience });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: "", institution: "", year: "", gpa: "" }],
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: "", position: "", startDate: "", endDate: "", description: "" }],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 shadow rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-green-500 mb-4">Welcome Aboard!</h2>
              <p className="text-gray-300 mb-8">Your onboarding process has been completed successfully.</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-white">Onboarding Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">1</div>
                  <div className="ml-4">
                    <p className="font-medium text-white">Application Submitted</p>
                    <p className="text-sm text-gray-400">Your information has been received</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">2</div>
                  <div className="ml-4">
                    <p className="font-medium text-white">Document Verification</p>
                    <p className="text-sm text-gray-400">Expected completion: 2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">3</div>
                  <div className="ml-4">
                    <p className="font-medium text-white">Orientation</p>
                    <p className="text-sm text-gray-400">Scheduled for next week</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Download Welcome Kit
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 shadow rounded-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">New Candidate Onboarding</h2>
              <div className="text-sm text-gray-400">Step {currentStep} of 4</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-white">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handlePersonalInfoChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handlePersonalInfoChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handlePersonalInfoChange}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePersonalInfoChange}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handlePersonalInfoChange}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-white">Education Details</h3>
                {formData.education.map((edu, index) => (
                  <div key={index} className="p-4 border border-gray-700 rounded-lg space-y-4 bg-gray-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Degree</label>
                        <input
                          type="text"
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Institution</label>
                        <input
                          type="text"
                          name="institution"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Year</label>
                        <input
                          type="text"
                          name="year"
                          value={edu.year}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">GPA</label>
                        <input
                          type="text"
                          name="gpa"
                          value={edu.gpa}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEducation}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-400 bg-blue-900 hover:bg-blue-800"
                >
                  Add Another Education
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-white">Work Experience</h3>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="p-4 border border-gray-700 rounded-lg space-y-4 bg-gray-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Company</label>
                        <input
                          type="text"
                          name="company"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Position</label>
                        <input
                          type="text"
                          name="position"
                          value={exp.position}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Description</label>
                      <textarea
                        name="description"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, e)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-400 bg-blue-900 hover:bg-blue-800"
                >
                  Add Another Experience
                </button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-white">Review and Submit</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-white">Personal Information</h4>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="text-sm font-medium text-white">{`${formData.firstName} ${formData.lastName}`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-sm font-medium text-white">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-white">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Date of Birth</p>
                        <p className="text-sm font-medium text-white">{formData.dob}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white">Education</h4>
                    {formData.education.map((edu, index) => (
                      <div key={index} className="mt-2 p-4 border border-gray-700 rounded-lg bg-gray-800">
                        <p className="text-sm font-medium text-white">{edu.degree}</p>
                        <p className="text-sm text-gray-400">{edu.institution}</p>
                        <p className="text-sm text-gray-400">{`Year: ${edu.year}, GPA: ${edu.gpa}`}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-medium text-white">Work Experience</h4>
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="mt-2 p-4 border border-gray-700 rounded-lg bg-gray-800">
                        <p className="text-sm font-medium text-white">{exp.position}</p>
                        <p className="text-sm text-gray-400">{exp.company}</p>
                        <p className="text-sm text-gray-400">{`${exp.startDate} - ${exp.endDate}`}</p>
                        <p className="text-sm text-gray-400 mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700"
                >
                  Previous
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 