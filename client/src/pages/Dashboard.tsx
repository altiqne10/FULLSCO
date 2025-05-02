import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PostWithCategory } from "@shared/schema";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: posts, isLoading } = useQuery<PostWithCategory[]>({
    queryKey: ["/api/posts"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Count posts by status
  const publishedCount = posts?.filter(post => post.status === "published").length || 0;
  const draftCount = posts?.filter(post => post.status === "draft").length || 0;
  const totalPosts = posts?.length || 0;
  const totalCategories = categories?.length || 0;

  return (
    <div className="pt-6 px-4">
      <div className="mb-6 w-full">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold leading-none text-gray-900">Dashboard</h1>
          </div>
          <p className="text-sm text-gray-500">Welcome to your blog dashboard. Here you can see a summary of your blog stats.</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm font-medium text-gray-500">Total Posts</span>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <span className="text-2xl font-bold">{totalPosts}</span>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm font-medium text-gray-500">Published Posts</span>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <span className="text-2xl font-bold">{publishedCount}</span>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm font-medium text-gray-500">Draft Posts</span>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <span className="text-2xl font-bold">{draftCount}</span>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm font-medium text-gray-500">Categories</span>
            {categoriesLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <span className="text-2xl font-bold">{totalCategories}</span>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 w-full">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
            <Link href="/posts" className="mt-2 sm:mt-0 text-sm font-medium text-primary-600 hover:text-primary-700">
              View all posts
            </Link>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3">Title</th>
                    <th scope="col" className="px-4 py-3">Category</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {posts && posts.length > 0 ? (
                    posts.slice(0, 5).map((post) => (
                      <tr key={post.id} className="bg-white border-b hover:bg-gray-50">
                        <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                          <Link href={`/posts/${post.id}/edit`} className="hover:text-primary-600">
                            {post.title}
                          </Link>
                        </th>
                        <td className="px-4 py-3">{post.category?.name || "Uncategorized"}</td>
                        <td className="px-4 py-3">
                          <span className={`${
                            post.status === "published" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          } text-xs font-medium px-2.5 py-0.5 rounded`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white border-b">
                      <td colSpan={4} className="px-4 py-3 text-center">
                        No posts found. <Link href="/posts/new" className="text-primary-600 hover:underline">Create your first post</Link>.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
