const ATSChecks = ({ checks, score }) => {
  const passed = checks?.filter((c) => c.passed).length || 0;
  const total = checks?.length || 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Score summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800">ATS Compatibility</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {passed} of {total} checks passed
            </p>
          </div>
          <div className={`
            text-4xl font-bold
            ${score >= 70 ? 'text-green-600'
              : score >= 50 ? 'text-amber-500'
              : 'text-red-500'}
          `}>
            {score}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`
              h-full rounded-full transition-all duration-700
              ${score >= 70 ? 'bg-green-500'
                : score >= 50 ? 'bg-amber-500'
                : 'bg-red-500'}
            `}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Status message */}
        <p className={`
          text-sm mt-3 font-medium
          ${score >= 70 ? 'text-green-600'
            : score >= 50 ? 'text-amber-600'
            : 'text-red-600'}
        `}>
          {score >= 70
            ? '✓ Your resume is ATS-friendly'
            : score >= 50
              ? '⚠ Some ATS issues need attention'
              : '✗ Significant ATS issues detected'}
        </p>
      </div>

      {/* Checks list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Detailed checks</h3>
        <div className="flex flex-col gap-3">
          {checks?.map((check, i) => (
            <div
              key={i}
              className={`
                flex items-start gap-4 p-4 rounded-lg border transition-all
                ${check.passed
                  ? 'bg-green-50 border-green-100'
                  : 'bg-red-50 border-red-100'}
              `}
            >
              {/* Icon */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${check.passed ? 'bg-green-100' : 'bg-red-100'}
              `}>
                {check.passed ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${check.passed ? 'text-green-800' : 'text-red-800'}`}>
                  {check.name}
                </p>
                <p className={`text-xs mt-0.5 ${check.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {check.detail}
                </p>
              </div>

              {/* Badge */}
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-medium shrink-0
                ${check.passed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'}
              `}>
                {check.passed ? 'Pass' : 'Fail'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATSChecks;