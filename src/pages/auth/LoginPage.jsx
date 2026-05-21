import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '@/store/slices/authSlice';
import {
  selectIsLoading,
  selectAuthError,
  selectIsAuthenticated,
} from '@/store/slices/authSlice';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [githubError, setGithubError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'github_failed') {
      setGithubError('GitHub login failed. Please try again.');
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Enter a valid email';
    if (!formData.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    dispatch(loginUser(formData));
  };

  const EyeIcon = ({ open }) => open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  return (
    <AuthLayout>
      {/* Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-4 border border-white/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-indigo-200 text-sm mt-1">Sign in to your account</p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-8 border border-white/20"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}
      >
        {(error || githubError) && (
          <div className="mb-6">
            <Alert
              message={error || githubError}
              type="error"
              onClose={() => { dispatch(clearError()); setGithubError(''); }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-indigo-100">Email address</label>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className={`
                w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                border bg-white/10 text-white placeholder:text-indigo-300
                focus:ring-2 focus:outline-none backdrop-blur-sm
                ${formErrors.email
                  ? 'border-red-400 bg-red-500/10 focus:ring-red-400/30'
                  : 'border-white/20 focus:ring-indigo-400/40 focus:border-indigo-400/60'
                }
              `}
            />
            {formErrors.email && (
              <p className="text-xs text-red-300">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-indigo-100">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-300 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className={`
                  w-full px-3 py-2.5 pr-10 rounded-lg text-sm transition-all duration-200
                  border bg-white/10 text-white placeholder:text-indigo-300
                  focus:ring-2 focus:outline-none backdrop-blur-sm
                  ${formErrors.password
                    ? 'border-red-400 bg-red-500/10 focus:ring-red-400/30'
                    : 'border-white/20 focus:ring-indigo-400/40 focus:border-indigo-400/60'
                  }
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {formErrors.password && (
              <p className="text-xs text-red-300">{formErrors.password}</p>
            )}
          </div>

          <Button type="submit" isLoading={isLoading} className="mt-1">
            Sign in
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-indigo-300">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* GitHub OAuth */}
        <a
          href={`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/auth/github`}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-white/20 hover:bg-white/10 transition-all text-sm font-medium text-white"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continue with GitHub
        </a>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-indigo-200 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-white font-medium hover:text-indigo-200 transition-colors">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;