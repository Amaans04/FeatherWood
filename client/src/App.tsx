import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layouts/Layout";
import Home from "@/pages/Home";
import BlogDetail from "@/pages/BlogDetail";
import FurnitureShop from "@/pages/FurnitureShop";
import ProductDetail from "@/pages/ProductDetail";
import InteriorDesign from "@/pages/InteriorDesign";
import ProjectDetail from "@/pages/ProjectDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import BookingConfirmation from "@/pages/BookingConfirmation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/furniture" component={FurnitureShop} />
      <Route path="/furniture/:slug" component={ProductDetail} />
      <Route path="/interiors" component={InteriorDesign} />
      <Route path="/interiors/:slug" component={ProjectDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path="/booking-confirmation" component={BookingConfirmation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
