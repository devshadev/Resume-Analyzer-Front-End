const KeywordDiff = ({ keywordDiff, keywordGaps }) => {
  return (
    <div className="flex flex-col gap-6">

      {/* Keyword diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Present */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Present in resume
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Keywords from the JD found in your resume
          </p>
          <div className="flex flex-wrap gap-2">
            {keywordDiff?.present?.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100"
              >
                ✓ {keyword}
              </span>
            ))}
            {(!keywordDiff?.present?.length) && (
              <p className="text-sm text-gray-400">No matching keywords found</p>
            )}
          </div>
        </div>

        {/* Missing */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Missing from resume
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            JD keywords not found in your resume
          </p>
          <div className="flex flex-wrap gap-2">
            {keywordDiff?.missing?.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100"
              >
                ✗ {keyword}
              </span>
            ))}
            {(!keywordDiff?.missing?.length) && (
              <p className="text-sm text-gray-400">No missing keywords — great match!</p>
            )}
          </div>
        </div>
      </div>

      {/* Keyword gaps — AI identified */}
      {keywordGaps?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            AI identified keyword gaps
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Important phrases from the JD that should appear in your resume
          </p>
          <div className="flex flex-wrap gap-2">
            {keywordGaps.map((gap) => (
              <span
                key={gap}
                className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-100"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordDiff;