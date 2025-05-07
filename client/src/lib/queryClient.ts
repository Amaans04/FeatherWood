import { QueryClient, QueryFunction } from "@tanstack/react-query";
import heroSlides from "../data/hero-slides.json";
import furniture from "../data/furniture.json";
import storeLocations from "../data/storelocations.json";
import designIdeas from "../data/designideas.json";
import pricing from "../data/pricing.json";
import designIdeasDetails from "../data/designIdeasDetails.json";
import locations from "../data/locations.json";
import { testimonials } from "../data/testimonials";
import projectDetailsData from "../data/projectDetails.json";
import { services } from "../data/services";

// Map of data sources
const dataSources: Record<string, any> = {
  "/api/hero-slides": heroSlides,
  "/api/furniture": furniture,
  "/api/store-locations": storeLocations,
  "/api/design-ideas": designIdeas,
  "/api/pricing": pricing,
  "/api/design-ideas-details": designIdeasDetails,
  "/api/locations": locations,
  "/api/testimonials": testimonials,
  "/api/projects": Object.entries(projectDetailsData).map(([id, details]) => ({
    id,
    title: details.title,
    location: details.location,
    imageUrl: details.heroImage,
    link: `/projects/${id}`
  })),
  "/api/services": services,
};

export const getQueryFn: <T>(options: {
  on401: "returnNull" | "throw";
}) => QueryFunction<T> =
  () =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    // Check if we have a data source for this URL
    for (const [pattern, data] of Object.entries(dataSources)) {
      if (url === pattern || url.startsWith(pattern)) {
        // If URL has parameters (e.g., /api/furniture/1), filter data accordingly
        if (url !== pattern && Array.isArray(data)) {
          const id = url.replace(`${pattern}/`, "");
          return data.find((item: any) => item.id.toString() === id) || null;
        }
        return data;
      }
    }
    
    console.warn(`No local data found for: ${url}`);
    return null;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
