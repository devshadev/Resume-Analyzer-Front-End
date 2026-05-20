const Input = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-indigo-100">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error
              ? 'border border-red-400 bg-red-500/10 text-white placeholder:text-red-300 focus:ring-2 focus:ring-red-400/30'
              : 'border border-white/20 bg-white/10 text-white placeholder:text-indigo-300 focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400/60'
            }
            outline-none backdrop-blur-sm
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-300 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;