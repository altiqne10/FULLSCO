import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostsList } from "@/components/PostsList";
import { Skeleton } from "@/components/ui/skeleton";
import { PostWithCategory } from "@shared/schema";

export default function Posts() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { data: posts, isLoading: postsLoading } = useQuery<PostWithCategory[]>({
    queryKey: ["/api/posts"],
  });
  
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Filter posts based on search and category
  const filteredPosts = posts?.filter(post => {
    const matchesSearch = search 
      ? post.title.toLowerCase().includes(search.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(search.toLowerCase())
      : true;
      
    const matchesCategory = categoryFilter !== "all" 
      ? post.categoryId === parseInt(categoryFilter)
      : true;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-6 px-4">
      <div className="mb-6 w-full">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold leading-none text-gray-900">Posts Management</h1>
            <Link href="/posts/new" className="hidden sm:inline-flex ml-5 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center mr-3">
              <i className="fas fa-plus mr-2"></i> New Post
            </Link>
          </div>
          <p className="text-sm text-gray-500">Manage your blog posts from this dashboard. Create, edit, and delete posts as needed.</p>
        </div>
      </div>

      {/* Posts List */}
      <div className="w-full">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Posts</h3>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
              <div className="relative w-full sm:w-auto">
                <Input
                  type="text"
                  className="pl-10"
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="fas fa-search text-gray-500"></i>
                </div>
              </div>
              {categoriesLoading ? (
                <Skeleton className="h-9 w-40" />
              ) : (
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => setCategoryFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          <PostsList posts={filteredPosts} isLoading={postsLoading} />
        </div>
      </div>
    </div>
  );
}
