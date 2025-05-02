import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Posts from "@/pages/Posts";
import EditPost from "@/pages/EditPost";
import NewPost from "@/pages/NewPost";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";

function Router() {
  const [location] = useLocation();
  const { toast } = useToast();

  // Seed the database with initial data on first load
  useEffect(() => {
    const seedDatabase = async () => {
      try {
        await fetch("/api/seed", { method: "POST" });
      } catch (error) {
        console.error("Failed to seed database:", error);
        toast({
          title: "Database Error",
          description: "Failed to initialize the database. Some features may not work correctly.",
          variant: "destructive",
        });
      }
    };

    seedDatabase();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex overflow-hidden pt-16">
        <Sidebar />
        <div id="sidebarBackdrop" className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10"></div>
        <div id="main-content" className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64">
          <main>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/posts" component={Posts} />
              <Route path="/posts/new" component={NewPost} />
              <Route path="/posts/:id/edit" component={EditPost} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <footer className="bg-white p-4 md:p-6 xl:p-8 my-6 mx-4 shadow-md rounded-lg">
            <div className="text-sm text-center text-gray-500">
              &copy; {new Date().getFullYear()} Blog Admin Dashboard. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
