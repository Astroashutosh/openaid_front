import apiClient from './apiClient';

export interface AcademyCategory {
  id: number;
  parent_id: number | null;
  parent_title?: string | null;
  title: string;
  slug: string;
  status: number; // 1 = Active, 0 = Inactive
  courses_count: number;
  subcategories_count: number;
  created_at: string;
  updated_at: string;
}

export interface AcademyDocument {
  id: number;
  academy_course_id: number;
  title: string;
  file: string;
  created_at?: string;
  updated_at?: string;
}

export interface AcademyContent {
  id: number;
  academy_course_id: number;
  title: string;
  type: 'video' | 'document';
  file: string | null;
  url: string | null;
  status: number;
  created_at?: string;
  updated_at?: string;
}

export interface AcademyCourse {
  id: number;
  category_id: number;
  sub_category_id: number | null;
  category_title: string | null;
  subcategory_title: string | null;
  title: string;
  slug: string;
  price: number;
  image: string | null;
  duration: string | null;
  description: string | null;
  status: number; // 1 = Active, 0 = Inactive
  documents_count: number;
  contents_count: number;
  documents?: AcademyDocument[];
  contents?: AcademyContent[];
  created_at: string;
  updated_at: string;
}

export interface AcademyPurchase {
  id: number;
  user_id: number;
  course_id: number;
  amount: number;
  payment_status: string;
  created_at: string;
  username?: string;
  fullname?: string;
  course_title?: string;
}

export interface AcademyPaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const adminAcademyService = {
  // ── Categories ─────────────────────────────────────────────────────────────
  async getCategories(search?: string): Promise<{ success: boolean; data: AcademyCategory[] }> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiClient.get(`/admin/academy/categories${query}`);
  },

  async getParentCategories(): Promise<{ success: boolean; data: AcademyCategory[] }> {
    return apiClient.get('/admin/academy/categories/parents');
  },

  async getSubcategories(parentId: number): Promise<{ success: boolean; data: AcademyCategory[] }> {
    return apiClient.get(`/admin/academy/categories/subcategories?parent_id=${parentId}`);
  },

  async createCategory(data: {
    title: string;
    parent_id?: number | null;
    slug?: string;
    status?: number;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    return apiClient.post('/admin/academy/categories', data);
  },

  async updateCategory(
    id: number,
    data: {
      title: string;
      parent_id?: number | null;
      slug?: string;
      status?: number;
    }
  ): Promise<{ success: boolean; message: string; data?: any }> {
    return apiClient.put(`/admin/academy/categories/${id}`, data);
  },

  async toggleCategoryStatus(id: number): Promise<{ success: boolean; status: boolean; message: string; new_status: number }> {
    return apiClient.patch(`/admin/academy/categories/${id}/status`);
  },

  async deleteCategory(id: number): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/admin/academy/categories/${id}`);
  },

  // ── Courses ────────────────────────────────────────────────────────────────
  async getCourses(params?: {
    search?: string;
    category_id?: number | string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: AcademyCourse[]; meta: AcademyPaginationMeta }> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category_id) searchParams.set('category_id', String(params.category_id));
    if (params?.status !== undefined && params?.status !== '') searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`/admin/academy/courses${queryString}`);
  },

  async getCourseDetails(id: number): Promise<{ success: boolean; data: AcademyCourse }> {
    return apiClient.get(`/admin/academy/courses/${id}`);
  },

  async createCourse(formData: FormData): Promise<{ success: boolean; message: string; data?: any }> {
    return apiClient.post('/admin/academy/courses', formData);
  },

  async updateCourse(id: number, formData: FormData): Promise<{ success: boolean; message: string; data?: any }> {
    return apiClient.put(`/admin/academy/courses/${id}`, formData);
  },

  async toggleCourseStatus(id: number): Promise<{ success: boolean; status: boolean; message: string; new_status: number }> {
    return apiClient.patch(`/admin/academy/courses/${id}/status`);
  },

  async deleteCourse(id: number): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/admin/academy/courses/${id}`);
  },

  // ── Documents & Contents ───────────────────────────────────────────────────
  async deleteCourseDocument(docId: number): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/admin/academy/documents/${docId}`);
  },

  async deleteCourseContent(contentId: number): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/admin/academy/contents/${contentId}`);
  },

  // ── Purchases ──────────────────────────────────────────────────────────────
  async getPurchases(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: AcademyPurchase[]; meta: AcademyPaginationMeta }> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`/admin/academy/purchases${queryString}`);
  },
};

export default adminAcademyService;
