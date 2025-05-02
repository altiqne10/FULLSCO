import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import AdminLayout from '@/components/admin/admin-layout';
import RichEditor from '@/components/ui/rich-editor';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  Pencil,
  Save,
  X,
  Calendar as CalendarIcon,
  Link as LinkIcon,
  Globe,
  GraduationCap,
  BookOpen,
  Upload,
  FileText,
  FileCheck,
  AlertCircle,
  Loader2,
  Book,
  ChevronLeft,
  Image,
  RefreshCw,
} from 'lucide-react';

// نموذج المنحة الدراسية
const scholarshipFormSchema = z.object({
  title: z.string().min(10, 'العنوان يجب أن يكون 10 أحرف على الأقل').max(200, 'العنوان لا يجب أن يتجاوز 200 حرف'),
  slug: z.string().min(3, 'المسار يجب أن يكون 3 أحرف على الأقل')
    .max(100, 'المسار لا يجب أن يتجاوز 100 حرف')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'المسار يجب أن يحتوي على أحرف لاتينية صغيرة وأرقام وشرطات فقط'),
  description: z.string().min(10, 'الوصف المختصر يجب أن يكون 10 أحرف على الأقل').max(500, 'الوصف المختصر لا يجب أن يتجاوز 500 حرف'),
  content: z.string().min(10, 'المحتوى يجب أن يكون 10 أحرف على الأقل'),
  
  countryId: z.string().min(1, 'الرجاء اختيار الدولة'),
  levelId: z.string().min(1, 'الرجاء اختيار المستوى الدراسي'),
  categoryId: z.string().min(1, 'الرجاء اختيار التصنيف'),
  
  university: z.string().min(1, 'اسم الجامعة مطلوب'),
  department: z.string().optional(),
  website: z.string().url('يرجى إدخال رابط صحيح').optional().or(z.literal('')),
  
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  
  amount: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  
  seoTitle: z.string().max(70, 'عنوان SEO لا يجب أن يتجاوز 70 حرف').optional().nullable(),
  seoDescription: z.string().max(170, 'وصف SEO لا يجب أن يتجاوز 170 حرف').optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  focusKeyword: z.string().optional().nullable(),
});

type ScholarshipFormValues = z.infer<typeof scholarshipFormSchema>;

