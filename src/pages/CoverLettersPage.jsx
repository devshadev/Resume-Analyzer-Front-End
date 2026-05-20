import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisApi } from '@/api/authApi';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Link } from 'react-router-dom';

// ─── Cover letter card ────────────────────────────────────────────────────────
const CoverLetterCard = ({ report }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const letter = report.humanizedLetter?.refinedLetter
    || report.coverLetter?.paragraphs?.map((p) => p.text).join('\n\n')
    || '';

  const preview = letter.slice(0, 200) + (letter.length > 200 ? '...' : '');

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => navigate(`/reports/${report._id}?tab=cover-letter`)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-indigo-100 transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
            {report.jobData.jobTitle}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{report.jobData.company}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`
            px-2.5 py-1 rounded-full text-xs font-medium
            ${report.jobData.mode === 'ats'
              ? 'bg-indigo-50 text-indigo-600'
              : 'bg-purple-50 text-purple-600'}
          `}>
            {report.jobData.mode === 'ats' ? 'ATS' : 'Human'}
          </span>
        </div>
      </div>

      {/* Subject line */}
      {report.coverLetter?.subjectLine && (
        <div className="mb-3 px-3 py-2 bg-indigo-50 rounded-lg">
          <p className="text-xs text-indigo-500 font-medium mb-0.5">Subject line</p>
          <p className="text-xs text-indigo-800 font-medium">
            {report.coverLetter.subjectLine}
          </p>
        </div>
      )}

      {/* Preview */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
        {preview}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {new Date(report.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          {report.humanizedLetter?.refinedLetter && (
            <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium">
              Humanized
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy letter
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
    <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
      <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
    <h3 className="font-semibold text-gray-700 mb-1">No cover letters yet</h3>
    <p className="text-sm text-gray-400 mb-6">
      Run an analysis to generate your first tailored cover letter.
    </p>
    <Link
      to="/analyze"
      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Start an analysis
    </Link>
  </div>
);

// ─── Cover letters page ───────────────────────────────────────────────────────
const CoverLettersPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await analysisApi.getReports();
        // Only reports with cover letters
        const withLetters = data.reports.filter(
          (r) => r.status === 'completed'
        );
        setReports(withLetters);
      } catch {
        setError('Failed to load cover letters.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = reports.filter((r) =>
    r.jobData.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
    r.jobData.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Cover Letters">

      {/* Search + stats */}
      {reports.length > 0 && (
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
            />
          </div>
          <p className="text-sm text-gray-500">
            {filtered.length} cover letter{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      ) : reports.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400">No cover letters match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((report) => (
            <CoverLetterCard key={report._id} report={report} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default CoverLettersPage;