import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, Users, GraduationCap, FileText, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { formatNumber } from '@/lib/utils';
import AdminLayout from '@/components/admin/admin-layout';

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

  return (
    <AdminLayout title="لوحة التحكم">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-l from-primary/20 to-primary/5 border-none shadow-md mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">مرحباً بك في لوحة التحكم</h2>
              <p className="text-muted-foreground mt-2">
                هنا يمكنك إدارة المنح الدراسية والمستخدمين والمقالات وغيرها من المحتوى
              </p>
            </div>
            <div className="hidden md:block">
              <BarChart2 className="h-12 w-12 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">
                {Array.isArray(scholarships) ? formatNumber(scholarships.length) : 0}
              </h3>
              <p className="text-muted-foreground">إجمالي المنح</p>
              <Link href="/admin/scholarships">
                <Button variant="ghost" size="sm" className="mt-4 px-0 w-full justify-start">
                  إدارة المنح
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-green-50 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">
                {Array.isArray(users) ? formatNumber(users.length) : 0}
              </h3>
              <p className="text-muted-foreground">المستخدمين</p>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="mt-4 px-0 w-full justify-start">
                  إدارة المستخدمين
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-purple-50 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">
                {Array.isArray(posts) ? formatNumber(posts.length) : 0}
              </h3>
              <p className="text-muted-foreground">المقالات</p>
              <Link href="/admin/posts">
                <Button variant="ghost" size="sm" className="mt-4 px-0 w-full justify-start">
                  إدارة المقالات
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-amber-50 p-3 rounded-full">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">
                {Array.isArray(subscribers) ? formatNumber(subscribers.length) : 0}
              </h3>
              <p className="text-muted-foreground">المشتركين</p>
              <Link href="/admin/subscribers">
                <Button variant="ghost" size="sm" className="mt-4 px-0 w-full justify-start">
                  إدارة المشتركين
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link href="/admin/scholarships/create">
            <Button className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2" variant="outline">
              <PlusCircle className="h-5 w-5" />
              <span>إضافة منحة جديدة</span>
            </Button>
          </Link>
          <Link href="/admin/posts/create">
            <Button className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2" variant="outline">
              <FileText className="h-5 w-5" />
              <span>إنشاء مقال جديد</span>
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2" variant="outline">
              <FileText className="h-5 w-5" />
              <span>إدارة التصنيفات</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
