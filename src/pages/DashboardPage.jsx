import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';
import { Link } from 'react-router-dom';
import { analysisApi } from '@/api/authApi';

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, loading }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center gap-4 shadow-sm">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      {loading ? (
        <div className="w-12 h-7 bg-gray-100 rounded animate-pulse mb-1" />
      ) : (
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      )}
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

// ─── Quick action card ────────────────────────────────────────────────────────
const ActionCard = ({ title, description, icon, to, color }) => (
  <Link
    to={to}
    className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 group"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
      {icon}
    </div>
    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
      {title}
    </h3>
    <p className="text-sm text-gray-500">{description}</p>
  </Link>
);

// ─── Recent report row ────────────────────────────────────────────────────────
const RecentReportRow = ({ report }) => (
  <Link
    to={`/reports/${report._id}`}
    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group"
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
          {report.jobData.jobTitle}
        </p>
        <p className="text-xs text-gray-400">{report.jobData.company}</p>
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <span className={`
        px-2.5 py-1 rounded-full text-xs font-semibold
        ${report.matchScore >= 70 ? 'bg-green-50 text-green-700'
          : report.matchScore >= 50 ? 'bg-amber-50 text-amber-700'
          : 'bg-red-50 text-red-700'}
      `}>
        {report.matchScore}%
      </span>
      <span className="text-xs text-gray-400">
        {new Date(report.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}
      </span>
    </div>
  </Link>
);

// ─── Dashboard page ───────────────────────────────────────────────────────────
const DashboardPage = () => {
  const user = useSelector(selectUser);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await analysisApi.getReports();
        setReports(data.reports);
      } catch {
        // fail silently — dashboard still works without stats
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Compute stats from real data
  const totalAnalyses = reports.length;
  const completedReports = reports.filter((r) => r.status === 'completed');
  const avgMatchScore = completedReports.length > 0
    ? Math.round(completedReports.reduce((sum, r) => sum + r.matchScore, 0) / completedReports.length)
    : null;
  const coverLetters = completedReports.length;
  const recentReports = completedReports.slice(0, 5);

  const stats = [
    {
      label: 'Total analyses',
      value: totalAnalyses,
      color: 'bg-indigo-50',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Cover letters',
      value: coverLetters,
      color: 'bg-purple-50',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Avg match score',
      value: avgMatchScore !== null ? `${avgMatchScore}%` : 'N/A',
      color: 'bg-green-50',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'High matches',
      value: completedReports.filter((r) => r.matchScore >= 70).length,
      color: 'bg-amber-50',
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  const actions = [
    {
      title: 'Analyze a resume',
      description: 'Upload your resume and match it against a job description',
      to: '/analyze',
      color: 'bg-indigo-50',
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      title: 'View my reports',
      description: 'Browse your past analyses and track your progress',
      to: '/reports',
      color: 'bg-purple-50',
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Cover letters',
      description: 'View and manage your generated cover letters',
      to: '/cover-letters',
      color: 'bg-green-50',
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-gray-500 mt-1">
          Here's an overview of your resume analysis activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} loading={loading} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Quick actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Recent analyses</h3>
          {recentReports.length > 0 && (
            <Link
              to="/reports"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              View all →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="p-6 flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-gray-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentReports.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">No analyses yet</h3>
            <p className="text-sm text-gray-400 mb-4">
              Start by analyzing your first resume against a job description.
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
        ) : (
          <div className="p-2">
            {recentReports.map((report) => (
              <RecentReportRow key={report._id} report={report} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;