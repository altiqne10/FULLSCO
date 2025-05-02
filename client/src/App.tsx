import { Switch, Route, useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Scholarships from "@/pages/scholarships";
import ScholarshipDetail from "@/pages/scholarship-detail";
import Articles from "@/pages/articles";
import ArticleDetail from "@/pages/article-detail";
import StaticPage from "@/pages/static-page";

// Admin Components
import AdminDashboard from "@/pages/admin/dashboard";
import AdminScholarships from "@/pages/admin/scholarships";
import AdminPosts from "@/pages/admin/posts";
import AdminUsers from "@/pages/admin/users";
import AdminSettings from "@/pages/admin/settings";
import AdminSEO from "@/pages/admin/seo";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminCategories from "@/pages/admin/categories";
import AdminLevels from "@/pages/admin/levels";
import AdminCountries from "@/pages/admin/countries";
import AdminSiteSettings from "@/pages/admin/site-settings"; // نستخدم واجهة واحدة فقط لإعدادات الموقع
import AdminPages from "@/pages/admin/pages";
import AdminMenus from "@/pages/admin/menus";
import AdminMedia from "@/pages/admin/media";
import AdminRoles from "@/pages/admin/roles";
import AdminBackups from "@/pages/admin/backups";
import CreateScholarship from "@/pages/admin/create-scholarship";
import CreatePost from "@/pages/admin/create-post";
import AdminLogin from "@/pages/admin/login";

// New Admin Dashboard Component
import NewDashboard from "@/pages/admin/new-dashboard";

// New Admin Pages
import AdminSubscribers from "@/pages/admin/subscribers";
import AdminSuccessStories from "@/pages/admin/success-stories";
import AdminHomeLayout from "@/pages/admin/home-layout";
import AdminAppearance from "@/pages/admin/appearance";
import AdminMessages from "@/pages/admin/messages";
import CreateSuccessStory from "@/pages/admin/create-success-story";
import EditSuccessStory from "@/pages/admin/edit-success-story";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect } from "react";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import { SiteSettingsProvider } from "@/hooks/use-site-settings";
import { ScholarshipsProvider } from "@/hooks/use-scholarships";
import { PostsProvider } from "@/hooks/use-posts";
import { SuccessStoriesProvider } from "@/hooks/use-success-stories";
import { FilterOptionsProvider } from "@/hooks/use-filter-options";

function App() {
  // Get current location to determine if we're on an admin page
  const [location] = useLocation();
  const isAdminPage = location.startsWith("/admin");
  const isNewAdminDashboard = location === "/admin/new";

  // Add metadata to document head
  useEffect(() => {
    document.title = "FULLSCO - منصة المنح الدراسية";
    
    // ملاحظة: لا نقوم بتعيين dir و lang هنا
    // لأنه سيتم تعيينها عن طريق SiteSettingsProvider
    // وفقاً للإعدادات المخزنة في قاعدة البيانات
    
    // مهم: تأكد من أن overflow يعمل بشكل صحيح عند تنظيف المكون
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // تأكد من تمكين التمرير عند تغيير المسار
  useEffect(() => {
    document.body.style.overflow = '';
  }, [location]);

  // تغليف صفحات لوحة التحكم بمزود الإشعارات
  const wrapInNotificationProvider = (component: React.ReactNode) => {
    if (isAdminPage && location !== '/admin/login') {
      return (
        <NotificationProvider>
          {component}
        </NotificationProvider>
      );
    }
    return component;
  };

  return (
    <SiteSettingsProvider>
      <ScholarshipsProvider>
        <PostsProvider>
          <SuccessStoriesProvider>
            <FilterOptionsProvider>
              <TooltipProvider>
                {!isAdminPage && <Header />}
                {wrapInNotificationProvider(
                  <Switch>
                    {/* Public routes */}
                    <Route path="/" component={Home} />
                    <Route path="/scholarships" component={Scholarships} />
                    <Route path="/scholarships/:slug" component={ScholarshipDetail} />
                    <Route path="/articles" component={Articles} />
                    <Route path="/articles/:slug" component={ArticleDetail} />
                    <Route path="/page/:slug" component={StaticPage} />
                    
                    {/* Admin Login */}
                    <Route path="/admin/login" component={AdminLogin} />
                    
                    {/* New Admin Dashboard */}
                    <Route path="/admin/new" component={NewDashboard} />
                    
                    {/* Original Admin Routes */}
                    <Route path="/admin" component={AdminDashboard} />
                    <Route path="/admin/scholarships" component={AdminScholarships} />
                    <Route path="/admin/categories" component={AdminCategories} />
                    <Route path="/admin/levels" component={AdminLevels} />
                    <Route path="/admin/countries" component={AdminCountries} />
                    <Route path="/admin/posts" component={AdminPosts} />
                    <Route path="/admin/users" component={AdminUsers} />
                    <Route path="/admin/settings" component={AdminSettings} />
                    <Route path="/admin/site-settings" component={AdminSiteSettings} />
                    <Route path="/admin/pages" component={AdminPages} />
                    <Route path="/admin/menus" component={AdminMenus} />
                    <Route path="/admin/media" component={AdminMedia} />
                    <Route path="/admin/roles" component={AdminRoles} />
                    <Route path="/admin/backups" component={AdminBackups} />
                    <Route path="/admin/seo" component={AdminSEO} />
                    <Route path="/admin/analytics" component={AdminAnalytics} />
                    <Route path="/admin/scholarships/create" component={CreateScholarship} />
                    <Route path="/admin/posts/create" component={CreatePost} />

                    {/* New Admin Routes */}
                    <Route path="/admin/subscribers" component={AdminSubscribers} />
                    <Route path="/admin/success-stories" component={AdminSuccessStories} />
                    <Route path="/admin/success-stories/create" component={CreateSuccessStory} />
                    <Route path="/admin/success-stories/edit/:id" component={EditSuccessStory} />
                    <Route path="/admin/home-layout" component={AdminHomeLayout} />
                    <Route path="/admin/appearance" component={AdminAppearance} />
                    <Route path="/admin/messages" component={AdminMessages} />
                    
                    {/* Fallback to 404 */}
                    <Route component={NotFound} />
                  </Switch>
                )}
                {!isAdminPage && <Footer />}
              </TooltipProvider>
            </FilterOptionsProvider>
          </SuccessStoriesProvider>
        </PostsProvider>
      </ScholarshipsProvider>
    </SiteSettingsProvider>
  );
}

export default App;
