import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Globe, Award, GraduationCap } from 'lucide-react';
import { Scholarship } from '@/shared/schema';

// الواجهة المعدلة لبيانات المنحة الدراسية
interface ScholarshipCardData {
  id: number;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  isFullyFunded?: boolean;
  deadline?: string | null;
  currency?: string;
  amount?: string;
  university?: string;
  department?: string;
  categoryId?: number;
  countryId?: number;
  levelId?: number;
  category?: { id: number; name: string; slug: string } | null;
  country?: { id: number; name: string; slug: string; flagUrl?: string | null } | null;
  level?: { id: number; name: string; slug: string } | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // دعم الحقول القديمة للتوافقية
  image_url?: string;
  is_featured?: boolean;
  is_fully_funded?: boolean;
  category_id?: number;
  country_id?: number;
  level_id?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
}

interface ScholarshipCardProps {
  scholarship: ScholarshipCardData;
  isCompact?: boolean;
}

/**
 * مكون يعرض بطاقة منحة دراسية
 * @param scholarship بيانات المنحة الدراسية
 * @param isCompact ما إذا كان العرض مختصر أم كامل
 */
export function ScholarshipCard({ scholarship, isCompact = false }: ScholarshipCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  // استخراج البيانات بشكل آمن مع دعم التوافقية مع الأنماط القديمة
  const titleDisplay = scholarship?.title || 'منحة دراسية';
  const descriptionDisplay = scholarship?.description || '';
  const slugDisplay = scholarship?.slug || '';
  
  // يدعم كلاً من النمطين (snake_case و camelCase) للصور
  const imageUrlDisplay = scholarship?.thumbnailUrl || 
                          scholarship?.imageUrl || 
                          scholarship?.image_url || 
                          '/images/default-scholarship.svg';
  
  // يدعم كلاً من النمطين للحقول البولينية
  const isFeatured = scholarship?.isFeatured ?? scholarship?.is_featured ?? false;
  const isFullyFunded = scholarship?.isFullyFunded ?? scholarship?.is_fully_funded ?? false;
  
  // يدعم كلاً من النمطين للمفاتيح الخارجية
  const categoryId = scholarship?.categoryId ?? scholarship?.category_id;
  const countryId = scholarship?.countryId ?? scholarship?.country_id;
  const levelId = scholarship?.levelId ?? scholarship?.level_id;
  
  // تعامل آمن مع البيانات المرتبطة
  const categoryName = scholarship?.category?.name || 'منحة دراسية';
  const countryName = scholarship?.country?.name || scholarship?.university || 'دولي';
  const levelName = scholarship?.level?.name || 'جميع المستويات';
  
  // التعامل مع التواريخ
  const createdAtDisplay = scholarship?.createdAt || scholarship?.created_at;
  const deadlineDisplay = scholarship?.deadline;
  
  return (
    <Link
      href={`/scholarships/${slugDisplay}`}
      className={`group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
        isHovered ? 'ring-2 ring-primary' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {!imgError && imageUrlDisplay ? (
          <Image
            src={imageUrlDisplay}
            alt={titleDisplay}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-gray-800">
            <GraduationCap className="h-16 w-16 text-blue-300 dark:text-blue-700" />
          </div>
        )}
        
        {/* طبقة التدرج */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        
        {/* شارة المنح المميزة */}
        {isFeatured && (
          <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            منحة مميزة
          </div>
        )}
        
        {/* معلومات سريعة على الصورة */}
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center text-sm font-medium">
            <Globe className="w-4 h-4 ml-1 rtl:ml-1 rtl:mr-0" />
            {countryName}
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {titleDisplay}
        </h3>
        
        {!isCompact && descriptionDisplay && (
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 text-sm">
            {descriptionDisplay.substring(0, 120)}...
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {/* عرض معلومات التصنيف */}
          {(categoryId || scholarship?.category) && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
              {categoryName}
            </span>
          )}
          
          {/* عرض معلومات المستوى */}
          {(levelId || scholarship?.level) && (
            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-1 rounded-full">
              {levelName}
            </span>
          )}
          
          {/* شارة التمويل الكامل */}
          {isFullyFunded && (
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-full">
              <Award className="inline-block w-3 h-3 mr-1" />
              ممولة بالكامل
            </span>
          )}

          {/* عرض مبلغ المنحة */}
          {(scholarship?.amount && scholarship?.currency) && (
            <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 px-2 py-1 rounded-full">
              {scholarship.amount} {scholarship.currency}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100 dark:border-gray-700">
          {/* عرض تاريخ النشر */}
          <span className="text-gray-500 dark:text-gray-400">
            {createdAtDisplay && 
              (typeof createdAtDisplay === 'string'
                ? new Date(createdAtDisplay).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
                : 'تاريخ النشر')}
          </span>
          
          {/* عرض موعد المنحة */}
          <span className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
            <Calendar className="w-4 h-4 ml-1" />
            آخر موعد: {deadlineDisplay 
              ? (typeof deadlineDisplay === 'string' 
                 ? new Date(deadlineDisplay).toLocaleDateString('ar-EG')
                 : 'تاريخ محدد') 
              : 'غير محدد'}
          </span>
        </div>
      </div>
    </Link>
  );
}