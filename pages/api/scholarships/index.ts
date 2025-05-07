import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { scholarships, categories, countries, levels } from '@/shared/schema';
import { sql, asc, desc, count } from 'drizzle-orm';

// تعريف نوع البيانات للاستجابة
type ResponseData = {
  success: boolean;
  scholarships?: any[];
  message?: string;
  meta?: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    filters: {
      categories: { id: number; name: string; slug: string }[];
      countries: { id: number; name: string; slug: string }[];
      levels: { id: number; name: string; slug: string }[];
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    console.log('API: استلام طلب لقائمة المنح الدراسية');
    
    // استخراج معلمات الاستعلام
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const country = req.query.country as string | undefined;
    const level = req.query.level as string | undefined;
    const fundingType = req.query.fundingType as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    
    console.log(`API: معلمات البحث: page=${page}, limit=${limit}, search=${search}, category=${category}, country=${country}, level=${level}, fundingType=${fundingType}, sortBy=${sortBy}`);
    
    // حساب الصفحة الحالية والحد
    const offset = (page - 1) * limit;
    
    // بناء استعلام أساسي
    let query = db.select().from(scholarships);
    
    // تطبيق الفلاتر
    if (search) {
      query = query.where(sql`${scholarships.title} ILIKE ${'%' + search + '%'} OR ${scholarships.description} ILIKE ${'%' + search + '%'}`);
    }
    
    if (category) {
      const categoryData = await db.select().from(categories).where(sql`${categories.slug} = ${category}`).limit(1);
      if (categoryData.length > 0) {
        const categoryId = categoryData[0].id;
        query = query.where(sql`${scholarships.categoryId} = ${categoryId}`);
      }
    }
    
    if (country) {
      const countryData = await db.select().from(countries).where(sql`${countries.slug} = ${country}`).limit(1);
      if (countryData.length > 0) {
        const countryId = countryData[0].id;
        query = query.where(sql`${scholarships.countryId} = ${countryId}`);
      }
    }
    
    if (level) {
      const levelData = await db.select().from(levels).where(sql`${levels.slug} = ${level}`).limit(1);
      if (levelData.length > 0) {
        const levelId = levelData[0].id;
        query = query.where(sql`${scholarships.levelId} = ${levelId}`);
      }
    }
    
    if (fundingType) {
      query = query.where(sql`${scholarships.fundingType} = ${fundingType}`);
    }
    
    // تطبيق الترتيب
    switch (sortBy) {
      case 'newest':
        query = query.orderBy(desc(scholarships.createdAt));
        break;
      case 'oldest':
        query = query.orderBy(asc(scholarships.createdAt));
        break;
      case 'deadline':
        query = query.orderBy(asc(scholarships.deadline));
        break;
      case 'title':
        query = query.orderBy(asc(scholarships.title));
        break;
      default:
        query = query.orderBy(desc(scholarships.createdAt));
    }
    
    // الحصول على إجمالي عدد النتائج
    const countResult = await db.select({ count: count() }).from(scholarships);
    const total = countResult[0].count;
    
    // الحصول على قائمة المنح
    const result = await query.limit(limit).offset(offset);
    
    console.log(`API: تم العثور على ${result.length} منحة دراسية`);
    
    // الحصول على خيارات الفلترة
    const categoriesData = await db.select().from(categories);
    const countriesData = await db.select().from(countries);
    const levelsData = await db.select().from(levels);
    
    // تحضير البيانات للإرجاع
    const scholarshipsWithDetails = await Promise.all(
      result.map(async (scholarship) => {
        let category = null;
        let country = null;
        let level = null;
        
        if (scholarship.categoryId) {
          const categoryData = await db.select().from(categories).where(sql`${categories.id} = ${scholarship.categoryId}`).limit(1);
          if (categoryData.length > 0) {
            category = categoryData[0];
          }
        }
        
        if (scholarship.countryId) {
          const countryData = await db.select().from(countries).where(sql`${countries.id} = ${scholarship.countryId}`).limit(1);
          if (countryData.length > 0) {
            country = countryData[0];
          }
        }
        
        if (scholarship.levelId) {
          const levelData = await db.select().from(levels).where(sql`${levels.id} = ${scholarship.levelId}`).limit(1);
          if (levelData.length > 0) {
            level = levelData[0];
          }
        }
        
        // تعديل اسم حقل الصورة إذا كان موجودًا
        const thumbnailUrl = scholarship.imageUrl || scholarship.thumbnailUrl;
        
        return {
          ...scholarship,
          thumbnailUrl,
          category,
          country,
          level
        };
      })
    );
    
    // الرد بالبيانات
    res.status(200).json({
      success: true,
      scholarships: scholarshipsWithDetails,
      meta: {
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        filters: {
          categories: categoriesData,
          countries: countriesData,
          levels: levelsData
        }
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب قائمة المنح الدراسية',
      scholarships: [],
      meta: {
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        },
        filters: {
          categories: [],
          countries: [],
          levels: []
        }
      }
    });
  }
}