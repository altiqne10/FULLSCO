import { useState } from 'react';
import { useLocation } from 'wouter';
import { Trophy, PlusCircle, Edit, Trash2, Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useSuccessStories } from '@/hooks/use-success-stories';
import AdminLayout from '@/components/admin/admin-layout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { SuccessStory } from '@shared/schema';

const AdminSuccessStories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // Use our hooks to get actual data
  const { successStories, isLoading, error } = useSuccessStories();

  // Create a delete mutation
  const deleteStoryMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest(`/api/success-stories/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/success-stories'] });
    },
  });

  // Create a publish/unpublish mutation
  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) => {
      return apiRequest(`/api/success-stories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/success-stories'] });
    },
  });

  // Handle story deletion
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف قصة "${name}"؟`)) {
      deleteStoryMutation.mutate(id);
    }
  };

  // Toggle publish status
  const togglePublish = (id: number, currentStatus: boolean | undefined) => {
    // Set to true if undefined or false, and false if true
    const newStatus = !(currentStatus === true);
    togglePublishMutation.mutate({ id, isPublished: newStatus });
  };

  // Handle navigation to create page
  const handleAddNew = () => {
    setLocation('/admin/success-stories/create');
  };

  // Filter success stories
  const filteredSuccessStories = Array.isArray(successStories) 
    ? successStories.filter(story => 
        story.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        story.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Actions for AdminLayout header
  const actions = (
    <button 
      onClick={handleAddNew}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
    >
      <PlusCircle className="h-4 w-4" />
      إضافة قصة جديدة
    </button>
  );

  // Helper function to determine if a story is published
  const isStoryPublished = (story: any) => {
    return story.isPublished === true;
  };

  // Count published and draft stories
  const publishedCount = Array.isArray(successStories) 
    ? successStories.filter(story => isStoryPublished(story)).length 
    : 0;
  
  const draftCount = Array.isArray(successStories) 
    ? successStories.filter(story => !isStoryPublished(story)).length 
    : 0;

  // Error handling
  if (error) {
    return (
      <AdminLayout title="إدارة قصص النجاح" actions={actions}>
        <div className="p-8 text-center bg-red-50 rounded-lg">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-3" />
          <p className="text-red-600 font-medium">حدث خطأ أثناء تحميل البيانات</p>
          <p className="text-gray-600 mt-2">يرجى تحديث الصفحة أو المحاولة مرة أخرى لاحقًا</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="إدارة قصص النجاح" actions={actions}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="بحث في قصص النجاح..."
            className="w-full border rounded-md py-2 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Success Stories Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {isLoading || deleteStoryMutation.isPending || togglePublishMutation.isPending ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4">جاري تحميل البيانات...</p>
          </div>
        ) : filteredSuccessStories.length === 0 ? (
          <div className="p-8 text-center">
            <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">لا توجد قصص نجاح حتى الآن</p>
            <button 
              onClick={handleAddNew}
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              إضافة قصة نجاح جديدة
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">الاسم</th>
                  <th className="px-6 py-3">العنوان</th>
                  <th className="px-6 py-3">المنحة المرتبطة</th>
                  <th className="px-6 py-3">تاريخ الإضافة</th>
                  <th className="px-6 py-3">الحالة</th>
                  <th className="px-6 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuccessStories.map((story: any, index) => (
                  <tr key={story.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4">{story.name}</td>
                    <td className="px-6 py-4">{story.title}</td>
                    <td className="px-6 py-4">
                      {story.scholarshipName || 'غير مرتبط بمنحة'}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(story.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(story.id, isStoryPublished(story))}
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                          isStoryPublished(story) 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {isStoryPublished(story) ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>منشور</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" />
                            <span>مسودة</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setLocation(`/admin/success-stories/edit/${story.id}`)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                          title="تعديل"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(story.id, story.name)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                          title="حذف"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي القصص</p>
              <p className="text-2xl font-bold">{Array.isArray(successStories) ? successStories.length : 0}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المنشورة</p>
              <p className="text-2xl font-bold">{publishedCount}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المسودات</p>
              <p className="text-2xl font-bold">{draftCount}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSuccessStories;