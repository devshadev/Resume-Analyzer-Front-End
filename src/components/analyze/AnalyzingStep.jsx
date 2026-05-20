import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisApi } from '@/api/authApi';

const STAGES = [
  { id: 1, label: 'Validating and parsing resume',   detail: 'Extracting text from your file...' },
  { id: 2, label: 'Running scoring engine',          detail: 'Computing match score and ATS compatibility...' },
  { id: 3, label: 'Running AI analysis',             detail: 'Analyzing sections, keywords and gaps...' },
  { id: 4, label: 'Generating cover letter',         detail: 'Writing a tailored cover letter with explanations...' },
  { id: 5, label: 'Humanizing cover letter',         detail: 'Refining tone and removing AI clichés...' },
];

const AnalyzingStep = ({ jobData, resumeFile }) => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [reportId, setReportId] = useState(null);

const hasRun = useRef(false);

useEffect(() => {
  if (!jobData || !resumeFile) return;
  if (hasRun.current) return;
  hasRun.current = true;
  runAnalysis();
}, []);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const runAnalysis = async () => {
    try {
      // Stage 1 — upload and parse
      setCurrentStage(1);

      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobData', JSON.stringify(jobData));

      // Advance stages visually while waiting for the backend
      // The real work happens server-side — we simulate progress
      const stageTimer = async () => {
        await delay(2000); setCurrentStage(2);
        await delay(2000); setCurrentStage(3);
        await delay(3000); setCurrentStage(4);
        await delay(3000); setCurrentStage(5);
      };

      // Run stage animation and API call in parallel
      const [response] = await Promise.all([
        analysisApi.run(formData),
        stageTimer(),
      ]);

      setReportId(response.data.reportId);
      setStatus('success');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 'Analysis failed. Please try again.'
      );
      setStatus('error');
    }
  };

  // ── Error state ─────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis failed</h3>
        <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
        <button
          onClick={() => navigate('/analyze')}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis complete</h3>
        <p className="text-sm text-gray-500 mb-6">
          Your resume has been analyzed. View your full report below.
        </p>
        <button
          onClick={() => navigate(`/reports/${reportId}`)}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          View report →
        </button>
      </div>
    );
  }

  // ── Loading state ────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <div className="w-7 h-7 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Analyzing your resume
        </h3>
        <p className="text-sm text-gray-500">
          This takes 15–30 seconds. Please don't close this page.
        </p>
      </div>

      {/* Stages */}
      <div className="flex flex-col gap-3">
        {STAGES.map((stage) => {
          const isDone   = currentStage > stage.id;
          const isActive = currentStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`
                flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                ${isActive ? 'border-indigo-200 bg-indigo-50'
                  : isDone  ? 'border-green-100 bg-green-50'
                  :           'border-gray-100 bg-gray-50'}
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${isActive ? 'bg-indigo-100' : isDone ? 'bg-green-100' : 'bg-gray-100'}
              `}>
                {isDone ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-xs text-gray-400 font-medium">{stage.id}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium
                  ${isActive ? 'text-indigo-700' : isDone ? 'text-green-700' : 'text-gray-400'}
                `}>
                  {stage.label}
                </p>
                {isActive && (
                  <p className="text-xs text-indigo-500 mt-0.5">{stage.detail}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyzingStep;