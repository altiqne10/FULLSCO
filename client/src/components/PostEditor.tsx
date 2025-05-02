import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Category, PostWithCategory } from "@shared/schema";
import { Editor } from "@tinymce/tinymce-react";

// Extended schema for form validation
const postFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  categoryId: z.number().optional(),
  status: z.enum(["published", "draft"]),
  featuredImage: z.string().optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface PostEditorProps {
  post: Partial<PostWithCategory>;
  categories: Category[];
  isLoading: boolean;
  onSubmit: (data: PostFormValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
  submitLabel?: string;
}

export default function PostEditor({ 
  post, 
  categories, 
  isLoading, 
  onSubmit, 
  onCancel, 
  onDelete,
  submitLabel = "Save Post" 
}: PostEditorProps) {
  const [imagePreview, setImagePreview] = useState<string | undefined>(post.featuredImage || undefined);
  const editorRef = useRef<any>(null);
  
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      categoryId: post.categoryId || undefined,
      status: (post.status as "published" | "draft") || "draft",
      featuredImage: post.featuredImage || undefined,
    }
  });
  
  const handleSubmit = (data: PostFormValues) => {
    // Get content from TinyMCE
    if (editorRef.current) {
      data.content = editorRef.current.getContent();
    }
    
    onSubmit(data);
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        form.setValue("featuredImage", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-6 w-full">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {post.id ? "Edit" : "Create"} Post
          </h2>
          <div className="border-b border-gray-200 mb-4"></div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a brief summary of your post" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div className="min-h-[300px] border border-gray-300 rounded-lg">
                      <Editor
                        apiKey="q471jgf8f3tf021wog7g5ja3spibypjg739h8z86gbz2fi6h"
                        onInit={(evt: any, editor: any) => {
                          editorRef.current = editor;
                        }}
                        initialValue={field.value}
                        init={{
                          height: 400,
                          menubar: false,
                          plugins: [
                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons',
                            'image', 'link', 'lists', 'media', 'searchreplace', 'table',
                            'visualblocks', 'wordcount'
                          ],
                          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                          content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }',
                          skin: 'oxide',
                          setup: function(editor: any) {
                            editor.on('change', function() {
                              field.onChange(editor.getContent());
                            });
                          },
                          // Add this to disable the domain validation if using a local dev instance
                          readonly: false
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <div className="flex items-center">
                <div className="mr-4 w-32 h-32 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Featured image preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <i className="fas fa-image text-3xl"></i>
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    onChange={handleImageChange}
                  />
                  <p className="mt-1 text-sm text-gray-500">PNG, JPG or WEBP (Max. 2MB)</p>
                </div>
              </div>
            </FormItem>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="published" id="status-published" />
                        <Label htmlFor="status-published">Published</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="draft" id="status-draft" />
                        <Label htmlFor="status-draft">Draft</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              {onDelete && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={onDelete}
                  className="mr-auto"
                >
                  Delete
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
