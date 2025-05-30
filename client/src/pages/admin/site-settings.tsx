import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, RefreshCw, Check, Menu, Palette, Globe, Phone, Mail, MapPin, Image, FileType, Settings, Layers, LayoutDashboard, Grid, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/admin/sidebar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// زودج سكيما للتحقق من صحة البيانات
const siteSettingsSchema = z.object({
  // إعدادات عامة
  siteName: z.string().min(1, 'اسم الموقع مطلوب'),
  siteTagline: z.string().optional(),
  siteDescription: z.string().optional(),
  favicon: z.string().url('يجب أن يكون رابط صورة صالح').optional().or(z.literal('')),
  logo: z.string().url('يجب أن يكون رابط صورة صالح').optional().or(z.literal('')),
  logoDark: z.string().url('يجب أن يكون رابط صورة صالح').optional().or(z.literal('')),
  
  // إعدادات التواصل
  email: z.string().email('يجب إدخال بريد إلكتروني صالح').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  
  // روابط التواصل الاجتماعي
  facebook: z.string().url('يجب أن يكون رابط صالح').optional().or(z.literal('')),
  twitter: z.string().url('يجب أن يكون رابط صالح').optional().or(z.literal('')),
  instagram: z.string().url('يجب أن يكون رابط صالح').optional().or(z.literal('')),
  youtube: z.string().url('يجب أن يكون رابط صالح').optional().or(z.literal('')),
  linkedin: z.string().url('يجب أن يكون رابط صالح').optional().or(z.literal('')),
  
  // إعدادات الألوان
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'يجب أن يكون لون صالح (هيكس)').optional(),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'يجب أن يكون لون صالح (هيكس)').optional(),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'يجب أن يكون لون صالح (هيكس)').optional(),
  
  // إعدادات تخصيص الهيدر
  headerStyle: z.string().optional(),
  headerBackgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'يجب أن يكون لون صالح (هيكس)').optional().or(z.literal('')),
  headerTextColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'يجب أن يكون لون صالح (هيكس)').optional().or(z.literal('')),
  headerLogoPosition: z.string().optional(),
  headerHeight: z.string().optional(),
  customHeaderHtml: z.string().optional(),
  showHeaderSearch: z.boolean().optional(),
  showHeaderLanguageSwitcher: z.boolean().optional(),
  showHeaderLoginButton: z.boolean().optional(),
  
  // إعدادات تخصيص الفوتر
  footerStyle: z.string().optional(),
  footerBackgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'يجب أن يكون لون صالح (هيكس)').optional().or(z.literal('')),
  footerTextColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'يجب أن يكون لون صالح (هيكس)').optional().or(z.literal('')),
  footerLogoPosition: z.string().optional(),
  footerColumns: z.coerce.number().min(1).max(6).optional(),
  customFooterHtml: z.string().optional(),
  showFooterSocialIcons: z.boolean().optional(),
  showFooterNewsletter: z.boolean().optional(),
  showFooterCopyrightInfo: z.boolean().optional(),
  footerCopyrightText: z.string().optional(),
  
  // إعدادات أخرى
  enableDarkMode: z.boolean().default(true),
  rtlDirection: z.boolean().default(true),
  defaultLanguage: z.string().default('ar'),
  enableNewsletter: z.boolean().default(true),
  enableScholarshipSearch: z.boolean().default(true),
  footerText: z.string().optional(),
  
  // إعدادات إظهار/إخفاء الأقسام
  showHeroSection: z.boolean().default(true),
  showFeaturedScholarships: z.boolean().default(true),
  showSearchSection: z.boolean().default(true),
  showCategoriesSection: z.boolean().default(true),
  showCountriesSection: z.boolean().default(true),
  showLatestArticles: z.boolean().default(true),
  showSuccessStories: z.boolean().default(true),
  showNewsletterSection: z.boolean().default(true),
  showStatisticsSection: z.boolean().default(true),
  showPartnersSection: z.boolean().default(true),
  
  // عناوين وأوصاف الأقسام
  heroTitle: z.string().optional(),
  heroDescription: z.string().optional(),
  featuredScholarshipsTitle: z.string().optional(),
  featuredScholarshipsDescription: z.string().optional(),
  categoriesSectionTitle: z.string().optional(),
  categoriesSectionDescription: z.string().optional(),
  countriesSectionTitle: z.string().optional(),
  countriesSectionDescription: z.string().optional(),
  latestArticlesTitle: z.string().optional(),
  latestArticlesDescription: z.string().optional(),
  successStoriesTitle: z.string().optional(),
  successStoriesDescription: z.string().optional(),
  newsletterSectionTitle: z.string().optional(),
  newsletterSectionDescription: z.string().optional(),
  statisticsSectionTitle: z.string().optional(),
  statisticsSectionDescription: z.string().optional(),
  partnersSectionTitle: z.string().optional(),
  partnersSectionDescription: z.string().optional(),
  
  // خيارات تخطيط الصفحات
  homePageLayout: z.string().optional(),
  scholarshipPageLayout: z.string().optional(),
  articlePageLayout: z.string().optional(),
  customCss: z.string().optional(),
});

