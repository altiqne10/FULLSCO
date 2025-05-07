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
    
    // بناء استعلام أساسي مع تحديد الحقول المطلوبة
    let query = db.select({
      id: scholarships.id,
      title: scholarships.title,
      slug: scholarships.slug,
      description: scholarships.description,
      content: scholarships.content,
      amount: scholarships.amount,
      currency: scholarships.currency,
      university: scholarships.university,
      department: scholarships.department,
      isFeatured: scholarships.isFeatured,
      isFullyFunded: scholarships.isFullyFunded,
      imageUrl: scholarships.imageUrl,
      deadline: scholarships.deadline,
      categoryId: scholarships.categoryId,
      countryId: scholarships.countryId,
      levelId: scholarships.levelId,
      createdAt: scholarships.createdAt,
      updatedAt: scholarships.updatedAt,
      isPublished: scholarships.isPublished
    }).from(scholarships);
    
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
    
    // تعليق استعلام نوع التمويل حيث أنه غير متوفر في الهيكلية الحالية
    // التحقق من وجود isFullyFunded بدلاً منه
    if (fundingType === 'fully-funded') {
      query = query.where(sql`${scholarships.isFullyFunded} = true`);
    } else if (fundingType === 'partial') {
      query = query.where(sql`${scholarships.isFullyFunded} = false`);
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
    const categoriesData = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description
    }).from(categories);
    
    // استخدام select للحقول المحددة في الدول لتجنب خطأ flag_url
    const countriesData = await db.select({
      id: countries.id,
      name: countries.name,
      slug: countries.slug
    }).from(countries);
    
    // إضافة حقل flagUrl افتراضي
    const countriesWithFlag = countriesData.map(country => ({
      ...country,
      flagUrl: null, // إضافة حقل افتراضي للعلم
    }));
    
    const levelsData = await db.select({
      id: levels.id,
      name: levels.name,
      slug: levels.slug,
      description: levels.description
    }).from(levels);
    
    // تحضير البيانات للإرجاع
    const scholarshipsWithDetails = await Promise.all(
      result.map(async (scholarship) => {
        let category = null;
        let country = null;
        let level = null;
        
        if (scholarship.categoryId) {
          try {
            const categoryData = await db.select({
              id: categories.id,
              name: categories.name,
              slug: categories.slug,
              description: categories.description
            })
            .from(categories)
            .where(sql`${categories.id} = ${scholarship.categoryId}`)
            .limit(1);
            
            if (categoryData.length > 0) {
              category = categoryData[0];
            }
          } catch (error) {
            console.error('Error fetching category info for scholarship:', error);
            // الاستمرار بدون معلومات التصنيف إذا حدث خطأ
          }
        }
        
        if (scholarship.countryId) {
          try {
            // تجنب استخدام حقل flagUrl مباشرة وجلب الحقول المحددة فقط
            const countryData = await db.select({
              id: countries.id,
              name: countries.name,
              slug: countries.slug
            })
            .from(countries)
            .where(sql`${countries.id} = ${scholarship.countryId}`)
            .limit(1);
            
            if (countryData.length > 0) {
              // إضافة حقل flagUrl = null لتجنب الأخطاء
              country = {
                ...countryData[0],
                flagUrl: null // إضافة حقل افتراضي للعلم
              };
            }
          } catch (error) {
            console.error('Error fetching country info for scholarship:', error);
            // الاستمرار بدون معلومات البلد إذا حدث خطأ
          }
        }
        
        if (scholarship.levelId) {
          try {
            const levelData = await db.select({
              id: levels.id,
              name: levels.name,
              slug: levels.slug
            })
            .from(levels)
            .where(sql`${levels.id} = ${scholarship.levelId}`)
            .limit(1);
            
            if (levelData.length > 0) {
              level = levelData[0];
            }
          } catch (error) {
            console.error('Error fetching level info for scholarship:', error);
            // الاستمرار بدون معلومات المستوى إذا حدث خطأ
          }
        }
        
        // معالجة مشكلة الصورة. استخدام imageUrl أو عرض صورة افتراضية عند عدم وجود أي صورة
        let thumbnailUrl = '/images/default-scholarship.png'; // حقل افتراضي
        
        if (scholarship.imageUrl) {
          thumbnailUrl = scholarship.imageUrl;
        }
        
        // إنشاء كائن جديد بدلاً من استخدام ...scholarship لتجنب مشاكل الأنواع
        return {
          id: scholarship.id,
          title: scholarship.title || '',
          slug: scholarship.slug || '',
          description: scholarship.description || '',
          content: scholarship.content || '',
          deadline: scholarship.deadline || null,
          amount: scholarship.amount || null,
          currency: scholarship.currency || null,
          university: scholarship.university || null,
          department: scholarship.department || null,
          isFeatured: scholarship.isFeatured || false,
          isFullyFunded: scholarship.isFullyFunded || false,
          thumbnailUrl: thumbnailUrl,
          createdAt: scholarship.createdAt || new Date(),
          updatedAt: scholarship.updatedAt || new Date(),
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
          countries: countriesWithFlag,
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