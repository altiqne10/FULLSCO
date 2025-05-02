import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useLocation, useParams } from "wouter";
import PostEditor from "@/components/PostEditor";
import { UpdatePost, PostWithCategory } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function EditPost() {
  const params = useParams<{ id: string }>();
  const postId = params?.id ? parseInt(params.id) : 0;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const { data: post, isLoading: postLoading, error: postError } = useQuery<PostWithCategory>({
    queryKey: [`/api/posts/${postId}`],
    enabled: !!postId,
  });
  
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  const updatePostMutation = useMutation({
    mutationFn: async (postData: UpdatePost) => {
      const res = await apiRequest("PUT", `/api/posts/${postId}`, postData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}`] });
      toast({
        title: "Success",
        description: "Post updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
      navigate("/posts");
    },
    onError: (error) => {
      toast({
        title: "Failed to delete post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (postData: UpdatePost) => {
    updatePostMutation.mutate(postData);
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      deletePostMutation.mutate();
    }
  };
  
  if (postError) {
    return (
      <div className="pt-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load post. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="pt-6 px-4">
      <div className="mb-6 w-full">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold leading-none text-gray-900">
              {postLoading ? <Skeleton className="h-7 w-48" /> : `Edit Post: ${post?.title}`}
            </h1>
          </div>
          <p className="text-sm text-gray-500">Update your blog post information below.</p>
        </div>
      </div>
      
      {postLoading ? (
        <div className="mb-6 w-full">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : post ? (
        <PostEditor 
          post={post} 
          categories={categories || []} 
          isLoading={categoriesLoading || updatePostMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/posts")}
          onDelete={handleDelete}
          submitLabel="Update Post"
        />
      ) : null}
    </div>
  );
}
