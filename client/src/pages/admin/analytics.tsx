import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/admin/sidebar';
import { Button } from '@/components/ui/button';
import { Menu, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart, 
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

// ألوان للرسوم البيانية
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface AnalyticsUser {
  role?: string;
}

export default function AdminAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState('monthly');
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  
  const toggleSidebar = () => {
    console.log('Analytics: toggling sidebar');
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    console.log('Analytics: closing sidebar');
    setSidebarOpen(false);
  };

  // جلب بيانات لوحة المعلومات التحليلية
  const { data: analyticsData, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/dashboard?period=${timeRange}`);
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات التحليلات');
      }
      return response.json();
    },
    enabled: !!user && (user as AnalyticsUser)?.role === 'admin',
    staleTime: 1000 * 60 * 5, // 5 دقائق
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // إعادة جلب البيانات عند تغيير الفترة الزمنية
    if (user && (user as AnalyticsUser)?.role === 'admin') {
      refetch();
    }
  }, [timeRange, user, refetch]);

  // في حالة عدم تسجيل الدخول أو فشل المصادقة
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول للوصول إلى لوحة المعلومات التحليلية",
        variant: "destructive",
      });
      navigate('/admin/login');
    } else if (user && (user as AnalyticsUser)?.role !== 'admin') {
      toast({
        title: "وصول مرفوض",
        description: "يجب أن تكون مسؤولاً للوصول إلى هذه الصفحة",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [authLoading, user, navigate, toast]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="flex">
        {/* Sidebar for desktop */}
        {!isMobile && <Sidebar isMobileOpen={false} onClose={() => {}} />}
        
        {/* Mobile Sidebar */}
        {isMobile && <Sidebar isMobileOpen={sidebarOpen} onClose={closeSidebar} />}
        
        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-6 ${!isMobile ? 'mr-64' : ''}`}>
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6">
            {isMobile && (
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={toggleSidebar} 
                className="text-muted-foreground"
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
            <h1 className="text-2xl font-bold">التحليلات</h1>
            
            <div className="w-48">
              <Select 
                value={timeRange} 
                onValueChange={setTimeRange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفترة الزمنية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="yearly">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">جاري تحميل البيانات...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="p-4 bg-red-50 text-red-600 rounded-md mb-4">
                <p className="font-semibold">حدث خطأ أثناء تحميل البيانات</p>
                <p className="text-sm">{(error as Error).message}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة المحاولة
              </Button>
            </div>
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">إجمالي الزيارات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData?.visitStats?.stats?.totalVisits?.toLocaleString() || 0}</div>
                    <p className="text-xs text-green-500 mt-1">
                      {analyticsData?.visitStats?.stats?.growth?.visits || '+0%'} من الفترة السابقة
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">المقالات المنشورة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData?.postStats?.totalPosts || 0}</div>
                    <p className="text-xs text-green-500 mt-1">
                      {analyticsData?.visitStats?.stats?.growth?.posts || '+0%'} من الفترة السابقة
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">المنح المنشورة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData?.scholarshipStats?.totalScholarships || 0}</div>
                    <p className="text-xs text-green-500 mt-1">
                      {analyticsData?.visitStats?.stats?.growth?.scholarships || '+0%'} من الفترة السابقة
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">المشتركين في النشرة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData?.visitStats?.stats?.subscriberCount || 0}</div>
                    <p className="text-xs text-green-500 mt-1">
                      {analyticsData?.visitStats?.stats?.growth?.subscribers || '+0%'} من الفترة السابقة
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* الزيارات حسب الفترة */}
                <Card>
                  <CardHeader>
                    <CardTitle>إحصائيات الزيارات</CardTitle>
                    <CardDescription>
                      إجمالي الزيارات خلال الفترة المحددة ({timeRange === 'daily' ? 'يومي' : timeRange === 'weekly' ? 'أسبوعي' : timeRange === 'monthly' ? 'شهري' : 'سنوي'})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData?.visitStats?.visitData || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="visits" 
                            name="الزيارات"
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* توزيع مصادر الزيارات */}
                <Card>
                  <CardHeader>
                    <CardTitle>مصادر الزيارات</CardTitle>
                    <CardDescription>
                      توزيع الزيارات حسب مصدر الوصول
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData?.trafficSources || []}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({name, percent}: {name: string, percent: number}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {(analyticsData?.trafficSources || []).map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* المقالات الأكثر مشاهدة */}
                <Card>
                  <CardHeader>
                    <CardTitle>المقالات الأكثر مشاهدة</CardTitle>
                    <CardDescription>
                      أكثر المقالات التي تمت زيارتها
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={analyticsData?.topContent?.posts || []}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={150} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="views" name="المشاهدات" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* إحصائيات المحتوى */}
                <Card>
                  <CardHeader>
                    <CardTitle>نشاط المحتوى</CardTitle>
                    <CardDescription>
                      مقارنة بين المقالات والمنح المنشورة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analyticsData?.visitStats?.visitData || []}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="articles" name="المقالات" fill="#0088FE" />
                          <Bar dataKey="scholarships" name="المنح الدراسية" fill="#00C49F" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}