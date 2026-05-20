import { useState } from 'react';

const CoverLetter = ({ coverLetter, humanizedLetter }) => {
  const [activeVersion, setActiveVersion] = useState('humanized');
  const [showReasoning, setShowReasoning] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = activeVersion === 'humanized'
      ? humanizedLetter?.refinedLetter
      : coverLetter?.paragraphs?.map((p) => p.text).join('\n\n');

    navigator.clipboard.writeText(text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Version toggle + copy */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveVersion('humanized')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeVersion === 'humanized'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            Humanized version
          </button>
          <button
            onClick={() => setActiveVersion('original')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeVersion === 'original'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            Original with reasoning
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy letter
            </>
          )}
        </button>
      </div>

      {/* Subject line */}
      {coverLetter?.subjectLine && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs font-medium text-indigo-500 uppercase tracking-wider mb-1">
            Suggested subject line
          </p>
          <p className="text-sm font-medium text-indigo-800">
            {coverLetter.subjectLine}
          </p>
        </div>
      )}

      {/* Humanized version */}
      {activeVersion === 'humanized' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Humanized cover letter</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                AI clichés removed · Voice preserved · Ready to use
              </p>
            </div>
            <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
              Recommended
            </span>
          </div>

          {/* Changes made */}
          {humanizedLetter?.changesMade?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {humanizedLetter.changesMade.map((change, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100"
                >
                  ✓ {change}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg p-5 border border-gray-100">
              {humanizedLetter?.refinedLetter}
            </div>
          </div>
        </div>
      )}

      {/* Original with reasoning */}
      {activeVersion === 'original' && (
        <div className="flex flex-col gap-4">
          {coverLetter?.paragraphs?.map((paragraph, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Paragraph {i + 1}
                </span>
                <button
                  onClick={() => setShowReasoning(showReasoning === i ? null : i)}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {showReasoning === i ? 'Hide reasoning' : 'Why was this written?'}
                </button>
              </div>

              {/* Reasoning */}
              {showReasoning === i && (
                <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <p className="text-xs font-medium text-indigo-600 mb-1">
                    Why this paragraph was written:
                  </p>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    {paragraph.reasoning}
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-700 leading-relaxed">
                {paragraph.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoverLetter;