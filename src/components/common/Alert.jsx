const Alert = ({ message, type = 'error', onClose }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-500/20 border-red-400/40 text-red-200',
    success: 'bg-green-500/20 border-green-400/40 text-green-200',
    info: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200',
  };

  return (
    <div className={`flex items-start justify-between gap-3 px-4 py-3 rounded-lg border text-sm ${styles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;