import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  Wallet,
  Lock,
  KeyRound,
  CheckCircle2,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface Props {
  initialTab?: 'profile' | 'wallet' | 'password' | 'txpassword';
}

export const UserProfilePage: React.FC<Props> = ({ initialTab = 'profile' }) => {
  const location = useLocation();

  const getTabFromPath = () => {
    if (location.pathname.includes('wallet-address')) return 'wallet';
    if (location.pathname.includes('change-password')) return 'password';
    if (location.pathname.includes('change-transaction-password')) return 'txpassword';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState<'profile' | 'wallet' | 'password' | 'txpassword'>(getTabFromPath());
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  // Profile state
  const [profile, setProfile] = useState({
    username: 'OAI901248',
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.crypto@gmail.com',
    phone: '+1 (555) 234-8900',
    country: 'United States',
    address: '742 Evergreen Terrace',
    sponsor: 'sponsor_pro'
  });

  // Wallet state
  const [walletAddress, setWalletAddress] = useState('0x8b329Fe470Db40b1Fa15Eb52b4EbE17429d20c57');

  // Password states
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [txPasswords, setTxPasswords] = useState({ current: '', newPass: '', confirm: '' });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessAlert('Personal profile details updated successfully!');
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  const handleSaveWallet = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessAlert('USDT BEP-20 payout wallet address updated and verified successfully!');
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      alert('New password and confirmation do not match!');
      return;
    }
    setSuccessAlert('Account login password successfully changed!');
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  const handleSaveTxPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (txPasswords.newPass !== txPasswords.confirm) {
      alert('New transaction password and confirmation do not match!');
      return;
    }
    setSuccessAlert('Financial transaction authorization password updated successfully!');
    setTxPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/user/dashboard" className="hover:text-emerald-700">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Profile & Settings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Account Profile & Security</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your personal data, BEP-20 payout destination, login credentials, and transaction authorization.
          </p>
        </div>
      </div>

      {successAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          {successAlert}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'profile' ? 'bg-emerald-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" /> Personal Profile
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'wallet' ? 'bg-emerald-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" /> USDT BEP-20 Wallet Address
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'password' ? 'bg-emerald-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" /> Change Login Password
        </button>
        <button
          onClick={() => setActiveTab('txpassword')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'txpassword' ? 'bg-emerald-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-4 h-4" /> Transaction Password
        </button>
      </div>

      {/* Tab 1: Personal Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Your registered member details in the OpenAid community.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800">
              ID: {profile.username}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Introduced by Sponsor
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={profile.sponsor}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: USDT BEP-20 Wallet */}
      {activeTab === 'wallet' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">USDT BEP-20 Payout Wallet Address</h2>
              <p className="text-xs text-slate-500">Destination address for all USDT withdrawals and cashouts.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
              BNB Smart Chain
            </span>
          </div>

          <form onSubmit={handleSaveWallet} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Your BEP-20 Wallet Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
                placeholder="0x..."
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-200 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-900 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Security Instructions:
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Only input a valid BNB Smart Chain (BEP-20) address.</li>
                <li>Do NOT use exchange deposit addresses that have minimum deposit thresholds higher than your cashout.</li>
                <li>Recommended wallets: MetaMask, Trust Wallet, Binance Web3 Wallet, SafePal.</li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {walletAddress && (
                <a
                  href={`https://bscscan.com/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline"
                >
                  Verify on BscScan <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20"
              >
                Update Wallet Address
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Change Password */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Change Account Login Password</h2>
            <p className="text-xs text-slate-500">Update your security password for logging into OpenAid.</p>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-4 text-xs sm:text-sm max-w-lg">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md shadow-emerald-950/20"
              >
                Update Login Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Transaction Password */}
      {activeTab === 'txpassword' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Change Transaction Password</h2>
            <p className="text-xs text-slate-500">Secondary authorization PIN required for withdrawals and credit transfers.</p>
          </div>

          <form onSubmit={handleSaveTxPassword} className="space-y-4 text-xs sm:text-sm max-w-lg">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Transaction Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={txPasswords.current}
                onChange={(e) => setTxPasswords({ ...txPasswords, current: e.target.value })}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Transaction Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={txPasswords.newPass}
                onChange={(e) => setTxPasswords({ ...txPasswords, newPass: e.target.value })}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Transaction Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={txPasswords.confirm}
                onChange={(e) => setTxPasswords({ ...txPasswords, confirm: e.target.value })}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20"
              >
                Update Transaction Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default UserProfilePage;
