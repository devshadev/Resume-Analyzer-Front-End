import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analysisApi } from '@/api/authApi';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoreCard from '@/components/report/ScoreCard';
import KeywordDiff from '@/components/report/KeywordDiff';
import SectionFeedback from '@/components/report/SectionFeedback';
import CoverLetter from '@/components/report/CoverLetter';
import ATSChecks from '@/components/report/ATSChecks';
import RelevantJobs from '../components/report/RelevantJobs';

const ReportPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'overview';
    });

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await analysisApi.getReport(id);
                setReport(data.report);
            } catch {
                setError('Failed to load report.');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout title="Report">
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout title="Report">
                <div className="text-center py-16">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/reports')}
                        className="text-indigo-600 hover:underline"
                    >
                        Back to reports
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'feedback', label: 'Section Feedback' },
        { id: 'keywords', label: 'Keywords' },
        { id: 'ats', label: 'ATS Checks' },
        { id: 'cover-letter', label: 'Cover Letter' },
        { id: 'jobs', label: '🔍 Relevant Jobs' },
    ];

    return (
        <DashboardLayout title={`${report.jobData.jobTitle} — ${report.jobData.company}`}>
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {report.jobData.jobTitle}
                        </h2>
                        <p className="text-gray-500 mt-0.5">{report.jobData.company}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`
                px-2.5 py-0.5 rounded-full text-xs font-medium
                ${report.jobData.mode === 'ats'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'bg-purple-50 text-purple-700'}
              `}>
                                {report.jobData.mode === 'ats' ? 'ATS Optimized' : 'Human Optimized'}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                {report.jobData.experienceLevel}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Score badges */}
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className={`
                text-3xl font-bold
                ${report.matchScore >= 70 ? 'text-green-600'
                                    : report.matchScore >= 50 ? 'text-amber-500'
                                        : 'text-red-500'}
              `}>
                                {report.matchScore}%
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Match score</p>
                        </div>
                        <div className="w-px h-10 bg-gray-100" />
                        <div className="text-center">
                            <div className={`
                text-3xl font-bold
                ${report.atsScore >= 70 ? 'text-green-600'
                                    : report.atsScore >= 50 ? 'text-amber-500'
                                        : 'text-red-500'}
              `}>
                                {report.atsScore}%
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">ATS score</p>
                        </div>
                    </div>
                </div>

                {/* Overall summary */}
                {report.overallSummary && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {report.overallSummary}
                        </p>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
              ${activeTab === tab.id
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'}
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ScoreCard
                        matchScore={report.matchScore}
                        atsScore={report.atsScore}
                        matchDetails={report.matchDetails}
                    />
                    <div className="flex flex-col gap-4">
                        {/* Strengths */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                Top Strengths
                            </h3>
                            <ul className="flex flex-col gap-2">
                                {report.topStrengths?.map((strength, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {strength}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Critical issues */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                Critical Issues
                            </h3>
                            <ul className="flex flex-col gap-2">
                                {report.criticalIssues?.map((issue, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'feedback' && (
                <SectionFeedback feedback={report.sectionFeedback} />
            )}

            {activeTab === 'keywords' && (
                <KeywordDiff
                    keywordDiff={report.keywordDiff}
                    keywordGaps={report.keywordGaps}
                />
            )}

            {activeTab === 'ats' && (
                <ATSChecks checks={report.atsChecks} score={report.atsScore} />
            )}

            {activeTab === 'cover-letter' && (
                <CoverLetter
                    coverLetter={report.coverLetter}
                    humanizedLetter={report.humanizedLetter}
                />
            )}
            {activeTab === 'jobs' && (
                <RelevantJobs reportId={report._id} />
            )}
        </DashboardLayout>
    );
};

export default ReportPage;