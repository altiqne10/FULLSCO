import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  BarChart2, 
  Users, 
  GraduationCap, 
  FileText, 
  PlusCircle, 
  Edit, 
  UserPlus,
  Eye,
  Activity,
  ArrowUp,
  ArrowDown,
  Newspaper,
  Mail,
  Globe,
  BookOpen,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ListTodo,
  Sparkles,
  Calendar,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'wouter';
import { formatNumber, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/admin/admin-layout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("week");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch statistics
  const { data: scholarships, isLoading: scholarshipsLoading } = useQuery({
    queryKey: ['/api/scholarships'],
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['/api/posts'],
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
  });

  const { data: subscribers, isLoading: subscribersLoading } = useQuery({
    queryKey: ['/api/subscribers'],
  });

  const stats = [
    {
      title: "إجمالي المنح",
      value: Array.isArray(scholarships) ? scholarships.length : 0,
      change: 12.5,
      trending: "up",
      icon: GraduationCap,
      color: "bg-blue-50 dark:bg-blue-950 text-blue-500",
      link: "/admin/scholarships",
      isLoading: scholarshipsLoading
    },
    {
      title: "المستخدمين",
      value: Array.isArray(users) ? users.length : 0,
      change: 8.1,
      trending: "up",
      icon: Users,
      color: "bg-green-50 dark:bg-green-950 text-green-500",
      link: "/admin/users",
      isLoading: usersLoading
    },
    {
      title: "المقالات",
      value: Array.isArray(posts) ? posts.length : 0,
      change: 5.4,
      trending: "up",
      icon: Newspaper,
      color: "bg-purple-50 dark:bg-purple-950 text-purple-500",
      link: "/admin/posts",
      isLoading: postsLoading
    },
    {
      title: "المشتركين",
      value: Array.isArray(subscribers) ? subscribers.length : 0,
      change: -2.3,
      trending: "down",
      icon: Mail,
      color: "bg-amber-50 dark:bg-amber-950 text-amber-500",
      link: "/admin/subscribers",
      isLoading: subscribersLoading
    }
  ];

  const targets = [
    {
      title: "منح جديدة",
      target: 50,
      current: 24,
      color: "bg-blue-500"
    },
    {
      title: "مستخدمين نشطين",
      target: 1000,
      current: 620,
      color: "bg-green-500"
    },
    {
      title: "مشتركين في النشرة البريدية",
      target: 500,
      current: 385,
      color: "bg-amber-500"
    }
  ];

  const todos = [
    {
      task: "تحديث صفحة الشروط والأحكام",
      priority: "عالية",
      priorityColor: "bg-red-500",
      dueDate: "اليوم"
    },
    {
      task: "مراجعة طلبات المنح الجديدة",
      priority: "متوسطة",
      priorityColor: "bg-amber-500",
      dueDate: "غداً"
    },
    {
      task: "إضافة منح دراسية جديدة",
      priority: "عادية",
      priorityColor: "bg-green-500",
      dueDate: "خلال 3 أيام"
    }
  ];

  const recentActivity = [
    {
      type: "add",
      entity: "منحة",
      title: "منحة جيتس كامبريدج",
      time: "منذ ساعتين",
      user: "أحمد محمد",
      userAvatar: null,
      icon: PlusCircle,
      color: "bg-blue-50 dark:bg-blue-950 text-blue-500"
    },
    {
      type: "edit",
      entity: "مقال",
      title: "نصائح لمقابلات المنح الدراسية",
      time: "منذ 5 ساعات",
      user: "سارة علي",
      userAvatar: null,
      icon: Edit,
      color: "bg-purple-50 dark:bg-purple-950 text-purple-500"
    },
    {
      type: "add",
      entity: "مستخدم",
      title: "أحمد محمود",
      time: "الأمس",
      user: "النظام",
      userAvatar: null,
      icon: UserPlus,
      color: "bg-green-50 dark:bg-green-950 text-green-500"
    },
    {
      type: "view",
      entity: "مقال",
      title: "كيف تكتب مقال ناجح للمنحة الدراسية",
      time: "منذ يومين",
      user: "خالد عمر",
      userAvatar: null,
      icon: Eye,
      color: "bg-amber-50 dark:bg-amber-950 text-amber-500"
    }
  ];

  // Alerts or notifications
  const alerts = [
    {
      type: "warning",
      title: "تحديث أمان ضروري",
      message: "يجب تحديث نظام إدارة المحتوى للحفاظ على أمان الموقع",
      time: "منذ ساعة",
      icon: AlertCircle,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
    },
    {
      type: "success",
      title: "تم النسخ الاحتياطي بنجاح",
      message: "تم إنشاء نسخة احتياطية تلقائية لقاعدة البيانات",
      time: "منذ 3 ساعات",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
    }
  ];

  // Popular Pages/Content
  const popularContent = [
    {
      title: "منحة جامعة هارفارد",
      type: "منحة",
      views: 1240,
      icon: GraduationCap,
      growth: 15,
      trending: "up"
    },
    {
      title: "كيفية كتابة السيرة الذاتية الأكاديمية",
      type: "مقال",
      views: 986,
      icon: FileText,
      growth: 8,
      trending: "up"
    },
    {
      title: "المنح الدراسية في المملكة المتحدة",
      type: "صفحة",
      views: 752,
      icon: Globe,
      growth: -3,
      trending: "down"
    }
  ];

  return (
    <AdminLayout
      title="لوحة التحكم"
      actions={
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="الفترة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">اليوم</SelectItem>
            <SelectItem value="week">هذا الأسبوع</SelectItem>
            <SelectItem value="month">هذا الشهر</SelectItem>
            <SelectItem value="year">هذا العام</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {/* Welcome Card */}
      <Card className="bg-gradient-to-l from-primary/20 to-primary/5 border-none shadow-md mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">مرحباً، {typeof user === 'object' && user ? (user.fullName || user.username || 'المدير') : 'المدير'}</h2>
              <p className="text-muted-foreground mt-1 max-w-lg">هذه هي لوحة تحكم FULLSCO - استقبل الموقع <strong>1,240</strong> زائر جديد و <strong>62</strong> اشتراك في النشرة البريدية.</p>
            </div>
            <div className="hidden md:block">
              <BarChart2 className="h-10 w-10 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm border-muted">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-xs bg-secondary/20 px-2 py-1 rounded-full flex items-center">
                  {stat.trending === "up" ? <ArrowUp className="ml-1 h-3 w-3 text-green-500" /> : <ArrowDown className="ml-1 h-3 w-3 text-red-500" />}
                  <span className={stat.trending === "up" ? "text-green-600" : "text-red-600"}>
                    {Math.abs(stat.change)}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  {stat.isLoading ? (
                    <div className="h-8 bg-muted/50 rounded animate-pulse w-16"></div>
                  ) : (
                    formatNumber(stat.value)
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
              <div className="mt-3">
                <Link href={stat.link}>
                  <Button variant="ghost" size="sm" className="px-0 text-muted-foreground hover:text-primary w-full justify-start">
                    عرض التفاصيل <ChevronLeft className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Activity Card */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold">آخر النشاطات</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">عرض الكل</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex p-3 rounded-lg hover:bg-muted/30 transition-colors border border-border/50">
                  <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center ml-3 shrink-0`}>
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          <span>
                            {activity.type === 'add' && 'إضافة'}
                            {activity.type === 'edit' && 'تحديث'}
                            {activity.type === 'view' && 'مشاهدة'}
                          </span>
                          {' '}
                          {activity.entity}: <span>{activity.title}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">بواسطة {activity.user}</p>
                      </div>
                      <div className="text-xs border px-2 py-0.5 rounded-full h-6 flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 ml-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                عرض المزيد من النشاطات
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Targets Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">أهداف {timeRange === 'day' ? 'اليوم' : timeRange === 'week' ? 'الأسبوع' : timeRange === 'month' ? 'الشهر' : 'العام'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {targets.map((target, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{target.title}</span>
                      <span className="text-sm text-muted-foreground">{target.current}/{target.target}</span>
                    </div>
                    <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${target.color}`}
                        style={{ width: `${(target.current / target.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" size="sm" className="w-full">
                <TrendingUp className="ml-2 h-4 w-4" />
                إدارة الأهداف
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/admin/scholarships/create">
                  <Button className="w-full justify-between" variant="default">
                    <div className="flex items-center">
                      <PlusCircle className="ml-2 h-4 w-4" /> إضافة منحة جديدة
                    </div>
                    <ChevronLeft className="h-4 w-4 opacity-70" />
                  </Button>
                </Link>
                <Link href="/admin/posts/create">
                  <Button className="w-full justify-between" variant="secondary">
                    <div className="flex items-center">
                      <FileText className="ml-2 h-4 w-4" /> إنشاء مقال جديد
                    </div>
                    <ChevronLeft className="h-4 w-4 opacity-70" />
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button className="w-full justify-between" variant="outline">
                    <div className="flex items-center">
                      <Activity className="ml-2 h-4 w-4" /> عرض التحليلات
                    </div>
                    <ChevronLeft className="h-4 w-4 opacity-70" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popular Content */}
      <Card className="shadow-sm mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold">المحتوى الأكثر شعبية</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">عرض التقرير الكامل</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularContent.map((item, index) => (
              <Card key={index} className="bg-muted/30 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-md bg-background mr-2">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-xs border px-2 py-0.5 rounded-full">
                      {item.type}
                    </div>
                  </div>
                  <h3 className="font-medium line-clamp-1">{item.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground ml-1" />
                      <span className="text-sm text-muted-foreground">{item.views}</span>
                    </div>
                    <div className="text-xs px-2 py-0.5 rounded-full flex items-center">
                      {item.trending === "up" ? 
                        <ArrowUp className="ml-1 h-3 w-3 text-green-500" /> : 
                        <ArrowDown className="ml-1 h-3 w-3 text-red-500" />
                      }
                      <span className={item.trending === "up" ? "text-green-600" : "text-red-600"}>
                        {Math.abs(item.growth)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Card */}
      <Card className="shadow-sm mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-bold">المهام العاجلة</CardTitle>
              <CardDescription>المهام المطلوب إنجازها قريباً</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <PlusCircle className="ml-2 h-4 w-4" />
              مهمة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todos.map((todo, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 rtl:space-x-reverse hover:bg-muted/30">
                <div className="mr-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ListTodo className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
                <div className="flex-1 mr-2">
                  <p className="font-medium">{todo.task}</p>
                  <div className="flex items-center mt-1">
                    <div className={`text-xs px-2 py-0.5 rounded-full ${todo.priorityColor} bg-white`}>
                      {todo.priority}
                    </div>
                    <span className="text-xs text-muted-foreground mr-2">
                      <Calendar className="inline-block ml-1 h-3.5 w-3.5" />
                      {todo.dueDate}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="p-1 h-8">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground hover:text-green-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
