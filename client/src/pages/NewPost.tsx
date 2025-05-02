import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import PostEditor from "@/components/PostEditor";
import { InsertPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function NewPost() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Empty post for the new post form
  const emptyPost = {
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
    categoryId: undefined,
    featuredImage: undefined,
  };
  
  const createPostMutation = useMutation({
    mutationFn: async (postData: Partial<InsertPost>) => {
      const res = await apiRequest("POST", "/api/posts", postData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
      navigate("/posts");
    },
    onError: (error) => {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (postData: Partial<InsertPost>) => {
    createPostMutation.mutate(postData);
  };
  
  return (
    <div className="pt-6 px-4">
      <div className="mb-6 w-full">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold leading-none text-gray-900">Create New Post</h1>
          </div>
          <p className="text-sm text-gray-500">Fill in the form below to create a new blog post.</p>
        </div>
      </div>
      
      <PostEditor 
        post={emptyPost} 
        categories={categories || []} 
        isLoading={categoriesLoading || createPostMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/posts")}
        submitLabel="Create Post"
      />
    </div>
  );
}
