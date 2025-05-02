import { Link } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PostWithCategory } from "@shared/schema";

interface PostsListProps {
  posts?: PostWithCategory[];
  isLoading: boolean;
}

export function PostsList({ posts, isLoading }: PostsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No posts found.</p>
        <Link href="/posts/new">
          <Button variant="default">
            <i className="fas fa-plus mr-2"></i> Create Your First Post
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3">Title</th>
            <th scope="col" className="px-4 py-3">Category</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Date</th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="bg-white border-b hover:bg-gray-50">
              <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                {post.title}
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
              <td className="px-4 py-3 flex items-center justify-end">
                <Link href={`/posts/${post.id}/edit`}>
                  <button className="inline-flex items-center text-sm font-medium hover:bg-gray-100 hover:text-primary-700 p-1.5 rounded-lg">
                    <i className="fas fa-pen-to-square"></i>
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {posts.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <div className="flex text-sm text-gray-700">
            Showing <span className="font-semibold mx-1">1-{Math.min(posts.length, 10)}</span> of <span className="font-semibold mx-1">{posts.length}</span> entries
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled className="inline-flex items-center">
              <i className="fas fa-angle-left mr-2"></i>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled className="inline-flex items-center">
              Next
              <i className="fas fa-angle-right ml-2"></i>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
