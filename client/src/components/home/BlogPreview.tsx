import React from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { BlogPost } from "@shared/schema";

const BlogPreview: React.FC = () => {
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/recent"],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Design Tips & Inspiration</h2>
          <Link href="/blog" className="text-primary hover:text-accent font-medium flex items-center">
            View All Posts <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden card-shadow animate-pulse h-96"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading blog posts. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden card-shadow hover-scale">
                <div className="relative h-56">
                  <img 
                    src={post.imageUrl || "https://via.placeholder.com/400"} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-sm text-gray-500">{formatDate(post.publishDate.toString())}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-accent">{post.category}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3">{post.title}</h3>
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`}>
                    <a className="text-primary hover:text-accent font-medium">Read More</a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPreview;
