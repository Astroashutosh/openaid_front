import { API_ENDPOINTS } from '../config/api';
import { adminAuthService } from './adminAuthService';

export interface DashboardRecipient {
  id: number;
  user_id: number;
  username: string;
  email: string;
  full_name: string;
  lend_amount: number;
  received_amount: number;
  donors_received_count: number;
  package_title: string;
  package_price: number;
  created_at: string;
}

export interface DashboardPackageStat {
  id: number;
  title: string;
  price: number;
  daily_limit: number;
  donations_count: number;
  donations_volume: number;
  active_count: number;
  completed_count: number;
  status: number;
  tier?: number;
}

export interface DashboardQueueByPackage {
  package_id: number;
  tier: number;
  tier_label: string;
  title: string;
  price: number;
  daily_limit: number;
  active_count: number;
  active_amount: number;
  completed_count: number;
  completed_amount: number;
  donations_count: number;
  donations_volume: number;
  current_recipient: DashboardRecipient | null;
}

export interface DashboardTransaction {
  id: number;
  user_id: number;
  trans_id: string;
  username: string;
  email: string;
  full_name: string;
  amount: number;
  charge: number;
  new_balance: number;
  type: string;
  transaction_type: string;
  remarks: string;
  description: string;
  created_at: string;
}

export interface DashboardPagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface DashboardOverviewData {
  page_title: string;

  // 1. User stats
  total_users: number;
  total_active_users: number;
  total_inactive_users: number;
  today_users: number;
  today_active_users: number;
  today_inactive_users: number;

  // 2. FIFO Queue stats
  current_recipient: DashboardRecipient | null;
  queue_by_package?: DashboardQueueByPackage[];
  total_donations: number;
  total_help_given: number;
  total_help_received: number;
  active_queue_count: number;
  active_queue_amount: number;
  completed_cycles_count: number;
  completed_cycles_amount: number;
  today_help_given: number;

  // 3. Packages breakdown
  package_stats: DashboardPackageStat[];

  // 4. Pin / Credit stats
  total_pins: number;
  total_pin_value: number;
  available_pins_count: number;
  available_pins_value: number;
  used_pins_count: number;
  used_pins_value: number;
  epin_purchase_amount: number;

  // 5. Donate / Deposit stats
  total_approved_deposits: number;
  approved_deposits_count: number;
  pending_deposits_count: number;
  pending_deposits_amount: number;

  // 6. Rank rewards stats
  total_rewards_awarded: number;
  requested_claims_count: number;
  unclaimed_rewards_count: number;
  approved_rewards_count: number;
  total_approved_bonus: number;

  // 7. MLM Commissions & 1% Protocol Fee
  level_commission: number;
  direct_commission: number;
  protocol_fee_amount: number;
  protocol_fee_count: number;
  total_commissions_and_fees: number;
  cycle_commission: number;
  rank_commission: number;
  total_earning: number;

  // 8. Withdrawals stats
  withdraw_amount: number;
  paid_withdrawals_count: number;
  pending_withdrawals_count: number;
  pending_withdrawals_amount: number;
  main_paid_amount: number;
  main_paid_count: number;
  main_pending_amount: number;
  main_pending_count: number;
  donation_paid_amount: number;
  donation_paid_count: number;
  donation_pending_amount: number;
  donation_pending_count: number;

  // 9. Activity Feed (Latest 50 Transactions)
  transactions: DashboardTransaction[];
  total_recent_transactions?: number;
  pagination?: DashboardPagination;
}

export const adminDashboardService = {
  async getDashboardOverview(): Promise<DashboardOverviewData> {
    const token = adminAuthService.getToken();
    if (!token) {
      throw new Error('Unauthorized. Please log in again.');
    }

    const res = await fetch(API_ENDPOINTS.ADMIN.DASHBOARD, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load executive dashboard data.');
    }

    return data.data;
  },
};