export default function CreateScholarshipPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  // استعلام عن الدول
  const { data: countries } = useQuery<any[]>({
    queryKey: ['/api/countries'],
    queryFn: async () => {
      const response = await fetch('/api/countries');
      if (!response.ok) throw new Error('فشل في استلام الدول');
      return response.json();
    }
  });
  
  // استعلام عن المستويات الدراسية
  const { data: levels } = useQuery<any[]>({
    queryKey: ['/api/levels'],
    queryFn: async () => {
      const response = await fetch('/api/levels');
      if (!response.ok) throw new Error('فشل في استلام المستويات الدراسية');
      return response.json();
    }
  });
  
  // استعلام عن التصنيفات
  const { data: categories } = useQuery<any[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('فشل في استلام التصنيفات');
      return response.json();
    }
  });
  
  // إضافة منحة جديدة
  const addScholarshipMutation = useMutation({
    mutationFn: async (newScholarship: ScholarshipFormValues) => {
      // تحويل ID إلى أرقام
      const payload = {
        ...newScholarship,
        countryId: parseInt(newScholarship.countryId),
        levelId: parseInt(newScholarship.levelId),
        categoryId: parseInt(newScholarship.categoryId),
      };
      
      const response = await fetch('/api/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إضافة المنحة');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scholarships'] });
      toast({
        title: 'تم إضافة المنحة بنجاح',
        description: 'تمت إضافة المنحة الدراسية الجديدة',
      });
      navigate('/admin/scholarships');
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ',
        description: `فشل في إضافة المنحة: ${error.message}`,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  });
  
  // تهيئة نموذج المنحة
  const form = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: '',
      countryId: '',
      levelId: '',
      categoryId: '',
      university: '',
      department: '',
      website: '',
      startDate: null,
      endDate: null,
      isFeatured: false,
      isPublished: true,
      amount: '',
      currency: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      focusKeyword: '',
    },
  });
  
  // معالجة تقديم النموذج
  const onSubmit = (data: ScholarshipFormValues) => {
    setIsSubmitting(true);
    addScholarshipMutation.mutate(data);
  };
  
  // إنشاء slug من العنوان
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };
  
  // تحديث slug عند تغير العنوان
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    // تحديث slug فقط إذا لم يتم تعديله يدوياً
    const currentSlug = form.getValues('slug');
    if (!currentSlug || currentSlug === generateSlug(form.getValues('title'))) {
      form.setValue('slug', generateSlug(title));
    }
    
    // تعيين عنوان SEO إذا لم يتم تعبئته
    const seoTitle = form.getValues('seoTitle');
    if (!seoTitle) {
      form.setValue('seoTitle', title);
    }
  };
  
  // تحديث عنوان SEO من العنوان الرئيسي
  const updateSeoFromTitle = () => {
    const title = form.getValues('title');
    form.setValue('seoTitle', title);
  };
  
  // تحديث وصف SEO من الوصف المختصر
  const updateSeoFromDescription = () => {
    const description = form.getValues('description');
    form.setValue('seoDescription', description);
  };
  
  // محتوى الصفحة
  const pageActions = (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost"
        onClick={() => setShowExitAlert(true)}
        disabled={isSubmitting}
        className="flex items-center gap-1"
      >
        <X className="h-4 w-4" />
        <span className="hidden sm:inline">إلغاء</span>
      </Button>
      <Button
        type="submit"
        form="scholarship-form" 
        disabled={isSubmitting}
        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جاري الحفظ...
          </>
        ) : (
          <>
            <Save className="ml-2 h-4 w-4" />
            حفظ المنحة
          </>
        )}
      </Button>
    </div>
  );
  
  return (
    <AdminLayout title="إضافة منحة جديدة" actions={pageActions}>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center text-muted-foreground hover:text-primary"
          onClick={() => navigate('/admin/scholarships')}
        >
          <ChevronLeft className="ml-1 h-4 w-4" />
          العودة للمنح الدراسية
        </Button>
      </div>
      
      <Form {...form}>
        <form id="scholarship-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* القسم الرئيسي */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">معلومات المنحة الأساسية</CardTitle>
                  <CardDescription>
                    المعلومات الرئيسية عن المنحة الدراسية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان المنحة</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="أدخل عنوان المنحة الدراسية" 
                            {...field} 
                            onChange={handleTitleChange}
                            className="bg-white"
                          />
                        </FormControl>
                        <FormDescription>
                          هذا العنوان سيظهر في صفحة المنحة وفي نتائج البحث
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المسار (Slug)</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0">
                            <span className="pl-3 py-2 text-muted-foreground text-sm border-l">
                              scholarships/
                            </span>
                            <Input 
                              placeholder="مسار-المنحة" 
                              {...field} 
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              dir="ltr"
                              autoComplete="off"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          سيستخدم هذا المسار في عنوان URL الخاص بالمنحة
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الوصف المختصر</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="أدخل وصفاً مختصراً للمنحة الدراسية" 
                            {...field} 
                            className="resize-none min-h-[100px] bg-white"
                          />
                        </FormControl>
                        <FormDescription>
                          وصف قصير يظهر في صفحة المنح وفي نتائج البحث
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>محتوى المنحة</FormLabel>
                          <FormControl>
                            <RichEditor
                              initialValue={field.value}
                              onChange={field.onChange}
                              placeholder="اكتب تفاصيل المنحة الدراسية..."
                              height={500}
                              dir="rtl"
                              seoTitle={form.getValues('seoTitle') || ''}
                              onSeoTitleChange={(title) => form.setValue('seoTitle', title)}
                              seoDescription={form.getValues('seoDescription') || ''}
                              onSeoDescriptionChange={(desc) => form.setValue('seoDescription', desc)}
                              seoKeywords={form.getValues('seoKeywords') || ''}
                              onSeoKeywordsChange={(keywords) => form.setValue('seoKeywords', keywords)}
                              focusKeyword={form.getValues('focusKeyword') || ''}
                              onFocusKeywordChange={(keyword) => form.setValue('focusKeyword', keyword)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">تحسين محركات البحث (SEO)</CardTitle>
                  <CardDescription>
                    معلومات تساعد في تحسين ظهور المنحة في نتائج البحث
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Button type="button" size="sm" variant="outline" onClick={updateSeoFromTitle}>
                      <FileText className="ml-2 h-3.5 w-3.5" />
                      نسخ من العنوان
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={updateSeoFromDescription}>
                      <FileCheck className="ml-2 h-3.5 w-3.5" />
                      نسخ من الوصف
                    </Button>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان SEO</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="عنوان للظهور في نتائج البحث" 
                            {...field} 
                            value={field.value || ''}
                            className="bg-white"
                          />
                        </FormControl>
                        <FormDescription>
                          مثالي: 50-60 حرف. سيظهر في نتائج البحث
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف SEO</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="وصف للظهور في نتائج البحث" 
                            {...field} 
                            value={field.value || ''}
                            className="resize-none min-h-[80px] bg-white"
                          />
                        </FormControl>
                        <FormDescription>
                          مثالي: 140-160 حرف. سيظهر في نتائج البحث
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="focusKeyword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الكلمة المفتاحية الرئيسية</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="مثال: منح دراسية في بريطانيا" 
                              {...field} 
                              value={field.value || ''}
                              className="bg-white"
                            />
                          </FormControl>
                          <FormDescription>
                            الكلمة المفتاحية الأهم للمنحة
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="seoKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الكلمات المفتاحية</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="مثال: منح دراسية, منح خارجية, منح مجانية" 
                              {...field} 
                              value={field.value || ''}
                              className="bg-white"
                            />
                          </FormControl>
                          <FormDescription>
                            كلمات مفتاحية مفصولة بفواصل
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* القسم الجانبي */}
            <div className="space-y-6">
              <Card className="shadow-sm border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">تصنيف المنحة</CardTitle>
                  <CardDescription>
                    معلومات حول تصنيف وتنظيم المنحة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="countryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الدولة</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="اختر الدولة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries?.map((country) => (
                              <SelectItem key={country.id} value={String(country.id)}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          الدولة التي تقدم المنحة الدراسية
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="levelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المستوى الدراسي</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="اختر المستوى الدراسي" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {levels?.map((level) => (
                              <SelectItem key={level.id} value={String(level.id)}>
                                {level.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          مستوى الدراسة المطلوب للمنحة
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>التصنيف</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="اختر التصنيف" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={String(category.id)}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          تصنيف المنحة الدراسية
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">معلومات الجامعة</CardTitle>
                  <CardDescription>
                    معلومات عن الجامعة المقدمة للمنحة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم الجامعة</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="أدخل اسم الجامعة" 
                            {...field} 
                            className="bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>القسم أو الكلية</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="أدخل اسم القسم أو الكلية (اختياري)" 
                            {...field} 
                            className="bg-white"
                          />
                        </FormControl>
                        <FormDescription>
                          القسم أو الكلية التي تقدم المنحة (اختياري)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الموقع الإلكتروني</FormLabel>
                        <FormControl>
                          <div className="flex items-center bg-white border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0">
                            <span className="pl-3 py-2 text-muted-foreground">
                              <Globe className="h-4 w-4" />
                            </span>
                            <Input 
                              placeholder="https://www.example.com" 
                              {...field} 
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              dir="ltr"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          رابط موقع المنحة الرسمي (اختياري)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">التفاصيل الإضافية</CardTitle>
                  <CardDescription>
                    معلومات إضافية عن المنحة الدراسية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>تاريخ البدء</FormLabel>
                          <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                            className="w-full"
                          />
                          <FormDescription>
                            تاريخ بدء التقديم
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>تاريخ الانتهاء</FormLabel>
                          <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                            className="w-full"
                          />
                          <FormDescription>
                            تاريخ انتهاء التقديم
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>قيمة المنحة</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="قيمة المنحة" 
                              {...field} 
                              value={field.value || ''}
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العملة</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="USD" 
                              {...field} 
                              value={field.value || ''}
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-3 bg-gray-50 p-3 rounded-md">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 space-y-0 rtl:space-x-reverse">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">منحة مميزة</FormLabel>
                            <FormDescription>
                              ستظهر في قسم المنح المميزة
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 space-y-0 rtl:space-x-reverse">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">نشر المنحة</FormLabel>
                            <FormDescription>
                              ستظهر المنحة للزوار
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      
      {/* مربع حوار تأكيد الخروج */}
      <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الخروج؟</AlertDialogTitle>
            <AlertDialogDescription>
              ستفقد جميع التغييرات التي قمت بها. هل ترغب بالاستمرار؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="sm:ml-2">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => navigate('/admin/scholarships')}
            >
              نعم، الخروج بدون حفظ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}