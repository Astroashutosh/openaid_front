import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  FileText,
  FileSpreadsheet,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  File,
  Home,
  ArrowLeft,
  Save,
  RefreshCw,
  UploadCloud,
} from 'lucide-react';
import adminAcademyService, {
  type AcademyCategory,
  type AcademyCourse,
  type AcademyDocument,
  type AcademyContent,
} from '../../services/adminAcademyService';
import { buildAssetUrl } from '../../config/api';

interface DynamicContentRow {
  title: string;
  type: 'video' | 'document';
  url: string;
  status: number;
  file?: File | null;
}

export const AcademyAdminPage: React.FC<{ initialTab?: 'categories' | 'courses' }> = ({
  initialTab = 'categories',
}) => {
  const location = useLocation();

  // Detect mode based on URL: /categories vs /courses
  const isCoursesPage =
    location.pathname.includes('/courses') || (!location.pathname.includes('/categories') && initialTab === 'courses');

  // Active sub-view: 'list' | 'add_category' | 'edit_category' | 'add_course' | 'edit_course' | 'view_course_details'
  const [subView, setSubView] = useState<'list' | 'add' | 'edit' | 'details'>('list');

  // Toast alert
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Reset subview when URL changes
  useEffect(() => {
    setSubView('list');
  }, [location.pathname]);

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORIES STATE
  // ───────────────────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<AcademyCategory[]>([]);
  const [parentCategories, setParentCategories] = useState<AcademyCategory[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  // Category Form State (Create / Edit)
  const [categoryFormData, setCategoryFormData] = useState<{
    id?: number;
    title: string;
    parent_id: string; // '' for None
    slug: string;
    status: number;
  }>({
    title: '',
    parent_id: '',
    slug: '',
    status: 1,
  });
  const [categorySaving, setCategorySaving] = useState(false);

  // ───────────────────────────────────────────────────────────────────────────
  // COURSES STATE
  // ───────────────────────────────────────────────────────────────────────────
  const [courses, setCourses] = useState<AcademyCourse[]>([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const [coursePage, setCoursePage] = useState(1);
  const courseLimit = 15;
  const [courseTotalPages, setCourseTotalPages] = useState(1);
  const [courseTotalRecords, setCourseTotalRecords] = useState(0);

  // Course Details State
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<AcademyCourse | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Document Lightbox preview (PDF / Image)
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string; type: 'pdf' | 'image' } | null>(null);

  // Course Wizard Form State (Create / Edit)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [courseFormData, setCourseFormData] = useState<{
    id?: number;
    title: string;
    price: string | number;
    category_id: string;
    sub_category_id: string;
    duration: string;
    status: number;
    description: string;
    imageFile: File | null;
    imagePreview: string | null;
    existingImage: string | null;
    docFiles: File[];
    existingDocs: AcademyDocument[];
    existingContents: AcademyContent[];
    newContents: DynamicContentRow[];
  }>({
    title: '',
    price: 0,
    category_id: '',
    sub_category_id: '',
    duration: '',
    status: 1,
    description: '',
    imageFile: null,
    imagePreview: null,
    existingImage: null,
    docFiles: [],
    existingDocs: [],
    existingContents: [],
    newContents: [],
  });
  const [subcategoriesForCourse, setSubcategoriesForCourse] = useState<AcademyCategory[]>([]);
  const [courseSaving, setCourseSaving] = useState(false);

  // Delete Confirmation State
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'category' | 'course';
    id: number;
    title: string;
    warning?: string;
  }>({ open: false, type: 'category', id: 0, title: '' });

  // ───────────────────────────────────────────────────────────────────────────
  // FETCHERS
  // ───────────────────────────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    try {
      setCategoryLoading(true);
      const [allRes, parentsRes] = await Promise.all([
        adminAcademyService.getCategories(categorySearch),
        adminAcademyService.getParentCategories(),
      ]);
      if (allRes.success) setCategories(allRes.data);
      if (parentsRes.success) setParentCategories(parentsRes.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load categories', 'error');
    } finally {
      setCategoryLoading(false);
    }
  }, [categorySearch]);

  const fetchCourses = useCallback(async () => {
    try {
      setCourseLoading(true);
      const res = await adminAcademyService.getCourses({
        search: courseSearch,
        page: coursePage,
        limit: courseLimit,
      });
      if (res.success) {
        setCourses(res.data);
        setCourseTotalPages(res.meta.pages || 1);
        setCourseTotalRecords(res.meta.total || 0);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load courses', 'error');
    } finally {
      setCourseLoading(false);
    }
  }, [courseSearch, coursePage, courseLimit]);

  // Load data based on current page
  useEffect(() => {
    if (isCoursesPage) {
      fetchCourses();
      adminAcademyService.getParentCategories().then((res) => {
        if (res.success) setParentCategories(res.data);
      }).catch(() => {});
    } else {
      fetchCategories();
    }
  }, [isCoursesPage, fetchCategories, fetchCourses]);

  // Fetch subcategories when course category changes in form
  useEffect(() => {
    if (!courseFormData.category_id) {
      setSubcategoriesForCourse([]);
      return;
    }
    const catId = Number(courseFormData.category_id);
    if (!catId) return;
    adminAcademyService.getSubcategories(catId).then((res) => {
      if (res.success) {
        setSubcategoriesForCourse(res.data);
      }
    }).catch(() => setSubcategoriesForCourse([]));
  }, [courseFormData.category_id]);

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORY HANDLERS
  // ───────────────────────────────────────────────────────────────────────────
  const handleOpenAddCategory = () => {
    setCategoryFormData({
      title: '',
      parent_id: '',
      slug: '',
      status: 1,
    });
    setSubView('add');
  };

  const handleOpenEditCategory = (cat: AcademyCategory) => {
    setCategoryFormData({
      id: cat.id,
      title: cat.title,
      parent_id: cat.parent_id ? String(cat.parent_id) : '',
      slug: cat.slug,
      status: cat.status,
    });
    setSubView('edit');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.title.trim()) {
      showToast('Category title is required', 'error');
      return;
    }
    try {
      setCategorySaving(true);
      const payload = {
        title: categoryFormData.title.trim(),
        parent_id: categoryFormData.parent_id ? Number(categoryFormData.parent_id) : null,
        slug: categoryFormData.slug.trim() || undefined,
        status: categoryFormData.status,
      };

      if (subView === 'add') {
        const res = await adminAcademyService.createCategory(payload);
        showToast(res.message || 'Category created successfully');
      } else if (categoryFormData.id) {
        const res = await adminAcademyService.updateCategory(categoryFormData.id, payload);
        showToast(res.message || 'Category updated successfully');
      }
      setSubView('list');
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setCategorySaving(false);
    }
  };

  const handleToggleCategoryStatus = async (id: number) => {
    try {
      const res = await adminAcademyService.toggleCategoryStatus(id);
      showToast(res.message || 'Status updated successfully');
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handlePromptDeleteCategory = (cat: AcademyCategory) => {
    setDeleteDialog({
      open: true,
      type: 'category',
      id: cat.id,
      title: cat.title,
      warning:
        cat.courses_count > 0
          ? `Warning: This category has ${cat.courses_count} course(s) linked to it. You cannot delete it until all linked courses are moved or deleted.`
          : undefined,
    });
  };

  // ───────────────────────────────────────────────────────────────────────────
  // COURSE HANDLERS
  // ───────────────────────────────────────────────────────────────────────────
  const handleOpenAddCourse = () => {
    setWizardStep(1);
    setCourseFormData({
      title: '',
      price: 0,
      category_id: parentCategories.length > 0 ? String(parentCategories[0].id) : '',
      sub_category_id: '',
      duration: '',
      status: 1,
      description: '',
      imageFile: null,
      imagePreview: null,
      existingImage: null,
      docFiles: [],
      existingDocs: [],
      existingContents: [],
      newContents: [],
    });
    setSubView('add');
  };

  const handleOpenEditCourse = async (courseId: number) => {
    try {
      setCourseLoading(true);
      const res = await adminAcademyService.getCourseDetails(courseId);
      if (res.success && res.data) {
        const c = res.data;
        setWizardStep(1);
        setCourseFormData({
          id: c.id,
          title: c.title,
          price: c.price,
          category_id: c.category_id ? String(c.category_id) : '',
          sub_category_id: c.sub_category_id ? String(c.sub_category_id) : '',
          duration: c.duration || '',
          status: c.status,
          description: c.description || '',
          imageFile: null,
          imagePreview: null,
          existingImage: c.image || null,
          docFiles: [],
          existingDocs: c.documents || [],
          existingContents: c.contents || [],
          newContents: [],
        });
        setSubView('edit');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load course details for editing', 'error');
    } finally {
      setCourseLoading(false);
    }
  };

  const handleViewDetails = async (courseId: number) => {
    try {
      setDetailsLoading(true);
      setSubView('details');
      const res = await adminAcademyService.getCourseDetails(courseId);
      if (res.success) {
        setSelectedCourseDetails(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load course details', 'error');
      setSubView('list');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleToggleCourseStatus = async (id: number) => {
    try {
      const res = await adminAcademyService.toggleCourseStatus(id);
      showToast(res.message || 'Status updated successfully');
      fetchCourses();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handlePromptDeleteCourse = (course: AcademyCourse) => {
    setDeleteDialog({
      open: true,
      type: 'course',
      id: course.id,
      title: course.title,
      warning: 'This course and its documents will be permanently deleted.',
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteDialog.type === 'category') {
        const res = await adminAcademyService.deleteCategory(deleteDialog.id);
        showToast(res.message || 'Category deleted successfully');
        fetchCategories();
      } else if (deleteDialog.type === 'course') {
        const res = await adminAcademyService.deleteCourse(deleteDialog.id);
        showToast(res.message || 'Course deleted successfully');
        fetchCourses();
      }
      setDeleteDialog({ open: false, type: 'category', id: 0, title: '' });
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await adminAcademyService.deleteCourseDocument(docId);
      setCourseFormData((prev) => ({
        ...prev,
        existingDocs: prev.existingDocs.filter((d) => d.id !== docId),
      }));
      showToast('Document deleted successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete document', 'error');
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await adminAcademyService.deleteCourseContent(contentId);
      setCourseFormData((prev) => ({
        ...prev,
        existingContents: prev.existingContents.filter((c) => c.id !== contentId),
      }));
      showToast('Lesson deleted successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete lesson', 'error');
    }
  };

  const handleAddNewContentRow = () => {
    setCourseFormData((prev) => ({
      ...prev,
      newContents: [
        ...prev.newContents,
        {
          title: '',
          type: 'video',
          url: '',
          status: 1,
          file: null,
        },
      ],
    }));
  };

  const handleRemoveNewContentRow = (index: number) => {
    setCourseFormData((prev) => ({
      ...prev,
      newContents: prev.newContents.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateNewContentRow = (index: number, field: keyof DynamicContentRow, value: any) => {
    setCourseFormData((prev) => {
      const updated = [...prev.newContents];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, newContents: updated };
    });
  };

  const handleCourseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCourseFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleDocFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setCourseFormData((prev) => ({
        ...prev,
        docFiles: [...prev.docFiles, ...filesArray],
      }));
    }
  };

  const handleRemoveDocFile = (index: number) => {
    setCourseFormData((prev) => ({
      ...prev,
      docFiles: prev.docFiles.filter((_, i) => i !== index),
    }));
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormData.title.trim()) {
      showToast('Course title is required', 'error');
      setWizardStep(1);
      return;
    }
    if (!courseFormData.category_id) {
      showToast('Please select a Category', 'error');
      setWizardStep(1);
      return;
    }

    try {
      setCourseSaving(true);
      const fd = new FormData();
      fd.append('title', courseFormData.title.trim());
      fd.append('price', String(courseFormData.price || 0));
      fd.append('category_id', String(courseFormData.category_id));
      if (courseFormData.sub_category_id) {
        fd.append('sub_category_id', String(courseFormData.sub_category_id));
      }
      fd.append('duration', courseFormData.duration.trim());
      fd.append('status', String(courseFormData.status));
      fd.append('description', courseFormData.description || '');

      if (courseFormData.imageFile) {
        fd.append('image', courseFormData.imageFile);
      }

      courseFormData.docFiles.forEach((file) => {
        fd.append('doc_file', file);
      });

      courseFormData.newContents.forEach((item, index) => {
        if (item.title.trim()) {
          fd.append(`content_title[${index}]`, item.title.trim());
          fd.append(`content_type[${index}]`, item.type);
          fd.append(`content_status[${index}]`, String(item.status));
          if (item.url) fd.append(`content_url[${index}]`, item.url.trim());
          if (item.file) fd.append(`content_file[${index}]`, item.file);
        }
      });

      if (subView === 'add') {
        const res = await adminAcademyService.createCourse(fd);
        showToast(res.message || 'Course created successfully');
      } else if (courseFormData.id) {
        const res = await adminAcademyService.updateCourse(courseFormData.id, fd);
        showToast(res.message || 'Course updated successfully');
      }
      setSubView('list');
      fetchCourses();
    } catch (err: any) {
      showToast(err.message || 'Failed to save course', 'error');
    } finally {
      setCourseSaving(false);
    }
  };

  const getDocFileInfo = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') {
      return { icon: <FileText className="w-8 h-8 text-danger text-rose-600" />, type: 'pdf' as const };
    }
    if (['doc', 'docx'].includes(ext)) {
      return { icon: <FileText className="w-8 h-8 text-primary text-blue-600" />, type: 'office' as const };
    }
    if (['xls', 'xlsx'].includes(ext)) {
      return { icon: <FileSpreadsheet className="w-8 h-8 text-success text-emerald-600" />, type: 'office' as const };
    }
    if (['ppt', 'pptx'].includes(ext)) {
      return { icon: <File className="w-8 h-8 text-warning text-amber-600" />, type: 'office' as const };
    }
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
      return { icon: <File className="w-8 h-8 text-info text-sky-600" />, type: 'image' as const };
    }
    return { icon: <File className="w-8 h-8 text-muted text-slate-400" />, type: 'office' as const };
  };

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER: VIEW 1 - CATEGORIES LIST (category/index.blade.php)
  // ───────────────────────────────────────────────────────────────────────────
  if (!isCoursesPage && subView === 'list') {
    return (
      <div className="w-full space-y-4">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-bold text-white ${
              toast.type === 'success' ? 'bg-[#28a745]' : 'bg-[#dc3545]'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toast.message}</span>
            <button type="button" onClick={() => setToast(null)} className="ml-2 hover:opacity-75">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Header (Exact matching Laravel content-header) */}
        <div className="content-header pb-2">
          <div className="d-flex align-items-center flex justify-between items-center">
            <div className="me-auto">
              <h4 className="page-title text-xl font-bold text-slate-800">Academy Categories</h4>
              <div className="d-inline-block align-items-center">
                <nav>
                  <ol className="breadcrumb flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <li className="breadcrumb-item">
                      <Link to="/admin/home" className="hover:text-slate-800">
                        <Home className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                      Academy Categories
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Box (Exact matching Laravel .box) */}
        <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Box Header */}
          <div className="box-header with-border px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="box-title text-base font-bold text-slate-800">Academy Categories</h3>
            <button
              type="button"
              onClick={handleOpenAddCategory}
              className="btn btn-sm btn-success bg-[#28a745] hover:bg-[#218838] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>

          {/* Box Body */}
          <div className="box-body p-6">
            {/* Search Filter */}
            <div className="d-flex justify-content-end flex justify-end mb-4">
              <div className="flex items-center gap-2 border border-slate-300 rounded px-3 py-1.5 w-72 text-xs bg-white">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search category title or slug..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="table-responsive overflow-x-auto border border-slate-200 rounded">
              <table className="table table-bordered table-hover display nowrap w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-3 px-3.5 border-r border-slate-200 w-16">Sr.No.</th>
                    <th className="py-3 px-3.5 border-r border-slate-200">Title</th>
                    <th className="py-3 px-3.5 border-r border-slate-200">Slug</th>
                    <th className="py-3 px-3.5 border-r border-slate-200">Parent Name</th>
                    <th className="py-3 px-3.5 border-r border-slate-200 text-center">Courses</th>
                    <th className="py-3 px-3.5 border-r border-slate-200 text-center">Status</th>
                    <th className="py-3 px-3.5 border-r border-slate-200">Created At</th>
                    <th className="py-3 px-3.5 text-center w-44">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {categoryLoading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#28a745]" />
                        Loading categories...
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No categories found.
                      </td>
                    </tr>
                  ) : (
                    categories.map((category, index) => (
                      <tr key={category.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-mono text-slate-600">
                          {index + 1}
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-semibold text-slate-900">
                          {category.title}
                          {category.subcategories_count > 0 && (
                            <span className="ml-2 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                              ({category.subcategories_count} subcategories)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-slate-600 font-mono text-[11px]">
                          {category.slug}
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-slate-600">
                          {category.parent_title ? (
                            <span className="font-semibold text-slate-800">{category.parent_title}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-center">
                          <span className="badge badge-primary bg-[#007bff] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                            {category.courses_count}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleCategoryStatus(category.id)}
                            className="focus:outline-none cursor-pointer"
                            title="Click to toggle status"
                          >
                            {category.status === 1 ? (
                              <span className="badge badge-success bg-[#28a745] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                Active
                              </span>
                            ) : (
                              <span className="badge badge-danger bg-[#dc3545] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                Inactive
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-slate-500 font-mono text-[11px]">
                          {category.created_at
                            ? new Date(category.created_at).toLocaleDateString('en-GB') +
                              ' ' +
                              new Date(category.created_at).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </td>
                        <td className="py-2.5 px-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCategory(category)}
                              className="btn btn-xs btn-primary bg-[#007bff] hover:bg-[#0069d9] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                            >
                              <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePromptDeleteCategory(category)}
                              className="btn btn-xs btn-danger bg-[#dc3545] hover:bg-[#c82333] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Delete Dialog Modal */}
        {deleteDialog.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-[#dc3545] flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-1">Are you sure?</h3>
              <p className="text-xs text-slate-500 mb-4">
                This category will be permanently deleted: <strong>"{deleteDialog.title}"</strong>
              </p>
              {deleteDialog.warning && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px] text-left">
                  {deleteDialog.warning}
                </div>
              )}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteDialog({ open: false, type: 'category', id: 0, title: '' })}
                  className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-[#dc3545] hover:bg-[#c82333] text-white rounded text-xs font-bold transition shadow-xs"
                >
                  Yes, delete it!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER: VIEW 2 - ADD / EDIT CATEGORY (category/create.blade.php & edit.blade.php)
  // ───────────────────────────────────────────────────────────────────────────
  if (!isCoursesPage && (subView === 'add' || subView === 'edit')) {
    return (
      <div className="w-full space-y-4">
        {/* Content Header */}
        <div className="content-header pb-2">
          <div className="d-flex align-items-center flex justify-between items-center">
            <div className="me-auto">
              <h4 className="page-title text-xl font-bold text-slate-800">
                {subView === 'add' ? 'Add Academy Category' : 'Edit Academy Category'}
              </h4>
              <div className="d-inline-block align-items-center">
                <nav>
                  <ol className="breadcrumb flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <li className="breadcrumb-item">
                      <Link to="/admin/home" className="hover:text-slate-800">
                        <Home className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item">
                      <button onClick={() => setSubView('list')} className="hover:text-slate-800">
                        Academy Categories
                      </button>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                      {subView === 'add' ? 'Add Category' : 'Edit Category'}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Form Box (Matching Laravel .box) */}
        <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="box-header with-border px-6 py-4 border-b border-slate-200">
            <h4 className="box-title text-base font-bold text-slate-800">Category Info</h4>
          </div>

          <form onSubmit={handleSaveCategory} className="form">
            <div className="box-body p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="form-label block font-bold text-slate-700 mb-1">
                    Category Title <span className="text-danger text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Enter Category Title"
                    value={categoryFormData.title}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, title: e.target.value })}
                    className="form-control w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#007bff]"
                  />
                </div>

                {/* Parent Category */}
                <div>
                  <label className="form-label block font-bold text-slate-700 mb-1">Parent Category</label>
                  <select
                    name="parent_id"
                    value={categoryFormData.parent_id}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, parent_id: e.target.value })}
                    className="form-control w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#007bff] bg-white"
                  >
                    <option value="">None (Top Level Category)</option>
                    {parentCategories
                      .filter((p) => p.id !== categoryFormData.id)
                      .map((parent) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.title}
                        </option>
                      ))}
                  </select>
                  <span className="text-muted text-[11px] text-slate-400 mt-1 block">
                    Select a parent to make this a sub-category.
                  </span>
                </div>

                {/* Slug */}
                <div>
                  <label className="form-label block font-bold text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="auto-generated if empty"
                    value={categoryFormData.slug}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                    className="form-control w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#007bff] font-mono"
                  />
                  <span className="text-muted text-[11px] text-slate-400 mt-1 block">
                    Leave blank to auto-generate.
                  </span>
                </div>

                {/* Status */}
                <div>
                  <label className="form-label block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    name="status"
                    required
                    value={categoryFormData.status}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, status: Number(e.target.value) })}
                    className="form-control w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#007bff] bg-white"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Box Footer (Exact matching Laravel box-footer) */}
            <div className="box-footer text-end px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-2">
              <button
                type="submit"
                disabled={categorySaving}
                className="btn btn-primary bg-[#007bff] hover:bg-[#0069d9] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
              <button
                type="button"
                onClick={() => setSubView('list')}
                className="btn btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER: VIEW 3 - COURSES LIST (courses.blade.php)
  // ───────────────────────────────────────────────────────────────────────────
  if (isCoursesPage && subView === 'list') {
    return (
      <div className="w-full space-y-4">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-bold text-white ${
              toast.type === 'success' ? 'bg-[#28a745]' : 'bg-[#dc3545]'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toast.message}</span>
            <button type="button" onClick={() => setToast(null)} className="ml-2 hover:opacity-75">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Header (Exact matching Laravel content-header) */}
        <div className="content-header pb-2">
          <div className="d-flex align-items-center flex justify-between items-center">
            <div className="me-auto">
              <h4 className="page-title text-xl font-bold text-slate-800">Academy Courses</h4>
              <div className="d-inline-block align-items-center">
                <nav>
                  <ol className="breadcrumb flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <li className="breadcrumb-item">
                      <Link to="/admin/home" className="hover:text-slate-800">
                        <Home className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                      Academy Courses
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Box (Exact matching Laravel .box) */}
        <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Box Header */}
          <div className="box-header with-border px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="box-title text-base font-bold text-slate-800">Academy Courses</h3>
            <button
              type="button"
              onClick={handleOpenAddCourse}
              className="btn btn-sm btn-success bg-[#28a745] hover:bg-[#218838] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add Course
            </button>
          </div>

          {/* Box Body */}
          <div className="box-body p-6">
            {/* Search Filter */}
            <div className="d-flex justify-content-end flex justify-end mb-4">
              <div className="flex items-center gap-2 border border-slate-300 rounded px-3 py-1.5 w-72 text-xs bg-white">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search course title or slug..."
                  value={courseSearch}
                  onChange={(e) => {
                    setCourseSearch(e.target.value);
                    setCoursePage(1);
                  }}
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="table-responsive overflow-x-auto border border-slate-200 rounded">
              <table className="table table-bordered table-hover display nowrap w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-3 px-3.5 border-r border-slate-200 w-16">Sr.No.</th>
                    <th className="py-3 px-3.5 border-r border-slate-200 w-20 text-center">Image</th>
                    <th className="py-3 px-3.5 border-r border-slate-200">Title</th>
                    <th className="py-3 px-3.5 border-r border-slate-200">Price</th>
                    <th className="py-3 px-3.5 border-r border-slate-200 text-center">Documents</th>
                    <th className="py-3 px-3.5 border-r border-slate-200 text-center">Status</th>
                    <th className="py-3 px-3.5 border-r border-slate-200">Created At</th>
                    <th className="py-3 px-3.5 text-center w-60">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {courseLoading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#28a745]" />
                        Loading courses...
                      </td>
                    </tr>
                  ) : courses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No courses found.
                      </td>
                    </tr>
                  ) : (
                    courses.map((course, index) => (
                      <tr key={course.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-mono text-slate-600">
                          {(coursePage - 1) * courseLimit + index + 1}
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-center">
                          {course.image ? (
                            <img
                              src={buildAssetUrl(course.image)}
                              alt="Course"
                              style={{ maxWidth: '60px', maxHeight: '60px', borderRadius: '4px' }}
                              className="mx-auto border border-slate-200 object-cover"
                            />
                          ) : (
                            <span className="text-muted text-slate-400 text-[11px]">No Image</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-semibold text-slate-900">
                          {course.title}
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-mono font-bold text-slate-800">
                          {Number(course.price).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-center font-bold text-slate-700">
                          {course.documents_count}
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleCourseStatus(course.id)}
                            className="focus:outline-none cursor-pointer"
                            title="Click to toggle status"
                          >
                            {course.status === 1 ? (
                              <span className="badge badge-success bg-[#28a745] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                Active
                              </span>
                            ) : (
                              <span className="badge badge-danger bg-[#dc3545] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                Inactive
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-slate-500 font-mono text-[11px]">
                          {course.created_at
                            ? new Date(course.created_at).toLocaleDateString('en-GB') +
                              ' ' +
                              new Date(course.created_at).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </td>
                        <td className="py-2.5 px-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleViewDetails(course.id)}
                              className="btn btn-xs btn-info bg-[#17a2b8] hover:bg-[#138496] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                            >
                              <Eye className="w-3 h-3" /> View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditCourse(course.id)}
                              className="btn btn-xs btn-primary bg-[#007bff] hover:bg-[#0069d9] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                            >
                              <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePromptDeleteCourse(course)}
                              className="btn btn-xs btn-danger bg-[#dc3545] hover:bg-[#c82333] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {courseTotalPages > 1 && (
              <div className="p-3 bg-slate-50/70 border-t border-slate-200 mt-2 flex items-center justify-between text-xs text-slate-600">
                <div>
                  Showing Page {coursePage} of {courseTotalPages} ({courseTotalRecords} total courses)
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={coursePage <= 1}
                    onClick={() => setCoursePage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-bold text-slate-800">{coursePage}</span>
                  <button
                    type="button"
                    disabled={coursePage >= courseTotalPages}
                    onClick={() => setCoursePage((p) => Math.min(courseTotalPages, p + 1))}
                    className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Dialog Modal */}
        {deleteDialog.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-[#dc3545] flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-1">Are you sure?</h3>
              <p className="text-xs text-slate-500 mb-4">
                This course and its documents will be permanently deleted: <strong>"{deleteDialog.title}"</strong>
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteDialog({ open: false, type: 'course', id: 0, title: '' })}
                  className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-[#dc3545] hover:bg-[#c82333] text-white rounded text-xs font-bold transition shadow-xs"
                >
                  Yes, delete it!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER: VIEW 4 - COURSE DETAILS (details.blade.php)
  // ───────────────────────────────────────────────────────────────────────────
  if (isCoursesPage && subView === 'details') {
    return (
      <div className="w-full space-y-4">
        {/* Content Header (details.blade.php lines 8-26) */}
        <div className="content-header pb-2">
          <div className="d-flex align-items-center flex justify-between items-center">
            <div className="me-auto">
              <h4 className="page-title text-xl font-bold text-slate-800">Academy Course Details</h4>
              <div className="d-inline-block align-items-center">
                <nav>
                  <ol className="breadcrumb flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <li className="breadcrumb-item">
                      <Link to="/admin/home" className="hover:text-slate-800">
                        <Home className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item">
                      <button onClick={() => setSubView('list')} className="hover:text-slate-800">
                        Academy Courses
                      </button>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                      Course Details
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubView('list')}
              className="btn btn-secondary ms-2 bg-[#6c757d] hover:bg-[#5a6268] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>
        </div>

        {detailsLoading || !selectedCourseDetails ? (
          <div className="box bg-white p-12 text-center text-slate-400 rounded-xl border border-slate-200">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#007bff]" />
            Loading course details...
          </div>
        ) : (
          <div className="space-y-5">
            {/* Box 1: Course Details (details.blade.php lines 32-118) */}
            <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="box-header with-border px-6 py-4 border-b border-slate-200">
                <h4 className="box-title text-base font-bold text-slate-800">Course Details</h4>
              </div>
              <div className="box-body p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <table className="table table-bordered table-striped w-full text-left border-collapse border border-slate-200 text-xs">
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <th className="py-2.5 px-3 bg-slate-50 font-bold text-slate-700 w-1/3 border-r border-slate-200">
                            ID
                          </th>
                          <td className="py-2.5 px-3 font-mono text-slate-800">{selectedCourseDetails.id}</td>
                        </tr>
                        <tr>
                          <th className="py-2.5 px-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">
                            Title
                          </th>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{selectedCourseDetails.title}</td>
                        </tr>
                        <tr>
                          <th className="py-2.5 px-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">
                            Slug
                          </th>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{selectedCourseDetails.slug}</td>
                        </tr>
                        <tr>
                          <th className="py-2.5 px-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">
                            Price
                          </th>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            {Number(selectedCourseDetails.price).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <th className="py-2.5 px-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">
                            Category
                          </th>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {selectedCourseDetails.category_title || '-'}
                          </td>
                        </tr>
                        <tr>
                          <th className="py-2.5 px-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">
                            Sub Category
                          </th>
                          <td className="py-2.5 px-3 text-slate-700">
                            {selectedCourseDetails.subcategory_title || '-'}
                          </td>
                        </tr>
                        <tr>
                          <th className="py-2.5 px-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">
                            Duration
                          </th>
                          <td className="py-2.5 px-3 text-slate-700">{selectedCourseDetails.duration || '-'}</td>
                        </tr>
                        <tr>
                          <th className="py-2.5 px-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">
                            Status
                          </th>
                          <td className="py-2.5 px-3">
                            {selectedCourseDetails.status === 1 ? (
                              <span className="badge badge-success bg-[#28a745] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                Active
                              </span>
                            ) : (
                              <span className="badge badge-danger bg-[#dc3545] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                Inactive
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th className="py-2.5 px-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">
                            Description
                          </th>
                          <td className="py-2.5 px-3 text-slate-700 leading-relaxed">
                            {selectedCourseDetails.description ? (
                              <div
                                dangerouslySetInnerHTML={{ __html: selectedCourseDetails.description }}
                                className="prose prose-xs max-w-none"
                              />
                            ) : (
                              <span className="text-muted text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th className="py-2.5 px-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">
                            Created At
                          </th>
                          <td className="py-2.5 px-3 font-mono text-slate-600">
                            {selectedCourseDetails.created_at
                              ? new Date(selectedCourseDetails.created_at).toLocaleDateString('en-GB') +
                                ' ' +
                                new Date(selectedCourseDetails.created_at).toLocaleTimeString('en-GB', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </td>
                        </tr>
                        <tr>
                          <th className="py-2.5 px-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">
                            Updated At
                          </th>
                          <td className="py-2.5 px-3 font-mono text-slate-600">
                            {selectedCourseDetails.updated_at
                              ? new Date(selectedCourseDetails.updated_at).toLocaleDateString('en-GB') +
                                ' ' +
                                new Date(selectedCourseDetails.updated_at).toLocaleTimeString('en-GB', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Course Image Box (details.blade.php lines 98-109) */}
                  <div className="col-md-4 text-center flex flex-col items-center">
                    <label className="form-label font-bold text-slate-700 mb-2">
                      <strong>Course Image</strong>
                    </label>
                    <div style={{ marginTop: '10px' }} className="w-full">
                      {selectedCourseDetails.image ? (
                        <img
                          src={buildAssetUrl(selectedCourseDetails.image)}
                          alt={selectedCourseDetails.title}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '400px',
                            border: '1px solid #ddd',
                            padding: '4px',
                            borderRadius: '4px',
                          }}
                          className="mx-auto object-cover"
                        />
                      ) : (
                        <div className="alert alert-info bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded text-xs">
                          No image uploaded.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Course Documents (details.blade.php lines 122-193) */}
            <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="box-header with-border px-6 py-4 border-b border-slate-200">
                <h4 className="box-title text-base font-bold text-slate-800">Course Documents</h4>
              </div>
              <div className="box-body p-6">
                {selectedCourseDetails.documents && selectedCourseDetails.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedCourseDetails.documents.map((document) => {
                      const fileInfo = getDocFileInfo(document.file);
                      const fileUrl = buildAssetUrl(document.file);
                      return (
                        <div key={document.id} className="card border border-slate-200 rounded-lg p-4 text-center">
                          <div className="card-body py-4 flex flex-col items-center justify-between h-full">
                            <div className="mb-2">{fileInfo.icon}</div>
                            <h5 className="text-truncate font-bold text-slate-800 text-xs truncate w-full mb-1">
                              {document.title}
                            </h5>
                            <small className="text-muted text-slate-400 block truncate w-full mb-3 text-[10px]">
                              {document.file.split('/').pop()}
                            </small>

                            {fileInfo.type === 'pdf' || fileInfo.type === 'image' ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewDoc({
                                    title: document.title,
                                    url: fileUrl,
                                    type: fileInfo.type,
                                  })
                                }
                                className="btn btn-sm btn-info bg-[#17a2b8] hover:bg-[#138496] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 w-full shadow-xs transition"
                              >
                                <Eye className="w-3.5 h-3.5" /> View Document
                              </button>
                            ) : (
                              <a
                                href={fileUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-success bg-[#28a745] hover:bg-[#218838] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 w-full shadow-xs transition"
                              >
                                <Download className="w-3.5 h-3.5" /> Download Document
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted text-center text-slate-400 text-xs py-4">
                    No documents uploaded for this course.
                  </p>
                )}
              </div>
            </div>

            {/* Box 3: Course Contents (details.blade.php lines 197-263) */}
            <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="box-header with-border px-6 py-4 border-b border-slate-200">
                <h4 className="box-title text-base font-bold text-slate-800">Course Contents</h4>
              </div>
              <div className="box-body p-6">
                {selectedCourseDetails.contents && selectedCourseDetails.contents.length > 0 ? (
                  <div className="table-responsive overflow-x-auto border border-slate-200 rounded">
                    <table className="table table-bordered table-striped w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                          <th className="py-2.5 px-3 border-r border-slate-200 w-16">Sr.No.</th>
                          <th className="py-2.5 px-3 border-r border-slate-200">Title</th>
                          <th className="py-2.5 px-3 border-r border-slate-200">Type</th>
                          <th className="py-2.5 px-3 border-r border-slate-200">Source</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedCourseDetails.contents.map((content, idx) => (
                          <tr key={content.id} className="hover:bg-slate-50/70">
                            <td className="py-2 px-3 border-r border-slate-200 font-mono text-slate-600">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900">
                              {content.title}
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200">
                              {content.type === 'video' ? (
                                <span className="badge badge-info bg-[#17a2b8] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                  Video
                                </span>
                              ) : (
                                <span className="badge badge-warning bg-[#ffc107] text-slate-900 px-2 py-0.5 rounded text-[11px] font-bold">
                                  Document
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 border-r border-slate-200">
                              {content.file ? (
                                <a
                                  href={buildAssetUrl(content.file)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-xs btn-info bg-[#17a2b8] hover:bg-[#138496] text-white px-2.5 py-1 rounded text-xs font-semibold inline-flex items-center gap-1 shadow-xs"
                                >
                                  <Eye className="w-3 h-3" />{' '}
                                  {content.type === 'video' ? 'View Video' : 'View Document'}
                                </a>
                              ) : content.url ? (
                                <a
                                  href={content.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-xs btn-info bg-[#17a2b8] hover:bg-[#138496] text-white px-2.5 py-1 rounded text-xs font-semibold inline-flex items-center gap-1 shadow-xs"
                                >
                                  <ExternalLink className="w-3 h-3" /> Open URL
                                </a>
                              ) : (
                                <span className="text-muted text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {content.status === 1 ? (
                                <span className="badge badge-success bg-[#28a745] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                  Active
                                </span>
                              ) : (
                                <span className="badge badge-danger bg-[#dc3545] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                  Inactive
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center text-slate-400 text-xs py-4">
                    No contents added for this course.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Document Preview Lightbox Modal (details.blade.php documentModal) */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h5 className="modal-title font-bold text-xs text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {previewDoc.title}
                </h5>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="modal-body p-4 bg-slate-100 flex items-center justify-center overflow-auto">
                {previewDoc.type === 'pdf' ? (
                  <iframe
                    src={previewDoc.url}
                    title={previewDoc.title}
                    style={{ width: '100%', height: '600px', border: 'none' }}
                    className="rounded border border-slate-200"
                  />
                ) : (
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.title}
                    style={{ maxWidth: '100%', maxHeight: '600px' }}
                    className="rounded object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER: VIEW 5 - ADD / EDIT COURSE WIZARD (create.blade.php & edit.blade.php)
  // ───────────────────────────────────────────────────────────────────────────
  if (isCoursesPage && (subView === 'add' || subView === 'edit')) {
    return (
      <div className="w-full space-y-4">
        {/* Content Header */}
        <div className="content-header pb-2">
          <div className="d-flex align-items-center flex justify-between items-center">
            <div className="me-auto">
              <h4 className="page-title text-xl font-bold text-slate-800">
                {subView === 'add' ? 'Add Academy Course' : 'Edit Academy Course'}
              </h4>
              <div className="d-inline-block align-items-center">
                <nav>
                  <ol className="breadcrumb flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <li className="breadcrumb-item">
                      <Link to="/admin/home" className="hover:text-slate-800">
                        <Home className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item">
                      <button onClick={() => setSubView('list')} className="hover:text-slate-800">
                        Academy Courses
                      </button>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                      {subView === 'add' ? 'Add Course' : 'Edit Course'}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Wizard Form Box (Exact matching Laravel .box) */}
        <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="box-header with-border px-6 py-4 border-b border-slate-200">
            <h4 className="box-title text-base font-bold text-slate-800">Course Info</h4>
          </div>

          <form onSubmit={handleSaveCourse} className="form" id="courseForm">
            <div className="box-body p-6 space-y-6 text-xs">
              {/* Step indicator (create.blade.php lines 52-67) */}
              <div className="course-wizard flex items-center justify-center gap-3 py-2 border-b border-slate-200">
                <div
                  onClick={() => setWizardStep(1)}
                  className={`wizard-step-item flex items-center gap-2 cursor-pointer ${
                    wizardStep === 1 ? 'text-[#007bff] font-bold' : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`wizard-circle w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      wizardStep === 1 ? 'bg-[#007bff] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    1
                  </div>
                  <div className="wizard-label text-xs">Basic Info</div>
                </div>

                <div
                  className={`wizard-step-line w-16 h-0.5 ${wizardStep >= 2 ? 'bg-[#007bff]' : 'bg-slate-200'}`}
                ></div>

                <div
                  onClick={() => setWizardStep(2)}
                  className={`wizard-step-item flex items-center gap-2 cursor-pointer ${
                    wizardStep === 2 ? 'text-[#007bff] font-bold' : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`wizard-circle w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      wizardStep === 2 ? 'bg-[#007bff] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    2
                  </div>
                  <div className="wizard-label text-xs">Description &amp; Image</div>
                </div>

                <div
                  className={`wizard-step-line w-16 h-0.5 ${wizardStep >= 3 ? 'bg-[#007bff]' : 'bg-slate-200'}`}
                ></div>

                <div
                  onClick={() => setWizardStep(3)}
                  className={`wizard-step-item flex items-center gap-2 cursor-pointer ${
                    wizardStep === 3 ? 'text-[#007bff] font-bold' : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`wizard-circle w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      wizardStep === 3 ? 'bg-[#007bff] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    3
                  </div>
                  <div className="wizard-label text-xs">Documents &amp; Contents</div>
                </div>
              </div>

              {/* Step 1: Basic Info (create.blade.php lines 70-144) */}
              {wizardStep === 1 && (
                <div className="form-step space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label block font-bold text-slate-700 mb-1">
                        Course Title <span className="text-danger text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        placeholder="Enter Course Title"
                        value={courseFormData.title}
                        onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                        className="form-control w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#007bff]"
                      />
                    </div>

                    <div>
                      <label className="form-label block font-bold text-slate-700 mb-1">
                        Course Price <span className="text-danger text-rose-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        value={courseFormData.price}
                        onChange={(e) => setCourseFormData({ ...courseFormData, price: e.target.value })}
                        className="form-control w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#007bff] font-mono"
                      />
                    </div>

                    <div>
                      <label className="form-label block font-bold text-slate-700 mb-1">
                        Category <span className="text-danger text-rose-600">*</span>
                      </label>
                      <select
                        name="category_id"
                        required
                        value={courseFormData.category_id}
                        onChange={(e) =>
                          setCourseFormData({
                            ...courseFormData,
                            category_id: e.target.value,
                            sub_category_id: '',
                          })
                        }
                        className="form-control w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#007bff] bg-white"
                      >
                        <option value="">Select Category</option>
                        {parentCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label block font-bold text-slate-700 mb-1">Sub Category</label>
                      <select
                        name="sub_category_id"
                        value={courseFormData.sub_category_id}
                        onChange={(e) => setCourseFormData({ ...courseFormData, sub_category_id: e.target.value })}
                        className="form-control w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#007bff] bg-white"
                      >
                        <option value="">Select Sub Category</option>
                        {subcategoriesForCourse.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label block font-bold text-slate-700 mb-1">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        placeholder="e.g. 2 hours / 3 weeks"
                        value={courseFormData.duration}
                        onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                        className="form-control w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#007bff]"
                      />
                    </div>

                    <div>
                      <label className="form-label block font-bold text-slate-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={courseFormData.status}
                        onChange={(e) => setCourseFormData({ ...courseFormData, status: Number(e.target.value) })}
                        className="form-control w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#007bff] bg-white"
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Description & Image (create.blade.php lines 147-186) */}
              {wizardStep === 2 && (
                <div className="form-step space-y-4">
                  <div>
                    <label className="form-label block font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      rows={6}
                      placeholder="Enter Course Description"
                      value={courseFormData.description}
                      onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                      className="form-control w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#007bff]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    <div>
                      <label className="form-label block font-bold text-slate-700 mb-1">Course Image</label>
                      <input
                        type="file"
                        name="image"
                        accept="image/jpg,image/jpeg,image/png,image/webp"
                        onChange={handleCourseImageChange}
                        className="form-control w-full px-3 py-2 border border-slate-300 rounded bg-slate-50"
                      />
                      <span className="text-muted text-[11px] text-slate-400 mt-1 block">
                        JPG, JPEG, PNG, WEBP. Max 2MB.
                      </span>
                    </div>

                    <div>
                      <label className="form-label block font-bold text-slate-700 mb-1">Image Preview</label>
                      <div>
                        {courseFormData.imagePreview ? (
                          <img
                            src={courseFormData.imagePreview}
                            alt="Preview"
                            style={{
                              maxWidth: '150px',
                              maxHeight: '150px',
                              border: '1px solid #ddd',
                              padding: '4px',
                              borderRadius: '4px',
                            }}
                          />
                        ) : courseFormData.existingImage ? (
                          <img
                            src={buildAssetUrl(courseFormData.existingImage)}
                            alt="Current"
                            style={{
                              maxWidth: '150px',
                              maxHeight: '150px',
                              border: '1px solid #ddd',
                              padding: '4px',
                              borderRadius: '4px',
                            }}
                          />
                        ) : (
                          <span className="text-slate-400 text-xs">No image chosen</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents & Contents (create.blade.php lines 189-260) */}
              {wizardStep === 3 && (
                <div className="form-step space-y-5">
                  {/* Documents Section */}
                  <div>
                    <label className="form-label block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-blue-600" /> Course Documents
                    </label>
                    <input
                      type="file"
                      name="doc_file[]"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
                      onChange={handleDocFilesChange}
                      className="form-control w-full px-3 py-2 border border-slate-300 rounded bg-slate-50"
                    />

                    {/* Staged files */}
                    {courseFormData.docFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <span className="font-bold text-[11px] text-slate-700">Files ready to upload:</span>
                        {courseFormData.docFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded text-xs"
                          >
                            <span className="font-medium text-blue-900 truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveDocFile(idx)}
                              className="text-rose-600 hover:text-rose-800 font-bold ml-2"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Existing documents if editing */}
                    {courseFormData.existingDocs.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <span className="font-bold text-[11px] text-slate-700">Attached Documents:</span>
                        {courseFormData.existingDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="font-bold text-slate-800 truncate">{doc.title}</span>
                              <span className="text-slate-400 text-[10px] truncate">({doc.file.split('/').pop()})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="btn btn-xs btn-danger bg-[#dc3545] text-white p-1 rounded hover:bg-[#c82333]"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contents Section */}
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="form-label font-bold text-slate-700">Course Contents &amp; Lessons</label>
                      <button
                        type="button"
                        onClick={handleAddNewContentRow}
                        className="btn btn-sm btn-info bg-[#17a2b8] hover:bg-[#138496] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3 h-3" /> Add Lesson Row
                      </button>
                    </div>

                    {/* Existing contents */}
                    {courseFormData.existingContents.length > 0 && (
                      <div className="mb-3 space-y-1">
                        <span className="font-bold text-[11px] text-slate-700">Attached Lessons:</span>
                        {courseFormData.existingContents.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="font-bold text-slate-800">{c.title}</span>
                              <span className="badge badge-info bg-[#17a2b8] text-white px-1.5 py-0.5 rounded text-[10px] uppercase">
                                {c.type}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteContent(c.id)}
                              className="btn btn-xs btn-danger bg-[#dc3545] text-white p-1 rounded hover:bg-[#c82333]"
                              title="Delete Lesson"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dynamic new rows */}
                    {courseFormData.newContents.length === 0 ? (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center text-slate-400 text-xs">
                        No lessons added yet. Click "+ Add Lesson Row" to add video lessons or reading materials.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {courseFormData.newContents.map((row, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2 relative"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-700 text-xs">Lesson #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveNewContentRow(idx)}
                                className="text-rose-600 hover:text-rose-800 font-bold"
                                title="Remove lesson row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="Lesson Title *"
                                value={row.title}
                                onChange={(e) => handleUpdateNewContentRow(idx, 'title', e.target.value)}
                                className="form-control px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
                              />
                              <select
                                value={row.type}
                                onChange={(e) =>
                                  handleUpdateNewContentRow(idx, 'type', e.target.value as 'video' | 'document')
                                }
                                className="form-control px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
                              >
                                <option value="video">Video</option>
                                <option value="document">Document</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Video URL (YouTube/Vimeo/Direct)"
                                value={row.url}
                                onChange={(e) => handleUpdateNewContentRow(idx, 'url', e.target.value)}
                                className="form-control px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white font-mono"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Box Footer Controls */}
            <div className="box-footer px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <div>
                {wizardStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep((s) => (s - 1) as any)}
                    className="btn btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSubView('list')}
                  className="btn btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-3.5 py-1.5 rounded text-xs font-semibold shadow-xs"
                >
                  Cancel
                </button>

                {wizardStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep((s) => (s + 1) as any)}
                    className="btn btn-primary bg-[#007bff] hover:bg-[#0069d9] text-white px-4 py-1.5 rounded text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={courseSaving}
                    className="btn btn-success bg-[#28a745] hover:bg-[#218838] text-white px-4 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    {courseSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Save Course
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default AcademyAdminPage;
