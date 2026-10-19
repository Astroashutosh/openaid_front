import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { GeneralSettingsProvider } from './context/GeneralSettingsContext';

// Admin Layout & Pages
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PackagesPage } from './pages/admin/PackagesPage';
import { CreditsPage } from './pages/admin/CreditsPage';
import { MembersPage } from './pages/admin/MembersPage';
import { MemberProfilePage } from './pages/admin/MemberProfilePage';
import { MemberUpdateProfilePage } from './pages/admin/MemberUpdateProfilePage';
import { DepositsPage } from './pages/admin/DepositsPage';
import { RankRewardsPage } from './pages/admin/RankRewardsPage';
import { WithdrawalsPage } from './pages/admin/WithdrawalsPage';
import { PurchaseDonationPage } from './pages/admin/PurchaseDonationPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { ProtocolFeeReportPage } from './pages/admin/ProtocolFeeReportPage';
import { WeeklyReportPage } from './pages/admin/WeeklyReportPage';
import { AcademyAdminPage } from './pages/admin/AcademyAdminPage';
import { BannerAdminPage } from './pages/admin/BannerAdminPage';
import { AnnouncementsAdminPage } from './pages/admin/AnnouncementsAdminPage';
import { SupportAdminPage } from './pages/admin/SupportAdminPage';
import { BusinessMaterialPage } from './pages/admin/BusinessMaterialPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { ChangePasswordPage } from './pages/admin/ChangePasswordPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';




// User (Member Portal) Layout & Pages
import { UserLayout } from './layouts/UserLayout';
import { UserDashboard } from './pages/user/UserDashboard';
import { UserWalletPage } from './pages/user/UserWalletPage';
import { UserTransferToDepositPage } from './pages/user/UserTransferToDepositPage';
import { UserDepositPage } from './pages/user/UserDepositPage';
import { UserDepositHistoryPage } from './pages/user/UserDepositHistoryPage';
import { UserMakeDonationPage } from './pages/user/UserMakeDonationPage';
import { UserMakeDonationOverviewPage } from './pages/user/UserMakeDonationOverviewPage';
import { UserReceiveDonationPage } from './pages/user/UserReceiveDonationPage';
import { UserSendDonationsPage } from './pages/user/UserSendDonationsPage';
import { UserQueueTrackerPage } from './pages/user/UserQueueTrackerPage';
import { UserRecommitmentPage } from './pages/user/UserRecommitmentPage';
import { UserRecommitOverviewPage } from './pages/user/UserRecommitOverviewPage';
import { UserEpinsPage } from './pages/user/UserEpinsPage';
import { UserBuyEpinsPage } from './pages/user/UserBuyEpinsPage';
import { UserBuyEpinOverviewPage } from './pages/user/UserBuyEpinOverviewPage';
import { UserTransferEpinPage } from './pages/user/UserTransferEpinPage';
import { UserPurchasedEpinsPage } from './pages/user/UserPurchasedEpinsPage';
import { UserMyReferralsPage } from './pages/user/UserMyReferralsPage';
import { UserGenealogyPage } from './pages/user/UserGenealogyPage';
import { UserWithdrawPage } from './pages/user/UserWithdrawPage';
import { UserWithdrawReportPage } from './pages/user/UserWithdrawReportPage';
import { UserEarningsPage } from './pages/user/UserEarningsPage';
import { UserRankRewardsPage } from './pages/user/UserRankRewardsPage';
import { UserEcosystemPage } from './pages/user/UserEcosystemPage';
import { UserAcademyPage } from './pages/user/UserAcademyPage';
import { UserAcademyCoursePage } from './pages/user/UserAcademyCoursePage';
import { UserAnnouncementsPage } from './pages/user/UserAnnouncementsPage';
import { UserBusinessMaterialPage } from './pages/user/UserBusinessMaterialPage';
import { UserSupportPage } from './pages/user/UserSupportPage';
import { UserProfilePage } from './pages/user/UserProfilePage';

