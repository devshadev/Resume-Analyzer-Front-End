import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { analysisApi } from '@/api/authApi';
import DashboardLayout from '@/components/layout/DashboardLayout';

// ─── Score badge ──────────────────────────────────────────────────────────────
const ScoreBadge = ({ score }) => (
  <span className={`
    px-2.5 py-1 rounded-full text-xs font-semibold
    ${score >= 70 ? 'bg-green-50 text-green-700'
      : score >= 50 ? 'bg-amber-50 text-amber-700'
      : 'bg-red-50 text-red-700'}
  `}>
    {score}%
  </span>
);

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span className={`
    px-2.5 py-1 rounded-full text-xs font-medium
    ${status === 'completed' ? 'bg-green-50 text-green-700'
      : status === 'processing' ? 'bg-indigo-50 text-indigo-700'
      : 'bg-red-50 text-red-700'}
  `}>
    {status === 'completed' ? 'Completed'
      : status === 'processing' ? 'Processing'
      : 'Failed'}
  </span>
);

// ─── Report card ──────────────────────────────────────────────────────────────
const ReportCard = ({ report, onDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this report? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await analysisApi.deleteReport(report._id);
      onDelete(report._id);
    } catch {
      alert('Failed to delete report.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/reports/${report._id}`)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-100 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Job title + company */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
              {report.jobData.jobTitle}
            </h3>
            <StatusBadge status={report.status} />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{report.jobData.company}</p>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span className={`
              px-2 py-0.5 rounded-full text-xs font-medium
              ${report.jobData.mode === 'ats'
                ? 'bg-indigo-50 text-indigo-600'
                : 'bg-purple-50 text-purple-600'}
            `}>
              {report.jobData.mode === 'ats' ? 'ATS' : 'Human'}
            </span>
            <span className="text-xs text-gray-400">
              {report.resumeMetadata?.fileName}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(report.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Scores */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Match</span>
            <ScoreBadge score={report.matchScore} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">ATS</span>
            <ScoreBadge score={report.atsScore} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
        <Link
          to={`/reports/${report._id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          View full report →
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete'}
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="font-semibold text-gray-700 mb-1">No reports yet</h3>
    <p className="text-sm text-gray-400 mb-6">
      Run your first analysis to see your reports here.
    </p>
    <Link
      to="/analyze"
      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Start your first analysis
    </Link>
  </div>
);

// ─── Reports page ─────────────────────────────────────────────────────────────
const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await analysisApi.getReports();
        setReports(data.reports);
      } catch {
        setError('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDelete = (id) => {
    setReports((prev) => prev.filter((r) => r._id !== id));
  };

  const filtered = reports
    .filter((r) => {
      if (filter === 'all') return true;
      if (filter === 'ats') return r.jobData.mode === 'ats';
      if (filter === 'human') return r.jobData.mode === 'human';
      if (filter === 'high') return r.matchScore >= 70;
      if (filter === 'low') return r.matchScore < 70;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'highest') return b.matchScore - a.matchScore;
      if (sortBy === 'lowest') return a.matchScore - b.matchScore;
      return 0;
    });

  return (
    <DashboardLayout title="My Reports">

      {/* Stats bar */}
      {reports.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total reports', value: reports.length },
            {
              label: 'Avg match score',
              value: `${Math.round(reports.reduce((sum, r) => sum + r.matchScore, 0) / reports.length)}%`,
            },
            {
              label: 'High matches',
              value: reports.filter((r) => r.matchScore >= 70).length,
            },
            {
              label: 'ATS optimized',
              value: reports.filter((r) => r.jobData.mode === 'ats').length,
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters + sort */}
      {reports.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'ats', label: 'ATS' },
              { id: 'human', label: 'Human' },
              { id: 'high', label: 'High match' },
              { id: 'low', label: 'Low match' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                  ${filter === f.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'}
                `}
              >
                {f.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest match</option>
            <option value="lowest">Lowest match</option>
          </select>
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
      ) : filtered.length === 0 && reports.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400">No reports match the selected filter.</p>
        </div>
      ) : reports.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ReportsPage;