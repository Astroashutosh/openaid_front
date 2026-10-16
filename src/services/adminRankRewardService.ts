import { apiClient } from './apiClient';

export interface RankRewardItem {
  id: number;
  srNo: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  rankId: number;
  rankName: string;
  rewardAmount: number;
  rewardName: string | null;
  transId: string;
  commissionEarned: number;
  directsCount: number;
  rewardOptions: string[];
  rawRewardOptions: string | null;
  status: 'pending' | 'requested' | 'approved' | 'rejected';
  response: Record<string, any>;
  approvedBy: string;
  approvedAt: string | null;
  adminNotes: string | null;
  rejectionHistory: Array<{
    declined_item: string;
    rejected_by: string;
    rejected_at: string;
    reason: string;
  }>;
  lastRejection: {
    declined_item: string;
    rejected_by: string;
    rejected_at: string;
    reason: string;
  } | null;
  declinedItem: string;
  declineReason: string;
  rejectedBy: string;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RankRewardCounts {
  requested_count: number;
  unclaimed_count: number;
  approved_count: number;
  rejected_count: number;
  total_cash_given: number;
}

export interface RankRewardsResponse {
  success: boolean;
  counts: RankRewardCounts;
  data: RankRewardItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchRankRewardsParams {
  tab?: 'pending' | 'unclaimed' | 'approved' | 'rejected';
  search?: string;
  uname?: string;
  page?: number;
  limit?: number;
  rows?: number;
}

export const adminRankRewardService = {
  /**
   * Fetch rank rewards list and summary counts
   */
  async getRankRewards(params: FetchRankRewardsParams = {}): Promise<RankRewardsResponse> {
    const query = new URLSearchParams();
    if (params.tab) query.append('tab', params.tab);
    if (params.search || params.uname) query.append('search', (params.search || params.uname || '').trim());
    if (params.page) query.append('page', String(params.page));
    if (params.limit || params.rows) query.append('limit', String(params.limit || params.rows));

    return apiClient.get<RankRewardsResponse>(`/admin/rank-rewards?${query.toString()}`, {
      authScope: 'admin',
    });
  },

  /**
   * Approve a rank reward claim (optionally specifying/modifying the item and admin notes)
   */
  async approveReward(
    id: number,
    data: { reward_name?: string; admin_notes?: string } = {}
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/admin/rank-rewards/${id}/approve`,
      data,
      { authScope: 'admin' }
    );
  },

  /**
   * Reject a rank reward claim (Option A: Reset to pending for re-claim with reason)
   */
  async rejectReward(
    id: number,
    data: { reason: string }
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/admin/rank-rewards/${id}/reject`,
      data,
      { authScope: 'admin' }
    );
  },
};