// Public Front Pages
import { HomePage } from './pages/front/HomePage';
import { LoginPage } from './pages/front/LoginPage';
import { RegisterPage } from './pages/front/RegisterPage';
import { ForgotPasswordPage } from './pages/front/ForgotPasswordPage';
import { UserResetPasswordPage } from './pages/front/UserResetPasswordPage';

import TestimonialsPage from './pages/front/TestimonialsPage';
import Disclaimer from './pages/front/Disclaimer';

// User Auth Context & Route Guards
import { UserAuthProvider } from './context/UserAuthContext';
import { UserProtectedRoute } from './components/common/UserProtectedRoute';
import { UserPublicRoute } from './components/common/UserPublicRoute';

// Admin Auth Pages & Protection (Matching Laravel backoffice and admin-reset URL patterns)
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminProtectedRoute } from './components/common/AdminProtectedRoute';
import { AdminPublicRoute } from './components/common/AdminPublicRoute';
import { AdminLoginPage } from './pages/admin/auth/AdminLoginPage';
import { AdminForgotPasswordPage } from './pages/admin/auth/AdminForgotPasswordPage';
import { AdminResetPasswordPage } from './pages/admin/auth/AdminResetPasswordPage';
import { useLocation } from 'react-router-dom';
import React, { useLayoutEffect } from 'react';
import TestimonialsCMS from './pages/admin/TestimonialsCMS';
import DisclaimerCMS from './pages/admin/DisclaimerCMS';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