type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

// واجهة لإعدادات الموقع
interface SiteSettings {
  id: number;
  siteName: string;
  siteTagline?: string;
  siteDescription?: string;
  favicon?: string;
  logo?: string;
  logoDark?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  enableDarkMode: boolean;
  rtlDirection: boolean;
  defaultLanguage: string;
  enableNewsletter: boolean;
  enableScholarshipSearch: boolean;
  footerText?: string;
  
  // إعدادات إظهار/إخفاء الأقسام
  showHeroSection?: boolean;
  showFeaturedScholarships?: boolean;
  showSearchSection?: boolean;
  showCategoriesSection?: boolean;
  showCountriesSection?: boolean;
  showLatestArticles?: boolean;
  showSuccessStories?: boolean;
  showNewsletterSection?: boolean;
  showStatisticsSection?: boolean;
  showPartnersSection?: boolean;
  
  // عناوين وأوصاف الأقسام
  heroTitle?: string;
  heroDescription?: string;
  featuredScholarshipsTitle?: string;
  featuredScholarshipsDescription?: string;
  categoriesSectionTitle?: string;
  categoriesSectionDescription?: string;
  countriesSectionTitle?: string;
  countriesSectionDescription?: string;
  latestArticlesTitle?: string;
  latestArticlesDescription?: string;
  successStoriesTitle?: string;
  successStoriesDescription?: string;
  newsletterSectionTitle?: string;
  newsletterSectionDescription?: string;
  statisticsSectionTitle?: string;
  statisticsSectionDescription?: string;
  partnersSectionTitle?: string;
  partnersSectionDescription?: string;
  
  // خيارات تخطيط الصفحات
  homePageLayout?: string;
  scholarshipPageLayout?: string;
  articlePageLayout?: string;
  customCss?: string;
}

