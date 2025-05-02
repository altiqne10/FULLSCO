import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { formatDate, cn } from "@/lib/utils";
import Sidebar from "@/components/admin/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Menu,
  XCircle
} from "lucide-react";
import { Post, User } from "@shared/schema";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminPosts = () => {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch posts
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

  // Fetch users for author info
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: isAuthenticated,
  });

  // حذف المقال
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/posts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "تم حذف المقال",
        description: "تم حذف المقال بنجاح.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: `فشل في حذف المقال: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId !== undefined) {
      deleteMutation.mutate(deleteId);
    }
  };

  const getAuthorName = (authorId?: number) => {
    if (!authorId || !users) return "كاتب غير معروف";
    const author = users.find((u) => u.id === authorId);
    return author?.fullName || author?.username || "كاتب غير معروف";
  };

  const filteredPosts = posts?.filter((post) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(search) ||
      post.content.toLowerCase().includes(search) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(search)) ||
      getAuthorName(post.authorId).toLowerCase().includes(search)
    );
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen relative overflow-x-hidden">
      {/* السايدبار للجوال */}
      <Sidebar 
        isMobileOpen={sidebarOpen} 
        onClose={() => {
          console.log('Posts: closing sidebar');
          setSidebarOpen(false);
        }} 
      />
      
      {/* المحتوى الرئيسي */}
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "w-full" : "mr-64"
      )}>
        <main className="p-4 md:p-6">
          {/* زر فتح السايدبار في الجوال والهيدر */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-2" 
                  onClick={() => setSidebarOpen(true)}
                  aria-label="فتح القائمة"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-xl md:text-2xl font-bold">إدارة المقالات</h1>
            </div>
            <Link href="/admin/posts/create">
              <Button className="flex items-center w-full sm:w-auto shadow-soft">
                <PlusCircle className="ml-2 h-4 w-4" /> إضافة مقال جديد
              </Button>
            </Link>
          </div>

          <div className="bg-card p-4 md:p-6 rounded-lg shadow-soft mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن المقالات..."
                  className="pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredPosts?.length || 0} مقال
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="mt-2 text-muted-foreground">جاري تحميل المقالات...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
                <h3 className="text-lg font-medium mb-1">
                  خطأ في تحميل المقالات
                </h3>
                <p className="text-muted-foreground">يرجى المحاولة مرة أخرى لاحقًا.</p>
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العنوان</TableHead>
                      <TableHead>الكاتب</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المشاهدات</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          {post.title}
                        </TableCell>
                        <TableCell>{getAuthorName(post.authorId)}</TableCell>
                        <TableCell>{formatDate(post.createdAt)}</TableCell>
                        <TableCell className="flex items-center">
                          <Eye className="h-3 w-3 ml-1 text-muted-foreground" /> {post.views || 0}
                        </TableCell>
                        <TableCell>
                          {post.isFeatured ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">مميز</Badge>
                          ) : (
                            <Badge variant="secondary">منشور</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-start gap-2">
                            <Link
                              href={`/articles/${post.slug}`}
                              target="_blank"
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link
                              href={`/admin/posts/edit/${post.id}`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              onClick={() => handleDeleteClick(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  لم يتم العثور على مقالات. قم بإنشاء أول مقال باستخدام زر "إضافة مقال جديد".
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* نافذة تأكيد الحذف */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف المقال</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "جاري الحذف..." : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPosts;
