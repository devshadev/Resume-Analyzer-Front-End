const ScoreRing = ({ score, label, color }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="8"
          />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-800">{score}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  );
};

const ScoreBar = ({ label, value, color }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}%</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const ScoreCard = ({ matchScore, atsScore, matchDetails }) => {
  const matchColor = matchScore >= 70 ? '#22c55e' : matchScore >= 50 ? '#f59e0b' : '#ef4444';
  const atsColor = atsScore >= 70 ? '#22c55e' : atsScore >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-800 mb-6">Score breakdown</h3>

      {/* Score rings */}
      <div className="flex items-center justify-around mb-8">
        <ScoreRing score={matchScore} label="JD Match" color={matchColor} />
        <ScoreRing score={atsScore}   label="ATS Score" color={atsColor} />
      </div>

      {/* Score bars */}
      <div className="flex flex-col gap-4">
        <ScoreBar
          label="Keyword match"
          value={matchDetails?.keywordScore || 0}
          color="#6366f1"
        />
        <ScoreBar
          label="Section coverage"
          value={matchDetails?.sectionScore || 0}
          color="#8b5cf6"
        />
        <ScoreBar
          label="Required skills"
          value={matchDetails?.skillScore || 0}
          color="#a78bfa"
        />
      </div>

      {/* Sections found */}
      {matchDetails?.sectionsFound?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Sections detected</p>
          <div className="flex flex-wrap gap-2">
            {matchDetails.sectionsFound.map((section) => (
              <span
                key={section}
                className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full capitalize"
              >
                {section}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreCard;