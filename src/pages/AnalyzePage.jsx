import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import JobDetailsStep from '@/components/analyze/JobDetailsStep';
import ResumeUploadStep from '@/components/analyze/ResumeUploadStep';
import AnalyzingStep from '@/components/analyze/AnalyzingStep';

const STEPS = [
  { id: 1, label: 'Job details' },
  { id: 2, label: 'Resume upload' },
  { id: 3, label: 'Analyzing' },
];

const AnalyzePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobData, setJobData] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const handleJobDetailsSubmit = (data) => {
    setJobData(data);
    setCurrentStep(2);
  };

  const handleResumeSubmit = (file) => {
    setResumeFile(file);
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <DashboardLayout title="New Analysis">
      {/* Step indicator */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
            <div
              className="h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300 border-2
                  ${currentStep > step.id
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : currentStep === step.id
                      ? 'bg-white border-indigo-600 text-indigo-600'
                      : 'bg-white border-gray-200 text-gray-400'
                  }
                `}
              >
                {currentStep > step.id ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  currentStep >= step.id ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-3xl mx-auto">
        {currentStep === 1 && (
          <JobDetailsStep onSubmit={handleJobDetailsSubmit} />
        )}
        {currentStep === 2 && (
          <ResumeUploadStep
            onSubmit={handleResumeSubmit}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <AnalyzingStep
            jobData={jobData}
            resumeFile={resumeFile}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalyzePage;