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
  image_url?: string; // الاسم الفعلي في قاعدة البيانات
  is_featured?: boolean; // الاسم الفعلي في قاعدة البيانات
  is_fully_funded?: boolean; // الاسم الفعلي في قاعدة البيانات
  deadline?: string | null;
  currency?: string;
  amount?: string;
  university?: string;
  department?: string;
  category_id?: number; // الاسم الفعلي في قاعدة البيانات
  country_id?: number; // الاسم الفعلي في قاعدة البيانات
  level_id?: number; // الاسم الفعلي في قاعدة البيانات
  category?: { id: number; name: string; slug: string };
  country?: { id: number; name: string; slug: string };
  level?: { id: number; name: string; slug: string };
  created_at?: string | Date; // الاسم الفعلي في قاعدة البيانات
  updated_at?: string | Date; // الاسم الفعلي في قاعدة البيانات
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
  
  return (
    <Link
      href={`/scholarships/${scholarship.slug}`}
      className={`group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
        isHovered ? 'ring-2 ring-primary' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {scholarship.image_url ? (
          <Image
            src={scholarship.image_url || '/placeholder-scholarship.jpg'}
            alt={scholarship.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-gray-800">
            <GraduationCap className="h-16 w-16 text-blue-300 dark:text-blue-700" />
          </div>
        )}
        
        {/* طبقة التدرج */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        
        {/* شارة المنح المميزة */}
        {scholarship.is_featured && (
          <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            منحة مميزة
          </div>
        )}
        
        {/* معلومات سريعة على الصورة */}
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center text-sm font-medium">
            <Globe className="w-4 h-4 ml-1 rtl:ml-1 rtl:mr-0" />
            {scholarship.country?.name || scholarship.university || 'دولي'}
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {scholarship.title}
        </h3>
        
        {!isCompact && (
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 text-sm">
            {scholarship.description?.substring(0, 120)}...
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {scholarship.category_id && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
              {scholarship.category?.name || 'منحة دراسية'}
            </span>
          )}
          
          {scholarship.level_id && (
            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-1 rounded-full">
              {scholarship.level?.name || 'جميع المستويات'}
            </span>
          )}
          
          {scholarship.is_fully_funded && (
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-full">
              <Award className="inline-block w-3 h-3 mr-1" />
              ممولة بالكامل
            </span>
          )}

          {(scholarship.amount && scholarship.currency) && (
            <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 px-2 py-1 rounded-full">
              {scholarship.amount} {scholarship.currency}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">
            {scholarship.created_at && 
              (typeof scholarship.created_at === 'string'
                ? new Date(scholarship.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
                : 'تاريخ النشر')}
          </span>
          
          <span className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
            <Calendar className="w-4 h-4 ml-1" />
            آخر موعد: {scholarship.deadline 
              ? (typeof scholarship.deadline === 'string' 
                 ? new Date(scholarship.deadline).toLocaleDateString('ar-EG')
                 : 'تاريخ محدد') 
              : 'غير محدد'}
          </span>
        </div>
      </div>
    </Link>
  );
}