import { useEffect, useState } from 'react';
import { analysisApi } from '@/api/authApi';

// ─── Job card ─────────────────────────────────────────────────────────────────
const JobCard = ({ job }) => (
  <a
    href={job.url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-100 transition-all duration-200 group flex flex-col gap-3"
  >
    {/* Header */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {job.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-10 h-10 rounded-lg object-contain border border-gray-100 shrink-0 bg-white"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 truncate">{job.company}</p>
        </div>
      </div>
      <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-1.5">
      {job.location && (
        <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100">
          📍 {job.location}
        </span>
      )}
      {job.employmentType && (
        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full border border-indigo-100">
          {job.employmentType}
        </span>
      )}
      {job.via && (
        <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-100">
          via {job.via}
        </span>
      )}
    </div>

    {/* Description snippet */}
    {job.description && (
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
        {job.description}
      </p>
    )}

    {/* Footer */}
    
    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
      {job.salary ? (
        <span className="text-sm font-semibold text-green-600">{job.salary}</span>
      ) : (
        <span className="text-xs text-gray-400">Salary not specified</span>
      )}
      <span className="text-xs text-gray-400">
        {job.publishedAt
          ? new Date(job.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          : ''}
      </span>
    </div>
  </a>
);

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse shrink-0" />
      <div className="flex-1">
        <div className="w-48 h-4 bg-gray-100 rounded animate-pulse mb-2" />
        <div className="w-32 h-3 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="w-20 h-5 bg-gray-100 rounded-full animate-pulse" />
      <div className="w-16 h-5 bg-gray-100 rounded-full animate-pulse" />
    </div>
    <div className="w-full h-3 bg-gray-100 rounded animate-pulse" />
    <div className="w-3/4 h-3 bg-gray-100 rounded animate-pulse" />
  </div>
);

// ─── Relevant jobs component ──────────────────────────────────────────────────
const RelevantJobs = ({ reportId }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await analysisApi.getRelevantJobs(reportId);
        setJobs(data.jobs);
        setTotal(data.total);
        setSearchQuery(data.searchQuery);
      } catch {
        setError('Could not load relevant jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [reportId]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="w-64 h-4 bg-gray-100 rounded animate-pulse" />
          <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-600 mb-1">{error}</p>
        <p className="text-xs text-gray-400">Job search may be temporarily unavailable.</p>
      </div>
    );
  }

  // ── Empty ───────────────────────────────────────────────────────────────────
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-700 mb-1">No jobs found</h3>
        <p className="text-sm text-gray-400 mb-4">
          No matching jobs found for this role right now.
        </p>
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}+jobs`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Search on Google Jobs →
        </a>
      </div>
    );
  }

  // ── Results ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm text-gray-600">
            Found <span className="font-semibold text-gray-800">{total}</span> jobs matching
            <span className="text-indigo-600 font-medium"> "{searchQuery}"</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Powered by JSearch · Aggregated from LinkedIn, Indeed, Glassdoor · Showing top 10
          </p>
        </div>
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}+jobs`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          Search more on Google Jobs →
        </a>
      </div>

      {/* Job grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default RelevantJobs;