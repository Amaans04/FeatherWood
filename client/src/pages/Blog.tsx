import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";

const Blog: React.FC = () => {
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
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
    <div className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Design Tips & Inspiration</h1>
          <p className="text-lg text-gray-700">
            Explore our articles for expert advice, creative ideas, and design inspiration for your home.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden hover-scale animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded mb-3"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-10">
              <h2 className="text-xl font-medium mb-2">Error loading blog posts</h2>
              <p className="text-gray-600 mb-4">Please try again later</p>
              <Button onClick={() => window.location.reload()}>Refresh</Button>
            </div>
          ) : posts?.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <h2 className="text-xl font-medium mb-2">No blog posts found</h2>
              <p className="text-gray-600">Check back soon for new articles</p>
            </div>
          ) : (
            posts?.map((post) => (
              <Card key={post.id} className="overflow-hidden hover-scale">
                <div className="relative h-64">
                  <img 
                    src={post.imageUrl || "https://via.placeholder.com/400"} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(post.publishDate.toString())}
                    </span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-accent">{post.category}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3">{post.title}</h3>
                  <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Link href={`/blog/${post.slug}`}>
                    <a className="text-primary hover:text-accent font-medium flex items-center">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
