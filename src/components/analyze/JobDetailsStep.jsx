import { useState } from 'react';
import Button from '@/components/common/Button';

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry level (0-2 years)' },
  { value: 'mid', label: 'Mid level (2-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead / Principal (8+ years)' },
];

const JobDetailsStep = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobDescription: '',
    experienceLevel: 'mid',
    requiredSkills: [],
    mode: 'ats',
  });
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    if (formData.requiredSkills.includes(skill)) return;
    setFormData((prev) => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, skill],
    }));
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.jobTitle.trim()) errs.jobTitle = 'Job title is required';
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.jobDescription.trim()) errs.jobDescription = 'Job description is required';
    else if (formData.jobDescription.trim().length < 50) errs.jobDescription = 'Please provide a more detailed job description (min 50 characters)';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(formData);
  };

  const inputClass = (field) => `
    w-full px-3 py-2.5 rounded-lg text-sm border transition-all duration-200
    focus:ring-2 focus:outline-none bg-white text-gray-800 placeholder:text-gray-400
    ${errors[field]
      ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
      : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-400'
    }
  `;

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Job details</h2>
        <p className="text-sm text-gray-500 mb-6">
          Tell us about the role first — every analysis is tailored to this specific job.
        </p>

        <div className="flex flex-col gap-5">
          {/* Job title + Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Job title <span className="text-red-400">*</span>
              </label>
              <input
                name="jobTitle"
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.jobTitle}
                onChange={handleChange}
                className={inputClass('jobTitle')}
              />
              {errors.jobTitle && (
                <p className="text-xs text-red-500">{errors.jobTitle}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Company name <span className="text-red-400">*</span>
              </label>
              <input
                name="company"
                type="text"
                placeholder="e.g. Stripe"
                value={formData.company}
                onChange={handleChange}
                className={inputClass('company')}
              />
              {errors.company && (
                <p className="text-xs text-red-500">{errors.company}</p>
              )}
            </div>
          </div>

          {/* Job description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Job description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="jobDescription"
              placeholder="Paste the full job description here..."
              value={formData.jobDescription}
              onChange={handleChange}
              rows={6}
              className={`${inputClass('jobDescription')} resize-none`}
            />
            <div className="flex items-center justify-between">
              {errors.jobDescription
                ? <p className="text-xs text-red-500">{errors.jobDescription}</p>
                : <p className="text-xs text-gray-400">Paste the complete JD for the most accurate analysis</p>
              }
              <p className="text-xs text-gray-400 shrink-0 ml-2">
                {formData.jobDescription.length} chars
              </p>
            </div>
          </div>

          {/* Experience level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Experience level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className={inputClass('experienceLevel')}
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Required skills */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Required skills
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. React, TypeScript..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="flex-1 px-3 py-2.5 rounded-lg text-sm border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none bg-white text-gray-800 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-medium rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            {formData.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-indigo-900 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recruitment mode */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Recruitment mode
              <span className="text-gray-400 font-normal ml-1">
                — large companies and online portals usually use ATS
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, mode: 'ats' }))}
                className={`
                  p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${formData.mode === 'ats'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <p className={`text-sm font-semibold mb-1 ${formData.mode === 'ats' ? 'text-indigo-700' : 'text-gray-700'}`}>
                  ATS optimized
                </p>
                <p className="text-xs text-gray-500">
                  Keyword dense, standard headers, parser-friendly
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, mode: 'human' }))}
                className={`
                  p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${formData.mode === 'human'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <p className={`text-sm font-semibold mb-1 ${formData.mode === 'human' ? 'text-indigo-700' : 'text-gray-700'}`}>
                  Human optimized
                </p>
                <p className="text-xs text-gray-500">
                  Narrative flow, personality, storytelling
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="w-auto px-8">
          Continue to resume upload →
        </Button>
      </div>
    </form>
  );
};

export default JobDetailsStep;