export default function SiteSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('general');

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // استلام إعدادات الموقع
  const { data: settings, isLoading, isError, refetch } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (!response.ok) throw new Error('فشل في استلام إعدادات الموقع');
        return response.json();
      } catch (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }
    },
    enabled: isAuthenticated
  });

  // تحديث إعدادات الموقع
  const updateMutation = useMutation({
    mutationFn: async (updatedSettings: SiteSettingsFormValues) => {
      // طباعة البيانات قبل إرسالها للتحقق من وجود أي مشاكل
      console.log('Sending settings data:', JSON.stringify(updatedSettings, null, 2));
      
      try {
        const response = await fetch('/api/site-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSettings),
          credentials: 'include', // إضافة هذا الخيار للتأكد من إرسال ملفات تعريف الارتباط
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Server response error:', response.status, errorData || response.statusText);
          throw new Error(`فشل في تحديث إعدادات الموقع: ${errorData?.message || response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Server response:', result);
        return result;
      } catch (error) {
        console.error('Error updating site settings:', error);
        throw error;
      }
    },
    onSuccess: (updatedSettings) => {
      // طباعة البيانات المحدثة
      console.log('Applying site settings to document:', updatedSettings);
      
      // تحديث البيانات في ذاكرة التخزين المؤقت
      queryClient.setQueryData(['/api/site-settings'], updatedSettings);
      
      // إعادة تحميل البيانات فقط (بدون إعادة تحميل كامل للصفحة) لتحسين الأداء
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      
      toast({ 
        title: 'تم الحفظ بنجاح', 
        description: 'تم تحديث إعدادات الموقع بنجاح' 
      });
      
      // تطبيق التغييرات الأساسية مباشرة (بدون إعادة تحميل)
      if (updatedSettings.primaryColor) {
        try {
          const hexToHSL = (hex: string) => {
            const hexColor = hex.replace('#', '');
            const r = parseInt(hexColor.substr(0, 2), 16) / 255;
            const g = parseInt(hexColor.substr(2, 2), 16) / 255;
            const b = parseInt(hexColor.substr(4, 2), 16) / 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h = 0, s = 0, l = (max + min) / 2;
            if (max !== min) {
              const d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
              if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
              else if (max === g) h = (b - r) / d + 2;
              else h = (r - g) / d + 4;
              h *= 60;
            }
            return {
              h: Math.round(h),
              s: Math.round(s * 100),
              l: Math.round(l * 100)
            };
          };
          
          const hsl = hexToHSL(updatedSettings.primaryColor);
          document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
          console.log(`Applied primary color: ${hsl.h} ${hsl.s}% ${hsl.l}%`);
          
          if (updatedSettings.secondaryColor) {
            const hsl2 = hexToHSL(updatedSettings.secondaryColor);
            document.documentElement.style.setProperty('--secondary', `${hsl2.h} ${hsl2.s}% ${hsl2.l}%`);
            console.log(`Applied secondary color: ${hsl2.h} ${hsl2.s}% ${hsl2.l}%`);
          }
          
          if (updatedSettings.accentColor) {
            const hsl3 = hexToHSL(updatedSettings.accentColor);
            document.documentElement.style.setProperty('--accent', `${hsl3.h} ${hsl3.s}% ${hsl3.l}%`);
            console.log(`Applied accent color: ${hsl3.h} ${hsl3.s}% ${hsl3.l}%`);
          }
        } catch (e) {
          console.error('Error applying color updates:', e);
        }
      }
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({ 
        title: 'خطأ!', 
        description: `فشل في تحديث إعدادات الموقع: ${(error as Error).message}`, 
        variant: 'destructive' 
      });
    }
  });

  // نموذج إعدادات الموقع
  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      // القيم الأساسية للموقع
      siteName: settings?.siteName || 'FULLSCO',
      siteTagline: settings?.siteTagline || 'منصة المنح الدراسية',
      siteDescription: settings?.siteDescription || 'منصة عربية متكاملة للبحث عن المنح الدراسية وتقديم الطلبات',
      favicon: settings?.favicon || '',
      logo: settings?.logo || '',
      logoDark: settings?.logoDark || '',
      
      // معلومات التواصل
      email: settings?.email || 'info@fullsco.com',
      phone: settings?.phone || '',
      whatsapp: settings?.whatsapp || '',
      address: settings?.address || '',
      
      // الشبكات الاجتماعية
      facebook: settings?.facebook || '',
      twitter: settings?.twitter || '',
      instagram: settings?.instagram || '',
      youtube: settings?.youtube || '',
      linkedin: settings?.linkedin || '',
      
      // الألوان والمظهر
      primaryColor: settings?.primaryColor || '#3b82f6', // أزرق
      secondaryColor: settings?.secondaryColor || '#10b981', // أخضر
      accentColor: settings?.accentColor || '#f59e0b', // برتقالي
      enableDarkMode: settings?.enableDarkMode ?? true,
      rtlDirection: settings?.rtlDirection ?? true, // اتجاه RTL مفعل افتراضيًا
      defaultLanguage: settings?.defaultLanguage || 'ar', // اللغة العربية افتراضية
      
      // خيارات الموقع
      enableNewsletter: settings?.enableNewsletter ?? true,
      enableScholarshipSearch: settings?.enableScholarshipSearch ?? true,
      footerText: settings?.footerText || '© 2025 FULLSCO. جميع الحقوق محفوظة.',
      
      // إعدادات إظهار/إخفاء الأقسام (جميعها مفعلة افتراضيًا)
      showHeroSection: settings?.showHeroSection ?? true,
      showFeaturedScholarships: settings?.showFeaturedScholarships ?? true,
      showSearchSection: settings?.showSearchSection ?? true,
      showCategoriesSection: settings?.showCategoriesSection ?? true,
      showCountriesSection: settings?.showCountriesSection ?? true,
      showLatestArticles: settings?.showLatestArticles ?? true,
      showSuccessStories: settings?.showSuccessStories ?? true,
      showNewsletterSection: settings?.showNewsletterSection ?? true,
      showStatisticsSection: settings?.showStatisticsSection ?? true,
      showPartnersSection: settings?.showPartnersSection ?? true,
      
      // عناوين وأوصاف الأقسام
      heroTitle: settings?.heroTitle || 'ابحث عن المنح الدراسية المناسبة لك',
      heroDescription: settings?.heroDescription || 'أكبر قاعدة بيانات للمنح الدراسية حول العالم',
      featuredScholarshipsTitle: settings?.featuredScholarshipsTitle || 'منح دراسية مميزة',
      featuredScholarshipsDescription: settings?.featuredScholarshipsDescription || 'أبرز المنح الدراسية المتاحة حالياً',
      categoriesSectionTitle: settings?.categoriesSectionTitle || 'تصفح حسب التخصص',
      categoriesSectionDescription: settings?.categoriesSectionDescription || 'اختر المنح المناسبة حسب مجال دراستك',
      countriesSectionTitle: settings?.countriesSectionTitle || 'تصفح حسب البلد',
      countriesSectionDescription: settings?.countriesSectionDescription || 'اكتشف المنح الدراسية في بلدان مختلفة',
      latestArticlesTitle: settings?.latestArticlesTitle || 'أحدث المقالات',
      latestArticlesDescription: settings?.latestArticlesDescription || 'تعرف على آخر النصائح والمعلومات',
      successStoriesTitle: settings?.successStoriesTitle || 'قصص نجاح',
      successStoriesDescription: settings?.successStoriesDescription || 'تجارب حقيقية للطلاب الذين حصلوا على منح دراسية',
      newsletterSectionTitle: settings?.newsletterSectionTitle || 'النشرة البريدية',
      newsletterSectionDescription: settings?.newsletterSectionDescription || 'اشترك ليصلك كل جديد عن المنح الدراسية',
      statisticsSectionTitle: settings?.statisticsSectionTitle || 'إحصائيات',
      statisticsSectionDescription: settings?.statisticsSectionDescription || 'أرقام عن المنح الدراسية والطلاب حول العالم',
      partnersSectionTitle: settings?.partnersSectionTitle || 'شركاؤنا',
      partnersSectionDescription: settings?.partnersSectionDescription || 'المؤسسات والجامعات التي نتعاون معها',
      
      // خيارات تخطيط الصفحات
      homePageLayout: settings?.homePageLayout || 'default',
      scholarshipPageLayout: settings?.scholarshipPageLayout || 'default',
      articlePageLayout: settings?.articlePageLayout || 'default',
      customCss: settings?.customCss || '',
    },
  });

  // تحديث النموذج عند تغيير البيانات
  useEffect(() => {
    if (settings) {
      // تطبيق القيم الافتراضية مع إعطاء أفضلية للقيم الموجودة
      form.reset({
        // القيم الأساسية للموقع
        siteName: settings.siteName || 'FULLSCO',
        siteTagline: settings.siteTagline || 'منصة المنح الدراسية',
        siteDescription: settings.siteDescription || 'منصة عربية متكاملة للبحث عن المنح الدراسية وتقديم الطلبات',
        favicon: settings.favicon || '',
        logo: settings.logo || '',
        logoDark: settings.logoDark || '',
        
        // معلومات التواصل
        email: settings.email || 'info@fullsco.com',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        address: settings.address || '',
        
        // الشبكات الاجتماعية
        facebook: settings.facebook || '',
        twitter: settings.twitter || '',
        instagram: settings.instagram || '',
        youtube: settings.youtube || '',
        linkedin: settings.linkedin || '',
        
        // الألوان والمظهر
        primaryColor: settings.primaryColor || '#3b82f6', // أزرق
        secondaryColor: settings.secondaryColor || '#10b981', // أخضر
        accentColor: settings.accentColor || '#f59e0b', // برتقالي
        enableDarkMode: settings.enableDarkMode ?? true,
        rtlDirection: settings.rtlDirection ?? true, // اتجاه RTL مفعل افتراضيًا
        defaultLanguage: settings.defaultLanguage || 'ar', // اللغة العربية افتراضية
        
        // خيارات الموقع
        enableNewsletter: settings.enableNewsletter ?? true,
        enableScholarshipSearch: settings.enableScholarshipSearch ?? true,
        footerText: settings.footerText || '© 2025 FULLSCO. جميع الحقوق محفوظة.',
        
        // إعدادات إظهار/إخفاء الأقسام (جميعها مفعلة افتراضيًا)
        showHeroSection: settings.showHeroSection ?? true,
        showFeaturedScholarships: settings.showFeaturedScholarships ?? true,
        showSearchSection: settings.showSearchSection ?? true,
        showCategoriesSection: settings.showCategoriesSection ?? true,
        showCountriesSection: settings.showCountriesSection ?? true,
        showLatestArticles: settings.showLatestArticles ?? true,
        showSuccessStories: settings.showSuccessStories ?? true,
        showNewsletterSection: settings.showNewsletterSection ?? true,
        showStatisticsSection: settings.showStatisticsSection ?? true,
        showPartnersSection: settings.showPartnersSection ?? true,
        
        // عناوين وأوصاف الأقسام
        heroTitle: settings.heroTitle || 'ابحث عن المنح الدراسية المناسبة لك',
        heroDescription: settings.heroDescription || 'أكبر قاعدة بيانات للمنح الدراسية حول العالم',
        featuredScholarshipsTitle: settings.featuredScholarshipsTitle || 'منح دراسية مميزة',
        featuredScholarshipsDescription: settings.featuredScholarshipsDescription || 'أبرز المنح الدراسية المتاحة حالياً',
        categoriesSectionTitle: settings.categoriesSectionTitle || 'تصفح حسب التخصص',
        categoriesSectionDescription: settings.categoriesSectionDescription || 'اختر المنح المناسبة حسب مجال دراستك',
        countriesSectionTitle: settings.countriesSectionTitle || 'تصفح حسب البلد',
        countriesSectionDescription: settings.countriesSectionDescription || 'اكتشف المنح الدراسية في بلدان مختلفة',
        latestArticlesTitle: settings.latestArticlesTitle || 'أحدث المقالات',
        latestArticlesDescription: settings.latestArticlesDescription || 'تعرف على آخر النصائح والمعلومات',
        successStoriesTitle: settings.successStoriesTitle || 'قصص نجاح',
        successStoriesDescription: settings.successStoriesDescription || 'تجارب حقيقية للطلاب الذين حصلوا على منح دراسية',
        newsletterSectionTitle: settings.newsletterSectionTitle || 'النشرة البريدية',
        newsletterSectionDescription: settings.newsletterSectionDescription || 'اشترك ليصلك كل جديد عن المنح الدراسية',
        statisticsSectionTitle: settings.statisticsSectionTitle || 'إحصائيات',
        statisticsSectionDescription: settings.statisticsSectionDescription || 'أرقام عن المنح الدراسية والطلاب حول العالم',
        partnersSectionTitle: settings.partnersSectionTitle || 'شركاؤنا',
        partnersSectionDescription: settings.partnersSectionDescription || 'المؤسسات والجامعات التي نتعاون معها',
        
        // خيارات تخطيط الصفحات
        homePageLayout: settings.homePageLayout || 'default',
        scholarshipPageLayout: settings.scholarshipPageLayout || 'default',
        articlePageLayout: settings.articlePageLayout || 'default',
        customCss: settings.customCss || '',
      });
      
      console.log('Form reset with data:', { 
        siteName: settings?.siteName || 'FULLSCO',
        rtlDirection: settings?.rtlDirection ?? true,
        defaultLanguage: settings?.defaultLanguage || 'ar'
      });
    }
  }, [settings, form]);

  // معالجة حدث إرسال النموذج مع تحسين الأداء
  const onSubmit = (data: SiteSettingsFormValues) => {
    try {
      // تحضير البيانات قبل الإرسال (تجنب الحقول الفارغة)
      const cleanedData = { ...data };
      
      // تعامل خاص مع البيانات البولينية
      Object.keys(cleanedData).forEach(key => {
        if (typeof cleanedData[key] === 'boolean') {
          // لا تغير القيم البولينية
        } else if (cleanedData[key] === '') {
          // تعيين القيم الفارغة كقيم null لتتوافق مع القاعدة
          cleanedData[key] = null;
        }
      });
      
      // إضافة تسجيل
      console.log('Submitting site settings with cleaned data:', cleanedData);
      
      // إرسال البيانات إلى الخادم
      updateMutation.mutate(cleanedData);
    } catch (error) {
      console.error('Error when submitting form:', error);
      toast({ 
        title: 'خطأ في حفظ الإعدادات', 
        description: 'حدث خطأ أثناء حفظ إعدادات الموقع. الرجاء المحاولة مرة أخرى.' 
      });
    }
  };

  // في حالة تحميل بيانات المصادقة أو عدم تسجيل الدخول
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
          console.log('SiteSettings: closing sidebar');
          setSidebarOpen(false);
        }} 
      />
      
      {/* المحتوى الرئيسي */}
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "w-full" : "md:mr-64"
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
              <h1 className="text-xl md:text-2xl font-bold">تخصيص الموقع</h1>
            </div>
            <div className="flex flex-wrap w-full sm:w-auto gap-2">
              <Button className="w-full xs:w-auto" variant="outline" onClick={() => refetch()}>
                <RefreshCw className="ml-2 h-4 w-4" />
                <span className="hidden xs:inline">إعادة تحميل</span>
                <span className="xs:hidden">تحميل</span>
              </Button>
              <Button 
                className="w-full xs:w-auto"
                onClick={form.handleSubmit(onSubmit)} 
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                    <span className="hidden xs:inline">جاري الحفظ...</span>
                    <span className="xs:hidden">جاري...</span>
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    <span className="hidden xs:inline">حفظ الإعدادات</span>
                    <span className="xs:hidden">حفظ</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="mr-2">جاري التحميل...</span>
            </div>
          ) : isError ? (
            <div className="text-center py-4 text-red-500">
              <p>حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-2">
                إعادة المحاولة
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6 flex flex-wrap max-w-full overflow-x-auto gap-2 p-2">
                    <TabsTrigger value="general" className="min-w-fit whitespace-nowrap">
                      <Settings className="ml-2 h-4 w-4" />
                      <span className="hidden xs:inline">إعدادات عامة</span>
                      <span className="xs:hidden">عام</span>
                    </TabsTrigger>
                    <TabsTrigger value="header" className="min-w-fit whitespace-nowrap">
                      <LayoutDashboard className="ml-2 h-4 w-4" />
                      <span className="hidden xs:inline">تخصيص الهيدر</span>
                      <span className="xs:hidden">الهيدر</span>
                    </TabsTrigger>
                    <TabsTrigger value="footer" className="min-w-fit whitespace-nowrap">
                      <LayoutDashboard className="ml-2 h-4 w-4 rotate-180" />
                      <span className="hidden xs:inline">تخصيص الفوتر</span>
                      <span className="xs:hidden">الفوتر</span>
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="min-w-fit whitespace-nowrap">
                      <Palette className="ml-2 h-4 w-4" />
                      <span className="hidden xs:inline">المظهر والألوان</span>
                      <span className="xs:hidden">المظهر</span>
                    </TabsTrigger>
                    <TabsTrigger value="sections" className="min-w-fit whitespace-nowrap">
                      <Layers className="ml-2 h-4 w-4" />
                      <span className="hidden xs:inline">إدارة الأقسام</span>
                      <span className="xs:hidden">الأقسام</span>
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="min-w-fit whitespace-nowrap">
                      <Phone className="ml-2 h-4 w-4" />
                      <span className="hidden xs:inline">معلومات التواصل</span>
                      <span className="xs:hidden">التواصل</span>
                    </TabsTrigger>
                    <TabsTrigger value="social" className="min-w-fit whitespace-nowrap">
                      <Globe className="ml-2 h-4 w-4" />
                      <span className="hidden xs:inline">التواصل الاجتماعي</span>
                      <span className="xs:hidden">التواصل</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* إعدادات عامة */}
                  <TabsContent value="general">
                    <Card>
                      <CardHeader>
                        <CardTitle>الإعدادات العامة</CardTitle>
                        <CardDescription>
                          الإعدادات الأساسية للموقع مثل الاسم والوصف
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="siteName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>اسم الموقع</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="مثال: FULLSCO" />
                              </FormControl>
                              <FormDescription>
                                اسم الموقع كما سيظهر في شريط العنوان والهيدر
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="siteTagline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شعار الموقع</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="مثال: منصة المنح الدراسية" />
                              </FormControl>
                              <FormDescription>
                                شعار قصير يظهر بجانب اسم الموقع
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="siteDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>وصف الموقع</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="وصف قصير للموقع" 
                                  rows={3}
                                />
                              </FormControl>
                              <FormDescription>
                                وصف قصير للموقع يظهر في نتائج البحث
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="footerText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>نص التذييل</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="مثال: © 2025 FULLSCO. جميع الحقوق محفوظة." />
                              </FormControl>
                              <FormDescription>
                                النص الذي سيظهر في تذييل الموقع
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="defaultLanguage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اللغة الافتراضية</FormLabel>
                                <Select 
                                  value={field.value} 
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="اختر اللغة" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="ar">العربية</SelectItem>
                                    <SelectItem value="en">الإنجليزية</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="rtlDirection"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">اتجاه RTL</FormLabel>
                                  <FormDescription>
                                    تمكين الكتابة من اليمين لليسار
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
                            name="enableDarkMode"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">الوضع الداكن</FormLabel>
                                  <FormDescription>
                                    إتاحة الوضع الداكن للموقع
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
                  </TabsContent>

                  {/* إعدادات تخصيص الهيدر */}
                  <TabsContent value="header">
                    <Card>
                      <CardHeader>
                        <CardTitle>تخصيص الهيدر</CardTitle>
                        <CardDescription>
                          تخصيص شامل لمظهر وسلوك شريط الهيدر في الموقع
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="headerStyle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>نمط الهيدر</FormLabel>
                                <Select 
                                  value={field.value || "default"} 
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="اختر نمط الهيدر" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="default">افتراضي</SelectItem>
                                    <SelectItem value="transparent">شفاف</SelectItem>
                                    <SelectItem value="compact">مدمج</SelectItem>
                                    <SelectItem value="sticky">ثابت</SelectItem>
                                    <SelectItem value="expanded">موسع</SelectItem>
                                    <SelectItem value="minimal">مبسط</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  اختر النمط العام لشريط الهيدر
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="headerLogoPosition"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>موضع الشعار</FormLabel>
                                <Select 
                                  value={field.value || "left"} 
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="اختر موضع الشعار" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="left">يسار</SelectItem>
                                    <SelectItem value="center">وسط</SelectItem>
                                    <SelectItem value="right">يمين</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  اختر موضع الشعار في شريط الهيدر
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="headerBackgroundColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>لون خلفية الهيدر</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="color" 
                                    className="h-10 p-1 w-full cursor-pointer"
                                  />
                                </FormControl>
                                <FormDescription>
                                  اختر لون خلفية شريط الهيدر
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="headerTextColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>لون النص في الهيدر</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="color" 
                                    className="h-10 p-1 w-full cursor-pointer"
                                  />
                                </FormControl>
                                <FormDescription>
                                  اختر لون النص في شريط الهيدر
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="headerHeight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ارتفاع الهيدر</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="مثال: 80px" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormDescription>
                                حدد ارتفاع شريط الهيدر (بالبكسل أو وحدات CSS الأخرى)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customHeaderHtml"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>HTML مخصص للهيدر</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="أدخل كود HTML مخصص للهيدر..." 
                                  rows={6}
                                  className="font-mono text-sm"
                                />
                              </FormControl>
                              <FormDescription>
                                يمكنك إضافة HTML مخصص لشريط الهيدر (اختياري)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="showHeaderSearch"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">حقل البحث</FormLabel>
                                  <FormDescription>
                                    إظهار حقل البحث في الهيدر
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
                            name="showHeaderLanguageSwitcher"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">مبدل اللغة</FormLabel>
                                  <FormDescription>
                                    إظهار مبدل اللغة في الهيدر
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
                            name="showHeaderLoginButton"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">زر تسجيل الدخول</FormLabel>
                                  <FormDescription>
                                    إظهار زر تسجيل الدخول في الهيدر
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
                  </TabsContent>
                  
                  {/* إعدادات تخصيص الفوتر */}
                  <TabsContent value="footer">
                    <Card>
                      <CardHeader>
                        <CardTitle>تخصيص الفوتر</CardTitle>
                        <CardDescription>
                          تخصيص شامل لمظهر وسلوك تذييل الموقع (الفوتر)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="footerStyle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>نمط الفوتر</FormLabel>
                                <Select 
                                  value={field.value || "default"} 
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="اختر نمط الفوتر" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="default">افتراضي</SelectItem>
                                    <SelectItem value="simple">بسيط</SelectItem>
                                    <SelectItem value="multi-column">متعدد الأعمدة</SelectItem>
                                    <SelectItem value="modern">حديث</SelectItem>
                                    <SelectItem value="minimal">مبسط</SelectItem>
                                    <SelectItem value="expanded">موسع</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  اختر النمط العام لتذييل الموقع
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="footerLogoPosition"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>موضع الشعار</FormLabel>
                                <Select 
                                  value={field.value || "left"} 
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="اختر موضع الشعار" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="left">يسار</SelectItem>
                                    <SelectItem value="center">وسط</SelectItem>
                                    <SelectItem value="right">يمين</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  اختر موضع الشعار في الفوتر
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="footerBackgroundColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>لون خلفية الفوتر</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="color" 
                                    className="h-10 p-1 w-full cursor-pointer"
                                  />
                                </FormControl>
                                <FormDescription>
                                  اختر لون خلفية تذييل الموقع
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="footerTextColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>لون النص في الفوتر</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="color" 
                                    className="h-10 p-1 w-full cursor-pointer"
                                  />
                                </FormControl>
                                <FormDescription>
                                  اختر لون النص في تذييل الموقع
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="footerColumns"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>عدد الأعمدة في الفوتر</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  min="1" 
                                  max="6" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormDescription>
                                حدد عدد الأعمدة في تذييل الموقع (1-6)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="footerCopyrightText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>نص حقوق النشر</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="مثال: © 2023 FULLSCO. جميع الحقوق محفوظة." 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormDescription>
                                نص حقوق النشر الذي سيظهر في تذييل الموقع
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customFooterHtml"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>HTML مخصص للفوتر</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="أدخل كود HTML مخصص للفوتر..." 
                                  rows={6}
                                  className="font-mono text-sm"
                                />
                              </FormControl>
                              <FormDescription>
                                يمكنك إضافة HTML مخصص لتذييل الموقع (اختياري)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="showFooterSocialIcons"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">أيقونات التواصل</FormLabel>
                                  <FormDescription>
                                    إظهار أيقونات التواصل الاجتماعي في الفوتر
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
                            name="showFooterNewsletter"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">النشرة الإخبارية</FormLabel>
                                  <FormDescription>
                                    إظهار نموذج الاشتراك في النشرة الإخبارية في الفوتر
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
                            name="showFooterCopyrightInfo"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">معلومات حقوق النشر</FormLabel>
                                  <FormDescription>
                                    إظهار معلومات حقوق النشر في الفوتر
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
                  </TabsContent>
                  
                  {/* إعدادات المظهر */}
                  <TabsContent value="appearance">
                    <Card>
                      <CardHeader>
                        <CardTitle>إعدادات المظهر والألوان</CardTitle>
                        <CardDescription>
                          تخصيص مظهر الموقع والشعارات والألوان
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="favicon"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>أيقونة الموقع (Favicon)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="رابط صورة أيقونة الموقع" />
                                </FormControl>
                                <FormDescription>
                                  أيقونة صغيرة تظهر في تبويب المتصفح
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>شعار الموقع</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="رابط صورة شعار الموقع" />
                                </FormControl>
                                <FormDescription>
                                  شعار الموقع في الوضع الفاتح
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="logoDark"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>شعار الوضع الداكن</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="رابط صورة الشعار للوضع الداكن" />
                                </FormControl>
                                <FormDescription>
                                  شعار الموقع في الوضع الداكن
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="primaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اللون الرئيسي</FormLabel>
                                <div className="flex gap-2">
                                  <FormControl>
                                    <Input {...field} placeholder="#3B82F6" />
                                  </FormControl>
                                  <input
                                    type="color"
                                    value={field.value || '#3B82F6'}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="w-10 h-10 rounded-md p-1"
                                  />
                                </div>
                                <FormDescription>
                                  اللون الرئيسي للموقع (رمز هيكس)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="secondaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اللون الثانوي</FormLabel>
                                <div className="flex gap-2">
                                  <FormControl>
                                    <Input {...field} placeholder="#10B981" />
                                  </FormControl>
                                  <input
                                    type="color"
                                    value={field.value || '#10B981'}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="w-10 h-10 rounded-md p-1"
                                  />
                                </div>
                                <FormDescription>
                                  اللون الثانوي للموقع (رمز هيكس)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="accentColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>لون التمييز</FormLabel>
                                <div className="flex gap-2">
                                  <FormControl>
                                    <Input {...field} placeholder="#8B5CF6" />
                                  </FormControl>
                                  <input
                                    type="color"
                                    value={field.value || '#8B5CF6'}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="w-10 h-10 rounded-md p-1"
                                  />
                                </div>
                                <FormDescription>
                                  لون التمييز للعناصر البارزة (رمز هيكس)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="enableNewsletter"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">النشرة البريدية</FormLabel>
                                  <FormDescription>
                                    عرض نموذج الاشتراك بالنشرة البريدية
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
                            name="enableScholarshipSearch"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">بحث المنح</FormLabel>
                                  <FormDescription>
                                    عرض محرك بحث المنح في الصفحة الرئيسية
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
                  </TabsContent>
                  
                  {/* إدارة الأقسام */}
                  <TabsContent value="sections">
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>إظهار/إخفاء الأقسام</CardTitle>
                        <CardDescription>
                          التحكم في ظهور أقسام الصفحة الرئيسية
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="showHeroSection"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">قسم البانر الرئيسي</FormLabel>
                                  <FormDescription>
                                    عرض قسم البانر الرئيسي في الصفحة الرئيسية
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
                            name="showFeaturedScholarships"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">قسم المنح المميزة</FormLabel>
                                  <FormDescription>
                                    عرض قسم المنح الدراسية المميزة
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
                            name="showSearchSection"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">قسم البحث</FormLabel>
                                  <FormDescription>
                                    عرض قسم البحث عن المنح الدراسية
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
                            name="showCategoriesSection"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">قسم التخصصات</FormLabel>
                                  <FormDescription>
                                    عرض قسم تصفح المنح حسب التخصص
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
                            name="showCountriesSection"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">قسم البلدان</FormLabel>
                                  <FormDescription>
                                    عرض قسم تصفح المنح حسب البلد
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
                            name="showLatestArticles"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">قسم المقالات</FormLabel>
                                  <FormDescription>
                                    عرض قسم أحدث المقالات
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
                            name="showSuccessStories"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">قسم قصص النجاح</FormLabel>
                                  <FormDescription>
                                    عرض قسم قصص نجاح الطلاب
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
                            name="showNewsletterSection"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">قسم النشرة البريدية</FormLabel>
                                  <FormDescription>
                                    عرض قسم الاشتراك في النشرة البريدية
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
                            name="showStatisticsSection"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">قسم الإحصائيات</FormLabel>
                                  <FormDescription>
                                    عرض قسم إحصائيات المنح والطلاب
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
                            name="showPartnersSection"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div>
                                  <FormLabel className="mb-0">قسم الشركاء</FormLabel>
                                  <FormDescription>
                                    عرض قسم شركاء الموقع والمؤسسات التعليمية
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
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>تخصيص عناوين وأوصاف الأقسام</CardTitle>
                        <CardDescription>
                          تعديل عناوين وأوصاف أقسام الصفحة الرئيسية
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">قسم البانر الرئيسي</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="heroTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان البانر</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان البانر الرئيسي" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="heroDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف البانر</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="وصف بسيط للبانر الرئيسي" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">قسم المنح المميزة</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="featuredScholarshipsTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم المنح المميزة</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم المنح المميزة" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="featuredScholarshipsDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم المنح المميزة</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="وصف قسم المنح المميزة" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">قسم التخصصات</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="categoriesSectionTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم التخصصات</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم التخصصات" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="categoriesSectionDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم التخصصات</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="وصف قسم التخصصات" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">قسم البلدان</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="countriesSectionTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم البلدان</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم البلدان" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="countriesSectionDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم البلدان</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="وصف قسم البلدان" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">قسم المقالات</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="latestArticlesTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم المقالات</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم المقالات" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="latestArticlesDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم المقالات</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="وصف قسم المقالات" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">قسم قصص النجاح</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="successStoriesTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم قصص النجاح</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم قصص النجاح" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="successStoriesDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم قصص النجاح</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="وصف قسم قصص النجاح" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">قسم النشرة البريدية</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="newsletterSectionTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم النشرة البريدية</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم النشرة البريدية" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="newsletterSectionDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم النشرة البريدية</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="وصف قسم النشرة البريدية" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">قسم الإحصائيات</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="statisticsSectionTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم الإحصائيات</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم الإحصائيات" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="statisticsSectionDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم الإحصائيات</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="وصف قسم الإحصائيات" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">قسم الشركاء</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="partnersSectionTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم الشركاء</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم الشركاء" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="partnersSectionDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم الشركاء</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="وصف قسم الشركاء" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* إعدادات التواصل */}
                  <TabsContent value="contact">
                    <Card>
                      <CardHeader>
                        <CardTitle>معلومات التواصل</CardTitle>
                        <CardDescription>
                          معلومات التواصل الرئيسية للموقع
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>البريد الإلكتروني</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="info@example.com" />
                              </FormControl>
                              <FormDescription>
                                البريد الإلكتروني العام للتواصل
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>رقم الهاتف</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+966 5xxxxxxxx" />
                              </FormControl>
                              <FormDescription>
                                رقم الهاتف للتواصل
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="whatsapp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>رقم واتساب</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+966 5xxxxxxxx" />
                              </FormControl>
                              <FormDescription>
                                رقم واتساب للتواصل
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>العنوان</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="عنوان المكتب أو المقر" rows={3} />
                              </FormControl>
                              <FormDescription>
                                عنوان المقر أو المكتب
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* إعدادات التواصل الاجتماعي */}
                  <TabsContent value="social">
                    <Card>
                      <CardHeader>
                        <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
                        <CardDescription>
                          روابط الحسابات على مواقع التواصل الاجتماعي
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="facebook"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>فيسبوك</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://facebook.com/yourpage" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="twitter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>تويتر</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://twitter.com/yourhandle" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="instagram"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>انستقرام</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://instagram.com/yourprofile" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="youtube"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>يوتيوب</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://youtube.com/c/yourchannel" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="linkedin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>لينكد إن</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://linkedin.com/company/yourcompany" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <p className="text-muted-foreground text-sm">
                          ملاحظة: اترك الحقل فارغًا للحسابات غير المتوفرة
                        </p>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={updateMutation.isPending || isLoading}>
                    {updateMutation.isPending ? (
                      <>
                        <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="ml-2 h-4 w-4" />
                        حفظ الإعدادات
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </main>
      </div>
    </div>
  );
}