function App() {
  return (
    <GeneralSettingsProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <UserAuthProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
              {/* =========================================
                  1. USER (MEMBER) PORTAL ROUTES (PROTECTED)
                  ========================================= */}
              <Route element={<UserProtectedRoute />}>
                <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />

            {/* Wallets & Balance */}
            <Route path="my-wallet" element={<UserWalletPage />} />
            <Route path="transfer-to-deposit" element={<UserTransferToDepositPage />} />

            {/* Donate Now (Deposits) */}
            <Route path="deposit-fund" element={<UserDepositPage />} />
            <Route path="deposit/history" element={<UserDepositHistoryPage />} />

            {/* FIFO Protocol (2:1 Engine) */}
            <Route path="make-donation" element={<UserMakeDonationPage />} />
            <Route path="make-donation/overview" element={<UserMakeDonationOverviewPage />} />
            <Route path="make-donation/overview/:id" element={<UserMakeDonationOverviewPage />} />
            <Route path="receive-donation" element={<UserReceiveDonationPage />} />
            <Route path="send-donations" element={<UserSendDonationsPage />} />
            <Route path="live-queue-tracker" element={<UserQueueTrackerPage />} />
            <Route path="queue-tracker" element={<UserQueueTrackerPage />} />
            <Route path="recommitment" element={<UserRecommitmentPage />} />
            <Route path="recommitment/overview" element={<UserRecommitOverviewPage />} />
            <Route path="recommitment/overview/:id" element={<UserRecommitOverviewPage />} />

            {/* Credits System */}
            <Route path="my-epins" element={<UserEpinsPage />} />
            <Route path="buy-epins" element={<UserBuyEpinsPage />} />
            <Route path="buy-epins/overview" element={<UserBuyEpinOverviewPage />} />
            <Route path="buy-epins/overview/:id" element={<UserBuyEpinOverviewPage />} />
            <Route path="transfer-epin" element={<UserTransferEpinPage />} />
            <Route path="my-purchased-epins" element={<UserPurchasedEpinsPage />} />

            {/* Network */}
            <Route path="my-referrals" element={<UserMyReferralsPage />} />
            <Route path="genealogy-view" element={<UserGenealogyPage />} />

            {/* Withdrawals */}
            <Route path="withdraw-usdt" element={<UserWithdrawPage />} />
            <Route path="withdrawal-report" element={<UserWithdrawReportPage />} />

            {/* Earnings & Reports */}
            <Route path="transactions" element={<UserEarningsPage initialTab="transactions" />} />
            <Route path="referral-income" element={<UserEarningsPage initialTab="referral" />} />
            <Route path="level-income" element={<UserEarningsPage initialTab="level" />} />
            <Route path="donation-earnings" element={<UserEarningsPage initialTab="donation" />} />

            {/* Rank Rewards */}
            <Route path="ranks" element={<UserRankRewardsPage />} />
            <Route path="rank-reward" element={<UserRankRewardsPage />} />
            <Route path="claim-rewards" element={<UserRankRewardsPage />} />

            {/* Ecosystem & Academy */}
            <Route path="academy" element={<UserAcademyPage />} />
            <Route path="academy/course/:slug" element={<UserAcademyCoursePage />} />
            <Route path="openaid-token" element={<UserEcosystemPage moduleType="token" />} />
            <Route path="market" element={<UserEcosystemPage moduleType="market" />} />
            <Route path="jobs" element={<UserEcosystemPage moduleType="bot" />} />
            <Route path="news-events" element={<UserEcosystemPage moduleType="news" />} />
            <Route path="announcements" element={<UserAnnouncementsPage />} />
            <Route path="business-material" element={<UserBusinessMaterialPage />} />
            <Route path="support" element={<UserSupportPage />} />

            {/* Profile & Security */}
            <Route path="profile" element={<UserProfilePage initialTab="profile" />} />
            <Route path="wallet-address" element={<UserProfilePage initialTab="wallet" />} />
            <Route path="change-password" element={<UserProfilePage initialTab="password" />} />
            <Route path="change-transaction-password" element={<UserProfilePage initialTab="txpassword" />} />
          </Route>
        </Route>

          {/* User Legacy URL Redirects for Direct Link Parity */}
          <Route path="/home" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/my-wallet" element={<Navigate to="/user/my-wallet" replace />} />
          <Route path="/transfer-to-deposit" element={<Navigate to="/user/transfer-to-deposit" replace />} />
          <Route path="/deposit-fund" element={<Navigate to="/user/deposit-fund" replace />} />
          <Route path="/deposit/history" element={<Navigate to="/user/deposit/history" replace />} />
          <Route path="/make-donation" element={<Navigate to="/user/make-donation" replace />} />
          <Route path="/make-donation/overview" element={<Navigate to="/user/make-donation/overview" replace />} />
          <Route path="/make-donation/overview/:id" element={<Navigate to="/user/make-donation/overview" replace />} />
          <Route path="/receive-donation" element={<Navigate to="/user/receive-donation" replace />} />
          <Route path="/send-donations" element={<Navigate to="/user/send-donations" replace />} />
          <Route path="/live-queue-tracker" element={<Navigate to="/user/live-queue-tracker" replace />} />
          <Route path="/queue-tracker" element={<Navigate to="/user/live-queue-tracker" replace />} />
          <Route path="/recommitment" element={<Navigate to="/user/recommitment" replace />} />
          <Route path="/recommitment/overview" element={<Navigate to="/user/recommitment/overview" replace />} />
          <Route path="/recommitment/overview/:id" element={<Navigate to="/user/recommitment/overview" replace />} />
          <Route path="/my-epins" element={<Navigate to="/user/my-epins" replace />} />
          <Route path="/buy-epins" element={<Navigate to="/user/buy-epins" replace />} />
          <Route path="/buy-epins/overview" element={<Navigate to="/user/buy-epins/overview" replace />} />
          <Route path="/buy-epins/overview/:id" element={<Navigate to="/user/buy-epins/overview" replace />} />
          <Route path="/transfer-epin" element={<Navigate to="/user/transfer-epin" replace />} />
          <Route path="/my-purchased-epins" element={<Navigate to="/user/my-purchased-epins" replace />} />
          <Route path="/my-referrals" element={<Navigate to="/user/my-referrals" replace />} />
          <Route path="/genealogy-view" element={<Navigate to="/user/genealogy-view" replace />} />
          <Route path="/withdraw-usdt" element={<Navigate to="/user/withdraw-usdt" replace />} />
          <Route path="/withdrawal-report" element={<Navigate to="/user/withdrawal-report" replace />} />
          <Route path="/transactions" element={<Navigate to="/user/transactions" replace />} />
          <Route path="/referral-income" element={<Navigate to="/user/referral-income" replace />} />
          <Route path="/level-income" element={<Navigate to="/user/level-income" replace />} />
          <Route path="/donation-earnings" element={<Navigate to="/user/donation-earnings" replace />} />
          <Route path="/ranks" element={<Navigate to="/user/ranks" replace />} />
          <Route path="/rank-reward" element={<Navigate to="/user/ranks" replace />} />
          <Route path="/claim-rewards" element={<Navigate to="/user/claim-rewards" replace />} />
          <Route path="/academy" element={<Navigate to="/user/academy" replace />} />
          <Route path="/academy/course/:slug" element={<UserAcademyCoursePage />} />
          <Route path="/profile" element={<Navigate to="/user/profile" replace />} />
          <Route path="/wallet-address" element={<Navigate to="/user/wallet-address" replace />} />

          {/* =========================================
              2. ADMIN AUTH & BACKOFFICE PORTAL ROUTES
              ========================================= */}
          {/* Admin Guest / Public Auth Routes */}
          <Route element={<AdminPublicRoute />}>
            <Route path="/backoffice" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin-reset" element={<AdminForgotPasswordPage />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
            <Route path="/admin-reset-password/:token" element={<AdminResetPasswordPage />} />
            <Route path="/admin/reset-password/:token" element={<AdminResetPasswordPage />} />
          </Route>

          {/* Admin Protected Backoffice Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="home" element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />


             <Route  path="/admin/cms" element={<TestimonialsCMS />}/>
  <Route
    path="/admin/disclaimer"
    element={<DisclaimerCMS />}
  />


              {/* 2. Packages */}
              <Route path="packages" element={<Navigate to="/admin/packages/donations" replace />} />
              <Route path="packages/donations" element={<PackagesPage />} />
              <Route path="packages/credits" element={<PackagesPage />} />
              <Route path="minting/packages" element={<Navigate to="/admin/packages/donations" replace />} />
              <Route path="epin/packages" element={<Navigate to="/admin/packages/credits" replace />} />
              <Route path="add-package" element={<Navigate to="/admin/packages/donations?action=add" replace />} />

              {/* 3. Credits */}
              <Route path="credits/generated" element={<CreditsPage />} />
              <Route path="credits/transfer" element={<CreditsPage />} />
              <Route path="credits/used" element={<CreditsPage />} />

              {/* 4. Members */}
              <Route path="members/active" element={<MembersPage />} />
              <Route path="members/inactive" element={<MembersPage />} />
              <Route path="members/blocked" element={<MembersPage />} />
              <Route path="members/suspended" element={<MembersPage />} />
              <Route path="profile/:id" element={<MemberProfilePage />} />
              <Route path="update-profile/:id" element={<MemberUpdateProfilePage />} />


              {/* 5. Donate Now (Deposits) */}
              <Route path="deposits/pending" element={<DepositsPage />} />
              <Route path="deposits/all" element={<DepositsPage />} />

              {/* 6. Rank Rewards */}
              <Route path="rank-rewards/pending" element={<RankRewardsPage />} />
              <Route path="rank-rewards/unclaimed" element={<RankRewardsPage />} />
              <Route path="rank-rewards/approved" element={<RankRewardsPage />} />
              <Route path="rank-rewards/rejected" element={<RankRewardsPage />} />

              {/* 7. Withdrawals */}
              <Route path="withdrawals/pending" element={<WithdrawalsPage />} />
              <Route path="withdrawals/history" element={<WithdrawalsPage />} />

              {/* 8. Purchase & Donation */}
              <Route path="purchase-donation/credit-purchases" element={<PurchaseDonationPage type="credit-purchases" />} />
              <Route path="purchase-donation/donations" element={<PurchaseDonationPage type="donations" />} />

              {/* 9. Reports & Bonuses */}
              <Route path="reports/referral" element={<ReportsPage />} />
              <Route path="reports/level" element={<ReportsPage />} />
              <Route path="reports/rank-reward" element={<ReportsPage />} />
              <Route path="reports/protocol-fee" element={<ProtocolFeeReportPage />} />
              <Route path="protocol-fee" element={<ProtocolFeeReportPage />} />
              <Route path="reports/transactions" element={<ReportsPage />} />

              {/* 10. Weekly Report */}
              <Route path="weekly-report" element={<WeeklyReportPage />} />

              {/* 11. Academy */}
              <Route path="academy" element={<AcademyAdminPage initialTab="categories" />} />
              <Route path="academy/categories" element={<AcademyAdminPage initialTab="categories" />} />
              <Route path="academy/courses" element={<AcademyAdminPage initialTab="courses" />} />
              {/* <Route path="academy/purchases" element={<AcademyAdminPage initialTab="purchases" />} /> */}

              {/* 12. Banners */}
              <Route path="banners" element={<BannerAdminPage />} />

              {/* 13. Announcements */}
              <Route path="announcements" element={<AnnouncementsAdminPage mode="list" />} />
              <Route path="announcements/create" element={<AnnouncementsAdminPage mode="create" />} />
              <Route path="announcements/send" element={<AnnouncementsAdminPage mode="create" />} />

              {/* 14. Support Tickets */}
              <Route path="support" element={<SupportAdminPage />} />
              <Route path="support/:status" element={<SupportAdminPage />} />
              <Route path="support/reply/:ticket" element={<SupportAdminPage />} />
              <Route path="supports" element={<SupportAdminPage />} />
              <Route path="supports/:status" element={<SupportAdminPage />} />

              {/* 15. Business Material */}
              <Route path="business-material" element={<BusinessMaterialPage />} />
              <Route path="business-material/create" element={<BusinessMaterialPage />} />
              <Route path="business-material/edit/:id" element={<BusinessMaterialPage />} />
              <Route path="business-materials" element={<BusinessMaterialPage />} />

              {/* 16. Settings */}
              <Route path="settings/general" element={<SettingsPage />} />
              <Route path="settings/charges" element={<SettingsPage />} />
              <Route path="settings/ranks" element={<SettingsPage />} />
              <Route path="settings/levels" element={<SettingsPage />} />
              <Route path="settings/payment" element={<SettingsPage />} />

              {/* 17. Security */}
              <Route path="change-password" element={<ChangePasswordPage />} />

              {/* 18. Admin Profile Update (Matching Laravel blade update_admin_profile) */}
              <Route path="profile" element={<AdminProfilePage />} />
              <Route path="update-profileadmin" element={<AdminProfilePage />} />

              {/* Legacy Admin URL Aliases */}
              <Route path="transferred/pin" element={<CreditsPage />} />
              <Route path="transaction/pin" element={<CreditsPage />} />
              <Route path="my-used-pin" element={<CreditsPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="inactive-members" element={<MembersPage />} />
              <Route path="blocked-members" element={<MembersPage />} />
              <Route path="ban-members" element={<MembersPage />} />
              <Route path="pending-deposits" element={<DepositsPage />} />
              <Route path="deposit-log" element={<DepositsPage />} />
              <Route path="pending-usdt-withdraw" element={<WithdrawalsPage />} />
              <Route path="withdraw-usdt-log" element={<WithdrawalsPage />} />
              <Route path="general-settings" element={<SettingsPage />} />
              <Route path="charge-setting" element={<SettingsPage />} />
              <Route path="rank-setting" element={<SettingsPage />} />
              <Route path="level-commission" element={<SettingsPage />} />
              <Route path="payment-setting" element={<SettingsPage />} />
            </Route>
          
          
          </Route>

          {/* =========================================
              3. PUBLIC FRONT PAGES (Landing, Auth)
              ========================================= */}
          {/* User Guest / Auth Routes */}
          <Route element={<UserPublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/password/reset" element={<ForgotPasswordPage />} />
            <Route path="/password/reset/:token" element={<UserResetPasswordPage />} />

             <Route path="/testimonial" element={<TestimonialsPage />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          </Route>

          <Route path="/" element={<HomePage />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
        </UserAuthProvider>
      </AdminAuthProvider>
    </LanguageProvider>
  </GeneralSettingsProvider>
  );
}

export default App;
