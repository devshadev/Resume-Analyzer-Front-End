import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';
import { logoutUser } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/api/authApi';

const SettingsPage = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);
    try {
      await api.put('/auth/profile', profileForm);
      setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      setProfileMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update profile.',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update password.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.email) return;
    setDeleteLoading(true);
    try {
      await api.delete('/auth/account');
      await dispatch(logoutUser());
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const inputClass = `
    w-full px-3 py-2.5 rounded-lg text-sm border border-gray-200
    focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400
    focus:outline-none bg-white text-gray-800 placeholder:text-gray-400
  `;

  const tabs = [
    { id: 'profile',  label: 'Profile' },
    { id: 'password', label: 'Password' },
    { id: 'danger',   label: 'Danger zone' },
  ];

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto">

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'}
                ${tab.id === 'danger' && activeTab !== 'danger' ? 'hover:text-red-500' : ''}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-1">Profile information</h3>
            <p className="text-sm text-gray-500 mb-6">Update your name and email address.</p>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-indigo-600">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                {user?.githubUsername && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    GitHub: @{user.githubUsername}
                  </p>
                )}
              </div>
            </div>

            {profileMessage && (
              <div className={`
                mb-4 px-4 py-3 rounded-lg text-sm
                ${profileMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-700 border border-red-100'}
              `}>
                {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Full name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={profileLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
              >
                {profileLoading ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>
        )}

        {/* Password tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-1">Change password</h3>
            <p className="text-sm text-gray-500 mb-6">
              {user?.githubId && !user?.passwordHash
                ? 'You signed in with GitHub. Set a password to also enable email login.'
                : 'Update your password. You will need your current password.'}
            </p>

            {passwordMessage && (
              <div className={`
                mb-4 px-4 py-3 rounded-lg text-sm
                ${passwordMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-700 border border-red-100'}
              `}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Current password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">New password</label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Confirm new password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
              >
                {passwordLoading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </div>
        )}

        {/* Danger zone tab */}
        {activeTab === 'danger' && (
          <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6">
            <h3 className="font-semibold text-red-600 mb-1">Danger zone</h3>
            <p className="text-sm text-gray-500 mb-6">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>

            <div className="p-4 bg-red-50 rounded-lg border border-red-100 mb-4">
              <p className="text-sm text-red-700 font-medium mb-1">
                This will permanently delete:
              </p>
              <ul className="text-sm text-red-600 flex flex-col gap-1">
                <li>• Your account and profile</li>
                <li>• All resume analyses and reports</li>
                <li>• All generated cover letters</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Type your email address to confirm:
                  <span className="text-red-500 ml-1 font-normal">{user?.email}</span>
                </label>
                <input
                  type="email"
                  placeholder={user?.email}
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== user?.email || deleteLoading}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Deleting...' : 'Permanently delete account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;