import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import MainLayout from '../components/layout/MainLayout';
import { useSiteSettings } from '../contexts/site-settings-context';
import { ArrowRight, Search, GraduationCap, Globe, BookOpen, Award, ArrowDown } from 'lucide-react';

// تعريف أنواع البيانات
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  scholarshipCount?: number;
}

interface Country {
  id: number;
  name: string;
  slug: string;
  flagUrl?: string;
  scholarshipCount?: number;
}

interface Scholarship {
  id: number;
  title: string;
  slug: string;
  description?: string;
  image_url?: string;
  deadline?: string;
  amount?: string;
  currency?: string;
  university?: string;
  is_featured?: boolean;
  is_fully_funded?: boolean;
  country_id?: number;
  level_id?: number;
  category_id?: number;
  country?: { id: number; name: string; slug: string; };
  category?: { id: number; name: string; slug: string; };
  level?: { id: number; name: string; slug: string; };
}

interface HomePageProps {
  categories: Category[];
  countries: Country[];
  featuredScholarships: Scholarship[];
}

export default function HomePage({ categories, countries, featuredScholarships }: HomePageProps) {
  const { siteSettings } = useSiteSettings();
  const [searchQuery, setSearchQuery] = useState('');
  
  // عرض في وحدة التحكم لفحص البيانات (للتطوير فقط)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Categories:', categories);
      console.log('Countries:', countries);
      console.log('Featured Scholarships:', featuredScholarships);
    }
  }, [categories, countries, featuredScholarships]);
  
  // مقاطع تمرير للأقسام
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <MainLayout
      title="الرئيسية"
      description="استكشف أفضل المنح الدراسية والفرص التعليمية حول العالم"
    >
      {/* قسم البطل */}
      <section className="relative py-20 md:py-28">
        {/* الخلفية */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
        
        {/* المحتوى */}
        <div className="container relative z-10 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              {siteSettings?.siteTagline || 'اكتشف افضل فرص المنح الدراسية حول العالم'}
            </h1>
            
            <p className="text-lg md:text-xl opacity-90 mb-8 animate-slide-up">
              نقدم مجموعة شاملة من المنح الدراسية للطلاب من جميع أنحاء العالم.
              ابحث عن المنحة المناسبة لك وابدأ رحلتك التعليمية.
            </p>
            
            {/* صندوق البحث */}
            <div className="relative max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <form 
                className="flex flex-col md:flex-row" 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/scholarships?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
              >
                <div className="relative flex-grow mb-3 md:mb-0">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full py-4 px-5 pr-14 rounded-lg md:rounded-r-none text-gray-800 border-0 focus:ring-2 focus:ring-blue-500"
                    placeholder="ابحث عن منح دراسية، جامعات، تخصصات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-lg md:rounded-l-none transition-all"
                >
                  بحث
                </button>
              </form>
            </div>
            
            {/* ميزات سريعة */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center">
                <GraduationCap className="h-6 w-6 mr-2" />
                <span>+10,000 منحة دراسية</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-6 w-6 mr-2" />
                <span>+100 دولة حول العالم</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 mr-2" />
                <span>كافة المستويات الدراسية</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* سهم التمرير لأسفل */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <button
            onClick={() => scrollToSection('categories')}
            className="bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-colors"
            aria-label="تمرير لأسفل"
          >
            <ArrowDown className="h-6 w-6" />
          </button>
        </div>
      </section>
      
      {/* قسم الإحصائيات */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-300">منحة دراسية</div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-2">110+</div>
              <div className="text-gray-600 dark:text-gray-300">دولة مستضيفة</div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">تخصص دراسي</div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">25,000+</div>
              <div className="text-gray-600 dark:text-gray-300">طالب مستفيد</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* قسم التصنيفات */}
      <section id="categories" className="py-16 bg-white dark:bg-gray-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">استكشف حسب التصنيف</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              تصفح المنح الدراسية حسب التصنيفات المختلفة للعثور على الفرصة المناسبة لاحتياجاتك واهتماماتك
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* عرض التصنيفات من قاعدة البيانات */}
            {categories && categories.length > 0 ? categories.map((category) => {
              // إنشاء رمز تعبيري استنادًا إلى اسم التصنيف
              let icon = '📚'; // رمز افتراضي
              
              if (category.name.includes('هندس')) icon = '🏗️';
              else if (category.name.includes('طب') || category.name.includes('صح')) icon = '🏥';
              else if (category.name.includes('حاسب') || category.name.includes('تقني')) icon = '💻';
              else if (category.name.includes('أعمال') || category.name.includes('إدار')) icon = '📊';
              else if (category.name.includes('علوم') || category.name.includes('بحث')) icon = '🔬';
              else if (category.name.includes('فن') || category.name.includes('تصميم')) icon = '🎨';
              else if (category.name.includes('قانون') || category.name.includes('حقوق')) icon = '⚖️';
              
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow text-center card-hover"
                >
                  <div className="text-4xl mb-3">{icon}</div>
                  <h3 className="font-bold mb-1">{category.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {category.scholarshipCount || 0} منحة
                  </p>
                </Link>
              );
            }) : Array(8).fill(0).map((_, index) => (
              // عنصر تحميل
              <div key={index} className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-6 animate-pulse">
                <div className="h-16 w-16 mx-auto mb-3 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mx-auto"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              href="/categories"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              عرض جميع التصنيفات
              <ArrowRight className="mr-2 h-4 w-4 rtl-mirror" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* قسم المنح المميزة */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">أحدث المنح الدراسية</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              استكشف أحدث المنح الدراسية المتاحة لمختلف التخصصات والمستويات الدراسية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* عرض المنح من قاعدة البيانات */}
            {featuredScholarships && featuredScholarships.length > 0 ? featuredScholarships.map((scholarship) => (
              <Link
                key={scholarship.id}
                href={`/scholarships/${scholarship.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow card-hover"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                  {scholarship.image_url ? (
                    <div 
                      className="absolute inset-0 bg-center bg-cover"
                      style={{ backgroundImage: `url(${scholarship.image_url})` }}
                    ></div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700"></div>
                  )}
                  
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  ></div>
                  
                  {scholarship.is_featured && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                      منحة مميزة
                    </div>
                  )}
                  
                  {scholarship.country && (
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-sm font-medium">
                        <Globe className="inline-block w-4 h-4 ml-1" />
                        {scholarship.country.name}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{scholarship.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {scholarship.category && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                        {scholarship.category.name}
                      </span>
                    )}
                    {scholarship.level && (
                      <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-1 rounded">
                        {scholarship.level.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm border-t pt-3">
                    <span className="text-gray-600 dark:text-gray-400">
                      <Award className="inline-block w-4 h-4 ml-1" />
                      {scholarship.is_fully_funded ? 'ممولة بالكامل' : 'منحة جزئية'}
                    </span>
                    {scholarship.deadline && (
                      <span>
                        <span className="text-gray-500 dark:text-gray-400">آخر موعد: </span>
                        <span className="font-medium">
                          {new Date(scholarship.deadline).toLocaleDateString('ar-EG')}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )) : Array(6).fill(0).map((_, index) => (
              // عنصر تحميل
              <div key={index} className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-4 mt-4 pt-4 border-t flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              href="/scholarships"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              عرض جميع المنح الدراسية
            </Link>
          </div>
        </div>
      </section>
      
      {/* قسم الدول المميزة */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">الدول الأكثر استضافة للمنح</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              اكتشف أفضل الدول التي توفر فرص تعليمية متميزة للطلاب الدوليين
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* عرض الدول من قاعدة البيانات */}
            {countries && countries.length > 0 ? countries.map((country) => {
              // إنشاء علم استنادًا إلى اسم الدولة
              let flag = '🌍'; // علم افتراضي
              
              if (country.name.includes('أمريك') || country.name.includes('الولايات المتحدة')) flag = '🇺🇸';
              else if (country.name.includes('بريطاني') || country.name.includes('المملكة المتحدة')) flag = '🇬🇧';
              else if (country.name.includes('ألمانيا')) flag = '🇩🇪';
              else if (country.name.includes('كندا')) flag = '🇨🇦';
              else if (country.name.includes('أسترالي')) flag = '🇦🇺';
              else if (country.name.includes('فرنسا')) flag = '🇫🇷';
              else if (country.name.includes('اليابان')) flag = '🇯🇵';
              else if (country.name.includes('هولندا')) flag = '🇳🇱';
              else if (country.name.includes('إيطاليا')) flag = '🇮🇹';
              else if (country.name.includes('إسبانيا')) flag = '🇪🇸';
              else if (country.name.includes('الصين')) flag = '🇨🇳';
              else if (country.name.includes('روسيا')) flag = '🇷🇺';
              else if (country.name.includes('سنغافورة')) flag = '🇸🇬';
              else if (country.name.includes('ماليزيا')) flag = '🇲🇾';
              else if (country.name.includes('الهند')) flag = '🇮🇳';
              
              return (
                <Link
                  key={country.id}
                  href={`/countries/${country.slug}`}
                  className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow text-center card-hover"
                >
                  <div className="text-4xl mb-3">{flag}</div>
                  <h3 className="font-bold mb-1">{country.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {country.scholarshipCount || 0} منحة
                  </p>
                </Link>
              );
            }) : Array(8).fill(0).map((_, index) => (
              // عنصر تحميل
              <div key={index} className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-6 animate-pulse">
                <div className="h-16 w-16 mx-auto mb-3 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mx-auto"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              href="/countries"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              عرض جميع الدول
              <ArrowRight className="mr-2 h-4 w-4 rtl-mirror" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* قسم دليل المنح */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">دليل التقديم للمنح الدراسية</h2>
              <p className="mb-6 opacity-90">
                اكتشف كيفية التقديم للمنح الدراسية بنجاح. دليلنا الشامل سيساعدك على فهم العملية خطوة بخطوة وزيادة فرصك في الحصول على المنح.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-700 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-medium">البحث عن المنح المناسبة</h3>
                    <p className="text-sm opacity-80">تعرف على كيفية البحث عن المنح المناسبة لتخصصك ومؤهلاتك</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-700 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-medium">تجهيز المستندات المطلوبة</h3>
                    <p className="text-sm opacity-80">تعرف على المستندات المطلوبة وكيفية تجهيزها بشكل احترافي</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-700 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-medium">كتابة مقال تنافسي</h3>
                    <p className="text-sm opacity-80">تعلم كيفية كتابة مقال قوي يزيد من فرصك في الحصول على المنحة</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-700 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-medium">اجتياز المقابلة الشخصية</h3>
                    <p className="text-sm opacity-80">نصائح وإرشادات لاجتياز المقابلة الشخصية بنجاح</p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/guides/scholarships"
                className="inline-block mt-8 px-6 py-3 bg-white text-blue-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                قراءة الدليل الكامل
              </Link>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4">نصائح سريعة للتقديم</h3>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 checkmark-icon mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>ابدأ البحث مبكراً قبل المواعيد النهائية بوقت كاف</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 checkmark-icon mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>تأكد من استيفاء جميع الشروط قبل التقديم</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 checkmark-icon mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>اطلب خطابات توصية من أساتذة متميزين</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 checkmark-icon mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>اكتب مقالاً شخصياً فريداً يعبر عن شخصيتك وأهدافك</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 checkmark-icon mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>تدرب على المقابلات الشخصية مع أصدقاء أو أساتذة</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 checkmark-icon mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>قم بتقديم طلبات لعدة منح لزيادة فرصك</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* قسم النشرة البريدية */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">اشترك في النشرة البريدية</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              احصل على أحدث المنح الدراسية وفرص التعليم مباشرة في بريدك الإلكتروني
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-grow py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                اشتراك
              </button>
            </form>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              لن نقوم بمشاركة بريدك الإلكتروني مع أي جهة خارجية.
              يمكنك إلغاء الاشتراك في أي وقت.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // استيراد الوحدات اللازمة
    const { db } = await import('../db');
    const { sql, desc } = await import('drizzle-orm');
    const { categories, countries, scholarships, levels } = await import('../shared/schema');

    // جلب التصنيفات مع عدد المنح الدراسية لكل تصنيف
    const categoriesWithCount = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        scholarshipCount: sql`count(${scholarships.id})`.mapWith(Number),
      })
      .from(categories)
      .leftJoin(scholarships, sql`${scholarships.categoryId} = ${categories.id}`)
      .groupBy(categories.id)
      .orderBy(sql`count(${scholarships.id}) DESC`)
      .limit(8);

    // جلب الدول مع عدد المنح الدراسية لكل دولة
    const countriesWithCount = await db
      .select({
        id: countries.id,
        name: countries.name,
        slug: countries.slug,
        flagUrl: countries.flagUrl,
        scholarshipCount: sql`count(${scholarships.id})`.mapWith(Number),
      })
      .from(countries)
      .leftJoin(scholarships, sql`${scholarships.countryId} = ${countries.id}`)
      .groupBy(countries.id)
      .orderBy(sql`count(${scholarships.id}) DESC`)
      .limit(8);

    // جلب المنح الدراسية المميزة مع التصنيفات والدول والمستويات المرتبطة بها
    const featuredScholarshipsQuery = await db
      .select()
      .from(scholarships)
      .where(sql`${scholarships.isFeatured} = true AND ${scholarships.isPublished} = true`)
      .orderBy(sql`${scholarships.createdAt} DESC`)
      .limit(6);

    // جلب المعلومات المفصلة للمنح الدراسية (التصنيف، الدولة، المستوى)
    const featuredScholarshipsPromises = featuredScholarshipsQuery.map(async (scholarship) => {
      // جلب التصنيف
      let category = null;
      if (scholarship.category_id) {
        const [categoryData] = await db
          .select()
          .from(categories)
          .where(sql`${categories.id} = ${scholarship.category_id}`);
        if (categoryData) {
          category = {
            id: categoryData.id,
            name: categoryData.name,
            slug: categoryData.slug
          };
        }
      }

      // جلب الدولة
      let country = null;
      if (scholarship.country_id) {
        const [countryData] = await db
          .select()
          .from(countries)
          .where(sql`${countries.id} = ${scholarship.country_id}`);
        if (countryData) {
          country = {
            id: countryData.id,
            name: countryData.name,
            slug: countryData.slug
          };
        }
      }

      // جلب المستوى الدراسي
      let level = null;
      if (scholarship.level_id) {
        const [levelData] = await db
          .select()
          .from(levels)
          .where(sql`${levels.id} = ${scholarship.level_id}`);
        if (levelData) {
          level = {
            id: levelData.id,
            name: levelData.name,
            slug: levelData.slug
          };
        }
      }

      // تحويل كائن المنحة إلى كائن قابل للتسلسل (JSON serializable)
      const { 
        id, title, slug, description, amount, currency, university, department, website,
        is_featured, is_fully_funded, country_id, level_id, category_id, requirements,
        application_link, image_url, content, seo_title, seo_description, seo_keywords,
        focus_keyword, is_published
      } = scholarship;
      
      // تحويل التواريخ إلى سلاسل نصية
      const created_at = scholarship.created_at instanceof Date ? scholarship.created_at.toISOString() : 
                        scholarship.created_at ? String(scholarship.created_at) : null;
                        
      const updated_at = scholarship.updated_at instanceof Date ? scholarship.updated_at.toISOString() : 
                        scholarship.updated_at ? String(scholarship.updated_at) : null;
                        
      const start_date = scholarship.start_date instanceof Date ? scholarship.start_date.toISOString() : 
                        scholarship.start_date ? String(scholarship.start_date) : null;
                        
      const end_date = scholarship.end_date instanceof Date ? scholarship.end_date.toISOString() : 
                      scholarship.end_date ? String(scholarship.end_date) : null;
                      
      const deadline = scholarship.deadline instanceof Date ? scholarship.deadline.toISOString() : 
                      scholarship.deadline ? String(scholarship.deadline) : null;

      // إرجاع كائن جديد مع جميع المعلومات المطلوبة
      return {
        id, title, slug, description, amount, currency, university, department, website,
        is_featured, is_fully_funded, country_id, level_id, category_id, requirements,
        application_link, image_url, content, seo_title, seo_description, seo_keywords,
        focus_keyword, is_published, created_at, updated_at, start_date, end_date, deadline,
        category, country, level
      };
    });
    
    const featuredScholarships = await Promise.all(featuredScholarshipsPromises);

    return {
      props: {
        categories: categoriesWithCount || [],
        countries: countriesWithCount || [],
        featuredScholarships: featuredScholarships || [],
      },
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      props: {
        categories: [],
        countries: [],
        featuredScholarships: [],
      },
    };
  }
};