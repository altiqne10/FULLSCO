import { useQuery } from '@tanstack/react-query';
import { FileText, LayoutDashboard, GraduationCap, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import AdminLayout from '@/components/admin/admin-layout';
import { Link } from 'wouter';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Fetch statistics
  const { data: scholarships } = useQuery({
    queryKey: ['/api/scholarships'],
  });

  const { data: posts } = useQuery({
    queryKey: ['/api/posts'],
  });

  const { data: users } = useQuery({
    queryKey: ['/api/users'],
  });

  const { data: subscribers } = useQuery({
    queryKey: ['/api/subscribers'],
  });

  const formatNumber = (num: number) => {
    return num.toString();
  };

  return (
    <AdminLayout title="لوحة التحكم" actions={null}>
      {/* Welcome Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-2">مرحباً بك في لوحة إدارة FULLSCO</h2>
        <p className="text-gray-600">يمكنك إدارة محتوى الموقع من هنا</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-blue-50 p-3 rounded-full">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {Array.isArray(scholarships) ? formatNumber(scholarships.length) : 0}
          </h3>
          <p className="text-gray-500">إجمالي المنح</p>
          <Link href="/admin/scholarships" className="text-blue-600 text-sm mt-4 inline-block">
            إدارة المنح
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-green-50 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {Array.isArray(users) ? formatNumber(users.length) : 0}
          </h3>
          <p className="text-gray-500">المستخدمين</p>
          <Link href="/admin/users" className="text-blue-600 text-sm mt-4 inline-block">
            إدارة المستخدمين
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-purple-50 p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {Array.isArray(posts) ? formatNumber(posts.length) : 0}
          </h3>
          <p className="text-gray-500">المقالات</p>
          <Link href="/admin/posts" className="text-blue-600 text-sm mt-4 inline-block">
            إدارة المقالات
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-50 p-3 rounded-full">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {Array.isArray(subscribers) ? formatNumber(subscribers.length) : 0}
          </h3>
          <p className="text-gray-500">المشتركين</p>
          <Link href="/admin/subscribers" className="text-blue-600 text-sm mt-4 inline-block">
            إدارة المشتركين
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-lg font-bold mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/scholarships/create" className="border p-4 rounded-lg text-center hover:bg-gray-50 transition-colors">
            إضافة منحة جديدة
          </Link>
          <Link href="/admin/posts/create" className="border p-4 rounded-lg text-center hover:bg-gray-50 transition-colors">
            إنشاء مقال جديد
          </Link>
          <Link href="/admin/categories" className="border p-4 rounded-lg text-center hover:bg-gray-50 transition-colors">
            إدارة التصنيفات
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
