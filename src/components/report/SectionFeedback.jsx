const ScoreBar = ({ score }) => {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Strong' : score >= 60 ? 'Good' : 'Needs work';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600 w-16 text-right">
        {score}% · {label}
      </span>
    </div>
  );
};

const SectionCard = ({ section }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">{section.section}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Section analysis</p>
        </div>
        <span className={`
          px-2.5 py-1 rounded-full text-xs font-medium
          ${section.score >= 80 ? 'bg-green-50 text-green-700'
            : section.score >= 60 ? 'bg-amber-50 text-amber-700'
            : 'bg-red-50 text-red-700'}
        `}>
          {section.score >= 80 ? 'Strong' : section.score >= 60 ? 'Good' : 'Needs work'}
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-4">
        <ScoreBar score={section.score} />
      </div>

      {/* Feedback */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {section.feedback}
      </p>

      {/* Suggestions */}
      {section.suggestions?.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Suggestions
          </p>
          <ul className="flex flex-col gap-2">
            {section.suggestions.map((suggestion, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-gray-600"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-indigo-600 font-medium">{i + 1}</span>
                </div>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SectionFeedback = ({ feedback }) => {
  if (!feedback?.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-gray-400">No section feedback available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedback.map((section) => (
          <SectionCard key={section.section} section={section} />
        ))}
      </div>
    </div>
  );
};

export default SectionFeedback;